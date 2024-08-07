import { addDoc, collection } from "firebase/firestore";
import {
	CaretakerInformationInterface,
	PatientFormDataInterface,
} from "../../types";
import { db } from "../firebase";

export const addPatient = async (
	formData: PatientFormDataInterface,
	caretakers: CaretakerInformationInterface[]
) => {
	const patientRef = collection(db, "patientdetails");
	await addDoc(patientRef, { ...formData, caretakers });
};
