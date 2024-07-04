import { CollectionReference, collection, doc } from "firebase/firestore";
import { db } from "./firebase/firebase";
import { ToDo } from "./types";
import { Timestamp } from "firebase/firestore";

export function getStartOfDay(selectedDate: Date) {
	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);
	return startOfDay;
}

export function getEndOfDay(selectedDate: Date) {
	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);
	return endOfDay;
}

export const toDoCollectionRef = collection(
	doc(db, "patientdetails", "patient@patient.com"),
	"todos"
) as CollectionReference<ToDo>;

export const formatTimestampToDate = (timestamp: Timestamp): string => {
	return timestamp.toDate().toISOString().substring(0, 10);
};
