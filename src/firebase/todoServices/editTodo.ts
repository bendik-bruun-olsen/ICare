import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  NotificationContext,
  NotificationType,
  ToDo,
  TodoSeriesInfo,
  ToDoStatus,
} from "../../types";
import {
  formatTimestampToDateString,
  generateTodosForSeries,
  mapSelectedDaysToNumbers,
} from "../../utils";

interface EditTodoItemProps {
  todoId: string;
  updatedTodo: ToDo;
  patientId: string;
  addNotification: NotificationContext["addNotification"];
}

export const editTodoItem = async ({
  todoId,
  updatedTodo,
  patientId,
  addNotification,
}: EditTodoItemProps): Promise<boolean> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const todoRef = doc(patientRef, "todoItems", todoId);

    await updateDoc(todoRef, { ...updatedTodo });
    addNotification("Todo edited successfully", NotificationType.SUCCESS);
    return true;
  } catch {
    addNotification("Error editing todo", NotificationType.ERROR);
    return false;
  }
};

export const editTodoSeries = async (
  seriesId: string,
  updatedSeriesInfo: TodoSeriesInfo,
  currentUser: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<boolean> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const todoCollection = collection(patientRef, "todoItems");
    const seriesInfoRef = doc(patientRef, "todoSeriesInfo", seriesId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = Timestamp.fromDate(today);
    const q = query(
      todoCollection,
      where("seriesId", "==", seriesId),
      where("date", ">=", startOfToday)
    );

    const querySnap = await getDocs(q);
    if (querySnap.empty) {
      addNotification("No todos found for series", NotificationType.ERROR);
      return false;
    }

    const batch = writeBatch(db);
    querySnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const selectedDaysNumbers = mapSelectedDaysToNumbers(
      updatedSeriesInfo.selectedDays
    );

    const newTodos = generateTodosForSeries(
      {
        title: updatedSeriesInfo.title,
        description: updatedSeriesInfo.description,
        time: updatedSeriesInfo.time,
        category: updatedSeriesInfo.category,
        status: ToDoStatus.unchecked,
        seriesId: seriesId,
        date: updatedSeriesInfo.startDate,
        id: "",
        createdBy: currentUser,
        completedBy: null,
      },
      formatTimestampToDateString(startOfToday),
      formatTimestampToDateString(updatedSeriesInfo.endDate),
      selectedDaysNumbers
    );

    newTodos.forEach((todo) => {
      const todoItemRef = doc(todoCollection);
      const updatedTodo = {
        ...todo,
        id: todoItemRef.id,
      };
      batch.set(todoItemRef, updatedTodo);
    });

    batch.update(seriesInfoRef, { ...updatedSeriesInfo });

    await batch.commit();
    addNotification("Series edited successfully", NotificationType.SUCCESS);
    return true;
  } catch {
    addNotification("Error editing series", NotificationType.ERROR);
    return false;
  }
};

export const createTodoSeriesFromSingleTodo = async (
  todoItem: ToDo,
  seriesInfo: TodoSeriesInfo,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<boolean> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const seriesCollection = collection(patientRef, "todoSeriesInfo");
    const todoCollection = collection(patientRef, "todoItems");
    const todoRef = doc(todoCollection, todoItem.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = Timestamp.fromDate(today);

    const batch = writeBatch(db);
    batch.delete(todoRef);

    const updatedSeriesInfo = {
      ...seriesInfo,
      title: todoItem.title,
      description: todoItem.description,
      time: todoItem.time,
      category: todoItem.category,
    };

    const selectedDaysNumbers = mapSelectedDaysToNumbers(
      updatedSeriesInfo.selectedDays
    );

    const newSeriesRef = doc(seriesCollection);
    batch.set(newSeriesRef, updatedSeriesInfo);

    const updatedTodoItem = {
      ...todoItem,
      seriesId: newSeriesRef.id,
    };

    const newTodos = generateTodosForSeries(
      updatedTodoItem,
      formatTimestampToDateString(startOfToday),
      formatTimestampToDateString(updatedSeriesInfo.endDate),
      selectedDaysNumbers
    );

    newTodos.forEach((todo) => {
      const todoDocRef = doc(todoCollection);
      const updatedTodo = {
        ...todo,
        id: todoDocRef.id,
      };
      batch.set(todoDocRef, updatedTodo);
    });

    await batch.commit();
    addNotification(
      "Todo successfully created into series",
      NotificationType.SUCCESS
    );
    return true;
  } catch {
    addNotification("Error creating series for todo", NotificationType.ERROR);
    return false;
  }
};
