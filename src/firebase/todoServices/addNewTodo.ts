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

	const batch = writeBatch(db);

	const todoSeriesInfoRef = doc(todoSeriesInfoCollection);
	batch.set(todoSeriesInfoRef, seriesInfo);

	todos.forEach((todo) => {
		const todoItemRef = doc(todoCollection);
		const updatedTodo = {
			...todo,
			seriesId: todoSeriesInfoRef.id,
			id: todoItemRef.id,
		};
		batch.set(todoItemRef, updatedTodo);
	});

	await batch.commit();
};
