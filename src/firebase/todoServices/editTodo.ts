import { db } from "../firebase";
import {
	collection,
	doc,
	getDocs,
	query,
	Timestamp,
	updateDoc,
	where,
	writeBatch,
} from "firebase/firestore";
import {
	NotificationContextType,
	TodoItemInterface,
	TodoSeriesInfoInterface,
	ToDoStatus,
} from "../../types";
import {
	formatTimestampToDateString,
	generateTodosForSeries,
	mapSelectedDaysToNumbers,
} from "../../utils";

export const editTodoItem = async (
	todoId: string,
	updatedTodo: TodoItemInterface,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoRef = doc(patientRef, "todoItems", todoId);

		await updateDoc(todoRef, { ...updatedTodo });
		addNotification("Todo edited successfully", "success");
	} catch {
		addNotification("Error editing todo", "error");
	}
};

export const editTodoSeries = async (
	seriesId: string,
	updatedSeriesInfo: TodoSeriesInfoInterface,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");
		const seriesInfoRef = doc(patientRef, "todoSeriesInfo", seriesId);

		const now = Timestamp.now();
		const q = query(
			todoCollection,
			where("seriesId", "==", seriesId),
			where("date", ">=", now)
		);

		const querySnap = await getDocs(q);

		if (querySnap.empty) {
			addNotification("No todos found for series", "error");
			return;
		}

		const batch = writeBatch(db);
		querySnap.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});

		const selectedDaysNumbers = mapSelectedDaysToNumbers(
			updatedSeriesInfo.selectedDays
		);

		const newTodos = generateTodosForSeries(
			{
				title: updatedSeriesInfo.title,
				description: updatedSeriesInfo.description,
				time: updatedSeriesInfo.time,
				category: updatedSeriesInfo.category,
				status: ToDoStatus.unchecked,
				comment: "",
				seriesId: seriesId,
				date: updatedSeriesInfo.startDate,
				id: "",
			},
			formatTimestampToDateString(now),
			formatTimestampToDateString(updatedSeriesInfo.endDate),
			selectedDaysNumbers
		);

		newTodos.forEach((todo) => {
			const todoItemRef = doc(todoCollection);
			const updatedTodo = {
				...todo,
				id: todoItemRef.id,
			};
			batch.set(todoItemRef, updatedTodo);
		});

		batch.update(seriesInfoRef, { ...updatedSeriesInfo });

		await batch.commit();
		addNotification("Series edited successfully", "success");
	} catch {
		addNotification("Error editing series", "error");
	}
};

export const editSingleTodoToSeries = async (
	todoId: string,
	todoItem: TodoItemInterface,
	seriesInfo: TodoSeriesInfoInterface,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const seriesCollection = collection(patientRef, "todoSeriesInfo");
		const todoCollection = collection(patientRef, "todoItems");
		const todoRef = doc(todoCollection, todoId);

		const now = Timestamp.now();
		const batch = writeBatch(db);

		// if (todoItem.date >= now) {
		// 	batch.delete(todoRef);
		// }
		batch.delete(todoRef);

		const updatedSeriesInfo = {
			...seriesInfo,
			title: todoItem.title,
			description: todoItem.description,
			time: todoItem.time,
			category: todoItem.category,
		};

		const selectedDaysNumbers = mapSelectedDaysToNumbers(
			updatedSeriesInfo.selectedDays
		);

		const newSeriesRef = doc(seriesCollection);
		batch.set(newSeriesRef, updatedSeriesInfo);

		const updatedTodoItem = {
			...todoItem,
			seriesId: newSeriesRef.id,
		};

		const newTodos = generateTodosForSeries(
			updatedTodoItem,
			formatTimestampToDateString(now),
			formatTimestampToDateString(updatedSeriesInfo.endDate),
			selectedDaysNumbers
		);

		newTodos.forEach((todo) => {
			const todoDocRef = doc(todoCollection);
			const updatedTodo = {
				...todo,
				id: todoDocRef.id,
			};
			batch.set(todoDocRef, updatedTodo);
		});

		await batch.commit();
		addNotification("Todo successfully created into series", "success");
	} catch {
		addNotification("Error creating series for todo", "error");
	}
};
