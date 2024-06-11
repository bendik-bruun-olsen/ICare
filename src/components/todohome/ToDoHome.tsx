import { Icon } from "@equinor/eds-core-react";
import { restaurant, group, walk, placeholder_icon } from "@equinor/eds-icons";
import styles from "./ToDoHome.module.css";

export default function ToDoHome() {
	const icons = {
		restaurant: restaurant,
		group: group,
		walk: walk,
		placeholder_icon: placeholder_icon,
	};

	return (
		<div className={styles.ToDoWrapper}>
			<div>
				<h1 className={styles.ToDoText}>Category</h1>
				<h1>0/5 tasks</h1>
			</div>
			<div className={styles.Icon}>
				<Icon data={restaurant} size={48}></Icon>
			</div>
		</div>
	);
}
