import Navbar from "../../components/Navbar/Navbar";
import Logo from "../../components/Logo/Logo";
import PatientDetails from "../../components/PatientDetails/PatientDetails";
import AppointmentsQuickView from "../../components/AppointmentsQuickView/AppointmentsQuickView";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";

const HomePage = () => {
	return (
		<>
			<Navbar leftContent={<Logo />} centerContent="Home" />
			<div className="pageWrapper">
				<div className="pageContent">
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
