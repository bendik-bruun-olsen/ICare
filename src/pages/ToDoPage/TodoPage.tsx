import React, { useState, useEffect } from "react";
import DatePickerComponent from "../../components/DatePicker/DatePickerComponent";
import ToDoTile from "../../components/ToDoTile/ToDoTile";
import styles from "./ToDoPage.module.css";
import { db } from "../../firebase/firebase";
import {
	collection,
	query,
	getDocs,
	doc,
	CollectionReference,
	updateDoc,
} from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import HomeButton from "../../components/HomeButton/HomeButton";
import { getEndOfDay, getStartOfDay } from "../../utils";
import { ToDo } from "../../types";

export async function updateToDoStatusInDatabase(
	todoId: string,
	newStatus: string
) {
	const patientRef = doc(db, "patientdetails", "patient@patient.com");
	const todoRef = doc(patientRef, "todos", todoId);
	await updateDoc(todoRef, { toDoStatus: newStatus });
}

const ToDoPage: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [todos, setTodos] = useState<ToDo[]>([]);
	const [loading, setLoading] = useState(true);

	function getTodosForSelectedDate(todo: ToDo) {
		const startOfDay = getStartOfDay(selectedDate);
		const endOfDay = getEndOfDay(selectedDate);
		const todoStartDate = todo.startDate.toDate();
		const todoEndDate = todo.endDate
			? todo.endDate.toDate()
			: todoStartDate;
		const isWithinDateRange =
			startOfDay <= todoEndDate && endOfDay >= todoStartDate;

		const dayOfWeek = selectedDate.toLocaleString("en-us", {
			weekday: "long",
		});
		const repeatsOnDay = todo.daysOfWeek
			? todo.daysOfWeek.includes(dayOfWeek)
			: false;
		const isStartDateOnlyMatch =
			!todo.endDate &&
			todoStartDate.toDateString() === selectedDate.toDateString();
		return isWithinDateRange || repeatsOnDay || isStartDateOnlyMatch;
	}

	const groupTodosByCategory = (todos: ToDo[]): { [key: string]: ToDo[] } => {
		const grouped: { [key: string]: ToDo[] } = {};
		todos.forEach((todo) => {
			const category = todo.category || "Others";
			if (!grouped[category]) {
				grouped[category] = [];
			}
			grouped[category].push(todo);
		});
		return grouped;
	};

	const groupedTodos = groupTodosByCategory(todos);

	function createTodoQuery() {
		const toDoCollectionRef = collection(
			doc(db, "patientdetails", "patient@patient.com"),
			"todos"
		) as CollectionReference<ToDo>;
		return query(toDoCollectionRef);
	}

	useEffect(() => {
		async function fetchTodos() {
			try {
				const toDosFromFirebase = await getDocs(createTodoQuery());
				const fetchedTodos = toDosFromFirebase.docs
					.map((doc) => ({
						...doc.data(),
						id: doc.id,
					}))
					.filter((todo) => {
						return getTodosForSelectedDate(todo);
					});

				setTodos(fetchedTodos);
			} catch (error) {
				console.error("Error fetching appointments: ", error);
			}
			setLoading(false);
		}
		fetchTodos();
	}, [selectedDate]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="ToDo" />
			<div className="pageWrapper">
				<div className={styles.fullWrapper}>
					<DatePickerComponent
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
					<div>
						<h2>Todos for {selectedDate.toDateString()}</h2>
						{Object.keys(groupedTodos).map((category) => (
							<div
								key={category}
								className={styles.categoryStyle}
							>
								<h3>{category}</h3>
								<div className={styles.toDoTileMargin}>
									{groupedTodos[category].map((todo) => (
										<div
											className={styles.toDoTile}
											key={todo.id}
										>
											<ToDoTile
												toDoId={todo.id}
												toDoTitle={todo.title}
												toDoDescription={
													todo.description
												}
												toDoComment={""}
												taskStatus={todo.toDoStatus}
												time={todo.time || ""}
											/>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default ToDoPage;
