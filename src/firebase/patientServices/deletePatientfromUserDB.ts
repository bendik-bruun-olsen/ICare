import { NotificationContext, NotificationType } from "../../types";
import { getUserEmailFromPatient } from "./getUserEmailFromPatient";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default async function deletePatientfromUserDB(
	patientId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<string[] | void> {
	try {
		const users = await getUserEmailFromPatient(patientId, addNotification);

		for (email of emails) {
			const users = doc(db, "users", email);
			if (!users) {
				addNotification("User not found", NotificationType.ERROR);
				return;
			}
			const newCaretakers = users.email.filter(
				() => administeredPatient.id === patientId
			);
			await updateDoc(users, { caretakers: newCaretakers });
		}
		console.log("email", email);
	} catch {
		addNotification("Error fetching patient", NotificationType.ERROR);
	}
	return;
}
