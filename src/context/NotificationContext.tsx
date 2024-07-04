import React, { createContext, useState, useContext, ReactNode } from "react";

type Notification = {
    id: number;
    message: string;
    type: "success" | "error" | "info";
};

type NotificationContextType = {
    notifications: Notification[];
    addNotification: (
        message: string,
        type: "success" | "error" | "info"
    ) => void;
    removeNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (
        message: string,
        type: "success" | "error" | "info"
    ) => {
        const id = Date.now();
        setNotifications([...notifications, { id, message, type }]);
        setTimeout(() => removeNotification(id), 3000); // Auto-remove after 3 seconds
    };

    const removeNotification = (id: number) => {
        setNotifications(
            notifications.filter((notification) => notification.id !== id)
        );
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
