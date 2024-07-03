import { Timestamp } from "firebase/firestore";

export enum ToDoStatus {
	Checked = "checked",
	Unchecked = "unchecked",
	NotApplicable = "not-applicable",
}

export interface ToDo {
	id: string;
	title: string;
	description: string;
	startDate: Timestamp;
	endDate?: Timestamp;
	daysOfWeek?: string[];
	time: string;
	category: string | null;
	toDoStatus: ToDoStatus;
}
