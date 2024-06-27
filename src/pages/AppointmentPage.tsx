
import React, { useState, useEffect } from "react";
import DatePickerComponent from "../components/DatePicker/DatePickerComponent";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
} from "firebase/firestore";

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  time: string;
}

const AppointmentPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentRef = collection(
          doc(db, "patientdetails", "patient@patient.com"),
          "appointments"
        );

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

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
      <DatePickerComponent
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
    </div>
  );
};

export default AppointmentPage;
