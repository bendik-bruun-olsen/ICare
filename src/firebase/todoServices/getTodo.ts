import { db } from "../firebase";
import {
	doc,
	collection,
	getDoc,
	getDocs,
	query,
	where,
	Timestamp,
} from "firebase/firestore";

export const getTodo = async (todoId: string) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todos", todoId);

	const todoSnap = await getDoc(todoRef);
	const todoWithId = { ...todoSnap.data(), id: todoSnap.id };
	return todoWithId;
};

export const getTodosBySelectedDate = async (selectedDate: Date) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoCollection = collection(patientRef, "todos");

	const startOfDay = Timestamp.fromDate(
		new Date(selectedDate.setHours(0, 0, 0, 0))
	);
	const endOfDay = Timestamp.fromDate(
		new Date(selectedDate.setHours(23, 59, 59, 999))
	);

	const q = query(
		todoCollection,
		where("date", ">=", startOfDay),
		where("date", "<=", endOfDay)
	);

	const querySnap = await getDocs(q);
	const todosWithId = querySnap.docs.map((doc) => ({
		...doc.data(),
		id: doc.id,
	}));
	return todosWithId;
};

export const getTodoSeriesInfo = async (seriesId: string) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const seriesInfoRef = doc(patientRef, "seriesInfo", seriesId);

	const seriesInfoSnap = await getDoc(seriesInfoRef);
	return seriesInfoSnap.data();
};
