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
	seriesId: null,
	id: "",
	createdBy: "",
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

export const defaultTodoItemInputFieldStatus = {
	title: undefined,
	description: undefined,
	category: undefined,
	date: undefined,
	time: undefined,
};

export const defaultTodoSeriesInputFieldStatus = {
	title: undefined,
	description: undefined,
	category: undefined,
	startDate: undefined,
	endDate: undefined,
	time: undefined,
	selectedDays: undefined,
};

export const daysOfTheWeek = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
];
