import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { NotificationContextType } from "../../types";

export const getPatient = async (
	patientId: string,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", patientId);
		const patientSnap = await getDoc(patientRef);

		if (!patientSnap.exists()) {
			addNotification("Patient not found", "error");
			return null;
		}

		return patientSnap.data();
	} catch {
		addNotification("Error fetching patient", "error");
		return null;
	}
};
