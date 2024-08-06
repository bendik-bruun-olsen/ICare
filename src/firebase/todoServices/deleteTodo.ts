import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	Timestamp,
	where,
	writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

export const deleteTodo = async (todoId: string) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoCollection = collection(patientRef, "todoItems");
	const todoRef = doc(todoCollection, todoId);

	await deleteDoc(todoRef);
};

export const deleteTodoSeries = async (todoSeriesId: string) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoCollection = collection(patientRef, "todoItems");

	const now = Timestamp.now();
	const q = query(
		todoCollection,
		where("seriesId", "==", todoSeriesId),
		where("date", ">=", now)
	);

	const querySnap = await getDocs(q);

	const batch = writeBatch(db);
	querySnap.docs.forEach((doc) => {
		batch.delete(doc.ref);
	});
	await batch.commit();
};
