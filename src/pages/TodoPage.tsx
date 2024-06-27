import React, { useState, useEffect } from "react";
import DatePickerComponent from "../components/DatePicker/DatePickerComponent";
import { db } from "../firebase/firebase";
import {
	collection,
	query,
	where,
	getDocs,
	Timestamp,
	doc,
} from "firebase/firestore";

interface Todo {
	id: string;
	title: string;
	description: string;
	startDate: Timestamp;
	endDate?: Timestamp;
	daysOfWeek?: string[];
	time: string;
	category: string | null;
}

const TodoPage: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [todos, setTodos] = useState<Todo[]>([]);

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const todoRef = collection(
					doc(db, "patientdetails", "patient@patient.com"),
					"todos"
				);

				const startOfDay = new Date(selectedDate);
				startOfDay.setHours(0, 0, 0, 0);
				const endOfDay = new Date(selectedDate);
				endOfDay.setHours(23, 59, 59, 999);

				const q = query(
					todoRef,
					where("startDate", "<=", Timestamp.fromDate(endOfDay))
				);
				const querySnapshot = await getDocs(q);
				const fetchedTodos: Todo[] = querySnapshot.docs
					.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
					.filter((todo) => {
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
					});

				setTodos(fetchedTodos);
			} catch (error) {
				console.error("Error fetching appointments: ", error);
			}
		};

		fetchTodos();
	}, [selectedDate]);

	const groupTodosByCategory = (todos: Todo[]): { [key: string]: Todo[] } => {
		const grouped: { [key: string]: Todo[] } = {};
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

	return (
		<div>
			<DatePickerComponent
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
			/>
			<div>
				<h2>Appointments for {selectedDate.toDateString()}</h2>
				{Object.keys(groupedTodos).map((category) => (
					<div key={category}>
						<h3>{category}</h3>
						<ul>
							{groupedTodos[category].map((todo) => (
								<li key={todo.id}>
									<p>Title: {todo.title}</p>
									<p>Description: {todo.description}</p>
									{todo.time && <p>Time: {todo.time}</p>}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default TodoPage;
