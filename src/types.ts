import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export enum ToDoStatus {
	unchecked = "unchecked",
	checked = "checked",
	ignore = "ignore",
}

export enum AppointmentStatus {
	unchecked = "unchecked",
	checked = "checked",
	cancelled = "cancelled",
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
	patientId: string;
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
	type: "item" | "series" | "appointment";
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

export interface Appointment {
	id: string;
	title: string;
	description: string;
	date: Timestamp;
	time: string;
	createdBy: string;
	status: AppointmentStatus;
	patientId: string;
}

export interface AssignedPatient {
	patientId: string;
	patientName: string;
}

export interface AdministeredPatient {
	patientId: string;
	patientName: string;
}

export interface User {
	name: string;
	age?: number;
	gender?: GenderOptions;
	phone?: string;
	email: string;
	administeredPatients: AdministeredPatient[];
	assignedPatients: AssignedPatient[];
}

export interface UserProfilePicUrl {
	profilePictureUrl?: string;
}

export interface NewPatient {
	name: string;
	age: string;
	phone: string;
	address: string;
	diagnoses: string;
	allergies: string;
	caretakers: Caretaker[];
	profilePictureUrl?: string;
	createdBy?: string;
}

export interface Patient {
	name: string;
	age: string;
	phone: string;
	address: string;
	diagnoses: string;
	allergies: string;
	caretakers: Caretaker[];
	profilePictureUrl?: string;
	id: string;
	createdBy: string;
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
	readOnly?: boolean;
}

export interface PatientProfilePictureProps {
	setProfileImage: Dispatch<SetStateAction<File | null>>;
	patientId: string;
	showIcon?: boolean;
	showMaxFileSize?: boolean;
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
	setTodoSeriesInputFieldStatus: Dispatch<
		SetStateAction<TodoSeriesInputStatusProps>
	>;
	addNotification: NotificationContext["addNotification"];
}

export interface validateTodoItemFieldsProps {
	todoItem: ToDo;
	setTodoItemInputFieldStatus: Dispatch<
		SetStateAction<TodoItemInputStatusProps>
	>;
	addNotification: NotificationContext["addNotification"];
}

export interface PatientPreview {
	name: string;
	email: string;
}

export interface AppointmentInputStatusProps {
	title?: Variants;
	description?: Variants;
	category?: Variants;
	date?: Variants;
	time?: Variants;
}

export interface validateAppointmentItemFieldsProps {
	appointmentItem: Appointment;
	setAppointmentItemInputFieldStatus: Dispatch<
		SetStateAction<AppointmentInputStatusProps>
	>;
	addNotification: NotificationContext["addNotification"];
}
