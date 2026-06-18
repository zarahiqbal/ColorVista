import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";

import { firestore } from "./firebase";
import { USERS_COLLECTION } from "./userProfileFirestore";

export const BROADCAST_COLLECTION = "broadcastNotifications";

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  icon?: string;
  color?: string;
  createdAt: string;
  read: boolean;
  broadcastId?: string;
}

function userNotificationsRef(uid: string) {
  return collection(firestore, USERS_COLLECTION, uid, "notifications");
}

function userNotificationRef(uid: string, notificationId: string) {
  return doc(firestore, USERS_COLLECTION, uid, "notifications", notificationId);
}

export function subscribeUserNotifications(
  uid: string,
  onData: (notifications: UserNotification[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    userNotificationsRef(uid),
    (snapshot) => {
      const items: UserNotification[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: String(data.title ?? ""),
          message: String(data.message ?? ""),
          icon: data.icon != null ? String(data.icon) : undefined,
          color: data.color != null ? String(data.color) : undefined,
          createdAt: String(data.createdAt ?? new Date().toISOString()),
          read: Boolean(data.read),
          broadcastId:
            data.broadcastId != null ? String(data.broadcastId) : undefined,
        };
      });
      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      onData(items);
    },
    (err) => onError?.(err),
  );
}

/** Pull active broadcast docs into the user's inbox (idempotent). */
export async function syncBroadcastNotifications(uid: string): Promise<void> {
  const broadcastQuery = query(
    collection(firestore, BROADCAST_COLLECTION),
    where("active", "==", true),
  );
  const [broadcastSnap, userSnap] = await Promise.all([
    getDocs(broadcastQuery),
    getDocs(userNotificationsRef(uid)),
  ]);

  const existingBroadcastIds = new Set(
    userSnap.docs
      .map((d) => d.data().broadcastId)
      .filter((id): id is string => typeof id === "string"),
  );

  const batch = writeBatch(firestore);
  let writes = 0;

  broadcastSnap.docs.forEach((broadcastDoc) => {
    if (existingBroadcastIds.has(broadcastDoc.id)) return;

    const data = broadcastDoc.data();
    const ref = userNotificationRef(uid, `broadcast_${broadcastDoc.id}`);
    batch.set(ref, {
      title: String(data.title ?? "Notification"),
      message: String(data.message ?? ""),
      icon: data.icon ?? "megaphone-outline",
      color: data.color ?? "#4A90E2",
      createdAt:
        data.createdAt?.toDate?.()?.toISOString?.() ??
        data.createdAt ??
        new Date().toISOString(),
      read: false,
      broadcastId: broadcastDoc.id,
    });
    writes += 1;
  });

  if (writes > 0) {
    await batch.commit();
  }
}

export async function markNotificationRead(
  uid: string,
  notificationId: string,
): Promise<void> {
  await updateDoc(userNotificationRef(uid, notificationId), { read: true });
}

export async function markAllNotificationsRead(uid: string): Promise<void> {
  const snap = await getDocs(userNotificationsRef(uid));
  const batch = writeBatch(firestore);
  snap.docs.forEach((d) => {
    if (!d.data().read) {
      batch.update(d.ref, { read: true });
    }
  });
  await batch.commit();
}

export async function dismissNotification(
  uid: string,
  notificationId: string,
): Promise<void> {
  await deleteDoc(userNotificationRef(uid, notificationId));
}

/**
 * Admin helper — create a broadcast notification visible to all users.
 * Add docs to `broadcastNotifications` in Firebase Console with the same shape,
 * or call this from an admin tool.
 */
export async function createBroadcastNotification(input: {
  title: string;
  message: string;
  icon?: string;
  color?: string;
}): Promise<string> {
  const ref = doc(collection(firestore, BROADCAST_COLLECTION));
  await setDoc(ref, {
    title: input.title,
    message: input.message,
    icon: input.icon ?? "megaphone-outline",
    color: input.color ?? "#4A90E2",
    active: true,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
