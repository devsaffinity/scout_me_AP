import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { emitToast } from "../hooks/useToast";

const STORAGE_KEY = "scoutme_admin_notifications";

const NotificationContext = createContext(null);

const defaultNotifications = [
  {
    id: "notif-1",
    type: "warning",
    title: "Verification queue growing",
    message: "18 new athlete verification requests are waiting for review.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    read: false,
  },
  {
    id: "notif-2",
    type: "success",
    title: "Subscription sync completed",
    message:
      "Premium subscription data synced successfully from the billing provider.",
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    read: false,
  },
  {
    id: "notif-3",
    type: "info",
    title: "New export ready",
    message:
      "The weekly analytics report has been generated and is ready to download.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: true,
  },
  {
    id: "notif-4",
    type: "error",
    title: "Scan endpoint retry detected",
    message:
      "One NFC scan endpoint required an automatic retry during the last hour.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    read: false,
  },
];

const sortNotifications = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(defaultNotifications);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setNotifications(sortNotifications(parsed));
          return;
        }
      }
    } catch (error) {
      console.error("Unable to restore notifications.", error);
    }

    setNotifications(sortNotifications(defaultNotifications));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error("Unable to persist notifications.", error);
    }
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true })),
    );
  };

  const removeNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const addNotification = (notification) => {
    const newItem = {
      id: notification.id || `notif-${Date.now()}`,
      type: notification.type || "info",
      title: notification.title || "Notification",
      message: notification.message || "",
      createdAt: notification.createdAt || new Date().toISOString(),
      read: notification.read ?? false,
    };

    setNotifications((current) => sortNotifications([newItem, ...current]));
    emitToast({
      type: newItem.type,
      title: newItem.title,
      message: newItem.message,
    });
  };

  const seedNotifications = () => {
    setNotifications(sortNotifications(defaultNotifications));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
      seedNotifications,
    }),
    [notifications, unreadCount],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }

  return context;
};

export default NotificationContext;
