import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import {
  dismissNotification,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeUserNotifications,
  syncBroadcastNotifications,
  type UserNotification,
} from "./notificationFirestore";

interface NotificationContextType {
  notifications: UserNotification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uid = user?.uid;
  const isGuest = user?.isGuest === true;

  const refreshNotifications = useCallback(async () => {
    if (!uid || isGuest) return;
    setIsLoading(true);
    try {
      await syncBroadcastNotifications(uid);
    } catch (err) {
      console.warn("Failed to sync broadcast notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [uid, isGuest]);

  useEffect(() => {
    if (!uid || isGuest) {
      setNotifications([]);
      return;
    }

    refreshNotifications();

    const unsubscribe = subscribeUserNotifications(
      uid,
      setNotifications,
      (err) => console.warn("Notification subscription error:", err),
    );

    return unsubscribe;
  }, [uid, isGuest, refreshNotifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!uid) return;
      await markNotificationRead(uid, id);
    },
    [uid],
  );

  const markAllAsRead = useCallback(async () => {
    if (!uid) return;
    await markAllNotificationsRead(uid);
  }, [uid]);

  const removeNotification = useCallback(
    async (id: string) => {
      if (!uid) return;
      await dismissNotification(uid, id);
    },
    [uid],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      markAsRead,
      markAllAsRead,
      removeNotification,
      refreshNotifications,
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      markAsRead,
      markAllAsRead,
      removeNotification,
      refreshNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
