import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { NotificationContext, NotificationType } from "../../types";

export async function updateAppointmentStatusInDB(
  appointmentId: string,
  newStatus: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<void> {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const appointmentRef = doc(patientRef, "appointments", appointmentId);

    const updatedMetaData = { status: newStatus };

    await updateDoc(appointmentRef, updatedMetaData);
  } catch {
    addNotification(
      "Error updating appointment status",
      NotificationType.ERROR
    );
  }
}
