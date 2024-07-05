import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const getTodo = async (todoId: string) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todos", todoId);

	const todoSnap = await getDoc(todoRef);

	if (todoSnap.exists()) return todoSnap.data();

	return null;
};
