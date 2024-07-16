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
import { ToDo } from "./types";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
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

export const checkUserExists = async (email: string): Promise<boolean> => {
  const db = getFirestore();
  try {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(userQuery);
    return !querySnapshot.empty;
  } catch {
    return false;
  }
};

export const sendResetEmail = async (email: string): Promise<void> => {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
};

export const formatTimestampToDate = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString().substring(0, 10);
};

export const groupTodosByCategory = (
  todos: ToDo[]
): { [key: string]: ToDo[] } => {
  const grouped: { [key: string]: ToDo[] } = {};
  todos.forEach((todo) => {
    const category = todo.category || "Others";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(todo);
  });
  return grouped;
};

export function getToDosForSelectedDate(selectedDate: Date, todo: ToDo) {
  const todoStartDate = todo.startDate.toDate();
  const todoEndDate = todo.endDate ? todo.endDate.toDate() : todoStartDate;

  if (todo.startDate && !todo.endDate && !todo.selectedDays) {
    const isStartDateOnlyMatch =
      !todo.endDate &&
      todoStartDate.toDateString() === selectedDate.toDateString();
    return isStartDateOnlyMatch;
  }

  if (
    todo.startDate &&
    todo.endDate &&
    (!todo.selectedDays || todo.selectedDays.length === 0)
  ) {
    const startOfDay = getStartOfDay(selectedDate);
    const endOfDay = getEndOfDay(selectedDate);
    const isWithinDateRange =
      startOfDay <= todoEndDate && endOfDay >= todoStartDate;
    return isWithinDateRange;
  }

  if (
    todo.startDate &&
    todo.endDate &&
    todo.selectedDays &&
    todo.selectedDays.length > 0
  ) {
    const selectedWeekday = selectedDate
      .toLocaleString("en-us", {
        weekday: "long",
      })
      .toLowerCase();
    const repeatsOnDay =
      todo.selectedDays.includes(selectedWeekday) &&
      selectedDate >= todoStartDate &&
      selectedDate <= todoEndDate;
    return repeatsOnDay;
  }

  return false;
}
