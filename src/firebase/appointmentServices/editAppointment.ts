import { db } from "../firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import {
  NotificationContext,
  NotificationType,
  Appointment,
} from "../../types";

interface EditAppointmentProps {
  appointmentId: string;
  updatedAppointment: Appointment;
  patientId: string;
  addNotification: NotificationContext["addNotification"];
}

export const editAppointment = async ({
  appointmentId,
  updatedAppointment,
  patientId,
  addNotification,
}: EditAppointmentProps): Promise<boolean> => {
  try {
    const formattedAppointment = {
      ...updatedAppointment,
      time: updatedAppointment.time.toString(),
      date:
        updatedAppointment.date instanceof Date
          ? updatedAppointment.date
          : new Date(updatedAppointment.date),
    };

    const patientRef = doc(db, "patientdetails", patientId);
    const appointmentCollection = collection(patientRef, "appointments");
    const appointmentRef = doc(appointmentCollection, appointmentId);

    await updateDoc(appointmentRef, { ...formattedAppointment });
    addNotification(
      "Appointment edited successfully",
      NotificationType.SUCCESS
    );
    return true;
  } catch (error) {
    console.error("Error editing appointment item:", error);
    addNotification("Error editing appointment", NotificationType.ERROR);
    return false;
  }
};
