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
      console.log("Patient not found");
    }

    await deleteDoc(patientRef);
    addNotification("Patient deleted", NotificationType.SUCCESS);
    console.log("Patient deleted");
  } catch {
    addNotification("Could not delete patient", NotificationType.ERROR);
    console.log("Could not delete patient");
  }
};
