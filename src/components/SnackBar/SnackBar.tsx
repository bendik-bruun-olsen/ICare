import React from "react";
import { useNotification } from "../../hooks/useNotifications";
import { Icon, Button } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import "./SnackBar.css";

const SnackBar: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="snackbar-container">
            {notifications && (
                <div
                    key={notifications.id}
                    className={`snackbar ${
                        notifications.type === "success"
                            ? "snackbar-success"
                            : notifications.type === "error"
                            ? "snackbar-error"
                            : ""
                    }`}
                >
                    <span>{notifications.message}</span>
                    <Button
                        variant="contained_icon"
                        onClick={() => {
                            removeNotification();
                        }}
                        className="snackbar-button"
                    >
                        <Icon data={close} />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SnackBar;
