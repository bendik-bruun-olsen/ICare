import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

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
	createdBy: string;
	completedBy: string | null;
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

export interface TodoItemInputFieldStatusProps {
	title: Variants | undefined;
	description: Variants | undefined;
	category: Variants | undefined;
	date: Variants | undefined;
	time: Variants | undefined;
}

export interface TodoSeriesInputFieldStatusProps {
	title: Variants | undefined;
	description: Variants | undefined;
	category: Variants | undefined;
	startDate: Variants | undefined;
	endDate: Variants | undefined;
	time: Variants | undefined;
	selectedDays: Variants | undefined;
}

export interface UserData {
	name: string;
	age?: number;
	gender?: "Male" | "Female" | "Others";
	phone?: string;
	email: string;
	profilePictureUrl?: string;
}

export interface PatientFormDataInterface {
	[key: string]: string;
	name: string;
	age: string;
	phone: string;
	address: string;
	diagnoses: string;
	allergies: string;
}

export interface CaretakerInformationInterface {
	name: string;
	email: string;
}

export type FormFieldProps = {
	label?: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
};

export interface PatientProfilePictureProps {
	setProfileImage: Dispatch<SetStateAction<File | null>>;
}
