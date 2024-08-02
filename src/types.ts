import { Timestamp } from "firebase/firestore";

export enum ToDoStatus {
	unchecked = "unchecked",
	checked = "checked",
	ignore = "ignore",
}

export interface ToDo {
	id: string;
	title: string;
	description: string;
	startDate: Timestamp;
	endDate?: Timestamp;
	selectedDays?: string[];
	time: string;
	category: string | null;
	toDoStatus: ToDoStatus;
}

export interface TodoInterface {
	title: string;
	description: string;
	date: Timestamp;
	time: string;
	category: string | null;
	status: ToDoStatus;
	comment: string;
}

export interface TodoSeriesInfoInterface {
	startDate: Timestamp;
	endDate: Timestamp;
	selectedDays: string[];
}
