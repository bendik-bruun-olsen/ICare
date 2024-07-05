import { db } from "../../firebase/firebase";
import { addDoc, doc, collection } from "firebase/firestore";
import { TodoInterface } from "../../types";

export const addNewTodo = async (newTodo: TodoInterface) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = collection(patientRef, "todos");

	const todoDocRef = await addDoc(todoRef, newTodo);
	return todoDocRef.id;
};
