import { Appointment, NotificationContext } from "../../types";
import { getAppointmentsBySelectedDate } from "./getAppointment";

export const getQuickviewAppointments = async (
	selectedDate: Date,
	patientId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<Appointment[]> => {
	const fetchedAppointments: Appointment[] =
		await getAppointmentsBySelectedDate(
			selectedDate,
			patientId,
			addNotification
		);
	if (!fetchedAppointments) return [];

	const now = new Date();

	const sortedAppointments: Appointment[] = fetchedAppointments
		.map((appointment) => {
			const [hours, minutes] = appointment.time.split(":").map(Number);
			const appointmentDateTime = new Date(selectedDate);
			appointmentDateTime.setHours(hours, minutes, 0, 0);

			return {
				...appointment,
				appointmentDateTime,
			};
		})
		.filter((appointment) => appointment.appointmentDateTime > now)
		.sort(
			(a, b) =>
				a.appointmentDateTime.getTime() - b.appointmentDateTime.getTime()
		);

	const limitedAppointments = sortedAppointments.slice(0, 2);

	return limitedAppointments;
};
