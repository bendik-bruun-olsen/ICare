import {
  CollectionReference,
  collection,
  doc,
  getFirestore,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase/firebase";
import {
  NotificationType,
  TodoItemInputStatusProps,
  ToDo,
  validateDateRangeProps,
  validateTodoItemFieldsProps,
  validateTodoSeriesFieldsProps,
  clearTodoSeriesInputStatusProps,
  GenerateTodosForSeriesProps,
} from "./types";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export function getStartOfDay(selectedDate: Date): Date {
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function getEndOfDay(selectedDate: Date): Date {
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}

export const capitalizeUsername = (username: string): string => {
  if (!username) return "";
  return username
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
export const getToDoCollectionRef = (
  patientId: string
): CollectionReference<ToDo> => {
  return collection(
    doc(db, "patientdetails", patientId),
    "todos"
  ) as CollectionReference<ToDo>;
};

export const toDoCollectionRef = (
  patientId: string
): CollectionReference<ToDo> => {
  return collection(
    doc(db, "patientdetails", patientId),
    "todos"
  ) as CollectionReference<ToDo>;
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  const db = getFirestore();
  try {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(userQuery);
    const userExists = !querySnapshot.empty;

    return userExists;
  } catch {
    return false;
  }
};

export const sendResetEmail = async (email: string): Promise<void> => {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
};

export const formatTimestampToDateString = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString().substring(0, 10);
};

export const groupTodosByCategory = (
  todos: ToDo[]
): { [key: string]: ToDo[] } => {
  const grouped: { [key: string]: ToDo[] } = {};
  todos.forEach((todo) => {
    if (todo.status === "ignore") {
      if (!grouped["Ignored"]) {
        grouped["Ignored"] = [];
      }
      grouped["Ignored"].push(todo);
    }
    if (todo.status !== "ignore") {
      const category = todo.category || "Others";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(todo);
    }
  });
  return grouped;
};

export const sortTodosGroup = (groupedTodos: {
  [key: string]: ToDo[];
}): { [key: string]: ToDo[] } => {
  const priorityOrder = ["Medicine", "Food", "Exercise", "Social", "Others"];
  const sortedGroup: { [key: string]: ToDo[] } = {};
  Object.keys(groupedTodos)
    .sort((a, b) => {
      const indexA = priorityOrder.indexOf(a);
      const indexB = priorityOrder.indexOf(b);
      return (
        (indexA === -1 ? Infinity : indexA) -
        (indexB === -1 ? Infinity : indexB)
      );
    })
    .forEach((key) => {
      sortedGroup[key] = groupedTodos[key].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
    });
  return sortedGroup;
};

export const mapSelectedDaysToNumbers = (selectedDays: string[]): number[] => {
  return selectedDays.map((day) => {
    if (day === "monday") return 1;
    if (day === "tuesday") return 2;
    if (day === "wednesday") return 3;
    if (day === "thursday") return 4;
    if (day === "friday") return 5;
    if (day === "saturday") return 6;
    if (day === "sunday") return 0;
    return -1;
  });
};

export const generateTodosForSeries = ({
  newTodo,
  startDate,
  endDate,
  selectedDaysNumbers,
}: GenerateTodosForSeriesProps): ToDo[] => {
  const newTodos = [];
  const currentDate = new Date(startDate);
  const isCurrentDayWithinSelectedDays = selectedDaysNumbers.includes(
    currentDate.getDay()
  );
  while (currentDate <= new Date(endDate)) {
    if (isCurrentDayWithinSelectedDays) {
      const todoForDay = {
        ...newTodo,
        date: Timestamp.fromDate(currentDate),
      };
      newTodos.push(todoForDay);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return newTodos;
};

export const validateTodoItemFields = ({
  todoItem,
  setTodoItemInputVariants,
  addNotification,
}: validateTodoItemFieldsProps): boolean => {
  const fields = [
    { key: "title", value: todoItem.title },
    { key: "description", value: todoItem.description },
    { key: "category", value: todoItem.category },
    { key: "date", value: todoItem.date },
    { key: "time", value: todoItem.time },
  ];
  let isValid = true;

  fields.forEach((field) => {
    if (!field.value) {
      setTodoItemInputVariants((prev) => ({
        ...prev,
        [field.key]: "error",
      }));
      isValid = false;
    }
  });

  if (!isValid) {
    addNotification(
      "Please fill in all required fields",
      NotificationType.ERROR
    );
  }

  return isValid;
};

export const validateTodoSeriesFields = ({
  todoSeriesInfo,
  setTodoSeriesInputVariants,
  addNotification,
}: validateTodoSeriesFieldsProps): boolean => {
  const fields = [
    { key: "title", value: todoSeriesInfo.title },
    { key: "description", value: todoSeriesInfo.description },
    { key: "category", value: todoSeriesInfo.category },
    { key: "startDate", value: todoSeriesInfo.startDate },
    { key: "endDate", value: todoSeriesInfo.endDate },
    { key: "time", value: todoSeriesInfo.time },
    {
      key: "selectedDays",
      value:
        todoSeriesInfo.selectedDays.length > 0
          ? todoSeriesInfo.selectedDays
          : null,
    },
  ];
  let isValid = true;

  fields.forEach((field) => {
    if (!field.value) {
      setTodoSeriesInputVariants((prev) => ({
        ...prev,
        [field.key]: "error",
      }));
      isValid = false;
    }
  });

  if (!isValid) {
    addNotification(
      "Please fill in all required fields",
      NotificationType.ERROR
    );
  }

  return isValid;
};

interface clearTodoItemInputStatusProps {
  todoItem: ToDo;
  setTodoItemInputFieldStatus: Dispatch<
    SetStateAction<TodoItemInputStatusProps>
  >;
}

export const clearTodoItemInputStatus = ({
  todoItem,
  setTodoItemInputFieldStatus,
}: clearTodoItemInputStatusProps): void => {
  setTodoItemInputFieldStatus((prev) => ({
    title: todoItem.title ? undefined : prev.title,
    description: todoItem.description ? undefined : prev.description,
    category: todoItem.category ? undefined : prev.category,
    date: todoItem.date ? undefined : prev.date,
    time: todoItem.time ? undefined : prev.time,
  }));
};

export const clearTodoSeriesInputStatus = ({
  todoSeriesInfo,
  setTodoSeriesInputFieldStatus,
}: clearTodoSeriesInputStatusProps): void => {
  setTodoSeriesInputFieldStatus((prev) => ({
    title: todoSeriesInfo.title ? undefined : prev.title,
    description: todoSeriesInfo.description ? undefined : prev.description,
    category: todoSeriesInfo.category ? undefined : prev.category,
    startDate: todoSeriesInfo.startDate ? undefined : prev.startDate,
    endDate: todoSeriesInfo.endDate ? undefined : prev.endDate,
    time: todoSeriesInfo.time ? undefined : prev.time,
    selectedDays:
      todoSeriesInfo.selectedDays.length > 0 ? undefined : prev.selectedDays,
  }));
};

export const validateDateRange = ({
  startDate,
  endDate,
  addNotification,
}: validateDateRangeProps): boolean => {
  if (startDate.seconds > endDate.seconds) {
    addNotification(
      "End date cannot be before start date",
      NotificationType.ERROR
    );
    return false;
  }
  return true;
};
