import { db } from "../../firebase/firebase";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import {
	NotificationContextType,
	TodoItemInterface,
	TodoSeriesInfoInterface,
} from "../../types";

export const addSingleNewTodo = async (
	todo: TodoItemInterface,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");
		const todoItemRef = doc(todoCollection);

		const todoWithId = {
			...todo,
			id: todoItemRef.id,
		};

		await setDoc(todoItemRef, todoWithId);
		addNotification("Todo added successfully", "success");
	} catch {
		addNotification("Error adding todo", "error");
	}
};

export const addMultipleNewTodos = async (
	todos: TodoItemInterface[],
	seriesInfo: TodoSeriesInfoInterface,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoSeriesInfoCollection = collection(
			patientRef,
			"todoSeriesInfo"
		);
		const todoCollection = collection(patientRef, "todoItems");

		const batch = writeBatch(db);

		const todoSeriesInfoRef = doc(todoSeriesInfoCollection);
		batch.set(todoSeriesInfoRef, seriesInfo);

		todos.forEach((todo) => {
			const todoItemRef = doc(todoCollection);
			const todoWithId = {
				...todo,
				seriesId: todoSeriesInfoRef.id,
				id: todoItemRef.id,
			};
			batch.set(todoItemRef, todoWithId);
		});

		await batch.commit();
		addNotification("Series added successfully", "success");
	} catch {
		addNotification("Error adding series", "error");
	}
};
