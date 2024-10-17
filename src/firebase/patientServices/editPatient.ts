import { collection, doc, updateDoc } from "firebase/firestore";
import { Caretaker, NewPatient } from "../../types";
import { db } from "../firebase";

export const editPatient = async (
	formData: NewPatient,
	caretakers: Caretaker[],
	patientId: string
): Promise<void> => {
	if (!patientId) {
		throw new Error("Patient ID is required to edit patient details.");
	}

	const patientRef = doc(db, "patientdetails", patientId);
	await updateDoc(patientRef, { ...formData, caretakers });
};
