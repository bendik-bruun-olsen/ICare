import { Icon } from "@equinor/eds-core-react";
import { IconData } from "@equinor/eds-icons";
import styles from "./RemainingTodos.module.css";

interface PropData {
	categoryTitle: string;
	completedTodosCount: number;
	allTodosCount: number;
	icon: IconData;
}

export default function RemainingTodoItem({
	categoryTitle,
	completedTodosCount,
	allTodosCount,
	icon,
}: PropData): JSX.Element {
	return (
		<div className={styles.toDoWrapper}>
			<div className={styles.flexContainer}>
				<div>
					<h3 className={styles.toDoText}>{categoryTitle}</h3>
					<p>
						{completedTodosCount}/{allTodosCount} tasks
					</p>
				</div>
				<div className={styles.icon}>
					<Icon
						data={icon}
						size={24}
						color={"#2c8891"}
						className={styles.iconOpacity}
					></Icon>
				</div>
			</div>
		</div>
	);
}
