import { db } from "../../firebase/firebase";
import { collection, addDoc, doc, Timestamp } from "firebase/firestore";

export const addNewTodo = async (todo) => {
	const todoWithTimestamps = {
		...todo,
		startDate: Timestamp.fromDate(new Date(todo.startDate)),
		endDate: todo.endDate
			? Timestamp.fromDate(new Date(todo.endDate))
			: null,
	};

	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = collection(patientRef, "todos");

	const todoDocRef = await addDoc(todoRef, todoWithTimestamps);
	return todoDocRef.id;
};
