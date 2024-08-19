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
import { Paths } from "../../paths";

const ToDoPage: React.FC = () => {
	const location = useLocation();
	const initialDate = location.state
		? new Date(location.state.selectedDate)
		: new Date();
	const [selectedDate, setSelectedDate] = useState(initialDate);
	const [categorizedTodos, setCategorizedTodos] = useState<{
		[key: string]: TodoItemInterface[];
	}>({});
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
					const groupedTodos = groupTodosByCategory(
						data as TodoItemInterface[]
					);
					const sortedTodosGroup = sortTodosGroup(groupedTodos);
					setCategorizedTodos(sortedTodosGroup);
				}
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [selectedDate]);

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
						{Object.keys(categorizedTodos).map((category) => (
							<div
								key={category}
								className={styles.categoryStyle}
							>
								<h3>{category}</h3>
								<div className={styles.toDoTileMargin}>
									{categorizedTodos[category].map((todo) => (
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
												onStatusChange={
													handleStatusChange
												}
											/>
										</div>
									))}
								</div>
							</div>
						))}
						<Link to={Paths.ADD_TODO}>
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
