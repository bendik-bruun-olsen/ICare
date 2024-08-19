import { useState } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import styles from "./AddTodoPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import {
	addSingleNewTodo,
	addMultipleNewTodos,
} from "../../firebase/todoServices/addNewTodo";
import { useNotification } from "../../hooks/useNotification";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TodoItemInterface, TodoSeriesInfoInterface } from "../../types";
import {
	formatTimestampToDateString,
	generateTodosForSeries,
	mapSelectedDaysToNumbers,
} from "../../utils";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Paths } from "../../paths";
import {
	daysOfTheWeek,
	defaultTodoItem,
	defaultTodoSeries,
} from "../../constants/defaultTodoValues";

const AddToDoPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isRepeating, setIsRepeating] = useState(false);
	const [todoItem, setTodoItem] =
		useState<TodoItemInterface>(defaultTodoItem);
	const [todoSeriesInfo, setTodoSeriesInfo] =
		useState<TodoSeriesInfoInterface>(defaultTodoSeries);
	const [endDateMinValue, setEndDateMinValue] = useState<Date | undefined>(
		undefined
	);
	const { addNotification } = useNotification();
	const navigate = useNavigate();

	const handleToggleRepeat = () => {
		setIsRepeating((isRepeating) => {
			if (!isRepeating) {
				const currentDay =
					daysOfTheWeek[todoItem.date.toDate().getDay()];
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			if (isRepeating) {
				const selectedDaysNumbers = mapSelectedDaysToNumbers(
					todoSeriesInfo.selectedDays
				);

				if (selectedDaysNumbers.includes(-1)) {
					addNotification("Invalid day selected", "error");
					setHasError(true);
					return;
				}

				const newTodos = generateTodosForSeries(
					todoItem,
					formatTimestampToDateString(todoSeriesInfo.startDate),
					formatTimestampToDateString(todoSeriesInfo.endDate),
					selectedDaysNumbers
				);

				await addMultipleNewTodos(
					newTodos,
					todoSeriesInfo,
					addNotification
				);
			}

			if (!isRepeating) {
				await addSingleNewTodo(todoItem, addNotification);
			}
		} finally {
			setIsLoading(false);
			navigate(Paths.TODO, {
				state: {
					selectedDate: isRepeating
						? todoSeriesInfo.startDate
						: todoItem.date,
				},
			});
		}
	};

	const handleDateChange = (field: string, date: string) => {
		const newTimestamp = Timestamp.fromDate(new Date(date));
		if (isRepeating) {
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

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isRepeating) {
			setTodoSeriesInfo((prev) => ({ ...prev, time: e.target.value }));
			return;
		}
		setTodoItem((prev) => ({ ...prev, time: e.target.value }));
	};

	if (isLoading) return <div>Loading...</div>;
	if (hasError) return <ErrorPage />;

	return (
		<>
			<Navbar
				leftContent={<BackHomeButton />}
				centerContent="Add To Do"
			/>
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.formContainer}>
						<div className={styles.mainContentContainer}>
							<TitleDescription
								title={
									isRepeating
										? todoSeriesInfo.title
										: todoItem.title
								}
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
								titleVariant={undefined}
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
								descriptionVariant={undefined}
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
										variant={undefined}
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
										onChange={(date) =>
											handleDateChange(
												isRepeating
													? "startDate"
													: "date",
												date
											)
										}
										variant={undefined}
										minValue={undefined}
									/>
								</div>

								<div className={styles.timeAndRepeatControls}>
									<TextField
										id="time"
										label="Select time"
										type="time"
										value={
											isRepeating
												? todoSeriesInfo.time
												: todoItem.time
										}
										className={styles.time}
										onChange={handleTimeChange}
										style={{ width: "150px" }}
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
										onChange={(date) =>
											handleDateChange("endDate", date)
										}
										variant={undefined}
										minValue={endDateMinValue}
									/>
									<DaysComponent
										selectedDays={
											todoSeriesInfo.selectedDays
										}
										onDayToggle={handleDayToggle}
										variant={undefined}
									/>
								</>
							)}
						</div>
						<AddButton label="Add" onClick={handleSubmit} />
					</div>
				</form>
			</div>
		</>
	);
};
export default AddToDoPage;
