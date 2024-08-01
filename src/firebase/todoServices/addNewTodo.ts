import { db } from "../../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { TodoInterface, seriesInfoInterface } from "../../types";

export const addSingleNewTodo = async (todo: TodoInterface) => {
	const patientRef = collection(
		db,
		"patientdetails",
		"patient@patient.com",
		"test"
	);

	const todoDocRef = await addDoc(patientRef, {
		todos: todo,
	});
	return todoDocRef.id;
};

export const addMultipleNewTodos = async (
	todos: TodoInterface[],
	seriesInfo: seriesInfoInterface
) => {
	const patientRef = collection(
		db,
		"patientdetails",
		"patient@patient.com",
		"test"
	);

	const todoDocRef = await addDoc(patientRef, {
		seriesInfo: seriesInfo,
		todos: todos,
	});
	return todoDocRef.id;
};
