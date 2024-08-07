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
import { ToDo, TodoItemInterface } from "./types";
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

export const formatTimestampToDateString = (timestamp: Timestamp): string => {
	return timestamp.toDate().toISOString().substring(0, 10);
};

export const groupTodosByCategory = (
	todos: TodoItemInterface[]
): { [key: string]: TodoItemInterface[] } => {
	const grouped: { [key: string]: TodoItemInterface[] } = {};
	todos.forEach((todo) => {
		const category = todo.category || "Others";
		if (!grouped[category]) {
			grouped[category] = [];
		}
		grouped[category].push(todo);
	});
	return grouped;
};

// export function getToDosForSelectedDate(selectedDate: Date, todo: ToDo) {
//   const todoStartDate = todo.startDate.toDate();
//   const todoEndDate = todo.endDate ? todo.endDate.toDate() : todoStartDate;

//   const hasOnlyStartDate =
//     todo.startDate && !todo.endDate && !todo.selectedDays;

//   if (hasOnlyStartDate) {
//     const isStartDateOnlyMatch =
//       !todo.endDate &&
//       todoStartDate.toDateString() === selectedDate.toDateString();
//     return isStartDateOnlyMatch;
//   }

//   const hasBothStartDateEndDate =
//     todo.startDate &&
//     todo.endDate &&
//     (!todo.selectedDays || todo.selectedDays.length === 0);
//   if (hasBothStartDateEndDate) {
//     const startOfDay = getStartOfDay(selectedDate);
//     const endOfDay = getEndOfDay(selectedDate);
//     const isWithinDateRange =
//       startOfDay <= todoEndDate && endOfDay >= todoStartDate;
//     return isWithinDateRange;
//   }
//   const hasStartDateEndDateFrequency =
//     todo.startDate &&
//     todo.endDate &&
//     todo.selectedDays &&
//     todo.selectedDays.length > 0;

//   if (hasStartDateEndDateFrequency) {
//     const selectedWeekday = selectedDate
//       .toLocaleString("en-us", {
//         weekday: "long",
//       })
//       .toLowerCase();
//     const repeatsOnDay =
//       todo.selectedDays?.includes(selectedWeekday) &&
//       selectedDate >= todoStartDate &&
//       selectedDate <= todoEndDate;
//     return repeatsOnDay;
//   }

//   return false;
// }

export const mapSelectedDaysToNumbers = (selectedDays: string[]) => {
	return selectedDays.map((day) => {
		switch (day) {
			case "sunday":
				return 0;
			case "monday":
				return 1;
			case "tuesday":
				return 2;
			case "wednesday":
				return 3;
			case "thursday":
				return 4;
			case "friday":
				return 5;
			case "saturday":
				return 6;
			default:
				return -1;
		}
	});
};

export const generateTodosForSeries = (
	newTodo: TodoItemInterface,
	startDate: string,
	endDate: string,
	selectedDaysNumbers: number[]
) => {
	console.log("newTodo: ", newTodo);
	console.log("startDate: ", startDate);
	console.log("endDate: ", endDate);
	console.log("selectedDaysNumbers: ", selectedDaysNumbers);

	const newTodos = [];
	const currentDate = new Date(startDate);
	while (currentDate <= new Date(endDate)) {
		console.log("Entering while loop");

		if (
			selectedDaysNumbers.includes(
				currentDate.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
			)
		) {
			console.log("Day matches selectedDaysNumbers");

			const todoForDay = {
				...newTodo,
				date: Timestamp.fromDate(currentDate),
			};
			newTodos.push(todoForDay);
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}
	console.log("Returning newTodos from generateTodosForSeries: ", newTodos);

	return newTodos;
};
