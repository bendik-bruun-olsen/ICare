import {
  NotificationContext,
  NotificationType,
  Appointment,
} from "../../types";
import { db } from "../firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export const getAppointment = async (
  appointmentId: string,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<Appointment | undefined> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const appointmentRef = doc(patientRef, "appointments", appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);

    if (!appointmentSnap.exists()) {
      addNotification("Appointment not found", NotificationType.ERROR);
      throw new Error("Appointment not found");
    }

    const data = appointmentSnap.data() as Appointment;
    return data;
  } catch {
    addNotification("Error fetching appointment", NotificationType.ERROR);
  }
};

export const getAppointmentsBySelectedDate = async (
  selectedDate: Date,
  patientId: string,
  addNotification: NotificationContext["addNotification"]
): Promise<Appointment[]> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const appointmentCollection = collection(patientRef, "appointments");

    const startOfDay = Timestamp.fromDate(
      new Date(selectedDate.setHours(0, 0, 0, 0))
    );
    const endOfDay = Timestamp.fromDate(
      new Date(selectedDate.setHours(23, 59, 59, 999))
    );

    const q = query(
      appointmentCollection,
      where("date", ">=", startOfDay),
      where("date", "<=", endOfDay)
    );

    const querySnap = await getDocs(q);
    if (querySnap.empty) {
      return [];
    }

    const appointmentsWithId = querySnap.docs.map((doc) => {
      const data = doc.data() as Appointment;
      return {
        ...data,
        id: doc.id,
      };
    });
    console.log("appointments", appointmentCollection);
    console.log("appointments with id", appointmentsWithId);

    return appointmentsWithId;
  } catch {
    addNotification("Error fetching appointments", NotificationType.ERROR);
    return [];
  }
};
