import { useState, useEffect } from "react";
import { Button, Checkbox, TextField } from "@equinor/eds-core-react";
import { Timestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
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
import {
	deleteTodoItem,
	deleteTodoSeries,
} from "../../firebase/todoServices/deleteTodo";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfimModal";
import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
interface TodoItemInputVariantProps {
	title: Variants | undefined;
	description: Variants | undefined;
	category: Variants | undefined;
	date: Variants | undefined;
	time: Variants | undefined;
}

interface TodoSeriesInputVariantProps {
	title: Variants | undefined;
	description: Variants | undefined;
	category: Variants | undefined;
	startDate: Variants | undefined;
	endDate: Variants | undefined;
	time: Variants | undefined;
	selectedDays: Variants | undefined;
}

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
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [todoItemVariants, setTodoItemVariants] =
		useState<TodoItemInputVariantProps>({
			title: undefined,
			description: undefined,
			category: undefined,
			date: undefined,
			time: undefined,
		});
	const [todoSeriesVariants, setTodoSeriesVariants] =
		useState<TodoSeriesInputVariantProps>({
			title: "error",
			description: "error",
			category: "error",
			startDate: "error",
			endDate: "error",
			time: "error",
			selectedDays: "error",
		});

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
			try {
				setIsLoading(true);

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
			if (prev) setIsCreatingNewSeries(false);
			return !prev;
		});
	};

	const toggleIsCreatingNewSeries = () => {
		setIsCreatingNewSeries((prev) => {
			if (prev) setIsEditingSeries(false);
			return !prev;
		});
	};

	const handleSeriesEdit = async () => {
		const seriesId = seriesIdFromParams || todoItem.seriesId;
		if (!seriesId) {
			setHasError(true);
			return;
		}
		try {
			setIsLoading(true);
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
		try {
			setIsLoading(true);
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
		try {
			setIsLoading(true);
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

	const handleDelete = async () => {
		if (isEditingSeries) {
			const seriesId = seriesIdFromParams || todoItem.seriesId;
			if (!seriesId) {
				setHasError(true);
				return;
			}
			try {
				setIsLoading(true);
				await deleteTodoSeries(seriesId, addNotification);
			} finally {
				setIsLoading(false);
				setIsConfirmModalOpen(false);
			}
			return;
		}
		if (todoItemIdFromParams) {
			try {
				setIsLoading(true);
				await deleteTodoItem(todoItemIdFromParams, addNotification);
			} finally {
				setIsLoading(false);
				setIsConfirmModalOpen(false);
			}
			return;
		}
		setHasError(true);
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

	// const validateTodoItemInput = () => {
	// 	const { title, description, category, date, time } = todoItem;
	// 	if (title && description && category && date && time) {
	// 		addNotification("Please fill out all fields", "error");
	// 		return "empty-title";
	// 	}
	// 	if (!description) {
	// 		addNotification("Please fill out all fields", "error");
	// 		return "empty-description";
	// 	}
	// 	if (!category) {
	// 		addNotification("Please fill out all fields", "error");
	// 		return "empty-category";
	// 	}
	// 	if (!date) {
	// 		addNotification("Please fill out all fields", "error");
	// 		return "empty-date";
	// 	}
	// 	if (!time) {
	// 		addNotification("Please fill out all fields", "error");
	// 		return "empty-time";
	// 	}
	// };

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
								titleVariant={
									isEditingSeries || isCreatingNewSeries
										? todoSeriesVariants.title
										: todoItemVariants.title
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
								descriptionVariant={
									isEditingSeries || isCreatingNewSeries
										? todoSeriesVariants.description
										: todoItemVariants.description
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
										variant={
											isEditingSeries ||
											isCreatingNewSeries
												? todoSeriesVariants.category
												: todoItemVariants.category
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
										variant={
											isEditingSeries ||
											isCreatingNewSeries
												? todoSeriesVariants.startDate
												: todoItemVariants.date
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
										variant={
											isEditingSeries ||
											isCreatingNewSeries
												? todoSeriesVariants.time
												: todoItemVariants.time
										}
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
										variant={"error"}
									/>
									<DaysComponent
										selectedDays={
											todoSeriesInfo.selectedDays
										}
										onDayToggle={handleDayToggle}
										variant={
											todoSeriesVariants.selectedDays
										}
									/>
								</>
							)}
						</div>
						<div className={styles.buttonContainer}>
							<Button onClick={handleSubmit}>Save</Button>
							<Button onClick={() => setIsConfirmModalOpen(true)}>
								Delete
							</Button>
						</div>
					</div>
				</form>
			</div>
			<DeleteConfirmModal
				isOpen={isConfirmModalOpen}
				onClose={() => setIsConfirmModalOpen(false)}
				onConfirm={handleDelete}
				type={isEditingSeries ? "series" : "item"}
			/>
		</>
	);
};

export default EditToDoPage;
