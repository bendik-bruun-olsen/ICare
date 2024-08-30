import { collection, doc, setDoc } from "firebase/firestore";
import {
	CaretakerInformationInterface,
	PatientFormDataInterface,
} from "../../types";
import { db } from "../firebase";

export const addPatient = async (
	formData: PatientFormDataInterface,
	caretakers: CaretakerInformationInterface[],
	id?: string
) => {
	const patientRef = id
		? doc(db, "patientdetails", id)
		: doc(collection(db, "patientdetails"));
	await setDoc(patientRef, { ...formData, caretakers });
	return patientRef.id;
};
