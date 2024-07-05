import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { TodoInterface } from "../../types";

export const editTodo = async (todoId: string, updatedTodo: TodoInterface) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todos", todoId);

	await updateDoc(todoRef, updatedTodo);
};
