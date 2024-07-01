import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { TodoType } from "../../types/TodoType";

export const editTodo = async (todoId: string, updatedTodo: TodoType) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todos", todoId);

	await updateDoc(todoRef, updatedTodo);
};
