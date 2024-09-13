import { NotificationContext, NotificationType, ToDo } from "../../types";
import { db } from "../firebase";
import {
	doc,
	collection,
	getDoc,
	getDocs,
	query,
	where,
	Timestamp,
	DocumentData,
} from "firebase/firestore";

export const getTodo = async (
	todoId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<ToDo | undefined> => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoRef = doc(patientRef, "todoItems", todoId);
		const todoSnap = await getDoc(todoRef);

		if (!todoSnap.exists()) {
			addNotification("Todo not found", NotificationType.ERROR);
			throw new Error("Todo not found");
		}

		const data = todoSnap.data() as ToDo;
		return data;
	} catch {
		addNotification("Error fetching todo", NotificationType.ERROR);
	}
};

export const getTodoSeriesInfo = async (
	seriesId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<DocumentData | null> => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const seriesInfoRef = doc(patientRef, "todoSeriesInfo", seriesId);

		const seriesInfoSnap = await getDoc(seriesInfoRef);
		if (!seriesInfoSnap.exists()) {
			addNotification("Series not found", NotificationType.ERROR);
			return null;
		}
		return seriesInfoSnap.data();
	} catch {
		addNotification("Error fetching series", NotificationType.ERROR);
		return null;
	}
};

export const getTodosBySelectedDate = async (
	selectedDate: Date,
	addNotification: NotificationContext["addNotification"]
): Promise<[] | void> => {
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
		addNotification("Error fetching todos", NotificationType.ERROR);
		return [];
	}
};

export const getTodoSeriesIdByTodoId = async (
	todoId: string
): Promise<string | null> => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");
		const todoRef = doc(todoCollection, todoId);
		const todoSnap = await getDoc(todoRef);
		if (!todoSnap.exists()) {
			return null;
		}
		return todoSnap.data().seriesId;
	} catch {
		return null;
	}
};
