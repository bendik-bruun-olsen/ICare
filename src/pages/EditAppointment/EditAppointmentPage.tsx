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
import { formatTimestampToDateString } from "../../utils";
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
    console.log("result", result);

    if (result) {
      setAppointment(result);
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (appointmentIdFromParams) {
      fetchAppointment(appointmentIdFromParams).catch(() => setHasError(true));
    }
  }, [appointmentIdFromParams]);

  const handleTimeChange = (date: string): void => {
    const newTimestamp = Timestamp.fromDate(new Date(date));
    setAppointment((prev) => ({ ...prev, time: newTimestamp }));
  };

  const handleDateChange = (date: string): void => {
    const newTimestamp = Timestamp.fromDate(new Date(date));
    setAppointment((prev) => ({ ...prev, date: newTimestamp }));
  };

  // const handleValidateAppointmentFields = (): boolean => {
  //   if (
  //     !validateAppointmentFields({
  //       appointment,
  //       setAppointmentInputFieldStatus,
  //       addNotification,
  //     })
  //   ) {
  //     return false;
  //   }
  //   return true;
  // };

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const appointmentId = appointmentIdFromParams;
    if (!appointmentId) return setHasError(true);

    try {
      setIsLoading(true);

      // if (!handleValidateAppointmentFields()) return;

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
    if (!appointmentIdFromParams) {
      setHasError(true);
      return;
    }

    try {
      setIsLoading(true);
      await deleteAppointment(
        appointmentIdFromParams,
        patientId,
        addNotification
      );
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
                      appointment.time.toDate().toTimeString().slice(0, 5) || ""
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
