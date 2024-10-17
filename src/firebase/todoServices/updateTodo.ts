import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { NotificationContext, NotificationType } from "../../types";

export async function updateToDoStatusInDatabase(
  todoId: string,
  newStatus: string,
  currentUser: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<void> {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const todoRef = doc(patientRef, "todoItems", todoId);

    let completedByUser: { completedBy: string | null } = { completedBy: null };
    if (newStatus === "checked") {
      completedByUser = { completedBy: currentUser };
    }

    const updatedMetaData = { status: newStatus, ...completedByUser };

    await updateDoc(todoRef, updatedMetaData);
  } catch {
    addNotification("Error updating todo status", NotificationType.ERROR);
  }
}
