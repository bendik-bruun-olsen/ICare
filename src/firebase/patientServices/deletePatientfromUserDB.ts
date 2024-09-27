import { NotificationContext, NotificationType } from "../../types";
import { getUserEmailFromPatient } from "./getUserEmailFromPatient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default async function deletePatientfromUserDB(
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<string[] | void> {
  try {
    const usersEmail = await getUserEmailFromPatient(
      patientId,
      addNotification
    );

    if (!usersEmail || usersEmail.length === 0) {
      addNotification(
        "No users found for the given patient ID",
        NotificationType.ERROR
      );
      return;
    }
    if (!usersEmail || usersEmail.length === 0) {
      addNotification(
        "No users found for the given patient ID",
        NotificationType.ERROR
      );
      return;
    }

    for (const userEmail of usersEmail) {
      const userDocRef = doc(db, "users", userEmail);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        addNotification(`User ${userEmail} not found`, NotificationType.ERROR);
        continue;
      }
      const userData = userSnapshot.data();

      const administeredPatients = userData.administeredPatients || [];
      const updatedAdministeredPatient = administeredPatients.filter(
        (administeredPatients: { id: string }) =>
          administeredPatients.id === patientId
      );
      const assignedPatients = userData.assignedPatients || [];
      const updatedAssignedPatient = assignedPatients.filter(
        (assignedPatients: { id: string }) => assignedPatients.id === patientId
      );

      await updateDoc(userDocRef, {
        administeredPatients: updatedAdministeredPatient,
        assignedPatients: updatedAssignedPatient,
      });
      await updateDoc(userDocRef, {
        administeredPatients: updatedAdministeredPatient,
        assignedPatients: updatedAssignedPatient,
      });
      console.log("Updated", userDocRef);
      addNotification(
        `Caretakers updated for user ${userEmail}`,
        NotificationType.SUCCESS
      );
    }
  } catch (error) {
    console.error("Error updating caretakers:", error);
    addNotification("Error updating caretakers", NotificationType.ERROR);
  }
}
