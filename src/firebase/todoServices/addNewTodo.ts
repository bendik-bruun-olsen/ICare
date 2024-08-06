import { db } from "../../firebase/firebase";
import { addDoc, collection, doc, writeBatch } from "firebase/firestore";
import { TodoItemInterface, TodoSeriesInfoInterface } from "../../types";

export const addSingleNewTodo = async (todo: TodoItemInterface) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoCollection = collection(patientRef, "todoItems");

	await addDoc(todoCollection, todo);
};

export const addMultipleNewTodos = async (
	todos: TodoItemInterface[],
	seriesInfo: TodoSeriesInfoInterface
) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");

	const todoSeriesInfoCollection = collection(patientRef, "todoSeriesInfo");
	const todoCollection = collection(patientRef, "todoItems");

	const todoSeriesInfoCollectionRef = await addDoc(
		todoSeriesInfoCollection,
		seriesInfo
	);

	const batch = writeBatch(db);

	todos.forEach((todo) => {
		const updatedTodo = {
			...todo,
			seriesId: todoSeriesInfoCollectionRef.id,
		};
		const todoDocRef = doc(todoCollection);
		batch.set(todoDocRef, updatedTodo);
	});

	await batch.commit();
};
