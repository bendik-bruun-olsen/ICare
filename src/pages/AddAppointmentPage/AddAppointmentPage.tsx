import React, { useContext, useState } from "react";
import { TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate/StartAndEndDate";
import { Timestamp } from "firebase/firestore";
import TitleDescription from "../../components/TitleDescription/TitleDescription";
import AddButton from "../../components/AddButton/AddButton";
import styles from "../AddTodoPage/AddTodoPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { Appointment } from "../../types";
import { formatTimestampToDateString } from "../../utils";
import { addAppointment } from "../../firebase/appointmentServices/addAppointment";
import { NotificationContext } from "../../context/NotificationContext";
import { defaultAppointmentForm } from "../../constants/defaultAppointment";

export default function AddAppointmentPage(): JSX.Element {
  const { currentPatientId } = useAuth();
  const currentUser = useAuth().userData?.email;
  const patientId = currentPatientId || "";
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const [appointmentData, setAppointmentData] = useState<Appointment>(
    defaultAppointmentForm
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      if (!currentUser) {
        return;
      }

      addAppointment(appointmentData, currentUser, patientId, addNotification);
    } catch (e) {
      console.error("Error in adding appointment document: ", e);
    }
  };

  const onclickAddButton = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    await handleSubmit(e);
    navigate(Paths.APPOINTMENT);
  };

  return (
    <>
      <Navbar centerContent="Add Appointments" />
      <div className="pageWrapper">
        <div className={styles.mainContainer}>
          <h1>Add Appointments</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div className={styles.fieldContainer}>
                <TitleDescription
                  title={appointmentData.title}
                  setTitle={(title) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      title,
                    }))
                  }
                  description={appointmentData.description}
                  setDescription={(description) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      description,
                    }))
                  }
                />
              </div>
              <div className={styles.fieldContainer}>
                <StartAndEndDate
                  label="Select Date"
                  value={
                    new Date(formatTimestampToDateString(appointmentData.date))
                  }
                  onChange={(date) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      date: Timestamp.fromDate(new Date(date)),
                    }))
                  }
                />
              </div>
              <div className={styles.fieldContainer}>
                <TextField
                  id="time"
                  label="Select time"
                  type="time"
                  value={appointmentData.time}
                  className={styles.time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  style={{ width: "150px" }}
                />
              </div>
              <AddButton label="Add" onClick={onclickAddButton} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
