import Navbar from "../../components/Navbar/Navbar";
import PatientDetails from "../../components/PatientDetails/PatientDetails";
import AppointmentsQuickView from "../../components/AppointmentsQuickView/AppointmentsQuickView";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import style from "./HomePage.module.css";

const HomePage = () => {
	return (
		<>
			<Navbar centerContent="Home" />
			<div className={style.pageContainer}>
				<div className={style.pageContent}>
					<PatientDetails patientName="Gjertrud" age="99" />
					<AppointmentsQuickView
						firstAppointment="Doctor's appointment"
						firstAppointmentTime="09:30"
						secondAppointment="Physical therapy"
						secondAppointmentTime="12:00"
					/>
					<RemainingTodos />
				</div>
			</div>
		</>
	);
};

export default HomePage;
