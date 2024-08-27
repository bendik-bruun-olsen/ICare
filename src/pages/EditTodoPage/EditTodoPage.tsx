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
import {
	formatTimestampToDateString,
	resetTodoItemInputFieldStatus,
	resetTodoSeriesInputFieldStatus,
	validateDateRange,
	validateTodoItemFields,
	validateTodoSeriesFields,
} from "../../utils";
import { useNotification } from "../../hooks/useNotification";
import {
	TodoSeriesInfoInterface,
	TodoItemInterface,
	TodoItemInputFieldStatusProps,
	TodoSeriesInputFieldStatusProps,
} from "../../types";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	daysOfTheWeek,
	defaultTodoItem,
	defaultTodoItemInputFieldStatus,
	defaultTodoSeries,
	defaultTodoSeriesInputFieldStatus,
} from "../../constants/defaultTodoValues";
import {
	deleteTodoItem,
	deleteTodoSeries,
} from "../../firebase/todoServices/deleteTodo";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import { Paths } from "../../paths";
import Loading from "../../components/Loading/Loading";

const EditToDoPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { selectedDate: DateSelectedInTodoPage } = location.state;
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [todoItem, setTodoItem] = useState<TodoItemInterface>(defaultTodoItem);
	const [todoSeriesInfo, setTodoSeriesInfo] =
		useState<TodoSeriesInfoInterface>(defaultTodoSeries);
	const { todoId: todoItemIdFromParams, seriesId: seriesIdFromParams } =
		useParams<{
			todoId: string;
			seriesId: string;
		}>();
	const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false);
	const [isEditingSeries, setIsEditingSeries] = useState(!!seriesIdFromParams);
	const { addNotification } = useNotification();
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [todoItemInputFieldStatus, setTodoItemInputFieldStatus] =
		useState<TodoItemInputFieldStatusProps>(defaultTodoItemInputFieldStatus);
	const [todoSeriesInputFieldStatus, setTodoSeriesInputFieldStatus] =
		useState<TodoSeriesInputFieldStatusProps>(
			defaultTodoSeriesInputFieldStatus
		);

	const [endDateMinValue, setEndDateMinValue] = useState<Date | undefined>(
		undefined
	);

	async function fetchSeriesInfo() {
		const id = seriesIdFromParams || todoItem.seriesId;
		if (!id) return setHasError(true);
		try {
			setIsLoading(true);
			const result = await getTodoSeriesInfo(id, addNotification);
			if (result) {
				setTodoSeriesInfo(result as TodoSeriesInfoInterface);
				setEndDateMinValue(result.startDate.toDate());
			}
		} finally {
			setIsLoading(false);
		}
	}

	async function fetchTodoItem() {
		const id = todoItemIdFromParams;
		if (!id) return setHasError(true);
		try {
			setIsLoading(true);
			const result = await getTodo(id, addNotification);
			if (result) {
				setTodoItem(result as TodoItemInterface);
			}
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			if (isEditingSeries) {
				await fetchSeriesInfo();
				return;
			}
			await fetchTodoItem();
		};
		fetchData();
	}, [isEditingSeries, todoItemIdFromParams, seriesIdFromParams]);

	const handleSeriesEdit = async () => {
		const seriesId = seriesIdFromParams || todoItem.seriesId;
		if (!seriesId) return setHasError(true);
		try {
			setIsLoading(true);
			await editTodoSeries(seriesId, todoSeriesInfo, addNotification);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSingleTodoEdit = async () => {
		const todoItemId = todoItemIdFromParams || todoItem.id;
		if (!todoItemId) return setHasError(true);
		try {
			setIsLoading(true);
			await editTodoItem(todoItemId, todoItem, addNotification);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isEditingSeries || isCreatingNewSeries) {
			resetTodoSeriesInputFieldStatus(
				todoSeriesInfo,
				setTodoSeriesInputFieldStatus
			);
			return;
		}
		resetTodoItemInputFieldStatus(todoItem, setTodoItemInputFieldStatus);
	}, [todoItem, todoSeriesInfo]);

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isEditingSeries || isCreatingNewSeries) {
			setTodoSeriesInfo((prev) => ({ ...prev, time: e.target.value }));
			return;
		}
		setTodoItem((prev) => ({ ...prev, time: e.target.value }));
	};

	const handleDateChange = (field: string, date: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(date));
		if (isEditingSeries || isCreatingNewSeries) {
			if (field === "startDate") setEndDateMinValue(new Date(date));
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

	const handleToggleEditSeries = () => {
		setIsEditingSeries((prev) => {
			if (!prev) {
				setIsCreatingNewSeries(false);
			}
			return !prev;
		});
	};

	const handleToggleRepeat = () => {
		setIsCreatingNewSeries((prev) => {
			if (!prev) {
				setIsEditingSeries(false);

				const currentDay = daysOfTheWeek[todoItem.date.toDate().getDay()];
				setTodoSeriesInfo((prev) => ({
					title: todoItem.title,
					description: todoItem.description,
					time: todoItem.time,
					category: todoItem.category,
					startDate: todoItem.date,
					endDate: todoItem.date,
					selectedDays: prev.selectedDays.includes(currentDay)
						? prev.selectedDays
						: [...prev.selectedDays, currentDay],
				}));
				setEndDateMinValue(todoItem.date.toDate());
			}
			return !prev;
		});
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
			if (!seriesId) return setHasError(true);
			try {
				setIsConfirmModalOpen(false);
				setIsLoading(true);
				await deleteTodoSeries(seriesId, addNotification);
			} finally {
				setIsLoading(false);
			}
			return navigate(Paths.TODO, {
				state: { selectedDate: DateSelectedInTodoPage },
			});
		}
		const todoItemId = todoItemIdFromParams;
		if (!todoItemId) return setHasError(true);
		try {
			setIsLoading(true);
			await deleteTodoItem(todoItemId, addNotification);
		} finally {
			setIsLoading(false);
			setIsConfirmModalOpen(false);
		}
		return navigate(Paths.TODO, {
			state: { selectedDate: DateSelectedInTodoPage },
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isEditingSeries) {
			if (
				!validateDateRange(
					todoSeriesInfo.startDate,
					todoSeriesInfo.endDate,
					addNotification
				)
			) {
				setTodoSeriesInputFieldStatus((prev) => ({
					...prev,
					endDate: "error",
				}));

				return;
			}
			if (
				!validateTodoSeriesFields(
					todoSeriesInfo,
					setTodoSeriesInputFieldStatus,
					addNotification
				)
			)
				return;

			await handleSeriesEdit();
			return navigate(Paths.TODO, {
				state: { selectedDate: DateSelectedInTodoPage },
			});
		}
		if (!isCreatingNewSeries) {
			if (
				!validateTodoItemFields(
					todoItem,
					setTodoItemInputFieldStatus,
					addNotification
				)
			)
				return;

			await handleSingleTodoEdit();
			return navigate(Paths.TODO, {
				state: { selectedDate: DateSelectedInTodoPage },
			});
		}
		if (isCreatingNewSeries) {
			if (
				!validateDateRange(
					todoSeriesInfo.startDate,
					todoSeriesInfo.endDate,
					addNotification
				)
			) {
				setTodoSeriesInputFieldStatus((prev) => ({
					...prev,
					endDate: "error",
				}));
				return;
			}
			if (
				!validateTodoSeriesFields(
					todoSeriesInfo,
					setTodoSeriesInputFieldStatus,
					addNotification
				)
			)
				return;

			await handleCreateNewSeriesFromSingleTodo();
			return navigate(Paths.TODO, {
				state: { selectedDate: DateSelectedInTodoPage },
			});
		}
		setHasError(true);
	};
	if (hasError) return <ErrorPage />;
	if (isLoading)
		return (
			<>
				<Navbar
					leftContent={<BackHomeButton />}
					centerContent={isEditingSeries ? "Edit ToDo Series" : "Edit ToDo"}
				/>
				<Loading />
			</>
		);

	return (
		<>
			<Navbar
				leftContent={<BackHomeButton />}
				centerContent={isEditingSeries ? "Edit ToDo Series" : "Edit ToDo"}
			/>
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.formContainer}>
						<div className={styles.mainContentContainer}>
							<TitleDescription
								title={
									isEditingSeries || isCreatingNewSeries
										? todoSeriesInfo.title
										: todoItem.title
								}
								setTitle={(title) =>
									isEditingSeries || isCreatingNewSeries
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
										? todoSeriesInputFieldStatus.title
										: todoItemInputFieldStatus.title
								}
								description={
									isEditingSeries || isCreatingNewSeries
										? todoSeriesInfo.description
										: todoItem.description
								}
								setDescription={(description) =>
									isEditingSeries || isCreatingNewSeries
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
										? todoSeriesInputFieldStatus.description
										: todoItemInputFieldStatus.description
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
											isEditingSeries || isCreatingNewSeries
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
											isEditingSeries || isCreatingNewSeries
												? todoSeriesInputFieldStatus.category
												: todoItemInputFieldStatus.category
										}
									/>
									<StartAndEndDate
										label={
											isCreatingNewSeries || isEditingSeries
												? "Start date"
												: "Date"
										}
										value={formatTimestampToDateString(
											isEditingSeries ? todoSeriesInfo.startDate : todoItem.date
										)}
										onChange={(date) =>
											handleDateChange(
												isEditingSeries ? "startDate" : "date",
												date
											)
										}
										variant={
											isEditingSeries || isCreatingNewSeries
												? todoSeriesInputFieldStatus.startDate
												: todoItemInputFieldStatus.date
										}
										minValue={undefined}
									/>
								</div>
								<div className={styles.timeAndRepeatControls}>
									<TextField
										id="time"
										label="Select time"
										type="time"
										name="time"
										value={
											isEditingSeries ? todoSeriesInfo.time : todoItem.time
										}
										className={styles.time}
										onChange={handleTimeChange}
										style={{ width: "150px" }}
										variant={
											isEditingSeries || isCreatingNewSeries
												? todoSeriesInputFieldStatus.time
												: todoItemInputFieldStatus.time
										}
									/>
									{todoItem.seriesId ? (
										<Checkbox
											label="Edit Series"
											checked={isEditingSeries}
											onChange={handleToggleEditSeries}
										/>
									) : (
										<Checkbox
											label="Repeat"
											checked={isCreatingNewSeries || isEditingSeries}
											disabled={seriesIdFromParams ? true : false}
											onChange={handleToggleRepeat}
										/>
									)}
								</div>
							</div>
							{(isCreatingNewSeries || isEditingSeries) && (
								<>
									<StartAndEndDate
										label="End date"
										value={formatTimestampToDateString(
											isEditingSeries ? todoSeriesInfo.endDate : todoItem.date
										)}
										onChange={(date) => handleDateChange("endDate", date)}
										variant={todoSeriesInputFieldStatus.endDate}
										minValue={endDateMinValue}
									/>
									<DaysComponent
										selectedDays={todoSeriesInfo.selectedDays}
										onDayToggle={handleDayToggle}
										variant={todoSeriesInputFieldStatus.selectedDays}
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
