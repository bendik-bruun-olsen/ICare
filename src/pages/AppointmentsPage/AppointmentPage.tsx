import React, { useState, useEffect, useContext } from "react";
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
import { NotificationContext } from "../../context/NotificationContext";
import { NotificationType } from "../../types";
import Navbar from "../../components/Navbar/Navbar";
import AppointmentTile from "../../components/AppointmentTile/AppointmentTile";
import { Appointment } from "../../types";

const AppointmentPage: React.FC = () => {
  const { currentPatientId } = useAuth();
  const { addNotification } = useContext(NotificationContext);
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
        if (fetchedAppointments.length === 0) {
          addNotification("No appointments found", NotificationType.ERROR);
          return;
        }
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchAppointments();
  }, [selectedDate, patientId]);

  return (
    <>
      <Navbar centerContent="Appointments" />
      <div className={"pageWrapper " + styles.fullPage}>
        <DateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div>
          <h2>Appointments for {selectedDate.toDateString()}</h2>
          <ul>
            {appointments.map((appointment) => (
              <AppointmentTile
                key={appointment.id}
                appointmentItem={appointment}
                selectedDate={selectedDate}
                onStatusChange={() => {}}
              />
            ))}
          </ul>
        </div>
        <Link to={Paths.ADD_APPOINTMENT} state={{ selectedDate }}>
          <div className={styles.addIcon}>
            <Button variant="contained_icon">
              <Icon data={add} size={32} />
            </Button>
          </div>
        </Link>
      </div>
    </>
  );
};

export default AppointmentPage;
