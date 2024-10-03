import React, { useState, useEffect } from "react";
import DateSelector from "../../components/DateSelector/DateSelector";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";
import { add } from "@equinor/eds-icons";
import { Button, Icon } from "@equinor/eds-core-react";
import styles from "./AppointmentPage.module.css";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { getEndOfDay, getStartOfDay } from "../../utils";

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  time: string;
}

const AppointmentPage: React.FC = () => {
  const { currentPatientId } = useAuth();
  const patientId = currentPatientId || "";
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async (): Promise<void> => {
      try {
        const appointmentRef = collection(
          doc(db, "patientdetails", patientId),
          "appointments"
        );

        const startOfDay = getStartOfDay(selectedDate);
        const endOfDay = getEndOfDay(selectedDate);
        const q = query(
          appointmentRef,
          where("startDate", ">=", Timestamp.fromDate(startOfDay)),
          where("startDate", "<=", Timestamp.fromDate(endOfDay))
        );
        const querySnapshot = await getDocs(q);
        const fetchedAppointments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  return (
    <div>
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div>
        <h2>Appointments for {selectedDate.toDateString()}</h2>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <p>Title: {appointment.title}</p>
              <p>Description: {appointment.description}</p>
              <p>Time: {appointment.time}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link to={Paths.ADD_APPOINTMENT} state={{ selectedDate }}>
          <div className={styles.addIcon}>
            <Button variant="contained_icon">
              <Icon data={add} size={32} />
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AppointmentPage;
