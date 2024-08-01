import { useState } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import styles from "./AddTodo.module.css";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import {
	addSingleNewTodo,
	addMultipleNewTodos,
} from "../../firebase/todoServices/addNewTodo";
import { useNotification } from "../../context/NotificationContext";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddToDo: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [repeat, setRepeat] = useState(false);
	const [startDate, setStartDate] = useState(
		new Date().toISOString().substring(0, 10)
	);
	const [endDate, setEndDate] = useState(
		new Date().toISOString().substring(0, 10)
	);
	const [time, setTime] = useState("");
	const [selectCategory, setSelectCategory] = useState<string | null>(null);
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const { addNotification } = useNotification();
	const Navigate = useNavigate();

	const handleCheckboxChange = () => {
		setRepeat((prev) => !prev);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const startDateAsTimestamp = Timestamp.fromDate(new Date(startDate));
		const endDateAsTimestamp = Timestamp.fromDate(new Date(endDate));
		const newTodo = {
			title,
			description,
			// repeat,
			startDate: startDateAsTimestamp,
			// endDate: endDateAsTimestamp,
			time,
			category: selectCategory,
			// selectedDays: repeat ? selectedDays : [],
		};

		try {
			const newTodos = [];
			setIsLoading(true);

			if (repeat) {
				console.log("Repeat is true, processing selectedDays");
				const selectedDaysNumbers = selectedDays.map((day) => {
					switch (day) {
						case "sunday":
							return 0;
						case "monday":
							return 1;
						case "tuesday":
							return 2;
						case "wednesday":
							return 3;
						case "thursday":
							return 4;
						case "friday":
							return 5;
						case "saturday":
							return 6;
						default:
							return -1;
					}
				});
				console.log(
					"Selected days converted to numbers:",
					selectedDaysNumbers
				);

				const currentDate = new Date(startDate);

				console.log("Entering while loop");
				while (currentDate <= new Date(endDate)) {
					if (selectedDaysNumbers.includes(currentDate.getDay())) {
						console.log("Adding todo for date:", currentDate);
						const todoForDay = {
							...newTodo,
							startDate: Timestamp.fromDate(currentDate),
							endDate: null,
							repeat: false,
						};
						newTodos.push(todoForDay);
					}

					console.log("Incrementing date");
					currentDate.setDate(currentDate.getDate() + 1);
				}
				const seriesInfo = {
					startDate: startDateAsTimestamp,
					endDate: endDateAsTimestamp,
					selectedDays: selectedDays,
				};

				addMultipleNewTodos(newTodos, seriesInfo);
			}

			if (!repeat) {
				console.log("Repeat is false, adding single todo");
				addSingleNewTodo(newTodo);
			}

			addNotification("ToDo added successfully!", "success");
		} catch (e) {
			addNotification(
				"Error adding ToDo. Please try again later",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCategorySelectionChange = (value: string | null) => {
		setSelectCategory(value);
	};

	const onclickAddButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
		await handleSubmit(e);
		setTitle("");
		setDescription("");
		setRepeat(false);
		setStartDate(new Date().toISOString().substring(0, 10));
		setEndDate(new Date().toISOString().substring(0, 10));
		setTime("");
		setSelectCategory(null);
		setSelectedDays([]);
		Navigate("/ToDoPage");
	};

	const handleDayToggle = (day: string) => {
		setSelectedDays((prevSelectedDays) =>
			prevSelectedDays.includes(day)
				? prevSelectedDays.filter((d) => d !== day)
				: [...prevSelectedDays, day]
		);
	};

	if (isLoading) return <div>Loading...</div>;

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
								title={title}
								setTitle={setTitle}
								description={description}
								setDescription={setDescription}
							/>
							<div className={styles.scheduleControlsContainer}>
								<div>
									<SelectCategory
										selectedOption={selectCategory}
										onSelectionChange={
											handleCategorySelectionChange
										}
									/>
									<StartAndEndDate
										label="Start date"
										value={startDate}
										onChange={(date: string) =>
											setStartDate(date)
										}
									/>
								</div>

								<div className={styles.timeAndRepeatControls}>
									<TextField
										id="time"
										label="Select time"
										type="time"
										value={time}
										className={styles.time}
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) => setTime(e.target.value)}
										style={{ width: "150px" }}
									/>
									<Checkbox
										label="Repeat"
										checked={repeat}
										onChange={handleCheckboxChange}
									/>
								</div>
							</div>
							{repeat && (
								<>
									<StartAndEndDate
										label="End date"
										value={endDate}
										onChange={(date: string) =>
											setEndDate(date)
										}
									/>
									<DaysComponent
										selectedDays={selectedDays}
										onDayToggle={handleDayToggle}
									/>
								</>
							)}
						</div>
						<AddButton label="Add" onClick={onclickAddButton} />
					</div>
				</form>
			</div>
		</>
	);
};
export default AddToDo;
