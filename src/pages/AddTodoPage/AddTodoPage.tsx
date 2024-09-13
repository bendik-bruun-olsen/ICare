/* eslint-disable no-mixed-spaces-and-tabs */
import { useContext, useEffect, useState } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory/SelectCategory";
import DaysComponent from "../../components/DaysComponent/DaysComponent";
import TitleDescription from "../../components/TitleDescription/TitleDescription";
import AddButton from "../../components/AddButton/AddButton";
import styles from "./AddTodoPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import {
	addSingleNewTodo,
	addMultipleNewTodos,
} from "../../firebase/todoServices/addNewTodo";
import { Timestamp } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import {
	TodoItemInputStatusProps,
	ToDo,
	TodoSeriesInfo,
	TodoSeriesInputStatusProps,
	ToDoStatus,
	NotificationType,
} from "../../types";
import {
	formatTimestampToDateString,
	generateTodosForSeries,
	mapSelectedDaysToNumbers,
	clearTodoItemInputStatus,
	clearTodoSeriesInputStatus,
	validateDateRange,
	validateTodoItemFields,
	validateTodoSeriesFields,
} from "../../utils";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Paths } from "../../paths";
import {
	daysOfTheWeek,
	defaultTodoItem,
	defaultTodoItemInputStatus,
	defaultTodoSeries,
	defaultTodoSeriesInputStatus,
} from "../../constants/defaultTodoValues";
import Loading from "../../components/Loading/Loading";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { NotificationContext } from "../../context/NotificationContext";

