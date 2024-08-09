import React, { createContext, useState, useContext, ReactNode } from "react";

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

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification>(null);

    const addNotification = (
        message: string,
        type: "success" | "error" | "info"
    ) => {
        const id = Date.now();
        setNotifications({ id, message, type });
        setTimeout(() => {
            removeNotification();
        }, 3000); // Auto-remove after 3 seconds
    };

    const removeNotification = () => {
        setNotifications(null);
    };

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, removeNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};
