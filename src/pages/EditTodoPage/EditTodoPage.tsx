import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, TextField } from "@equinor/eds-core-react";
import { Timestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import StartAndEndDate from "../../components/StartAndEndDate/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory/SelectCategory";
import DaysComponent from "../../components/DaysComponent/DaysComponent";
import TitleDescription from "../../components/TitleDescription/TitleDescription";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import Loading from "../../components/Loading/Loading";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { Paths } from "../../paths";
import styles from "./EditTodoPage.module.css";
import {
	formatTimestampToDateString,
	clearTodoItemInputStatus,
	clearTodoSeriesInputStatus,
	validateDateRange,
	validateTodoSeriesFields,
	validateTodoItemFields,
} from "../../utils";
import {
	daysOfTheWeek,
	defaultTodoItem,
	defaultTodoItemInputStatus,
	defaultTodoSeries,
	defaultTodoSeriesInputStatus,
} from "../../constants/defaultTodoValues";
import {
	TodoSeriesInfo,
	ToDo,
	TodoItemInputStatusProps,
	TodoSeriesInputStatusProps,
} from "../../types";
import {
	getTodo,
	getTodoSeriesIdByTodoId,
	getTodoSeriesInfo,
} from "../../firebase/todoServices/getTodo";
import {
	createTodoSeriesFromSingleTodo,
	editTodoItem,
	editTodoSeries,
} from "../../firebase/todoServices/editTodo";
import {
	deleteTodoItem,
	deleteTodoSeries,
} from "../../firebase/todoServices/deleteTodo";
import { NotificationContext } from "../../context/NotificationContext";

interface LocationState {
	selectedDate: Date;
	editingSeries: boolean;
}

const EditToDoPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const currentUser = useAuth().userData?.email;
	const locationState = location.state as LocationState;
	const { selectedDate: DateSelectedInTodoPage, editingSeries } =
		locationState || { selectedDate: new Date(), editingSeries: false };
	const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false);
	const [isEditingSeries, setIsEditingSeries] = useState(editingSeries);
	const [isSeriesMode, setIsSeriesMode] = useState(editingSeries);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [todoItem, setTodoItem] = useState<ToDo>(defaultTodoItem);
	const [todoSeriesInfo, setTodoSeriesInfo] =
		useState<TodoSeriesInfo>(defaultTodoSeries);
	const { todoId: todoItemIdFromParams } = useParams<{
		todoId: string;
	}>();
	const { addNotification } = useContext(NotificationContext);
	const [todoItemInputFieldStatus, setTodoItemInputFieldStatus] =
		useState<TodoItemInputStatusProps>(defaultTodoItemInputStatus);
	const [todoSeriesInputFieldStatus, setTodoSeriesInputFieldStatus] =
		useState<TodoSeriesInputStatusProps>(defaultTodoSeriesInputStatus);
	const [endDateMinValue, setEndDateMinValue] = useState<Date | undefined>(
		undefined
	);
	const { currentPatientId } = useAuth();
	const patientId = currentPatientId || "";

	async function fetchTodoItem(itemId: string): Promise<boolean> {
		const result = await getTodo(itemId, patientId, addNotification);
		if (result) {
			setTodoItem(result);
			return true;
		}
		return false;
	}

	async function fetchSeriesInfo(itemId: string): Promise<boolean> {
		const seriesId = await getTodoSeriesIdByTodoId(itemId, patientId);
		if (!seriesId) {
			setHasError(true);
			return false;
		}

		const result = await getTodoSeriesInfo(
			seriesId,
			patientId,
			addNotification
		);
		if (result) {
			setTodoSeriesInfo(result as TodoSeriesInfo);
			setEndDateMinValue(result.startDate.toDate());
			return true;
		}
		return false;
	}

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			const itemId = todoItemIdFromParams;
			if (!itemId) {
				setHasError(true);
				return;
			}
			try {
				setIsLoading(true);

				if (isEditingSeries) {
					const fetchSeriesSuccess = await fetchSeriesInfo(itemId);
					if (fetchSeriesSuccess) return;
				}
				if (!isEditingSeries) {
					const fetchItemSuccess = await fetchTodoItem(itemId);
					if (fetchItemSuccess) return;
				}
				setHasError(true);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [isEditingSeries, todoItemIdFromParams]);

	useEffect(() => {
		setIsSeriesMode(isEditingSeries || isCreatingNewSeries);
	}, [isEditingSeries, isCreatingNewSeries]);

	useEffect(() => {
		if (isSeriesMode) {
			clearTodoSeriesInputStatus({
				todoSeriesInfo,
				setTodoSeriesInputFieldStatus,
			});
			return;
		}
		clearTodoItemInputStatus({ todoItem, setTodoItemInputFieldStatus });
	}, [todoItem, todoSeriesInfo, isSeriesMode]);

	const handleToggleEditSeries = (): void => {
		setIsEditingSeries((prev) => {
			if (!prev) {
				setIsCreatingNewSeries(false);
			}
			return !prev;
		});
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (isSeriesMode) {
			setTodoSeriesInfo((prev) => ({ ...prev, time: e.target.value }));
			return;
		}
		setTodoItem((prev) => ({ ...prev, time: e.target.value }));
	};

	const handleDateChange = (field: string, date: string): void => {
		const newTimestamp = Timestamp.fromDate(new Date(date));
		if (isSeriesMode) {
			if (field === "startDate") setEndDateMinValue(new Date(date));
			setTodoSeriesInfo((prev) => ({ ...prev, [field]: newTimestamp }));
			return;
		}
		setTodoItem((prev) => ({ ...prev, [field]: newTimestamp }));
	};

	const handleDayToggle = (day: string): void => {
		setTodoSeriesInfo((prev) => {
			const isSelected = prev.selectedDays.includes(day);
			const selectedDays = isSelected
				? prev.selectedDays.filter((d) => d !== day)
				: [...prev.selectedDays, day];
			return { ...prev, selectedDays };
		});
	};

	const handleToggleRepeat = (): void => {
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

	const handleValidateItemFields = (): boolean => {
		if (
			!validateTodoItemFields({
				todoItem,
				setTodoItemInputFieldStatus,
				addNotification,
			})
		)
			return false;
		return true;
	};

	const handleValidateSeriesFields = (): boolean => {
		const dateRangeIsValid = validateDateRange({
			startDate: todoSeriesInfo.startDate,
			endDate: todoSeriesInfo.endDate,
			addNotification: addNotification,
		});

		const todoSeriesFieldsAreValid = validateTodoSeriesFields({
			todoSeriesInfo,
			setTodoSeriesInputFieldStatus,
			addNotification,
		});

		if (!dateRangeIsValid) {
			setTodoSeriesInputFieldStatus((prev) => ({
				...prev,
				endDate: "error",
			}));

			return false;
		}
		if (!todoSeriesFieldsAreValid) return false;
		return true;
	};

	const handleSeriesEdit = async (itemId: string): Promise<boolean> => {
		const seriesId = await getTodoSeriesIdByTodoId(itemId, patientId);
		if (!seriesId || !currentUser || !patientId) {
			setHasError(true);
			return false;
		}

		return await editTodoSeries(
			seriesId,
			todoSeriesInfo,
			currentUser,
			patientId,
			addNotification
		);
	};

	async function handleSubmit(e: React.FormEvent): Promise<void> {
		e.preventDefault();
		const itemId = todoItemIdFromParams;
		if (!itemId) return setHasError(true);
		try {
			setIsLoading(true);

			if (isEditingSeries) {
				if (!handleValidateSeriesFields()) return;
				const seriesEditSuccess = await handleSeriesEdit(itemId);
				if (seriesEditSuccess) {
					navigate(Paths.TODO, {
						state: { selectedDate: DateSelectedInTodoPage },
					});
					return;
				}
			}

			if (!isCreatingNewSeries) {
				if (!handleValidateItemFields()) return;
				const itemEditSuccess = await editTodoItem({
					todoId: itemId,
					updatedTodo: todoItem,
					patientId,
					addNotification,
				});
				if (itemEditSuccess) {
					navigate(Paths.TODO, {
						state: { selectedDate: DateSelectedInTodoPage },
					});
					return;
				}
			}
			if (isCreatingNewSeries) {
				if (!handleValidateSeriesFields) return;
				const seriesCreationSuccess = await createTodoSeriesFromSingleTodo(
					todoItem,
					todoSeriesInfo,
					patientId,
					addNotification
				);
				if (seriesCreationSuccess) {
					navigate(Paths.TODO, {
						state: { selectedDate: DateSelectedInTodoPage },
					});
					return;
				}
			}
			setHasError(true);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleDelete(): Promise<void> {
		if (!todoItemIdFromParams) {
			setHasError(true);
			return;
		}
		if (isSeriesMode) {
			const seriesId = await getTodoSeriesIdByTodoId(
				todoItemIdFromParams,
				patientId
			);
			if (!seriesId) {
				setHasError(true);
				return;
			}
			try {
				setIsLoading(true);
				await deleteTodoSeries(seriesId, patientId, addNotification);
			} finally {
				setIsConfirmModalOpen(false);
				setIsLoading(false);
			}
			navigate(Paths.TODO, {
				state: { selectedDate: DateSelectedInTodoPage },
			});
			return;
		}

		if (!isSeriesMode) {
			try {
				setIsLoading(true);
				await deleteTodoItem(todoItemIdFromParams, patientId, addNotification);
			} finally {
				setIsConfirmModalOpen(false);
				setIsLoading(false);
			}
			navigate(Paths.TODO, {
				state: { selectedDate: DateSelectedInTodoPage },
			});
			return;
		}
	}

	if (hasError) return <ErrorPage />;
	if (isLoading)
		return (
			<>
				<Navbar
					centerContent={isEditingSeries ? "Edit ToDo Series" : "Edit ToDo"}
				/>
				<Loading />
			</>
		);

	return (
		<>
			<Navbar
				centerContent={isEditingSeries ? "Edit ToDo Series" : "Edit ToDo"}
			/>
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.formContainer}>
						<div className="inputBackgroundBox">
							<div className={styles.mainContentContainer}>
								<TitleDescription
									title={isSeriesMode ? todoSeriesInfo.title : todoItem.title}
									setTitle={(title) =>
										isSeriesMode
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
										isSeriesMode
											? todoSeriesInputFieldStatus.title
											: todoItemInputFieldStatus.title
									}
									description={
										isSeriesMode
											? todoSeriesInfo.description
											: todoItem.description
									}
									setDescription={(description) =>
										isSeriesMode
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
										isSeriesMode
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
												isSeriesMode
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
												isSeriesMode
													? todoSeriesInputFieldStatus.category
													: todoItemInputFieldStatus.category
											}
										/>
										<StartAndEndDate
											label={isSeriesMode ? "Start date" : "Date"}
											value={formatTimestampToDateString(
												isEditingSeries
													? todoSeriesInfo.startDate
													: todoItem.date
											)}
											onChange={(date) =>
												handleDateChange(
													isEditingSeries ? "startDate" : "date",
													date
												)
											}
											variant={
												isSeriesMode
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
											onChange={handleTimeChange}
											style={{ width: "150px" }}
											variant={
												isSeriesMode
													? todoSeriesInputFieldStatus.time
													: todoItemInputFieldStatus.time
											}
										/>
										{todoItem.seriesId || isEditingSeries ? (
											<Checkbox
												label="Edit Series"
												checked={isEditingSeries}
												onChange={handleToggleEditSeries}
											/>
										) : (
											<Checkbox
												label="Repeat"
												checked={isCreatingNewSeries}
												onChange={handleToggleRepeat}
											/>
										)}
									</div>
								</div>
								{isSeriesMode && (
									<div className={styles.EndDateAndFrequencyContainer}>
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
									</div>
								)}
							</div>
						</div>
						<div className={styles.buttonContainer}>
							<Button onClick={handleSubmit}>Save</Button>
							<Button
								color="danger"
								onClick={() => setIsConfirmModalOpen(true)}
							>
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
