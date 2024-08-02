import { TodoInterface } from "../../types";
import { db } from "../firebase";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";

export const getTodo = async (todoId: string) => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "test", todoId);

	const todoSnap = await getDoc(todoRef);
	return todoSnap.data() as TodoInterface | undefined;
};

export const getAllTodos = async () => {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoCollection = collection(patientRef, "test");

	const todoSnap = await getDocs(todoCollection);
	return todoSnap.docs.map((doc) => doc.data() as TodoInterface);
};
