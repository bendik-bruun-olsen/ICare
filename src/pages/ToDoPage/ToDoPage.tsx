import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@equinor/eds-core-react";
import DateSelector from "../../components/DateSelector/DateSelector";
import ToDoTile from "../../components/ToDoTile/ToDoTile";
import styles from "./ToDoPage.module.css";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import { groupTodosByCategory, sortTodosGroup } from "../../utils";
import { TodoItemInterface, ToDoStatus } from "../../types";
import { Link, useLocation } from "react-router-dom";
import { getTodosBySelectedDate } from "../../firebase/todoServices/getTodo";
import { useNotification } from "../../hooks/useNotification";
import ErrorPage from "../ErrorPage/ErrorPage";
<<<<<<< HEAD
import Loading from "../../components/Loading/Loading";
=======
import { Paths } from "../../paths";
>>>>>>> development

const ToDoPage: React.FC = () => {
	const location = useLocation();
	const initialDate = location.state
		? new Date(location.state.selectedDate)
		: new Date();
	const [selectedDate, setSelectedDate] = useState(initialDate);
<<<<<<< HEAD
	const [todos, setTodos] = useState<TodoItemInterface[]>([]);
=======
	const [categorizedTodos, setCategorizedTodos] = useState<{
		[key: string]: TodoItemInterface[];
	}>({});
>>>>>>> development
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!selectedDate) return setHasError(true);

		async function fetchData() {
			setIsLoading(true);
			try {
				const data = await getTodosBySelectedDate(
					selectedDate,
					addNotification
				);
				if (data) {
<<<<<<< HEAD
					setTodos(data as TodoItemInterface[]);
=======
					const groupedTodos = groupTodosByCategory(
						data as TodoItemInterface[]
					);
					const sortedTodosGroup = sortTodosGroup(groupedTodos);
					setCategorizedTodos(sortedTodosGroup);
>>>>>>> development
				}
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [selectedDate]);

<<<<<<< HEAD
	const groupedTodos = groupTodosByCategory(todos);

	if (hasError) return <ErrorPage />;
	if (isLoading)
		return (
			<>
				<Navbar leftContent={<BackHomeButton />} centerContent="ToDo" />
				<Loading />
			</>
		);
=======
	const handleStatusChange = async (
		todoId: string,
		newStatus: ToDoStatus
	) => {
		if (!categorizedTodos) return;

		const flattenedTodos = Object.values(categorizedTodos).flat();
		const todoIndex = flattenedTodos.findIndex(
			(todo) => todo.id === todoId
		);
		if (todoIndex === -1) return;
		const updatedTodo = { ...flattenedTodos[todoIndex], status: newStatus };
		flattenedTodos[todoIndex] = updatedTodo;
		const updatedGroupedTodos = groupTodosByCategory(flattenedTodos);
		const updatedSortedTodosGroup = sortTodosGroup(updatedGroupedTodos);
		setCategorizedTodos(updatedSortedTodosGroup);
	};

	if (isLoading) return <CircularProgress />;
	if (hasError) return <ErrorPage />;
>>>>>>> development
	return (
		<>
			<Navbar leftContent={<BackHomeButton />} centerContent="ToDo" />
			<div className={"pageWrapper " + styles.fullPage}>
				<div className={styles.fullPage}>
					<DateSelector
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
					<div>
<<<<<<< HEAD
						{Object.keys(groupedTodos).map((category) => (
=======
						{Object.keys(categorizedTodos).map((category) => (
>>>>>>> development
							<div
								key={category}
								className={styles.categoryStyle}
							>
								<h3>{category}</h3>
								<div className={styles.toDoTileMargin}>
<<<<<<< HEAD
									{groupedTodos[category].map((todo) => (
=======
									{categorizedTodos[category].map((todo) => (
>>>>>>> development
										<div
											className={styles.toDoTile}
											key={todo.id}
										>
											<ToDoTile
												todoId={todo.id}
												toDoTitle={todo.title}
												toDoDescription={
													todo.description
												}
												taskStatus={todo.status}
												time={todo.time}
												seriesId={todo.seriesId}
												selectedDate={selectedDate}
<<<<<<< HEAD
=======
												onStatusChange={
													handleStatusChange
												}
>>>>>>> development
											/>
										</div>
									))}
								</div>
							</div>
						))}
<<<<<<< HEAD
						<Link to="/add-todo">
=======
						<Link to={Paths.ADD_TODO}>
>>>>>>> development
							<div className={styles.addIcon}>
								<Button variant="contained_icon">
									<Icon data={add} size={32} />
								</Button>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default ToDoPage;
