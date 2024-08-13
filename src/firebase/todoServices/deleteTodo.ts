import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
	writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { NotificationContextType } from "../../types";

export const deleteTodoItem = async (
	todoId: string,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");
		const todoRef = doc(todoCollection, todoId);

		if (!todoRef) {
			addNotification("Todo not found", "error");
			return;
		}
		await deleteDoc(todoRef);
		addNotification("Todo deleted successfully", "success");
	} catch {
		addNotification("Error deleting todo, please try again later", "error");
	}
};

export const deleteTodoSeries = async (
	seriesId: string,
	addNotification: NotificationContextType["addNotification"]
) => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");
		const seriesInfoRef = doc(patientRef, "todoSeriesInfo", seriesId);

		const q = query(todoCollection, where("seriesId", "==", seriesId));
		const querySnap = await getDocs(q);
		if (querySnap.empty) {
			addNotification("No todos found for series", "error");
			return;
		}

		const batch = writeBatch(db);
		querySnap.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});

		batch.delete(seriesInfoRef);

		await batch.commit();
		addNotification("Series deleted successfully", "success");
	} catch {
		addNotification(
			"Error deleting series, please try again later",
			"error"
		);
	}
};
