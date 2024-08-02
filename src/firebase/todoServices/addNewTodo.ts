import { db } from "../../firebase/firebase";
import { addDoc, collection, doc } from "firebase/firestore";
import { TodoInterface, TodoSeriesInfoInterface } from "../../types";

export const addSingleNewTodo = async (todo: TodoInterface) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoCollection = collection(patientRef, "todos");

	await addDoc(todoCollection, todo);

	return;
};

export const addMultipleNewTodos = async (
	todos: TodoInterface[],
	seriesInfo: TodoSeriesInfoInterface
) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");

	const todoCollection = collection(patientRef, "todos");
	const seriesInfoCollection = collection(patientRef, "seriesInfo");

	const seriesInfoCollectionRef = await addDoc(
		seriesInfoCollection,
		seriesInfo
	);

	for (const todo of todos) {
		const updatedTodo = { ...todo, seriesID: seriesInfoCollectionRef.id };
		await addDoc(todoCollection, updatedTodo);
	}

	return;
};
