import { collection, doc, setDoc } from "firebase/firestore";
import { Caretaker, NewPatient } from "../../types";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export const addPatient = async (
	formData: NewPatient,
	caretakers: Caretaker[],
	id?: string
): Promise<string> => {
	const auth = getAuth();
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new Error("No user is currently logged in.");
	}

	const patientRef = id
		? doc(db, "patientdetails", id)
		: doc(collection(db, "patientdetails"));

	const patientData = {
		...formData,
		caretakers,
		createdBy: {
			userEmail: currentUser.email,
		},
	};

	await setDoc(patientRef, patientData);
	return patientRef.id;
};
