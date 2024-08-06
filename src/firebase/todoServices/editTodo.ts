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
		},
		formatTimestampToDateString(updatedSeriesInfo.startDate),
		formatTimestampToDateString(updatedSeriesInfo.endDate),
		selectedDaysNumbers
	);

	newTodos.forEach((todo) => {
		const todoDocRef = doc(todoCollection);
		batch.set(todoDocRef, todo);
	});

	batch.update(seriesInfoRef, { ...updatedSeriesInfo });

	await batch.commit();
};
