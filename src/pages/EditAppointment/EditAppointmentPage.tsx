import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, TextField } from "@equinor/eds-core-react";
import { Timestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import StartAndEndDate from "../../components/StartAndEndDate/StartAndEndDate";
import TitleDescription from "../../components/TitleDescription/TitleDescription";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import Loading from "../../components/Loading/Loading";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { Paths } from "../../paths";
import styles from "./EditAppointment.module.css";
import {
  formatTimestampToDateString,
  validateAppointmentItemFields,
} from "../../utils";
import { Appointment, AppointmentInputStatusProps } from "../../types";
import { getAppointment } from "../../firebase/appointmentServices/getAppointment";
import { deleteAppointment } from "../../firebase/appointmentServices/deleteAppointment";
import { editAppointment } from "../../firebase/appointmentServices/editAppointment";
import { NotificationContext } from "../../context/NotificationContext";
import { defaultAppointmentForm } from "../../constants/defaultAppointment";

interface LocationState {
  selectedDate: Date;
}

const EditAppointmentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;
  const { selectedDate: DateSelectedInAppointmentPage } = locationState || {
    selectedDate: new Date(),
  };
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [appointment, setAppointment] = useState<Appointment>(
    defaultAppointmentForm
  );
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { addNotification } = useContext(NotificationContext);
  const [appointmentInputFieldStatus, setAppointmentInputFieldStatus] =
    useState<AppointmentInputStatusProps>({});
  const { currentPatientId } = useAuth();
  const patientId = currentPatientId || "";

  async function fetchAppointment(appointmentId: string): Promise<boolean> {
    const result = await getAppointment(
      appointmentId,
      patientId,
      addNotification
    );
    if (result) {
      setAppointment(result);
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment(appointmentId).catch(() => setHasError(true));
    }
  }, [appointmentId, patientId]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const time = e.target.value;
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/; // Matches HH:MM format

    if (timeRegex.test(time)) {
      setAppointment((prev) => ({ ...prev, time }));
    }
    if (!timeRegex.test(time)) {
      console.error("Invalid time format. Expected HH:MM");
      // Optionally, you can set a default time or notify the user
    }
  };

  const isValidDate = (dateString: string): boolean => {
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
  };

  const handleDateChange = (date: string): void => {
    if (!isValidDate(date)) {
      console.error("Invalid date format");
      return;
    }

    const newDate = new Date(date);
    const currentTime = appointment.time || "00:00";
    const timeParts = currentTime.split(":");

    if (timeParts.length !== 2) {
      console.error("Invalid time format");
      return;
    }

    const [hours, minutes] = timeParts.map(Number);

    if (
      isNaN(hours) ||
      hours < 0 ||
      hours > 23 ||
      isNaN(minutes) ||
      minutes < 0 ||
      minutes > 59
    ) {
      console.error("Invalid time values");
      return;
    }

    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    if (isNaN(newDate.getTime())) {
      console.error("Resulting date is invalid");
      return;
    }

    const newTimestamp = Timestamp.fromDate(newDate);
    setAppointment((prev) => ({ ...prev, date: newTimestamp }));
  };

  const handleValidateAppointmentFields = (): boolean => {
    if (
      !validateAppointmentItemFields({
        appointmentItem: appointment,
        setAppointmentItemInputFieldStatus: setAppointmentInputFieldStatus,
        addNotification,
      })
    ) {
      return false;
    }
    return true;
  };

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const id = appointmentId;
    if (!id) return setHasError(true);

    try {
      setIsLoading(true);

      if (!handleValidateAppointmentFields()) return;

      const editSuccess = await editAppointment({
        appointmentId,
        updatedAppointment: appointment as Appointment,
        patientId,
        addNotification,
      });
      if (editSuccess) {
        navigate(Paths.APPOINTMENT, {
          state: { selectedDate: DateSelectedInAppointmentPage },
        });
        return;
      }

      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!appointmentId) {
      setHasError(true);
      return;
    }

    try {
      setIsLoading(true);
      await deleteAppointment(appointmentId, patientId, addNotification);
    } finally {
      setIsConfirmModalOpen(false);
      setIsLoading(false);
    }

    navigate(Paths.APPOINTMENT, {
      state: { selectedDate: DateSelectedInAppointmentPage },
    });
  }

  if (hasError) return <ErrorPage />;
  if (isLoading)
    return (
      <>
        <Navbar centerContent="Edit Appointment" />
        <Loading />
      </>
    );

  return (
    <>
      <Navbar centerContent="Edit Appointment" />
      <div className="pageWrapper">
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <div className="inputBackgroundBox">
              <div className={styles.mainContentContainer}>
                <TitleDescription
                  title={appointment?.title || ""}
                  setTitle={(title) =>
                    setAppointment((prev) => ({ ...prev, title }))
                  }
                  titleVariant={appointmentInputFieldStatus.title}
                  description={appointment?.description || ""}
                  setDescription={(description) =>
                    setAppointment((prev) => ({ ...prev, description }))
                  }
                  descriptionVariant={appointmentInputFieldStatus.description}
                />
                <div className={styles.scheduleControlsContainer}>
                  <StartAndEndDate
                    label="Date"
                    value={formatTimestampToDateString(appointment?.date)}
                    onChange={handleDateChange}
                    variant={appointmentInputFieldStatus.date}
                    minValue={undefined}
                  />
                </div>
                <div className={styles.timeAndRepeatControls}>
                  <TextField
                    id="time"
                    label="Select time"
                    type="time"
                    name="time"
                    value={
                      typeof appointment.time === "string"
                        ? appointment.time
                        : ""
                    }
                    onChange={handleTimeChange}
                    style={{ width: "150px" }}
                    variant={appointmentInputFieldStatus.time}
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button onClick={handleSubmit}>Save</Button>
              <Button
                color="danger"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </form>
      </div>
      <DeleteConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        type="appointment"
      />
    </>
  );
};

export default EditAppointmentPage;
