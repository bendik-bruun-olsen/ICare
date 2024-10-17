import { Timestamp } from "firebase/firestore";
import { Appointment, AppointmentStatus } from "../types";

export const defaultAppointmentForm: Appointment = {
  id: "",
  title: "",
  description: "",
  date: Timestamp.now(),
  time: "00:00",
  createdBy: "",
  status: AppointmentStatus.unchecked,
  patientId: "",
};
