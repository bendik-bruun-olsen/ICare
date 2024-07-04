import { useState, useEffect } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import { Timestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import HomeButton from "../../components/HomeButton/HomeButton";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import { editTodo } from "../../firebase/todoServices/editTodo";
import { getTodo } from "../../firebase/todoServices/getTodo";
import styles from "./EditTodoPage.module.css";
import { formatTimestampToDate } from "../../utils";

interface TodoInterface {
	title: string;
	description: string;
	repeat: boolean;
	startDate: Timestamp;
	endDate: Timestamp | null;
	time: string;
	category: string | null;
	selectedDays: string[];
}

const defaultTodo: TodoInterface = {
	title: "",
	description: "",
	repeat: false,
	startDate: Timestamp.now(),
	endDate: null,
	time: "00:00",
	category: null,
	selectedDays: [],
};

const EditToDoPage = () => {
	const todoId = "F167KVtgHBGehgXzdEth";
	const [todo, setTodo] = useState<TodoInterface>(defaultTodo);
	const [isLoading, setIsLoading] = useState(true);
	const [notificationMessage, setNotificationMessage] = useState<string>("");
	const [initialDates, setInitialDates] = useState<{
		startDate: Timestamp;
		endDate: Timestamp | null;
	}>({ startDate: Timestamp.now(), endDate: null });

	useEffect(() => {
		const fetchTodoById = async () => {
			setIsLoading(true);
			try {
				const fetchedTodo = (await getTodo(todoId)) as TodoInterface;
				setTodo(fetchedTodo);
				setInitialDates({
					startDate: fetchedTodo.startDate,
					endDate: fetchedTodo.endDate,
				});
			} catch {
				setNotificationMessage(
					"Error fetching data. Please try again later."
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTodoById();
	}, [todoId]);

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTodo((prev) => ({ ...prev, [name]: value }));
	};

	const handleCheckboxChange = () => {
		setTodo((prev) => ({ ...prev, repeat: !prev.repeat }));
	};

	const handleDateChange = (field: string, dateString: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(dateString));
		setTodo((prev) => ({ ...prev, [field]: newTimestamp }));
	};

	const handleDayToggle = (day: string) => {
		setTodo((prev) => {
			const isSelected = prev.selectedDays.includes(day);
			const selectedDays = isSelected
				? prev.selectedDays.filter((d) => d !== day)
				: [...prev.selectedDays, day];
			return { ...prev, selectedDays };
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateDateRange(todo)) {
			setNotificationMessage("Invalid date range. Please try again.");
			resetDateToInitial();
			return;
		}

		try {
			await editTodo(todoId, todo);
			setNotificationMessage("Todo edited successfully!");
			setInitialDatesToCurrent();
		} catch {
			setNotificationMessage(
				"Error editing todo. Please try again later."
			);
		}
	};

	const setInitialDatesToCurrent = () => {
		setInitialDates({
			startDate: todo.startDate,
			endDate: todo.endDate,
		});
	};

	const resetDateToInitial = () => {
		setTodo((prev) => ({
			...prev,
			startDate: initialDates.startDate,
			endDate: prev.repeat ? initialDates.endDate : null,
		}));
	};

	const validateDateRange = ({
		startDate,
		endDate,
		time,
		repeat,
	}: TodoInterface): boolean => {
		const currentDate = new Date().getTime();
		const [hours, minutes] = time.split(":");
		const startDateWithTime =
			startDate.toMillis() +
			parseInt(hours) * 3600000 +
			parseInt(minutes) * 60000;

		const hasStartDateChanged = !startDate.isEqual(initialDates.startDate);

		if (repeat && endDate && initialDates.endDate) {
			const hasEndDateChanged = !endDate.isEqual(initialDates.endDate);
			if (hasStartDateChanged || hasEndDateChanged) {
				if (startDateWithTime >= endDate.toMillis()) return false;
			}
		}
		if (hasStartDateChanged) {
			if (startDateWithTime < currentDate) return false;
		}

		return true;
	};

	if (isLoading) return <h1>Loading....</h1>;

	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="Edit ToDo" />
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.formContainer}>
						<div className={styles.mainContentContainer}>
							<TitleDescription
								title={todo.title}
								setTitle={(title) =>
									setTodo((prev) => ({ ...prev, title }))
								}
								description={todo.description}
								setDescription={(description) =>
									setTodo((prev) => ({
										...prev,
										description,
									}))
								}
							/>
							<div className={styles.scheduleControlsContainer}>
								<div>
									<SelectCategory
										selectedOption={todo.category}
										onSelectionChange={(category) =>
											setTodo((prev) => ({
												...prev,
												category,
											}))
										}
									/>

									<StartAndEndDate
										label="Start date"
										value={formatTimestampToDate(
											todo.startDate
										)}
										onChange={(dateString) =>
											handleDateChange(
												"startDate",
												dateString
											)
										}
									/>
								</div>
								<div className={styles.timeAndRepeatControls}>
									<TextField
										id="time"
										label="Select time"
										type="time"
										name="time"
										value={todo.time}
										className={styles.time}
										onChange={handleTimeChange}
										style={{ width: "150px" }}
									/>

									<Checkbox
										label="Repeat"
										checked={todo.repeat}
										onChange={handleCheckboxChange}
									/>
								</div>
							</div>
							{todo.repeat && (
								<>
									<StartAndEndDate
										label="End date"
										value={
											todo.endDate
												? formatTimestampToDate(
														todo.endDate
												  )
												: ""
										}
										onChange={(dateString) =>
											handleDateChange(
												"endDate",
												dateString
											)
										}
									/>
									<DaysComponent
										selectedDays={todo.selectedDays}
										onDayToggle={handleDayToggle}
									/>
								</>
							)}
						</div>
						<AddButton label="Save" onClick={handleSubmit} />
						{notificationMessage && <h3>{notificationMessage}</h3>}
					</div>
				</form>
			</div>
		</>
	);
};

export default EditToDoPage;
