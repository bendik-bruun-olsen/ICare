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

export interface TodoItemInterface {
	title: string;
	description: string;
	date: Timestamp;
	time: string;
	category: string | null;
	status: ToDoStatus;
	seriesId: string | null;
	id: string;
}

export interface TodoSeriesInfoInterface {
	title: string;
	description: string;
	time: string;
	category: string | null;
	startDate: Timestamp;
	endDate: Timestamp;
	selectedDays: string[];
}

export type NotificationType = {
	id: number;
	message: string;
	type: "success" | "error" | "info";
};

export type NotificationContextType = {
	notifications: NotificationType[];
	addNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
	removeNotification: (id: number) => void;
};

export interface DeleteConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	type: "item" | "series";
}
