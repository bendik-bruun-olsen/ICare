import { Icon } from "@equinor/eds-core-react";
import { restaurant, group, walk, placeholder_icon } from "@equinor/eds-icons";
import styles from "./RemainingTodos.module.css";

type IconType =
	| typeof restaurant
	| typeof group
	| typeof walk
	| typeof placeholder_icon;

interface PropData {
	categoryTitle: string;
	completedTodosCount: number;
	allTodosCount: number;
	icon: IconType;
}

export default function RemainingTodoItem({
	categoryTitle,
	completedTodosCount,
	allTodosCount,
	icon,
}: PropData) {
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
