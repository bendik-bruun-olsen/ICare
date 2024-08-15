import React, { createContext, useState, useRef, ReactNode } from "react";

type Notification = {
    id: number;
    message: string;
    type: "success" | "error" | "info";
} | null;

type NotificationContextType = {
    notifications: Notification;
    addNotification: (
        message: string,
        type: "success" | "error" | "info"
    ) => void;
    removeNotification: () => void;
};

export const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const addNotification = (
        message: string,
        type: "success" | "error" | "info"
    ) => {
        const id = Date.now();

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setNotifications({ id, message, type });

        timeoutRef.current = setTimeout(() => {
            removeNotification();
        }, 5000); // Auto-remove after 5 seconds
    };

    const removeNotification = () => {
        setNotifications(null);

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
