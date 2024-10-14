import React, { useState, useEffect, useContext } from "react";
import DateSelector from "../../components/DateSelector/DateSelector";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";
import { add } from "@equinor/eds-icons";
import { Button, Icon } from "@equinor/eds-core-react";
import styles from "./AppointmentPage.module.css";
import { useAuth } from "../../hooks/useAuth/useAuth";
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

        const querySnapshot = await getDocs(appointmentRef);
        const fetchedAppointments = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Appointment;

          // Validate and format the time
          const timeIsValid =
            typeof data.time === "string" && /^\d{2}:\d{2}$/.test(data.time);
          if (!timeIsValid) {
            addNotification(
              "Invalid time format for appointment",
              NotificationType.ERROR
            );
            throw new Error("Invalid time format");
          }

          return {
            ...data,
            id: doc.id,
          };
        }) as Appointment[];

        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        addNotification("Error fetching appointments", NotificationType.ERROR);
      }
    };

    fetchAppointments();
  }, [patientId, addNotification]);

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
