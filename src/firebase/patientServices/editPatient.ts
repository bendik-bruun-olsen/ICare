import { collection, doc, updateDoc } from "firebase/firestore";
import {
	CaretakerInformationInterface,
	PatientFormDataInterface,
} from "../../types";
import { db } from "../firebase";

export const editPatient = async (
	formData: PatientFormDataInterface,
	caretakers: CaretakerInformationInterface[],
	id: string
) => {
	if (!id) {
		throw new Error("Document ID is required to edit patient details.");
	}
	const patientRef = doc(collection(db, "patientdetails"), id);
	await updateDoc(patientRef, { ...formData, caretakers });
	return patientRef.id;
};
