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
		<div className={styles.ToDoWrapper}>
			<div>
				<h1 className={styles.ToDoText}>Category</h1>
				<h1>0/5 tasks</h1>
			</div>
			<div className={styles.Icon}>
				<Icon
					data={icons.food}
					size={48}
					color={"#F5F5F5"}
					className={styles.IconOpacity}
				></Icon>
			</div>
		</div>
	);
}
