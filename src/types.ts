import { Timestamp } from "firebase/firestore";

export enum ToDoStatus {
  Checked = "checked",
  Unchecked = "unchecked",
  Ignore = "ignore",
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
  repeat: boolean;
  startDate: Timestamp;
  endDate: Timestamp | null;
  time: string;
  category: string | null;
  selectedDays: string[];
}
