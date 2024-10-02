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

export default function HomePage(): JSX.Element {
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
      if (!currentPatientId) {
        addNotification(
          "Error fetching patient details",
          NotificationType.ERROR
        );
      }
    }
  }, [currentPatientId, addNotification]);

  const patientId = currentPatientId || "";

  useEffect(() => {
    async function fetchTodos(): Promise<void> {
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
            firstAppointment="Doctor's appointment"
            firstAppointmentTime="09:30"
            secondAppointment="Physical therapy"
            secondAppointmentTime="12:00"
          />
          <RemainingTodos todos={todos} />
        </div>
      </div>
    </>
  );
}
