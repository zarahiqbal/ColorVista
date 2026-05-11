import {
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  type Unsubscribe,
  type UpdateData,
} from "firebase/firestore";

import { firestore } from "./firebase";

export const USERS_COLLECTION = "users";

export type GameId = "colorDetective" | "signalRush";

export interface GameProgressDoc {
  bestScore: number;
  highLevel: number;
  lastScore: number;
  lastLevel: number;
  lastAccuracy: number;
  gamesPlayed: number;
  avgAccuracy: number;
  lastPlayedAt: string;
}

export interface UserGamesDoc {
  colorDetective?: GameProgressDoc;
  signalRush?: GameProgressDoc;
}

export function userDocRef(uid: string) {
  return doc(firestore, USERS_COLLECTION, uid);
}

export async function fetchUserProfileDoc(uid: string) {
  return getDoc(userDocRef(uid));
}

export function subscribeUserProfile(
  uid: string,
  onData: (data: Record<string, unknown> | null) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  return onSnapshot(
    userDocRef(uid),
    (snap) => {
      onData(snap.exists() ? (snap.data() as Record<string, unknown>) : null);
    },
    (err) => {
      if (onError) onError(err);
    },
  );
}

export async function writeUserProfile(
  uid: string,
  profile: DocumentData,
): Promise<void> {
  await setDoc(userDocRef(uid), profile, { merge: true });
}

export async function patchUserProfile(
  uid: string,
  patch: UpdateData<DocumentData>,
): Promise<void> {
  await updateDoc(userDocRef(uid), patch);
}

/**
 * Persist a finished game run: updates bests, last session, rolling avg accuracy, play count.
 */
export async function recordGameSession(
  uid: string,
  gameId: GameId,
  session: { score: number; level: number; accuracy: number },
): Promise<void> {
  const ref = userDocRef(uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? (snap.data() as { games?: UserGamesDoc }) : {};
  const prev = data.games?.[gameId];
  const gamesPlayed = (prev?.gamesPlayed ?? 0) + 1;
  const bestScore = Math.max(prev?.bestScore ?? 0, session.score);
  const highLevel = Math.max(prev?.highLevel ?? 0, session.level);
  const prevAvg = prev?.avgAccuracy ?? 0;
  const avgAccuracy =
    gamesPlayed > 1
      ? (prevAvg * (gamesPlayed - 1) + session.accuracy) / gamesPlayed
      : session.accuracy;

  const nextProgress: GameProgressDoc = {
    bestScore,
    highLevel,
    lastScore: session.score,
    lastLevel: session.level,
    lastAccuracy: session.accuracy,
    gamesPlayed,
    avgAccuracy,
    lastPlayedAt: new Date().toISOString(),
  };

  await setDoc(
    ref,
    {
      games: {
        [gameId]: nextProgress,
      },
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}
