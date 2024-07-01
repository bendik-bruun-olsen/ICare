import { db } from "../../firebase/firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import { TodoType } from "../../types/TodoType";

export const addNewTodo = async (newTodo: TodoType) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = collection(patientRef, "todos");

	const todoDocRef = await addDoc(todoRef, newTodo);
	return todoDocRef.id;
};
