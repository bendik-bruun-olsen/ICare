import { db } from "../../firebase/firebase";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import {
  NotificationContext,
  NotificationType,
  ToDo,
  TodoSeriesInfo,
} from "../../types";

export const addSingleNewTodo = async (
  todo: ToDo,
  currentUserName: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<void> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const todoCollection = collection(patientRef, "todoItems");
    const todoItemRef = doc(todoCollection);

    const updatedTodo: ToDo = {
      ...todo,
      id: todoItemRef.id,
      createdBy: currentUserName,
    };

    await setDoc(todoItemRef, updatedTodo);
    addNotification("Todo added successfully", NotificationType.SUCCESS);
  } catch {
    addNotification("Error adding todo", NotificationType.ERROR);
  }
};

export const addMultipleNewTodos = async (
  todos: ToDo[],
  seriesInfo: TodoSeriesInfo,
  currentUserName: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<void> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const todoSeriesInfoCollection = collection(patientRef, "todoSeriesInfo");
    const todoCollection = collection(patientRef, "todoItems");

    const batch = writeBatch(db);

    const todoSeriesInfoRef = doc(todoSeriesInfoCollection);
    batch.set(todoSeriesInfoRef, seriesInfo);

    todos.forEach((todo) => {
      const todoItemRef = doc(todoCollection);
      const updatedTodo = {
        ...todo,
        seriesId: todoSeriesInfoRef.id,
        id: todoItemRef.id,
        createdBy: currentUserName,
      };
      batch.set(todoItemRef, updatedTodo);
    });

    await batch.commit();
    addNotification("Series added successfully", NotificationType.SUCCESS);
  } catch {
    addNotification("Error adding series", NotificationType.ERROR);
  }
};
