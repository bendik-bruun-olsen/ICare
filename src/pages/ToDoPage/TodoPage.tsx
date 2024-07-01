import React, { useState, useEffect } from "react";
import DatePickerComponent from "../../components/DatePicker/DatePickerComponent";
import { db } from "../../firebase/firebase";
import {
	collection,
	query,
	where,
	getDocs,
	Timestamp,
	doc,
	CollectionReference,
} from "firebase/firestore";
import TaskContainer from "../../components/TaskContainer/TaskContainer";

enum ToDoState {
	Complete = "completed",
	Uncompleted = "uncompleted",
	Disabled = "disabled",
}

interface ToDo {
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
	const [todos, setTodos] = useState<ToDo[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const todoRef = collection(
					doc(db, "patientdetails", "patient@patient.com"),
					"todos"
				) as CollectionReference<ToDo>;

				const startOfDay = new Date(selectedDate);
				startOfDay.setHours(0, 0, 0, 0);
				const endOfDay = new Date(selectedDate);
				endOfDay.setHours(23, 59, 59, 999);

				const q = query(
					todoRef,
					where("startDate", "<=", Timestamp.fromDate(endOfDay))
				);
				const querySnapshot = await getDocs(q);
				const fetchedTodos = querySnapshot.docs
					.map((doc) => ({
						...doc.data(),
						id: doc.id,
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
			setLoading(false);
		};

		fetchTodos();
	}, [selectedDate]);

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

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<DatePickerComponent
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
			/>
			<div>
				<h1>{todos[0]?.title || "No Todos"}</h1>
				<h2>Todos for {selectedDate.toDateString()}</h2>
				{Object.keys(groupedTodos).map((category) => (
					<div key={category}>
						<h3>{category}</h3>
						{groupedTodos[category].map((todo) => (
							<TaskContainer
								key={todo.id}
								toDoTitle={todo.title}
								toDoDescription={todo.description}
								toDoComment={""}
								taskStatus={"default"}
								time={todo.time || ""}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default TodoPage;
