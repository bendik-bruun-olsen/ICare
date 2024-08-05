import { useState, useEffect } from "react";
import { Button, Checkbox, TextField } from "@equinor/eds-core-react";
import { Timestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import { editTodo } from "../../firebase/todoServices/editTodo";
import {
	getTodo,
	getTodoSeriesInfo,
} from "../../firebase/todoServices/getTodo";
import styles from "./EditTodoPage.module.css";
import { formatTimestampToDate } from "../../utils";
import { useNotification } from "../../context/NotificationContext";
import {
	TodoWithIdInterface,
	ToDoStatus,
	TodoSeriesInfoInterface,
} from "../../types";
import { Link, useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Paths } from "../../paths";

const defaultTodo: TodoWithIdInterface = {
	title: "",
	description: "",
	date: Timestamp.now(),
	time: "00:00",
	category: null,
	status: ToDoStatus.unchecked,
	comment: "",
	seriesId: null,
	id: "",
};

const EditToDoPage = () => {
	const [todo, setTodo] = useState<
		TodoWithIdInterface | TodoSeriesInfoInterface
	>(defaultTodo);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isRepeating, setIsRepeating] = useState(false);
	const { addNotification } = useNotification();
	const { todoId: todoIdFromParams, seriesId: seriesIdFromParams } =
		useParams<{
			todoId: string;
			seriesId: string;
		}>();

	console.log("todoId: ", todoIdFromParams);
	console.log("seriesId: ", seriesIdFromParams);

	useEffect(() => {
		if (!todoIdFromParams && !seriesIdFromParams) {
			setIsLoading(false);
			setHasError(true);
			return;
		}

		const fetchTodoById = async (todoId: string) => {
			try {
				const result = await getTodo(todoId);
				if (result) {
					setTodo(result as TodoWithIdInterface);
				} else {
					addNotification(
						"Error fetching ToDo. Please try again later.",
						"error"
					);
				}
			} catch {
				addNotification(
					"Error fetching ToDo. Please try again later.",
					"info"
				);
			} finally {
				setIsLoading(false);
			}
		};

		const fetchSeriesById = async (seriesId: string) => {
			try {
				const result = await getTodoSeriesInfo(seriesId);
				if (result) {
					setTodo(result as TodoSeriesInfoInterface);
					setIsRepeating(true);
				} else {
					addNotification(
						"Error fetching series data. Please try again later.",
						"error"
					);
				}
			} catch {
				addNotification(
					"Error fetching series data. Please try again later.",
					"info"
				);
			} finally {
				setIsLoading(false);
			}
		};

		setIsLoading(true);
		if (todoIdFromParams) {
			console.log("fetching todo by id");
			fetchTodoById(todoIdFromParams);
			console.log(
				"Fetched TodoseriesID: ",
				(todo as TodoWithIdInterface).seriesId
			);
		} else if (seriesIdFromParams) {
			console.log("fetching series by id");
			fetchSeriesById(seriesIdFromParams);
		}
	}, [todoIdFromParams, seriesIdFromParams]);

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodo((prev) => ({ ...prev, time: e.target.value }));
	};

	const handleDateChange = (field: string, dateString: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(dateString));
		setTodo((prev) => ({ ...prev, [field]: newTimestamp }));
	};

	const handleDayToggle = (day: string) => {
		setTodo((prev) => {
			const isSelected = (
				prev as TodoSeriesInfoInterface
			).selectedDays.includes(day);
			const selectedDays = isSelected
				? (prev as TodoSeriesInfoInterface).selectedDays.filter(
						(d) => d !== day
				  )
				: [...(prev as TodoSeriesInfoInterface).selectedDays, day];
			return { ...prev, selectedDays };
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!todoIdFromParams) return;

		try {
			await editTodo(todoId, todo);
			addNotification("ToDo edited successfully!", "success");
			// setInitialDatesToCurrent();
		} catch {
			addNotification(
				"Error editing ToDo. Please try again later.",
				"error"
			);
		}
	};

	if (isLoading) return <h1>Loading....</h1>;
	if (hasError) return <ErrorPage />;

	return (
		<>
			<Navbar
				leftContent={<BackHomeButton />}
				centerContent="Edit ToDo"
			/>
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
										label={
											isRepeating ? "Start date" : "Date"
										}
										value={formatTimestampToDate(
											isRepeating
												? (
														todo as TodoSeriesInfoInterface
												  ).startDate
												: (todo as TodoWithIdInterface)
														.date
										)}
										onChange={(dateString) =>
											handleDateChange(
												seriesIdFromParams
													? "startDate"
													: "date",
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
										checked={isRepeating}
										disabled={
											seriesIdFromParams ||
											(todo as TodoWithIdInterface)
												.seriesId
												? true
												: false
										}
										onChange={(isRepeating) =>
											setIsRepeating(!isRepeating)
										}
									/>
								</div>
							</div>
							{isRepeating && (
								<>
									<StartAndEndDate
										label="End date"
										value={formatTimestampToDate(
											(todo as TodoSeriesInfoInterface)
												.endDate
										)}
										onChange={(dateString) =>
											handleDateChange(
												"endDate",
												dateString
											)
										}
									/>
									<DaysComponent
										selectedDays={
											(todo as TodoSeriesInfoInterface)
												.selectedDays
										}
										onDayToggle={handleDayToggle}
									/>
								</>
							)}
						</div>
						<div className={styles.actionButtonsContainer}>
							<AddButton label="Save" onClick={handleSubmit} />
							{(todo as TodoWithIdInterface).seriesId && (
								<Link
									to={Paths.EDIT_TODO_SERIES.replace(
										":seriesId",
										(todo as TodoWithIdInterface).seriesId
									)}
								>
									<h3>Edit entire series</h3>
								</Link>
							)}
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default EditToDoPage;
