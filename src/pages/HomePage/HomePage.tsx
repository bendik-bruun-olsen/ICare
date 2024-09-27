import Navbar from "../../components/Navbar/Navbar";
import PatientDetails from "../../components/PatientDetails/PatientDetails";
import AppointmentsQuickView from "../../components/AppointmentsQuickView/AppointmentsQuickView";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import style from "./HomePage.module.css";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { useContext, useEffect, useState } from "react";
import { getPatient } from "../../firebase/patientServices/getPatient";
import { NotificationContext } from "../../context/NotificationContext";
import { NotificationType } from "../../types";

export default function HomePage(): JSX.Element {
  const { currentPatientId } = useAuth();
  const [patientdetails, setPatientDetails] = useState<{
    name: string;
    age: string;
  }>();
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (currentPatientId) {
      getPatient(currentPatientId, addNotification).then((data) => {
        if (data && "name" in data && "age" in data) {
          setPatientDetails({ name: data.name, age: data.age });
        }
      });
      if (!currentPatientId) {
        addNotification(
          "Error fetching patient details",
          NotificationType.ERROR
        );
      }
    }
  }, [currentPatientId, addNotification]);

  return (
    <>
      <Navbar centerContent="Home" />
      <div className={style.pageContainer}>
        <div className={style.pageContent}>
          {patientdetails && (
            <PatientDetails
              patientName={patientdetails.name}
              age={patientdetails.age.toString()}
            />
          )}
          <AppointmentsQuickView
            firstAppointment="Doctor's appointment"
            firstAppointmentTime="09:30"
            secondAppointment="Physical therapy"
            secondAppointmentTime="12:00"
          />
          <RemainingTodos />
        </div>
      </div>
    </>
  );
}
