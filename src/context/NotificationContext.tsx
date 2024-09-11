import React, { createContext, useState, useRef, ReactNode } from "react";
import { NotificationType } from "../types";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContext {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: () => void;
}

export const NotificationContext = createContext<NotificationContext>(
  {} as NotificationContext
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addNotification = (message: string, type: NotificationType): void => {
    const id = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotifications([{ id, message, type }]);

    timeoutRef.current = setTimeout(() => {
      removeNotification();
    }, 5000);
  };

  const removeNotification = (): void => {
    setNotifications([]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
