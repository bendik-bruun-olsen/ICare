import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export enum ToDoStatus {
	unchecked = "unchecked",
	checked = "checked",
	ignore = "ignore",
}

export enum GenderOptions {
	MALE = "Male",
	FEMALE = "Female",
	OTHERS = "Others",
}
export enum NotificationType {
	SUCCESS = "success",
	ERROR = "error",
	INFO = "info",
}

export interface Notification {
	id: number;
	message: string;
	type: NotificationType;
}

export interface NotificationContext {
	notifications: Notification[];
	addNotification: (message: string, type: NotificationType) => void;
	removeNotification: (id: number) => void;
}

export interface ToDo {
	title: string;
	description: string;
	date: Timestamp;
	time: string;
	category: string | null;
	status: ToDoStatus;
	seriesId: string | null;
	id: string;
	createdBy: string;
	completedBy: string | null;
}

export interface TodoSeriesInfo {
	title: string;
	description: string;
	time: string;
	category: string | null;
	startDate: Timestamp;
	endDate: Timestamp;
	selectedDays: string[];
}

export interface DeleteConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	type: "item" | "series";
}

export interface TodoItemInputStatusProps {
	title?: Variants;
	description?: Variants;
	category?: Variants;
	date?: Variants;
	time?: Variants;
}

export interface TodoSeriesInputStatusProps {
	title?: Variants;
	description?: Variants;
	startDate?: Variants;
	endDate?: Variants;
	time?: Variants;
	selectedDays?: Variants;
	category?: Variants;
}

export interface User {
	name: string;
	age?: number;
	gender?: GenderOptions;
	phone?: string;
	email: string;
}

export interface UserProfilePicUrl {
	profilePictureUrl?: string;
}

export interface NewPatient {
	[key: string]: string;
	name: string;
	age: string;
	phone: string;
	address: string;
	diagnoses: string;
	allergies: string;
}

export interface Caretaker {
	name: string;
	email: string;
}

export interface FormFieldProps {
	label?: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	type: string;
}

export interface PatientProfilePictureProps {
	setProfileImage: Dispatch<SetStateAction<File | null>>;
}

export interface EmergencyContact {
	name: string;
	phone: string;
	email: string;
	relation: string;
}

export interface validateDateRangeProps {
	startDate: Timestamp;
	endDate: Timestamp;
	addNotification: NotificationContext["addNotification"];
}

export interface clearTodoSeriesInputStatusProps {
	todoSeriesInfo: TodoSeriesInfo;
	setTodoSeriesInputFieldStatus: Dispatch<
		SetStateAction<TodoSeriesInputStatusProps>
	>;
}

export interface validateTodoSeriesFieldsProps {
	todoSeriesInfo: TodoSeriesInfo;
	setTodoSeriesInputVariants: Dispatch<
		SetStateAction<TodoSeriesInputStatusProps>
	>;
	addNotification: NotificationContext["addNotification"];
}

export interface validateTodoItemFieldsProps {
	todoItem: ToDo;
	setTodoItemInputVariants: Dispatch<SetStateAction<TodoItemInputStatusProps>>;
	addNotification: NotificationContext["addNotification"];
}
