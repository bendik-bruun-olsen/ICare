import React, { useState } from "react";
import { TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate/StartAndEndDate";
import { db } from "../../firebase/firebase";
import { collection, addDoc, doc, Timestamp } from "firebase/firestore";
import TitleDescription from "../../components/TitleDescription/TitleDescription";
import AddButton from "../../components/AddButton/AddButton";
import styles from "../AddTodoPage/AddTodoPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { AppointmentStatus } from "../../types";

export default function AddAppointment(): JSX.Element {
  const { currentPatientId } = useAuth();
  const patientId = currentPatientId || "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [time, setTime] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const newAppointment = {
      title,
      description,
      startDate: Timestamp.fromDate(new Date(startDate)),
      time,
      newStatus: AppointmentStatus,
      createdBy: "",
    };
    try {
      const patientRef = doc(db, "patientdetails", patientId);
      const appointmentRef = collection(patientRef, "appointments");
      await addDoc(appointmentRef, newAppointment);
    } catch (e) {
      console.error("Error in adding appointment document: ", e);
    }
  };

  const onclickAddButton = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    await handleSubmit(e);
    setTitle("");
    setDescription("");
    setStartDate(new Date().toISOString().substring(0, 10));
    setTime("");
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
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                />
              </div>
              <div className={styles.fieldContainer}>
                <StartAndEndDate
                  label="Select Date"
                  value={startDate}
                  onChange={(date: string) => setStartDate(date)}
                />
              </div>
              <div className={styles.fieldContainer}>
                <TextField
                  id="time"
                  label="Select time"
                  type="time"
                  value={time}
                  className={styles.time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTime(e.target.value)
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
