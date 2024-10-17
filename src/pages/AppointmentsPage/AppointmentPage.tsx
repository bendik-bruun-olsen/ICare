import React, { useState, useEffect, useContext } from "react";
import DateSelector from "../../components/DateSelector/DateSelector";
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
import { getAppointmentsBySelectedDate } from "../../firebase/appointmentServices/getAppointment";

const AppointmentPage: React.FC = () => {
  const { currentPatientId } = useAuth();
  const { addNotification } = useContext(NotificationContext);
  const patientId = currentPatientId;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async (): Promise<void> => {
      if (!patientId) return;
      try {
        const fetchedAppointments = await getAppointmentsBySelectedDate(
          selectedDate,
          patientId,
          addNotification
        );
        setIsLoading(true);

        const sortedAppointments: Appointment[] = fetchedAppointments.sort(
          (a, b) => a.time.localeCompare(b.time)
        );

        setAppointments(sortedAppointments);

        if (fetchedAppointments.length === 0) {
          addNotification("No appointments", NotificationType.INFO);
          return;
        }
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        addNotification("Error fetching appointments", NotificationType.ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate, patientId]);

  if (appointments.length === 0) {
    return (
      <>
        <Navbar centerContent="Appointments" />
        <div className={"pageWrapper " + styles.fullPage}>
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={(prev) => setSelectedDate(prev)}
          />
          <div>
            <h2>No appointments for {selectedDate.toDateString()}</h2>
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
  }

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
