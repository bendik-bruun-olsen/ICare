import { Timestamp } from "firebase/firestore";
import {
	TodoItemInterface,
	TodoSeriesInfoInterface,
	ToDoStatus,
} from "../types";

export const defaultTodoItem: TodoItemInterface = {
	title: "",
	description: "",
	date: Timestamp.now(),
	time: "00:00",
	category: null,
	status: ToDoStatus.unchecked,
	comment: "",
	seriesId: null,
	id: "",
};

export const defaultTodoSeries: TodoSeriesInfoInterface = {
	title: "",
	description: "",
	time: "00:00",
	category: null,
	startDate: Timestamp.now(),
	endDate: Timestamp.now(),
	selectedDays: [],
};
