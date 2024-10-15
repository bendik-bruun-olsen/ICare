import { Appointment, NotificationContext } from "../../types";
import { getAppointment } from "./getAppointment";

export const getQuickviewAppointments = async (
  appointmentId: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<Appointment[]> => {
  const fetchedAppointments: Appointment[] = await getAppointment(
    appointmentId,
    patientId,
    addNotification
  );
  if (!fetchedAppointments) return [];

  const now = new Date();

  const sortedAppointments: Appointment[] = fetchedAppointments
    .sort((a, b) => a.time.localeCompare(b.time))
    .filter((appointment) => new Date(appointment.time) > now);

  sortedAppointments.slice(0, 2);
  console.log("fetchedAppointments: ", fetchedAppointments);
  console.log("sortedAppointments: ", sortedAppointments);
  return sortedAppointments;
};
