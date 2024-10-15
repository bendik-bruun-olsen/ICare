import Navbar from "../../components/Navbar/Navbar";
import PatientDetails from "../../components/PatientDetails/PatientDetails";
import AppointmentsQuickView from "../../components/AppointmentsQuickView/AppointmentsQuickView";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import style from "./HomePage.module.css";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { useContext, useEffect, useState } from "react";
import { getPatient } from "../../firebase/patientServices/getPatient";
import { NotificationContext } from "../../context/NotificationContext";
import { NotificationType, ToDo } from "../../types";
import DateSelector from "../../components/DateSelector/DateSelector";
import { useLocation } from "react-router-dom";
import { getTodosBySelectedDate } from "../../firebase/todoServices/getTodo";
import { getQuickviewAppointments } from "../../firebase/appointmentServices/getQuickviewAppointments";

export default function HomePage(
  appointmentId: string,
  patientId: string
): JSX.Element {
  const location = useLocation();
  const initialDate = location.state
    ? new Date(location.state.selectedDate)
    : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const { currentPatientId } = useAuth();
  const [patientDetails, setPatientDetails] = useState<{
    name: string;
    age: string;
  }>();
  const { addNotification } = useContext(NotificationContext);
  const [todos, setTodos] = useState<ToDo[]>([]);

  useEffect(() => {
    if (currentPatientId) {
      getPatient(currentPatientId, addNotification).then((data) => {
        if (data && "name" in data && "age" in data) {
          setPatientDetails({ name: data.name, age: data.age });
        }
      });
    }
  }, [currentPatientId, addNotification]);

  // const patientId = currentPatientId;

  useEffect(() => {
    async function fetchTodos(): Promise<void> {
      if (!patientId) {
        return;
      }
      const fetchedTodos =
        (await getTodosBySelectedDate(
          selectedDate,
          patientId,
          addNotification
        )) || [];
      setTodos(fetchedTodos);
    }

    fetchTodos();
  }, [selectedDate, patientId, addNotification]);

  const test = getQuickviewAppointments(
    appointmentId,
    patientId,
    addNotification
  );

  console.log("test: ", test);

  return (
    <>
      <Navbar centerContent="Home" />
      <div className={style.pageContainer}>
        <div className={style.pageContent}>
          {patientDetails && (
            <PatientDetails
              patientName={patientDetails.name}
              age={patientDetails.age.toString()}
            />
          )}
          <div className={style.dateSelector}>
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
          <AppointmentsQuickView
            firstAppointment="First Appointment"
            firstAppointmentTime="10:00 AM"
            secondAppointment="Second Appointment"
            secondAppointmentTime="2:00 PM"
          />

          <RemainingTodos todos={todos} />
        </div>
      </div>
    </>
  );
}
