import { collection, doc, setDoc } from "firebase/firestore";
import { Caretaker, NewPatient } from "../../types";
import { db } from "../firebase";

export const addPatient = async (
	formData: NewPatient,
	caretakers: Caretaker[],
	id?: string
) => {
	const patientRef = id
		? doc(db, "patientdetails", id)
		: doc(collection(db, "patientdetails"));
	await setDoc(patientRef, { ...formData, caretakers });
	return patientRef.id;
};