const AddToDoPage: React.FC = () => {
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isRepeating, setIsRepeating] = useState(false);
	const [todoItem, setTodoItem] = useState<ToDo>(defaultTodoItem);
	const [todoSeriesInfo, setTodoSeriesInfo] =
		useState<TodoSeriesInfo>(defaultTodoSeries);
	const [todoItemInputFieldStatus, setTodoItemInputFieldStatus] =
		useState<TodoItemInputStatusProps>(defaultTodoItemInputStatus);
	const [todoSeriesInputFieldStatus, setTodoSeriesInputFieldStatus] =
		useState<TodoSeriesInputStatusProps>(defaultTodoSeriesInputStatus);
	const [endDateMinValue, setEndDateMinValue] = useState<Date | undefined>(
		undefined
	);
	const { addNotification } = useContext(NotificationContext);
	const navigate = useNavigate();
	const currentUserEmail = useAuth().userData?.email;

	useEffect(() => {
		if (!location.state.selectedDate) {
			setHasError(true);
			return;
		}
		const initialDate = new Date(location.state.selectedDate);
		setTodoItem((prev) => ({
			...prev,
			date: Timestamp.fromDate(initialDate),
		}));
	}, [location.state.selectedDate]);

	useEffect(() => {
		if (isRepeating) {
			clearTodoSeriesInputStatus(todoSeriesInfo, setTodoSeriesInputFieldStatus);
			return;
		}
		clearTodoItemInputStatus(todoItem, setTodoItemInputFieldStatus);
	}, [todoItem, todoSeriesInfo]);

	const handleToggleRepeat = (): boolean | void => {
		setIsRepeating((isRepeating) => {
			if (!isRepeating) {
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
			return !isRepeating;
		});
	};

	const handleSubmit = async (e: React.FormEvent): Promise<void | boolean> => {
		e.preventDefault();
		try {
			setIsLoading(true);
			if (isRepeating) {
				if (
					!validateDateRange(
						todoSeriesInfo.startDate,
						todoSeriesInfo.endDate,
						addNotification
					)
				)
					return;

				if (
					!validateTodoSeriesFields(
						todoSeriesInfo,
						setTodoSeriesInputFieldStatus,
						addNotification
					)
				)
					return;
				if (!currentUserEmail) return setHasError(true);

				const selectedDaysNumbers = mapSelectedDaysToNumbers(
					todoSeriesInfo.selectedDays
				);
				if (selectedDaysNumbers.includes(-1)) {
					addNotification("Invalid day selected", NotificationType.ERROR);
					setHasError(true);
					return;
				}
				const newTodo = {
					title: todoSeriesInfo.title,
					description: todoSeriesInfo.description,
					date: Timestamp.now(),
					time: todoSeriesInfo.time,
					category: todoSeriesInfo.category,
					status: ToDoStatus.unchecked,
					seriesId: "",
					id: "",
					createdBy: "",
					completedBy: null,
				};
				const newTodos = generateTodosForSeries({
					newTodo,
					startDate: formatTimestampToDateString(todoSeriesInfo.startDate),
					endDate: formatTimestampToDateString(todoSeriesInfo.endDate),
					selectedDaysNumbers,
				});
				await addMultipleNewTodos(
					newTodos,
					todoSeriesInfo,
					currentUserEmail,
					addNotification
				);
				return navigate(Paths.TODO, {
					state: { selectedDate: todoSeriesInfo.startDate.toDate() },
				});
			}
			if (!isRepeating) {
				if (
					!validateTodoItemFields(
						todoItem,
						setTodoItemInputFieldStatus,
						addNotification
					)
				)
					return;
				if (!currentUserEmail) return setHasError(true);
				await addSingleNewTodo(todoItem, currentUserEmail, addNotification);
				return navigate(Paths.TODO, {
					state: { selectedDate: todoItem.date.toDate() },
				});
			}
			setHasError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDateChange = (field: string, date: string): void => {
		const newTimestamp = Timestamp.fromDate(new Date(date));
		if (isRepeating) {
			if (field === "startDate") setEndDateMinValue(new Date(date));
			setTodoSeriesInfo((prev) => ({ ...prev, [field]: newTimestamp }));
			return;
		}
		setTodoItem((prev) => ({ ...prev, [field]: newTimestamp }));
	};

	const handleDayToggle = (day: string): TodoSeriesInfo | void => {
		setTodoSeriesInfo((prev) => {
			const isSelected = prev.selectedDays.includes(day);
			const selectedDays = isSelected
				? prev.selectedDays.filter((d) => d !== day)
				: [...prev.selectedDays, day];
			return { ...prev, selectedDays };
		});
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (isRepeating) {
			setTodoSeriesInfo((prev) => ({ ...prev, time: e.target.value }));
			return;
		}
		setTodoItem((prev) => ({ ...prev, time: e.target.value }));
	};

	if (hasError) return <ErrorPage />;
	if (isLoading)
		return (
			<>
				<Navbar centerContent="Add ToDo" />
				<Loading />
			</>
		);

	return (
		<>
			<Navbar centerContent="Add To Do" />
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.formContainer}>
						<div className="inputBackgroundBox">
							<div className={styles.mainContentContainer}>
								<TitleDescription
									title={isRepeating ? todoSeriesInfo.title : todoItem.title}
									setTitle={(title) =>
										isRepeating
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
										isRepeating
											? todoSeriesInputFieldStatus.title
											: todoItemInputFieldStatus.title
									}
									description={
										isRepeating
											? todoSeriesInfo.description
											: todoItem.description
									}
									setDescription={(description) =>
										isRepeating
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
										isRepeating
											? todoSeriesInputFieldStatus.description
											: todoItemInputFieldStatus.description
									}
								/>
								<div className={styles.scheduleControlsContainer}>
									<div>
										<SelectCategory
											selectedOption={
												isRepeating
													? todoSeriesInfo.category
													: todoItem.category
											}
											onSelectionChange={(category) =>
												isRepeating
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
												isRepeating
													? todoSeriesInputFieldStatus.category
													: todoItemInputFieldStatus.category
											}
										/>
										<StartAndEndDate
											label={isRepeating ? "Start date" : "Date"}
											value={formatTimestampToDateString(
												isRepeating ? todoSeriesInfo.startDate : todoItem.date
											)}
											onChange={(date) =>
												handleDateChange(
													isRepeating ? "startDate" : "date",
													date
												)
											}
											variant={
												isRepeating
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
											value={isRepeating ? todoSeriesInfo.time : todoItem.time}
											className={styles.time}
											onChange={handleTimeChange}
											style={{ width: "150px" }}
											variant={
												isRepeating
													? todoSeriesInputFieldStatus.time
													: todoItemInputFieldStatus.time
											}
										/>
										<Checkbox
											label="Repeat"
											checked={isRepeating}
											onChange={handleToggleRepeat}
										/>
									</div>
								</div>
								{isRepeating && (
									<>
										<StartAndEndDate
											label="End date"
											value={formatTimestampToDateString(
												todoSeriesInfo.endDate
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
						</div>
						<div className={styles.buttonContainer}>
							<AddButton label="Add" onClick={handleSubmit} />
						</div>
					</div>
				</form>
			</div>
		</>
	);
};
export default AddToDoPage;
