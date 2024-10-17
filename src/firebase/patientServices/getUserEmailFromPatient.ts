import { NotificationContext, NotificationType } from "../../types";
import { getPatient } from "./getPatient";

export const getUserEmailFromPatient = async (
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<string[]> => {
  try {
    const patientData = await getPatient(patientId, addNotification);

    if (!patientData) {
      addNotification("Patient not found", NotificationType.ERROR);
      return [];
    }

    const caretakerEmail = patientData.caretakers.map(
      (caretaker) => caretaker.email
    );
    const createdByEmail = patientData.createdBy;

    const emailList: string[] = [...caretakerEmail, createdByEmail];

    if (!emailList) return [];
    return emailList;
  } catch {
    addNotification("Error fetching patient", NotificationType.ERROR);
    return [];
  }
};
