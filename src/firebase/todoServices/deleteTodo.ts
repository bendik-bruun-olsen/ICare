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
import { NotificationContext, NotificationType } from "../../types";

export const deleteTodoItem = async (
	todoId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<void> => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");
		const todoRef = doc(todoCollection, todoId);

		if (!todoRef) {
			addNotification("Todo not found", NotificationType.ERROR);
			return;
		}
		await deleteDoc(todoRef);
		addNotification("Todo deleted successfully", NotificationType.SUCCESS);
	} catch {
		addNotification(
			"Error deleting todo, please try again later",
			NotificationType.ERROR
		);
	}
};

export const deleteTodoSeries = async (
	seriesId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<void> => {
	try {
		const patientRef = doc(db, "patientdetails", "patient@patient.com");
		const todoCollection = collection(patientRef, "todoItems");
		const seriesInfoRef = doc(patientRef, "todoSeriesInfo", seriesId);

		const q = query(todoCollection, where("seriesId", "==", seriesId));
		const querySnap = await getDocs(q);
		if (querySnap.empty) {
			addNotification("No todos found for series", NotificationType.ERROR);
			return;
		}

		const batch = writeBatch(db);
		querySnap.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});

		batch.delete(seriesInfoRef);

		await batch.commit();
		addNotification("Series deleted successfully", NotificationType.SUCCESS);
	} catch {
		addNotification(
			"Error deleting series, please try again later",
			NotificationType.ERROR
		);
	}
};
