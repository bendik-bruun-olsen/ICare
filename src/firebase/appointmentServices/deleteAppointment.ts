import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { NotificationContext, NotificationType } from "../../types";

export const deleteAppointment = async (
  appointmentId: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<void> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const appointmentCollection = collection(patientRef, "appointments");
    const appointmentRef = doc(appointmentCollection, appointmentId);

    if (!appointmentRef) {
      addNotification("Todo not found", NotificationType.ERROR);
      return;
    }
    await deleteDoc(appointmentRef);
    addNotification("Todo deleted successfully", NotificationType.SUCCESS);
  } catch (error) {
    addNotification(
      "Error deleting todo, please try again later",
      NotificationType.ERROR
    );
  }
};
