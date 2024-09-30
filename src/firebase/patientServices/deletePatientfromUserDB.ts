import {
	AdministeredPatient,
	AssignedPatient,
	NotificationContext,
	NotificationType,
	User,
} from "../../types";
import { getUserEmailFromPatient } from "./getUserEmailFromPatient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const deletePatientsFromUser = (userData: User, patientId: string): User => {
	const administeredPatients = userData.administeredPatients || [];

	const updatedAdministeredPatient = administeredPatients.filter(
		(administeredPatient: AdministeredPatient) =>
			administeredPatient.patientId !== patientId
	);

	const assignedPatients = userData.assignedPatients || [];

	const updatedAssignedPatient = assignedPatients.filter(
		(assignedPatient: AssignedPatient) =>
			assignedPatient.patientId !== patientId
	);

	return {
		...userData,
		administeredPatients: updatedAdministeredPatient,
		assignedPatients: updatedAssignedPatient,
	};
};

export const deletePatientfromUserDB = async (
	patientId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<string[] | void> => {
	try {
		const userEmails = await getUserEmailFromPatient(
			patientId,
			addNotification
		);

		if (!userEmails || userEmails.length === 0) {
			addNotification(
				"No users found for the given patient ID",
				NotificationType.ERROR
			);
			return;
		}

		for (const userEmail of userEmails) {
			const userDocRef = doc(db, "users", userEmail);
			const userSnapshot = await getDoc(userDocRef);

			if (!userSnapshot.exists()) {
				addNotification(`User ${userEmail} not found`, NotificationType.ERROR);
				continue;
			}
			const userData = userSnapshot.data() as User;

			const userDataWithPatientsRemoved = deletePatientsFromUser(
				userData,
				patientId
			);

			await updateDoc(userDocRef, userDataWithPatientsRemoved as Partial<User>);
			addNotification(
				`Caretakers updated for user ${userEmail}`,
				NotificationType.SUCCESS
			);
		}
	} catch (error) {
		console.error("Error updating caretakers:", error);
		addNotification("Error updating caretakers", NotificationType.ERROR);
	}
};
