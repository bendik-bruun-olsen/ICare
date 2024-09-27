import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { NewPatient, NotificationContext, NotificationType } from "../../types";

export const getPatient = async (
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<NewPatient | null> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const patientSnap = await getDoc(patientRef);

    if (!patientSnap.exists()) {
      addNotification("Patient not found", NotificationType.ERROR);
      return null;
    }
    return patientSnap.data() as NewPatient;
  } catch {
    addNotification("Error fetching patient", NotificationType.ERROR);
    return null;
  }
};
