import { Icon } from "@equinor/eds-core-react";
import { calendar_today } from "@equinor/eds-icons";
import styles from "./AppointmentsQuickView.module.css";

interface AppointmentsQuickViewProps {
	firstAppointment: string;
	secondAppointment: string;
}

export default function AppointmentsQuickView({
	firstAppointment,
	secondAppointment,
}: AppointmentsQuickViewProps) {
	return (
		<div className={styles.appointmentsWrapper}>
			<div className={styles.textMargin}>
				<p className={styles.firstAppointment}>{firstAppointment}</p>
				<p className={styles.secondAppointment}>{secondAppointment}</p>
			</div>
			<div className={styles.appointmentIconWrapper}>
				<Icon
					data={calendar_today}
					size={48}
					color={"#aacccf"}
					className={styles.calendarIcon}
				/>
			</div>
		</div>
	);
}
