import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
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
    const patientRef = doc(db, "patientdetails", patientId);
    const appointmentRef = doc(patientRef, "appointmentItems", appointmentId);

    await updateDoc(appointmentRef, { ...updatedAppointment });
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
