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
	updatedTodo: TodoItemInterface
) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todoItems", todoId);

	await updateDoc(todoRef, { ...updatedTodo });
};

export const editTodoSeries = async (
	seriesId: string,
	updatedSeriesInfo: TodoSeriesInfoInterface
) => {
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
};

export const editSingleTodoToSeries = async (
	todoId: string,
	todoItem: TodoItemInterface,
	seriesInfo: TodoSeriesInfoInterface
) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const seriesCollection = collection(patientRef, "todoSeriesInfo");
	const todoCollection = collection(patientRef, "todoItems");
	const todoRef = doc(todoCollection, todoId);

	console.log("TodoItem received in editSingleTodoToSeries: ", todoItem);
	console.log("SeriesInfo received in editSingleTodoToSeries: ", seriesInfo);

	const now = Timestamp.now();
	const batch = writeBatch(db);

	console.log("Editing single todo to series");

	if (todoItem.date >= now) {
		batch.delete(todoRef);
		console.log("Deleted original todo");
	}

	const selectedDaysNumbers = mapSelectedDaysToNumbers(
		seriesInfo.selectedDays
	);

	const newSeriesRef = doc(seriesCollection);
	console.log("newSeriesRef: ", newSeriesRef.id);

	const updatedTodoItem = {
		...todoItem,
		seriesId: newSeriesRef.id,
	};

	console.log("TodoItem sent to generateTodosForSeries: ", updatedTodoItem);

	const newTodos = generateTodosForSeries(
		updatedTodoItem,
		formatTimestampToDateString(now),
		formatTimestampToDateString(seriesInfo.endDate),
		selectedDaysNumbers
	);

	console.log("Generated new todos: ", newTodos);

	newTodos.forEach((todo) => {
		const todoDocRef = doc(todoCollection);
		batch.set(todoDocRef, todo);
		console.log("Added new todo");
	});

	await batch.commit();
	console.log("Done!");
};
