import Navbar from "../../components/Navbar/Navbar";
import PatientDetails from "../../components/PatientDetails/PatientDetails";
import AppointmentsQuickView from "../../components/AppointmentsQuickView/AppointmentsQuickView";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import style from "./HomePage.module.css";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { useContext, useEffect, useState } from "react";
import { getPatient } from "../../firebase/patientServices/getPatient";
import { NotificationContext } from "../../context/NotificationContext";
import { ToDo } from "../../types";
import DateSelector from "../../components/DateSelector/DateSelector";
import { useLocation, useNavigate } from "react-router-dom";
import { getTodosBySelectedDate } from "../../firebase/todoServices/getTodo";
import { Paths } from "../../paths";
import { getQuickviewAppointments } from "../../firebase/appointmentServices/getQuickviewAppointments";
import Loading from "../../components/Loading/Loading";

export default function HomePage(): JSX.Element {
	const location = useLocation();
	const initialDate = location.state
		? new Date(location.state.selectedDate)
		: new Date();
	const [selectedDate, setSelectedDate] = useState(initialDate);
	const { currentPatientId } = useAuth();
	const [patientDetails, setPatientDetails] = useState<{
		name: string;
		age: string;
	}>();
	const { addNotification } = useContext(NotificationContext);
	const [todos, setTodos] = useState<ToDo[]>([]);
	const navigate = useNavigate();
	const [firstAppointment, setFirstAppointment] = useState<string>("");
	const [firstAppointmentTime, setFirstAppointmentTime] = useState<string>("");
	const [secondAppointment, setSecondAppointment] = useState<string>("");
	const [secondAppointmentTime, setSecondAppointmentTime] =
		useState<string>("");

	useEffect(() => {
		if (currentPatientId) {
			getPatient(currentPatientId, addNotification).then((data) => {
				if (data && "name" in data && "age" in data) {
					setPatientDetails({ name: data.name, age: data.age });
				}
			});
		}

		if (!currentPatientId) {
			navigate(Paths.PATIENT_OVERVIEW);
		}
	}, [currentPatientId, addNotification]);

	const patientId = currentPatientId;

	useEffect(() => {
		async function fetchTodos(): Promise<void> {
			if (!patientId) {
				return;
			}
			const fetchedTodos =
				(await getTodosBySelectedDate(
					selectedDate,
					patientId,
					addNotification
				)) || [];
			setTodos(fetchedTodos);
		}

		fetchTodos();
	}, [selectedDate, patientId, addNotification]);

	useEffect(() => {
		async function fetchQuickviewAppointments(): Promise<void> {
			if (!patientId) {
				return;
			}
			const appointments = await getQuickviewAppointments(
				selectedDate,
				patientId,
				addNotification
			);
			if (appointments.length === 0) {
				setFirstAppointment("No appointments yet");
				setFirstAppointmentTime("");
				setSecondAppointment("");
				setSecondAppointmentTime("");
			}
			if (appointments && appointments.length > 0) {
				setFirstAppointment(appointments[0].title);
				setFirstAppointmentTime(appointments[0].time);
				if (appointments.length > 1) {
					setSecondAppointment(appointments[1].title);
					setSecondAppointmentTime(appointments[1].time);
				}
			}
		}
		fetchQuickviewAppointments();
	}, [selectedDate, patientId, addNotification]);

	return (
		<>
			<Navbar centerContent="Home" />
			<div className={style.pageContainer}>
				<div className={style.pageContent}>
					{patientDetails && (
						<PatientDetails
							patientName={patientDetails.name}
							age={patientDetails.age.toString()}
						/>
					)}
					<div className={style.dateSelector}>
						<DateSelector
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
						/>
					</div>
					<AppointmentsQuickView
						firstAppointment={firstAppointment}
						firstAppointmentTime={firstAppointmentTime}
						secondAppointment={secondAppointment}
						secondAppointmentTime={secondAppointmentTime}
					/>
					<RemainingTodos todos={todos} />
				</div>
			</div>
		</>
	);
}
