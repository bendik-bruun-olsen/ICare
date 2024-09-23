import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { NotificationContext, NotificationType } from "../../types";

export const getPatient = async (
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<DocumentData | null> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const patientSnap = await getDoc(patientRef);

    if (!patientSnap.exists()) {
      addNotification("Patient not found", NotificationType.ERROR);
      return null;
    }
    console.log(patientSnap.data());
    return patientSnap.data();
  } catch {
    addNotification("Error fetching patient", NotificationType.ERROR);
    return null;
  }
};
