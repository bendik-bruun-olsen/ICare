import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { NotificationContextType } from "../../types";

export async function updateToDoStatusInDatabase(
	todoId: string,
	newStatus: string,
	currentUser: string,
	addNotification: NotificationContextType["addNotification"]
) {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoRef = doc(patientRef, "todoItems", todoId);

		let completedByUser: { completedBy: string | null } = { completedBy: null };
		if (newStatus === "checked") {
			completedByUser = { completedBy: currentUser };
		}

		const updatedMetaData = { status: newStatus, ...completedByUser };
		console.log("updatedMetaData: ", updatedMetaData);

		await updateDoc(todoRef, updatedMetaData);
	} catch {
		addNotification("Error updating todo status", "error");
	}
}
