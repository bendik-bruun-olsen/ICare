import { Icon } from "@equinor/eds-core-react";
import { restaurant, group, walk, placeholder_icon } from "@equinor/eds-icons";
import styles from "./ToDoHome.module.css";

export default function ToDoHome() {
	const icons = {
		food: restaurant,
		social: group,
		exercise: walk,
		medicine: placeholder_icon,
	};

	return (
		<div className={styles.toDoWrapper}>
			<div className={styles.flexContainer}>
				<div>
					<h1 className={styles.toDoText}>Category</h1>
					<p>0/5 tasks</p>
				</div>
				<div className={styles.icon}>
					<Icon
						data={icons.food}
						size={48}
						color={"#F5F5F5"}
						className={styles.iconOpacity}
					></Icon>
				</div>
			</div>
		</div>
	);
}
