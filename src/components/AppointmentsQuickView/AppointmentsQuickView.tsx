import { Link } from "react-router-dom";
import { Icon } from "@equinor/eds-core-react";
import { calendar_today, arrow_forward } from "@equinor/eds-icons";
import styles from "./AppointmentsQuickView.module.css";

interface AppointmentsQuickViewProps {
	firstAppointment: string;
	firstAppointmentTime: string;
	secondAppointment: string;
	secondAppointmentTime: string;
}

export default function AppointmentsQuickView({
	firstAppointment,
	firstAppointmentTime,
	secondAppointment,
	secondAppointmentTime,
}: AppointmentsQuickViewProps) {
	return (
		<div className={styles.appointmentsOuterWrapper}>
			<div className={styles.titleWrapper}>
				<h2>Appointments</h2>
				<div className={styles.arrowIconWrapper}>
					<Link to="/appointment">
						<div className={styles.linkButton}>
							<span>All appointments</span>
							<Icon data={arrow_forward} />
						</div>
					</Link>
				</div>
			</div>
			<div className={styles.appointmentsWrapper}>
				<div className={styles.textWrapper}>
					<p className={styles.firstAppointment}>
						{firstAppointmentTime} - {firstAppointment}
					</p>
					<p className={styles.secondAppointment}>
						{secondAppointmentTime} - {secondAppointment}
					</p>
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
		</div>
	);
}
