import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { NotificationContextType } from "../../types";

export async function updateToDoStatusInDatabase(
	todoId: string,
	newStatus: string,
	addNotification: NotificationContextType["addNotification"]
) {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoRef = doc(patientRef, "todoItems", todoId);

		await updateDoc(todoRef, { status: newStatus });
	} catch {
		addNotification("Error updating todo status", "error");
	}
}
