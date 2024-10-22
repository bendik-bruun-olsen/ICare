import { useContext, useEffect, useRef, useState } from "react";
import { Icon, Button } from "@equinor/eds-core-react";
import { arrow_back_ios, arrow_forward_ios } from "@equinor/eds-icons";
import styles from "./AppointmentTile.module.css";
import { Appointment, AppointmentStatus, NotificationType } from "../../types";
import { capitalizeUsername } from "../../utils";
import getNameFromEmail from "../../firebase/userServices/getNameFromEmail";
import { NotificationContext } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { deleteAppointment } from "../../firebase/appointmentServices/deleteAppointment";
import DeleteConfirmModal from "../DeleteConfirmModal/DeleteConfirmModal";

interface AppointmentTileProps {
  selectedDate: Date;
  appointmentItem: Appointment;
  onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
}

enum overflowStatus {
  hidden = "hidden",
  visible = "visible",
}

export default function AppointmentTile({
  appointmentItem: appointmentItem,
}: AppointmentTileProps): JSX.Element {
  const [createdByName, setCreatedByName] = useState("unknown");
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [contentMaxHeight, setContentMaxHeight] = useState("30px");
  const [contentContainerOverflow, setContentContainerOverflow] = useState(
    overflowStatus.hidden
  );
  const navigate = useNavigate();

  const { addNotification } = useContext(NotificationContext);

  const contentContainerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const optionsIconRef = useRef<SVGSVGElement>(null);
  const overflowTimeoutRef = useRef<number | undefined>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const defaultContentMaxHeight = 65;

  useEffect(() => {
    const fetchNames = async (): Promise<void> => {
      if (appointmentItem.createdBy) {
        const name = await getNameFromEmail(appointmentItem.createdBy);

        if (name) {
          const capitalizedName = capitalizeUsername(name);
          setCreatedByName(capitalizedName);
        }
      }
    };
    fetchNames();
  }, [appointmentItem.createdBy]);

  useEffect(() => {
    setOverflowStatus();
    if (isMenuExpanded && contentContainerRef.current) {
      setContentMaxHeight(`${contentContainerRef.current.scrollHeight}px`);
    }
    if (!isMenuExpanded && contentContainerRef.current) {
      if (descriptionRef.current) {
        const calculatedHeight =
          descriptionRef.current.scrollHeight < defaultContentMaxHeight
            ? descriptionRef.current.scrollHeight
            : defaultContentMaxHeight;
        setContentMaxHeight(`${calculatedHeight}px`);
      }
    }
  }, [isMenuExpanded]);

  const setOverflowStatus = (): void => {
    if (overflowTimeoutRef.current) {
      clearTimeout(overflowTimeoutRef.current);
    }
    if (isMenuExpanded) {
      overflowTimeoutRef.current = window.setTimeout(() => {
        setContentContainerOverflow(overflowStatus.visible);
      }, 300);
    }
    if (!isMenuExpanded) {
      setContentContainerOverflow(overflowStatus.hidden);
    }
  };

  const handleMenuExpand = (): void => {
    setIsMenuExpanded((prev) => !prev);
  };

  const navigateToEditPage = (): void => {
    navigate(
      Paths.EDIT_APPOINTMENT.replace(":appointmentId", appointmentItem.id)
    );
  };

  const handleDeleteAppointment = async (): Promise<void> => {
    try {
      await deleteAppointment(
        appointmentItem.id,
        appointmentItem.patientId,
        addNotification
      );

      location.reload();
    } catch (error) {
      addNotification(
        "Error deleting appointment, please try again later",
        NotificationType.ERROR
      );
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className={styles.checkboxAndToDoTileWrapper}>
      <div className={`${styles.toDoWrapper}`}>
        <h3 className={styles.title}>
          {`${appointmentItem.time} - ${appointmentItem.title}`}
        </h3>
        <div
          className={styles.contentContainer}
          style={{
            maxHeight: contentMaxHeight,
            overflow: contentContainerOverflow,
          }}
          ref={contentContainerRef}
        >
          <p className={styles.description} ref={descriptionRef}>
            {appointmentItem.description}
          </p>
          <div className={styles.metaDataAndOptionsContainer}>
            <div className={styles.metaDataContainer}>
              <span className={styles.metaDataText}>
                {`Created by ${createdByName}`}
              </span>
            </div>
            <div className={styles.optionsMenuContainer}>
              <div className={styles.buttons}>
                <Button onClick={navigateToEditPage} ref={optionsIconRef}>
                  Edit
                </Button>
                <Button
                  onClick={() => setIsConfirmModalOpen(true)}
                  ref={optionsIconRef}
                  color="danger"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.expandMenuButtonContainer}
          onClick={handleMenuExpand}
        >
          <Button className={styles.expandMenuButton} variant={"ghost_icon"}>
            <Icon data={isMenuExpanded ? arrow_back_ios : arrow_forward_ios} />
          </Button>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteAppointment}
        type="appointment"
      />
    </div>
  );
}
