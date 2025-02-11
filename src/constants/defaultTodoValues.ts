import { Timestamp } from "firebase/firestore";
import { ToDo, TodoSeriesInfo, ToDoStatus } from "../types";

export const defaultTodoItem: ToDo = {
  title: "",
  description: "",
  date: Timestamp.now(),
  time: "00:00",
  category: null,
  status: ToDoStatus.unchecked,
  seriesId: null,
  id: "",
  createdBy: "",
  completedBy: null,
  patientId: "",
};

export const defaultTodoSeries: TodoSeriesInfo = {
  title: "",
  description: "",
  time: "00:00",
  category: null,
  startDate: Timestamp.now(),
  endDate: Timestamp.now(),
  selectedDays: [],
};

export const defaultTodoItemInputStatus = {
  title: undefined,
  description: undefined,
  category: undefined,
  date: undefined,
  time: undefined,
};

export const defaultTodoSeriesInputStatus = {
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
