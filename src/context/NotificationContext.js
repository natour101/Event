import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'event-notifications';

const defaultState = {
  notifications: [],
  unreadCount: 0,
  addNotification: async () => {},
  markAllRead: async () => {},
  clearNotifications: async () => {},
};

const NotificationContext = createContext(defaultState);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const persist = useCallback(async next => {
    setNotifications(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addNotification = useCallback(
    async ({ title, message }) => {
      const next = [
        {
          id: `${Date.now()}`,
          title,
          message,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...notifications,
      ];
      await persist(next);
    },
    [notifications, persist]
  );

  const markAllRead = useCallback(async () => {
    const next = notifications.map(item => ({ ...item, read: true }));
    await persist(next);
  }, [notifications, persist]);

  const clearNotifications = useCallback(async () => {
    await persist([]);
  }, [persist]);

  const unreadCount = useMemo(
    () => notifications.filter(item => !item.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAllRead,
      clearNotifications,
    }),
    [notifications, unreadCount, addNotification, markAllRead, clearNotifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext) || defaultState;
}
