import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { NewPatient } from "../../types";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export const addPatient = async (
	formData: NewPatient,
	id?: string
): Promise<string> => {
	const auth = getAuth();
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new Error("No user is currently logged in.");
	}

	try {
		const patientRef = id
			? doc(db, "patientdetails", id)
			: doc(collection(db, "patientdetails"));

		if (currentUser.email) {
			formData.createdBy = currentUser.email;
		}

		await setDoc(patientRef, formData);

		if (!currentUser.email) {
			throw new Error("Current user email is null.");
		}
		const adminUseRef = doc(db, "users", currentUser.email);

		await updateDoc(adminUseRef, {
			administeredPatients: arrayUnion({
				patientId: patientRef.id,
				patientName: formData.name,
			}),
		});

		for (const caretaker of formData.caretakers) {
			const caretakerUserRef = doc(db, "users", caretaker.email);
			await updateDoc(caretakerUserRef, {
				assignedPatients: arrayUnion({
					patientId: patientRef.id,
					patientName: formData.name,
				}),
			});
		}

		return patientRef.id;
	} catch (error) {
		console.error("Error adding patient:", error);
		throw error;
	}
};
