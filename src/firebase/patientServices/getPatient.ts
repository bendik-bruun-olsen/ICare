import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { NotificationContext, NotificationType, Patient } from "../../types";

export const getPatient = async (
	patientId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<Patient | null> => {
	try {
		const patientRef = doc(db, "patientdetails", patientId);
		const patientSnap = await getDoc(patientRef);

		if (!patientSnap.exists()) {
			addNotification("Patient not found", NotificationType.ERROR);
			return null;
		}
		return patientSnap.data() as Patient;
	} catch {
		addNotification("Error fetching patient", NotificationType.ERROR);
		return null;
	}
};
