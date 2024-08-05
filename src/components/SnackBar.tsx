import React from "react";
import { useNotification } from "../context/NotificationContext";
import { Icon } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";

const SnackBar: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        background:
                            notification.type === "success"
                                ? "#1c7b82"
                                : notification.type === "error"
                                ? "#e7372b"
                                : "#153c86",
                        color: "#e9e9e9",
                        padding: "10px 20px",
                        margin: "5px 0",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span>{notification.message}</span>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        style={{ marginLeft: 10 }}
                    >
                        <Icon data={close} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SnackBar;
