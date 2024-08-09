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
import { TodoSeriesInfoInterface, TodoItemInterface } from "../../types";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useParams } from "react-router-dom";
import {
	daysOfTheWeek,
	defaultTodoItem,
	defaultTodoSeries,
} from "../../constants/defaultTodoValues";

const EditToDoPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [todoItem, setTodoItem] =
		useState<TodoItemInterface>(defaultTodoItem);
	const [todoSeriesInfo, setTodoSeriesInfo] =
		useState<TodoSeriesInfoInterface>(defaultTodoSeries);
	const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false);
	const [isEditingSeries, setIsEditingSeries] = useState(false);
	const { addNotification } = useNotification();
	const { todoId: todoItemIdFromParams, seriesId: seriesIdFromParams } =
		useParams<{
			todoId: string;
			seriesId: string;
		}>();

	useEffect(() => {
		if (seriesIdFromParams) {
			setIsEditingSeries(true);
		}
	}, [seriesIdFromParams]);

	useEffect(() => {
		async function fetchData() {
			if (!todoItemIdFromParams && !seriesIdFromParams) {
				setHasError(true);
				return;
			}
			setIsLoading(true);
			try {
				if (isEditingSeries) {
					const seriesId = seriesIdFromParams || todoItem.seriesId;
					if (!seriesId) return;
					const data = await getTodoSeriesInfo(
						seriesId,
						addNotification
					);
					if (data) {
						setTodoSeriesInfo(data as TodoSeriesInfoInterface);
					}
					return;
				}
				if (todoItemIdFromParams) {
					const data = await getTodo(
						todoItemIdFromParams,
						addNotification
					);
					if (data) {
						setTodoItem(data as TodoItemInterface);
					}
					return;
				}
				if (seriesIdFromParams) {
					const data = await getTodoSeriesInfo(
						seriesIdFromParams,
						addNotification
					);
					if (data) {
						setTodoSeriesInfo(data as TodoSeriesInfoInterface);
					}
					return;
				}
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [isEditingSeries]);

	useEffect(() => {
		if (isCreatingNewSeries) {
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
	}, [isCreatingNewSeries]);

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodoItem((prev) => ({ ...prev, time: e.target.value }));
	};

	const handleDateChange = (field: string, date: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(date));
		if (isEditingSeries || isCreatingNewSeries) {
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

	const toggleIsEditingSeries = () => {
		setIsEditingSeries((prev) => {
			if (isEditingSeries) setIsCreatingNewSeries(false);
			return !prev;
		});
	};

	const toggleIsCreatingNewSeries = () => {
		setIsCreatingNewSeries((prev) => {
			if (isCreatingNewSeries) setIsEditingSeries(false);
			return !prev;
		});
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

	const handleCreateNewSeriesFromSingleTodo = async () => {
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
		if (isEditingSeries) {
			await handleSeriesEdit();
			return;
		}
		if (!isCreatingNewSeries) {
			await handleSingleTodoEdit();
			return;
		}
		if (isCreatingNewSeries) {
			await handleCreateNewSeriesFromSingleTodo();
			return;
		}
	};

	if (hasError) return <ErrorPage />;
	if (isLoading) return <h1>Loading....</h1>;

	return (
		<>
			<Navbar
				leftContent={<BackHomeButton />}
				centerContent={
					isEditingSeries ? "Edit ToDo Series" : "Edit ToDo"
				}
			/>
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.formContainer}>
						<div className={styles.mainContentContainer}>
							<TitleDescription
								title={
									isEditingSeries
										? todoSeriesInfo.title
										: todoItem.title
								}
								setTitle={(title) =>
									isEditingSeries
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
									isEditingSeries
										? todoSeriesInfo.description
										: todoItem.description
								}
								setDescription={(description) =>
									isEditingSeries
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
											isEditingSeries
												? todoSeriesInfo.category
												: todoItem.category
										}
										onSelectionChange={(category) =>
											isEditingSeries
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
											isCreatingNewSeries ||
											isEditingSeries
												? "Start date"
												: "Date"
										}
										value={formatTimestampToDateString(
											isEditingSeries
												? todoSeriesInfo.startDate
												: todoItem.date
										)}
										onChange={(date) =>
											handleDateChange(
												seriesIdFromParams
													? "startDate"
													: "date",
												date
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
											isEditingSeries
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
											checked={isEditingSeries}
											onChange={toggleIsEditingSeries}
										/>
									) : (
										<Checkbox
											label="Repeat"
											checked={
												isCreatingNewSeries ||
												isEditingSeries
											}
											disabled={
												seriesIdFromParams
													? true
													: false
											}
											onChange={toggleIsCreatingNewSeries}
										/>
									)}
								</div>
							</div>
							{(isCreatingNewSeries || isEditingSeries) && (
								<>
									<StartAndEndDate
										label="End date"
										value={formatTimestampToDateString(
											isEditingSeries
												? todoSeriesInfo.endDate
												: todoItem.date
										)}
										onChange={(date) =>
											handleDateChange("endDate", date)
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
						<AddButton
							label={isEditingSeries ? "Delete" : "Delete Series"}
							onClick={handleDelete}
						/>
					</div>
				</form>
			</div>
		</>
	);
};

export default EditToDoPage;
