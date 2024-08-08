import { NotificationContextType } from "../../types";
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

export const getTodo = async (
	todoId: string,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoRef = doc(patientRef, "todoItems", todoId);
		const todoSnap = await getDoc(todoRef);

		if (!todoSnap.exists()) {
			addNotification("Todo not found", "error");
			return null;
		}

		return todoSnap.data();
	} catch {
		addNotification("Error fetching todo", "error");
		return null;
	}
};

export const getTodoSeriesInfo = async (
	seriesId: string,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const seriesInfoRef = doc(patientRef, "todoSeriesInfo", seriesId);

		const seriesInfoSnap = await getDoc(seriesInfoRef);
		if (!seriesInfoSnap.exists()) {
			addNotification("Series not found", "error");
			return null;
		}
		return seriesInfoSnap.data();
	} catch {
		addNotification("Error fetching series", "error");
		return null;
	}
};

export const getTodosBySelectedDate = async (
	selectedDate: Date,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");

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
		if (querySnap.empty) {
			return [];
		}

		const todosWithId = querySnap.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));
		return todosWithId;
	} catch {
		addNotification("Error fetching todos", "error");
		return [];
	}
};
