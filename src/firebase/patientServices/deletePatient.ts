import { deletePatientfromUserDB } from "./deletePatientfromUserDB";
import { deletePatientfromPatientDB } from "./deletePatientfromPatientDB";
import { NotificationContext, NotificationType } from "../../types";

// Combined Service: Deletes patient and updates user documents
export const deletePatient = async (
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<void> => {
  try {
    await Promise.all([
      deletePatientfromPatientDB(patientId, addNotification),
      deletePatientfromUserDB(patientId, addNotification),
    ]);
    addNotification(
      "Patient deleted and users updated successfully",
      NotificationType.SUCCESS
    );
  } catch (error) {
    console.error("Error deleting patient or updating users:", error);
    addNotification(
      "Error deleting patient or updating users",
      NotificationType.ERROR
    );
  }
};
