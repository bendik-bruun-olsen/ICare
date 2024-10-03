import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { NotificationContext, NotificationType } from "../../types";

export const deletePatientfromPatientDB = async (
  patientId: string,

  addNotification: NotificationContext["addNotification"]
): Promise<void> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);

    if (!patientRef) {
      addNotification("Patient not found", NotificationType.ERROR);
    }

    await deleteDoc(patientRef);
    addNotification("Patient deleted", NotificationType.SUCCESS);
  } catch {
    addNotification("Could not delete patient", NotificationType.ERROR);
  }
};
