import { collection, doc, updateDoc } from "firebase/firestore";
import { Caretaker, NewPatient } from "../../types";
import { db } from "../firebase";

export const editPatient = async (
	formData: NewPatient,
	caretakers: Caretaker[],
	id: string
): Promise<string> => {
	if (!id) {
		throw new Error("Document ID is required to edit patient details.");
	}
	const patientRef = doc(collection(db, "patientdetails", id));
	await updateDoc(patientRef, { ...formData, caretakers });
	return patientRef.id;
};
