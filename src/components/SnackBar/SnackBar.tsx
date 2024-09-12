import React, { useContext } from "react";
import { Icon, Button } from "@equinor/eds-core-react";
import { close } from "@equinor/eds-icons";
import styles from "./Snackbar.module.css";
import { NotificationContext } from "../../context/NotificationContext";
import { NotificationType } from "../../types";

const Snackbar: React.FC = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className={styles.snackbarContainer}>
      {notifications.map((notifications) => (
        <div
          key={notifications.id}
          className={`${styles.snackbar} ${
            notifications.type === NotificationType.SUCCESS
              ? styles.snackbarSuccess
              : notifications.type === NotificationType.ERROR
              ? styles.snackbarError
              : {}
          }`}
        >
          <span>{notifications.message}</span>
          <Button
            variant="contained_icon"
            onClick={() => {
              removeNotification();
            }}
            className={styles.snackbarButton}
          >
            <Icon data={close} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Snackbar;
