import { db } from "../../firebase/firebase";
import { addDoc, doc } from "firebase/firestore";
import { TodoType } from "../../types/TodoType";

export const addNewTodo = async (newTodo: TodoType) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todos");

	const todoDocRef = await addDoc(todoRef, newTodo);
	return todoDocRef.id;
};
