import { db } from "../../firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import {
  Appointment,
  NotificationContext,
  NotificationType,
} from "../../types";

export const addAppointment = async (
  appointment: Appointment,
  currentUserName: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<void> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const appointmentCollection = collection(patientRef, "appointments");
    const appointmentRef = doc(appointmentCollection);

    const updatedAppointment: Appointment = {
      ...appointment,
      id: appointmentRef.id,
      createdBy: currentUserName,
      patientId,
    };

    await setDoc(appointmentRef, updatedAppointment);
    addNotification("Appointment added successfully", NotificationType.SUCCESS);
  } catch {
    addNotification("Error adding Appointment", NotificationType.ERROR);
  }
};
