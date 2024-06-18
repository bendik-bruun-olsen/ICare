import { Icon } from "@equinor/eds-core-react";
import { calendar_today, arrow_forward } from "@equinor/eds-icons";
import styles from "./AppointmentComponent.module.css";

export default function AppointmentComponent() {
	return (
		<div className={styles.appointmentsWrapper}>
			<div>
				<p>08:30 - Meeting with doctor</p>
				<p>11:00 - Meeting with chiropractor</p>
			</div>
			<div className={styles.appointmentIconWrapper}>
				<Icon data={calendar_today} size={48} />
				<Icon data={arrow_forward} size={24} />
			</div>
		</div>
	);
}
