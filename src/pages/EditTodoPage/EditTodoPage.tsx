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
import {
	editTodoItem,
	editTodoSeries,
} from "../../firebase/todoServices/editTodo";
import {
	getTodo,
	getTodoSeriesInfo,
} from "../../firebase/todoServices/getTodo";
import styles from "./EditTodoPage.module.css";
import { formatTimestampToDateString } from "../../utils";
import { useNotification } from "../../context/NotificationContext";
import {
	TodoWithIdInterface,
	ToDoStatus,
	TodoSeriesInfoInterface,
} from "../../types";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useParams } from "react-router-dom";

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

const defaultSeries: TodoSeriesInfoInterface = {
	title: "",
	description: "",
	time: "00:00",
	category: null,
	startDate: Timestamp.now(),
	endDate: Timestamp.now(),
	selectedDays: [],
};

const EditToDoPage = () => {
	const [todoItem, setTodoItem] = useState<TodoWithIdInterface>(defaultTodo);
	const [todoSeriesInfo, setTodoSeriesInfo] =
		useState<TodoSeriesInfoInterface>(defaultSeries);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isRepeating, setIsRepeating] = useState(false);
	const [editSeries, setEditSeries] = useState(false);
	const { addNotification } = useNotification();
	const { todoId: todoIdFromParams, seriesId: seriesIdFromParams } =
		useParams<{
			todoId: string;
			seriesId: string;
		}>();

	console.log("todoId: ", todoIdFromParams);
	console.log("seriesId: ", seriesIdFromParams);

	useEffect(() => {
		console.log("useEffect");

		if (!todoIdFromParams && !seriesIdFromParams) {
			setIsLoading(false);
			setHasError(true);
			return;
		}

		const fetchTodoById = async (todoId: string) => {
			setIsLoading(true);
			try {
				const result = await getTodo(todoId);
				if (!result) {
					addNotification(
						"Error fetching ToDo. Please try again later.",
						"error"
					);
					setHasError(true);
					return;
				}
				setTodoItem(result as TodoWithIdInterface);
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
			setIsLoading(true);
			try {
				const result = await getTodoSeriesInfo(seriesId);
				if (!result) {
					addNotification(
						"Error fetching series data. Please try again later.",
						"error"
					);
					setHasError(true);
					return;
				}
				setTodoSeriesInfo(result as TodoSeriesInfoInterface);

				setIsRepeating(true);
			} catch {
				addNotification(
					"Error fetching series data. Please try again later.",
					"info"
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (editSeries && todoItem.seriesId) {
			fetchSeriesById(todoItem.seriesId);
		} else if (todoIdFromParams) {
			fetchTodoById(todoIdFromParams);
		} else if (seriesIdFromParams) {
			fetchSeriesById(seriesIdFromParams);
			setEditSeries(true);
		}
	}, [todoIdFromParams, seriesIdFromParams, editSeries]);

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodoItem((prev) => ({ ...prev, time: e.target.value }));
	};

	const handleDateChange = (field: string, dateString: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(dateString));
		setTodoItem((prev) => ({ ...prev, [field]: newTimestamp }));
	};

	const handleDayToggle = (day: string) => {
		setTodoSeriesInfo((prev) => {
			const isSelected = prev.selectedDays.includes(day);
			const selectedDays = isSelected
				? prev.selectedDays.filter((d) => d !== day)
				: [...prev.selectedDays, day];
			return { ...prev, selectedDays };
		});
	};

	const handleEditSeriesChange = () => {
		setEditSeries((prev) => !prev);
		if (editSeries) {
			setIsRepeating(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (editSeries) {
			const seriesId = seriesIdFromParams || todoItem.seriesId;
			if (!seriesId) {
				addNotification(
					"Error updating series. Please try again later.",
					"error"
				);
				return;
			}

			try {
				await editTodoSeries(seriesId, todoSeriesInfo);
				addNotification("Series updated successfully!", "success");
				return;
			} catch {
				addNotification(
					"Error updating series. Please try again later.",
					"error"
				);
			}
		}
		if (!isRepeating) {
			try {
				await editTodoItem(todoItem.id, todoItem);
				addNotification("ToDo updated successfully!", "success");
				return;
			} catch {
				addNotification(
					"Error updating ToDo. Please try again later.",
					"error"
				);
			}
		}

		if (isRepeating) {
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
								title={
									editSeries
										? todoSeriesInfo.title
										: todoItem.title
								}
								setTitle={(title) =>
									editSeries
										? setTodoSeriesInfo((prev) => ({
												...prev,
												title,
										  }))
										: setTodoItem((prev) => ({
												...prev,
												title,
										  }))
								}
								description={
									editSeries
										? todoSeriesInfo.description
										: todoItem.description
								}
								setDescription={(description) =>
									editSeries
										? setTodoSeriesInfo((prev) => ({
												...prev,
												description,
										  }))
										: setTodoItem((prev) => ({
												...prev,
												description,
										  }))
								}
							/>
							<div className={styles.scheduleControlsContainer}>
								<div>
									<SelectCategory
										selectedOption={
											editSeries
												? todoSeriesInfo.category
												: todoItem.category
										}
										onSelectionChange={(category) =>
											editSeries
												? setTodoSeriesInfo((prev) => ({
														...prev,
														category,
												  }))
												: setTodoItem((prev) => ({
														...prev,
														category,
												  }))
										}
									/>
									<StartAndEndDate
										label={
											isRepeating ? "Start date" : "Date"
										}
										value={formatTimestampToDateString(
											isRepeating
												? todoSeriesInfo.startDate
												: todoItem.date
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
										value={
											editSeries
												? todoSeriesInfo.time
												: todoItem.time
										}
										className={styles.time}
										onChange={handleTimeChange}
										style={{ width: "150px" }}
									/>
									{todoItem.seriesId ? (
										<Checkbox
											label="Edit Series"
											checked={editSeries}
											onChange={handleEditSeriesChange}
										/>
									) : (
										<Checkbox
											label="Repeat"
											checked={isRepeating}
											disabled={
												seriesIdFromParams ||
												todoItem.seriesId
													? true
													: false
											}
											onChange={() =>
												setIsRepeating((prev) => !prev)
											}
										/>
									)}
								</div>
							</div>
							{isRepeating && (
								<>
									<StartAndEndDate
										label="End date"
										value={formatTimestampToDateString(
											todoSeriesInfo.endDate
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
											todoSeriesInfo.selectedDays
										}
										onDayToggle={handleDayToggle}
									/>
								</>
							)}
						</div>

						<AddButton label="Save" onClick={handleSubmit} />
					</div>
				</form>
			</div>
		</>
	);
};

export default EditToDoPage;
