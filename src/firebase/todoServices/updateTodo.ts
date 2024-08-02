import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export async function updateToDoStatusInDatabase(
	todoId: string,
	newStatus: string
) {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todos", todoId);
	await updateDoc(todoRef, { status: newStatus });
}
