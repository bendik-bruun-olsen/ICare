import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@equinor/eds-core-react";
import DateSelector from "../../components/DateSelector/DateSelector";
import ToDoTile from "../../components/ToDoTile/ToDoTile";
import styles from "./ToDoPage.module.css";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import { getDocs } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import { groupTodosByCategory, getToDosForSelectedDate } from "../../utils";
import { ToDo } from "../../types";
import { Link } from "react-router-dom";
import { getAllTodos } from "../../firebase/todoServices/getTodo";

const ToDoPage: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [todos, setTodos] = useState<ToDo[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchTodos = async () => {
			setLoading(true);
			try {
				// const toDosFromFirebase = await getDocs(createTodoQuery());
				// const fetchedTodos = toDosFromFirebase.docs
				// 	.map((doc) => ({
				// 		...doc.data(),
				// 		id: doc.id,
				// 	}))
				// 	.filter((todo) => {
				// 		return getToDosForSelectedDate(selectedDate, todo);
				// 	});
				const fetchedTodos = await getAllTodos();

				console.log(fetchedTodos);

				// setTodos(fetchedTodos);
			} catch (error) {
				console.error("Error fetching todos: ", error);
			} finally {
				setLoading(false);
			}
		};
		fetchTodos();
	}, [selectedDate]);

	if (loading) {
		return <CircularProgress />;
	}
	const groupedTodos = groupTodosByCategory(todos);
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
