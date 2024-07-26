import { updateDoc, doc } from "firebase/firestore";
import { CollectionReference, collection, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ToDo } from "../../types";

export async function updateToDoStatusInDatabase(
  todoId: string,
  newStatus: string
) {
  const patientRef = doc(db, "patientdetails", "patient@patient.com");
  const todoRef = doc(patientRef, "todos", todoId);
  await updateDoc(todoRef, { toDoStatus: newStatus });
}

export function createTodoQuery() {
  const toDoCollectionRef = collection(
    doc(db, "patientdetails", "patient@patient.com"),
    "todos"
  ) as CollectionReference<ToDo>;
  return query(toDoCollectionRef);
}
