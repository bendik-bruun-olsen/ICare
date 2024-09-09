import { Icon } from "@equinor/eds-core-react";
import {
	restaurant,
	group,
	walk,
	arrow_forward,
	hospital,
} from "@equinor/eds-icons";
import styles from "./RemainingTodos.module.css";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";
import RemainingTodoItem from "./RemainingTodoItem";

const todos = [
	{ category: "Food", completed: 3, all: 6, icon: restaurant },
	{ category: "Medicine", completed: 2, all: 5, icon: hospital },
	{ category: "Social", completed: 1, all: 1, icon: group },
	{ category: "Exercise", completed: 2, all: 3, icon: walk },
];

export default function RemainingTodos() {
	return (
		<div className={styles.remainingTodosOuterWrapper}>
			<div className={styles.titleWrapper}>
				<h2>ToDo</h2>
				<Link to={Paths.TODO}>
					<div className={styles.arrowIconWrapper}>
						<span>All Todos</span>
						<Icon data={arrow_forward} />
					</div>
				</Link>
			</div>
			<div className={styles.remainingTodosInnerWrapper}>
				{todos.map((todo) => {
					return (
						<RemainingTodoItem
							categoryTitle={todo.category}
							completedTodosCount={todo.completed}
							allTodosCount={todo.all}
							icon={todo.icon}
							key={todo.all}
						/>
					);
				})}
			</div>
		</div>
	);
}
