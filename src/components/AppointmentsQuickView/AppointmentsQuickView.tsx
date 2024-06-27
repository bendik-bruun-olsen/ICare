<<<<<<< HEAD
import { Link } from "react-router-dom";
import { Icon } from "@equinor/eds-core-react";
import { calendar_today, arrow_forward } from "@equinor/eds-icons";
=======
import { Icon } from "@equinor/eds-core-react";
import { calendar_today } from "@equinor/eds-icons";
>>>>>>> development
import styles from "./AppointmentsQuickView.module.css";

interface AppointmentsQuickViewProps {
	firstAppointment: string;
<<<<<<< HEAD
	firstAppointmentTime: string;
	secondAppointment: string;
	secondAppointmentTime: string;
=======
	secondAppointment: string;
>>>>>>> development
}

export default function AppointmentsQuickView({
	firstAppointment,
<<<<<<< HEAD
	firstAppointmentTime,
	secondAppointment,
	secondAppointmentTime,
}: AppointmentsQuickViewProps) {
	return (
		<>
			<div className={styles.fullWrapper}>
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
					<Link to="/appointment">
						<div className={styles.arrowIconWrapper}>
							<p>All appointments</p>
							<Icon data={arrow_forward} color={"#1c7b82"} size={18} />
						</div>
					</Link>
				</div>
			</div>
		</>
=======
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
>>>>>>> development
	);
}
