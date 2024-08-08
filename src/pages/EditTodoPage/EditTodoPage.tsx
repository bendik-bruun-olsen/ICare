import { useState, useEffect } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import { Timestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import {
	editSingleTodoToSeries,
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
	ToDoStatus,
	TodoSeriesInfoInterface,
	TodoItemInterface,
} from "../../types";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useParams } from "react-router-dom";

const defaultTodoItem: TodoItemInterface = {
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
	const [todoItem, setTodoItem] =
		useState<TodoItemInterface>(defaultTodoItem);
	const [todoSeriesInfo, setTodoSeriesInfo] =
		useState<TodoSeriesInfoInterface>(defaultSeries);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isRepeating, setIsRepeating] = useState(false);
	const [editSeries, setEditSeries] = useState(false);
	const { addNotification } = useNotification();
	const { todoId: todoItemIdFromParams, seriesId: seriesIdFromParams } =
		useParams<{
			todoId: string;
			seriesId: string;
		}>();

	useEffect(() => {
		console.log("Entered useEffect");

		async function fetchData() {
			if (!todoItemIdFromParams && !seriesIdFromParams) {
				setHasError(true);
				return;
			}
			setIsLoading(true);
			try {
				if (editSeries && todoItem.seriesId) {
					const data = await getTodoSeriesInfo(
						todoItem.seriesId,
						addNotification
					);
					if (data) {
						setTodoSeriesInfo(data as TodoSeriesInfoInterface);
						setIsRepeating(true);
					}
				}
				if (todoItemIdFromParams) {
					const data = await getTodo(
						todoItemIdFromParams,
						addNotification
					);
					if (data) {
						setTodoItem(data as TodoItemInterface);
					}
				}
				if (seriesIdFromParams) {
					const data = await getTodoSeriesInfo(
						seriesIdFromParams,
						addNotification
					);
					if (data) {
						setTodoSeriesInfo(data as TodoSeriesInfoInterface);
						setEditSeries(true);
					}
				}
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
		console.log("Exited useEffect");
	}, [todoItemIdFromParams, seriesIdFromParams]);

	useEffect(() => {
		if (isRepeating) {
			const daysOfTheWeek = [
				"sunday",
				"monday",
				"tuesday",
				"wednesday",
				"thursday",
				"friday",
				"saturday",
			];
			const currentDay = daysOfTheWeek[todoItem.date.toDate().getDay()];

			setTodoSeriesInfo((prev) => {
				if (!prev.selectedDays.includes(currentDay)) {
					return {
						...prev,
						selectedDays: [...prev.selectedDays, currentDay],
					};
				}
				return prev;
			});
		}
	}, [isRepeating]);

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodoItem((prev) => ({ ...prev, time: e.target.value }));
	};

	const handleDateChange = (field: string, dateString: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(dateString));
		if (editSeries || isRepeating) {
			setTodoSeriesInfo((prev) => ({ ...prev, [field]: newTimestamp }));
			return;
		}
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
		setEditSeries((prev) => {
			if (editSeries) setIsRepeating(false);
			return !prev;
		});
	};

	const handleIsRepeatingChange = () => {
		setIsRepeating((prev) => !prev);
	};

	const handleSeriesEdit = async () => {
		const seriesId = seriesIdFromParams || todoItem.seriesId;
		if (!seriesId) {
			setHasError(true);
			return;
		}
		setIsLoading(true);
		try {
			await editTodoSeries(seriesId, todoSeriesInfo, addNotification);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSingleTodoEdit = async () => {
		const todoItemId = todoItemIdFromParams || todoItem.id;
		if (!todoItemId) {
			setHasError(true);
			return;
		}
		setIsLoading(true);
		try {
			await editTodoItem(todoItemId, todoItem, addNotification);
		} finally {
			setIsLoading(false);
		}
	};

	const createNewSeriesFromSingleTodo = async () => {
		const todoItemId = todoItemIdFromParams || todoItem.id;
		if (!todoItemId) {
			setHasError(true);
			return;
		}
		setIsLoading(true);
		try {
			await editSingleTodoToSeries(
				todoItemId,
				todoItem,
				todoSeriesInfo,
				addNotification
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (editSeries) {
			await handleSeriesEdit();
			return;
		}
		if (!isRepeating) {
			await handleSingleTodoEdit();
			return;
		}
		if (isRepeating) {
			await createNewSeriesFromSingleTodo();
			return;
		}
	};

	if (hasError) return <ErrorPage />;
	if (isLoading) return <h1>Loading....</h1>;

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
											editSeries
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
											onChange={handleIsRepeatingChange}
										/>
									)}
								</div>
							</div>
							{isRepeating && (
								<>
									<StartAndEndDate
										label="End date"
										value={formatTimestampToDateString(
											editSeries
												? todoSeriesInfo.endDate
												: todoItem.date
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
