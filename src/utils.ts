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
	NotificationContextType,
	ToDo,
	TodoItemInputVariantProps as TodoItemFieldStatusProps,
	TodoItemInterface,
	TodoSeriesInfoInterface,
	TodoSeriesInputVariantProps as TodoSeriesFieldStatusProps,
} from "./types";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

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

export const groupTodosByCategory = (todos: TodoItemInterface[]) => {
	const grouped: { [key: string]: TodoItemInterface[] } = {};
	todos.forEach((todo) => {
		if (todo.status === "ignore") {
			if (!grouped["Ignored"]) {
				grouped["Ignored"] = [];
			}
			grouped["Ignored"].push(todo);
		} else {
			const category = todo.category || "Others";
			if (!grouped[category]) {
				grouped[category] = [];
			}
			grouped[category].push(todo);
		}
	});

	console.log("grouped: ", grouped);

	return grouped;
};

export const sortTodosGroup = (groupedTodos: {
	[key: string]: TodoItemInterface[];
}) => {
	const priorityOrder = ["Medicine", "Food", "Exercise", "Social", "Others"];
	const sortedGroup: { [key: string]: TodoItemInterface[] } = {};
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

	console.log("sortedGroup: ", sortedGroup);

	return sortedGroup;
};

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
	const newTodos = [];
	const currentDate = new Date(startDate);
	while (currentDate <= new Date(endDate)) {
		if (
			selectedDaysNumbers.includes(
				currentDate.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
			)
		) {
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

export const validateTodoItemFields = (
	todoItem: TodoItemInterface,
	setTodoItemInputVariants: Dispatch<
		SetStateAction<TodoItemFieldStatusProps>
	>,
	addNotification: NotificationContextType["addNotification"]
) => {
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
		addNotification("Please fill in all required fields", "error");
	}

	return isValid;
};

export const validateTodoSeriesFields = (
	todoSeriesInfo: TodoSeriesInfoInterface,
	setTodoSeriesInputVariants: Dispatch<
		SetStateAction<TodoSeriesFieldStatusProps>
	>,
	addNotification: NotificationContextType["addNotification"]
) => {
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
		addNotification("Please fill in all required fields", "error");
	}

	return isValid;
};

export const resetTodoItemVariants = (
	todoItem: TodoItemInterface,
	setTodoItemInputVariants: Dispatch<SetStateAction<TodoItemFieldStatusProps>>
) => {
	setTodoItemInputVariants((prev) => ({
		title: todoItem.title ? undefined : prev.title,
		description: todoItem.description ? undefined : prev.description,
		category: todoItem.category ? undefined : prev.category,
		date: todoItem.date ? undefined : prev.date,
		time: todoItem.time ? undefined : prev.time,
	}));
};
export const resetTodoSeriesVariants = (
	todoSeriesInfo: TodoSeriesInfoInterface,
	setTodoSeriesInputVariants: Dispatch<
		SetStateAction<TodoSeriesFieldStatusProps>
	>
) => {
	setTodoSeriesInputVariants((prev) => ({
		title: todoSeriesInfo.title ? undefined : prev.title,
		description: todoSeriesInfo.description ? undefined : prev.description,
		category: todoSeriesInfo.category ? undefined : prev.category,
		startDate: todoSeriesInfo.startDate ? undefined : prev.startDate,
		endDate: todoSeriesInfo.endDate ? undefined : prev.endDate,
		time: todoSeriesInfo.time ? undefined : prev.time,
		selectedDays:
			todoSeriesInfo.selectedDays.length > 0
				? undefined
				: prev.selectedDays,
	}));
};

export const validateDateRange = (
	startDate: Timestamp,
	endDate: Timestamp,
	addNotification: NotificationContextType["addNotification"]
) => {
	if (startDate.seconds > endDate.seconds) {
		addNotification("End date cannot be before start date", "error");
		return false;
	}
	return true;
};
