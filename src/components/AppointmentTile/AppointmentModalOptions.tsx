import styles from "./AppointmentModalOptions.module.css";
import { Link } from "react-router-dom";
import { Appointment, AppointmentStatus } from "../../types";
import { Paths } from "../../paths";

interface Props {
  isAbove: boolean;
  onClose: () => void;
  onStatusChange: (newStatus: AppointmentStatus) => Promise<void>;
  currentTaskStatus: AppointmentStatus;
  appointmentItem: Appointment;
  selectedDate: Date;
}

export default function AppointmentModalOptions({
  isAbove,
  onClose,
  onStatusChange,
  currentTaskStatus,
  appointmentItem,
  selectedDate,
}: Props): JSX.Element {
  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}></div>
      <div
        className={`${styles.modalContainer} ${
          isAbove ? styles.dropdownAbove : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className={styles.modalList}>
          <li
            className={styles.modalItem}
            onClick={() =>
              onStatusChange(
                currentTaskStatus === AppointmentStatus.ignore
                  ? AppointmentStatus.unchecked
                  : AppointmentStatus.ignore
              )
            }
          >
            <p>
              {currentTaskStatus === AppointmentStatus.ignore
                ? "Mark as applicable"
                : "Mark as N/A"}
            </p>
          </li>
          <li className={styles.modalItem}>
            <Link
              to={Paths.EDIT_APPOINTMENT.replace(":todoId", appointmentItem.id)}
              state={{ selectedDate, editingSeries: false }}
            >
              <p>Edit/Delete This Task</p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
