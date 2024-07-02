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

const EditTodoPage: React.FC = () => {
	// const todoId = useParams<{ id: string }>().id;
	const todoId = "pwdKTNJarLQzuMkbLqDI";
	const [todo, setToDo] = useState<TodoInterface | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [notificationMessage, setNotificationMessage] = useState<string>("");

	useEffect(() => {
		const fetchTodoById = async () => {
			setIsLoading(true);
			try {
				const fetchedTodo = await getTodo(todoId);
				setToDo(fetchedTodo as TodoInterface);
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setToDo((prev) => (prev ? { ...prev, [name]: value } : null));
	};

	const handleCheckboxChange = () => {
		setToDo((prev) => (prev ? { ...prev, repeat: !prev.repeat } : null));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (todo && checkIfDateIsInPast(todo.startDate)) {
			setNotificationMessage("Start date cannot be in the past.");
			return;
		}
		try {
			if (todo) {
				await editTodo(todoId, todo);
				setNotificationMessage("Todo edited successfully!");
			}
		} catch (e) {
			setNotificationMessage(
				"Error editing todo. Please try again later."
			);
		}
	};

	const checkIfDateIsInPast = (date: Timestamp) => {
		// const convertedDate = date.toDate();
		const currentDate = Timestamp.now();
		console.log("date: ", date);
		console.log("dateType: ", typeof date);
		console.log("currentDate: ", currentDate);

		return date.toMillis() < currentDate.toMillis();
	};

	const handleDateChange = (field: string, dateString: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(dateString));
		setToDo((prev) => ({ ...prev, [field]: newTimestamp }));
	};

	const formatDate = (timestamp: Timestamp): string => {
		const date = timestamp.toDate();
		return date.toISOString().substring(0, 10);
	};

	if (isLoading) return <h1>Loading....</h1>;

	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="Edit ToDo" />
			<div className="pageWrapper">
				<div className={styles.mainContainer}>
					<form onSubmit={handleSubmit}>
						<div className={styles.formContainer}>
							<TitleDescription
								title={todo.title}
								setTitle={(title) =>
									setToDo((prev) => ({ ...prev, title }))
								}
								description={todo.description}
								setDescription={(description) =>
									setToDo((prev) => ({
										...prev,
										description,
									}))
								}
							/>
							<StartAndEndDate
								label="Start date"
								value={formatDate(todo.startDate)}
								onChange={(dateString) =>
									handleDateChange("startDate", dateString)
								}
							/>
							<TextField
								id="time"
								label="Select time"
								type="time"
								value={todo.time}
								className={styles.time}
								onChange={handleChange}
								style={{ width: "150px" }}
							/>
							{todo?.repeat && (
								<>
									<StartAndEndDate
										label="End date"
										value={formatDate(todo.startDate)}
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
							<Checkbox
								label="Repeat"
								checked={todo?.repeat || false}
								onChange={handleCheckboxChange}
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
};

export default EditTodoPage;
