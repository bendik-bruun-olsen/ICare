import { Timestamp } from "firebase/firestore";
import { Appointment, AppointmentStatus } from "../types";

export const defaultAppointmentForm: Appointment = {
  id: "",
  title: "",
  description: "",
  date: Timestamp.now(),
  time: Timestamp.now(),
  createdBy: "",
  status: AppointmentStatus.unchecked,
  patientId: "",
};
