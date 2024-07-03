// import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import styles from "./EditTodoPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import HomeButton from "../../components/HomeButton/HomeButton";
import { editTodo } from "../../firebase/todoServices/editTodo";
import { getTodo } from "../../firebase/todoServices/getTodo";
import { Timestamp } from "firebase/firestore";

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

function EditToDoPage() {
	// const todoId = useParams<{ id: string }>().id;
	const todoId = "F167KVtgHBGehgXzdEth";
	const [todo, setToDo] = useState<TodoInterface | null>(null);
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
				const fetchedTodo = await getTodo(todoId);
				setToDo(fetchedTodo as TodoInterface);
				setInitialDates({
					startDate: fetchedTodo?.startDate,
					endDate: fetchedTodo?.endDate,
				});
			} catch (e) {
				setNotificationMessage(
					"Error fetching data. Please try again later."
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTodoById();
	}, [todoId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLElement>
	) => {
		const { name, value } = e.target;
		setToDo((prev) => (prev ? { ...prev, [name]: value } : null));
	};

	const handleCheckboxChange = () => {
		setToDo((prev) => (prev ? { ...prev, repeat: !prev.repeat } : null));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!todo) {
			setNotificationMessage(
				"Error editing todo. Please try again later."
			);
			return;
		}

		const { startDate, endDate, time, repeat } = todo;

		const hasStartDateChanged = !startDate.isEqual(initialDates.startDate);
		const hasEndDateChanged = !endDate.isEqual(initialDates.endDate);

		if (repeat) {
			if (hasStartDateChanged || hasEndDateChanged) {
				if (!validateDate(startDate, endDate, time)) {
					setNotificationMessage(
						"Invalid date range. Please try again."
					);
					resetDateToInitial();
					return;
				}
			}
		} else {
			if (hasStartDateChanged) {
				if (!validateDate(startDate, null, time)) {
					setNotificationMessage(
						"Invalid date range. Please try again."
					);
					resetDateToInitial();
					return;
				}
			}
		}

		try {
			await editTodo(todoId, todo);
			setNotificationMessage("Todo edited successfully!");
		} catch (e) {
			setNotificationMessage(
				"Error editing todo. Please try again later."
			);
		}
	};

	const handleDateChange = (field: string, dateString: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(dateString));
		setToDo((prev) => ({ ...prev, [field]: newTimestamp }));
	};

	const formatDate = (timestamp: Timestamp): string => {
		const date = timestamp.toDate();
		return date.toISOString().substring(0, 10);
	};

	const validateDate = (
		startDate: Timestamp,
		endDate: Timestamp | null,
		time: string
	): boolean => {
		const currentDate = new Date().getTime();

		const [hours, minutes] = time.split(":");
		const hoursAsMillis = parseInt(hours) * 60 * 60 * 1000;
		const minutesAsMillis = parseInt(minutes) * 60 * 1000;

		const startDateWithHoursAndMinutes =
			startDate.toMillis() + hoursAsMillis + minutesAsMillis;

		const hasStartDateChanged = !startDate.isEqual(initialDates.startDate);

		if (hasStartDateChanged) {
			if (startDateWithHoursAndMinutes < currentDate) return false;
		}

		if (endDate && startDate.toMillis() >= endDate.toMillis()) return false;

		return true;
	};

	if (isLoading) return <h1>Loading....</h1>;

	const resetDateToInitial = () => {
		setToDo((prev) => {
			if (prev) {
				return {
					...prev,
					startDate: initialDates.startDate,
					endDate: prev.repeat ? initialDates.endDate : null,
				};
			}
			return prev;
		});
	};
	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="Edit ToDo" />
			<div className="pageWrapper">
				<div className={styles.mainContainer}>
					<form onSubmit={handleSubmit}>
						<div className={styles.formContainer}>
							<TitleDescription
								title={todo?.title || ""}
								setTitle={(title) =>
									setToDo((prev) => ({ ...prev, title }))
								}
								description={todo?.description || ""}
								setDescription={(description) =>
									setToDo((prev) => ({
										...prev,
										description,
									}))
								}
							/>
							<StartAndEndDate
								label="Start date"
								value={formatDate(todo?.startDate)}
								onChange={(dateString) =>
									handleDateChange("startDate", dateString)
								}
							/>
							<TextField
								id="time"
								label="Select time"
								type="time"
								name="time"
								value={todo?.time}
								className={styles.time}
								onChange={handleChange}
								style={{ width: "150px" }}
							/>
							<Checkbox
								label="Repeat"
								checked={todo?.repeat || false}
								onChange={handleCheckboxChange}
							/>
							{todo?.repeat && (
								<>
									<StartAndEndDate
										label="End date"
										value={formatDate(todo.endDate)}
										onChange={(dateString) =>
											handleDateChange(
												"endDate",
												dateString
											)
										}
									/>
									<DaysComponent
										selectedDays={todo?.selectedDays || []}
										onDayToggle={(day) =>
											setToDo((prev) => {
												const isDaySelected =
													prev?.selectedDays?.includes(
														day
													);
												return {
													...prev,
													selectedDays: isDaySelected
														? prev?.selectedDays.filter(
																(d) => d !== day
														  )
														: [
																...(prev?.selectedDays ||
																	[]),
																day,
														  ],
												};
											})
										}
									/>
								</>
							)}
							<SelectCategory
								selectedOption={todo?.category || null}
								onSelectionChange={(category) =>
									setToDo((prev) => ({ ...prev, category }))
								}
							/>
							<AddButton label="Save" onClick={handleSubmit} />
							{notificationMessage && (
								<h3>{notificationMessage}</h3>
							)}
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default EditToDoPage;
