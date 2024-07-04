import { Icon } from "@equinor/eds-core-react";
import {
	restaurant,
	group,
	walk,
	placeholder_icon,
	arrow_forward,
} from "@equinor/eds-icons";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import styles from "./HomePage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import { Paths } from "../../paths";
import PatientDetails from "../../components/PatientDetails/PatientDetails";
import AppointmentsQuickView from "../../components/AppointmentsQuickView/AppointmentsQuickView";

const HomePage = () => {
	return (
		<>
			<Navbar leftContent={<Logo />} centerContent="Home" />
			<div className="pageWrapper">
				<PatientDetails patientName="Gjertrud" age="99" />
				<AppointmentsQuickView
					firstAppointment="Doctor's appointment"
					firstAppointmentTime="09:30"
					secondAppointment="Chiropractor appointment"
					secondAppointmentTime="12:00"
				/>
				<div className={styles.remainingTodosOuterWrapper}>
					<h2>ToDo</h2>
					<div className={styles.remainingTodosInnerWrapper}>
						<div className={styles.remainingTodosContainer}>
							<RemainingTodos
								categoryTitle="Food"
								completedTodosCount="3"
								allTodosCount="6"
								icon={restaurant}
							/>
							<RemainingTodos
								categoryTitle="Medicine"
								completedTodosCount="2"
								allTodosCount="5"
								icon={placeholder_icon}
							/>
						</div>
						<div className={styles.remainingTodosContainer}>
							<RemainingTodos
								categoryTitle="Social"
								completedTodosCount="1"
								allTodosCount="1"
								icon={group}
							/>
							<RemainingTodos
								categoryTitle="Exercise"
								completedTodosCount="2"
								allTodosCount="3"
								icon={walk}
							/>
						</div>
					</div>
					<div className={styles.arrowIconWrapper}>
						<Link to={Paths.TODO}>
							<span>All Todos</span>
							<Icon data={arrow_forward} />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
