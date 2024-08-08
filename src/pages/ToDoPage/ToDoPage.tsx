import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@equinor/eds-core-react";
import DateSelector from "../../components/DateSelector/DateSelector";
import ToDoTile from "../../components/ToDoTile/ToDoTile";
import styles from "./ToDoPage.module.css";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import { groupTodosByCategory } from "../../utils";
import { TodoItemInterface } from "../../types";
import { Link } from "react-router-dom";
import { getTodosBySelectedDate } from "../../firebase/todoServices/getTodo";
import { useNotification } from "../../context/NotificationContext";
import ErrorPage from "../ErrorPage/ErrorPage";

const ToDoPage: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [todos, setTodos] = useState<TodoItemInterface[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (!selectedDate) {
			setIsLoading(false);
			setHasError(true);
			return;
		}
		async function fetchData() {
			setIsLoading(true);
			const data = await getTodosBySelectedDate(
				selectedDate,
				addNotification
			);
			if (data) {
				setTodos(data as TodoItemInterface[]);
			}
		}
		fetchData();
		setIsLoading(false);
	}, [selectedDate]);

	const groupedTodos = groupTodosByCategory(todos);

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
												todoId={todo.id}
												toDoTitle={todo.title}
												toDoDescription={
													todo.description
												}
												toDoComment={todo.comment}
												taskStatus={todo.status}
												time={todo.time}
												seriesId={todo.seriesId}
											/>
										</div>
									))}
								</div>
							</div>
						))}
						<Link to="/add-todo">
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
