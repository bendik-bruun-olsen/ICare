import styles from "./TaskContainer.module.css";
import { Icon } from "@equinor/eds-core-react";
import { comment, more_horizontal, badge } from "@equinor/eds-icons";

export default function TaskContainer() {
	return (
		<div className={styles.ToDoWrapper}>
			<div>
				<h1>08:00 - Morning Walk</h1>
			</div>
			<div className={styles.DescriptionSection}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
					elementum tempor facilisis.
				</p>
				<Icon data={more_horizontal} size={48} className={styles.moreIcon} />
			</div>
			<div className={styles.CommentWrapper}>
				<div className={styles.CommentSection}>
					<div className={styles.iconContainer}>
						<Icon data={comment} size={16} />
					</div>
					<p>Comment</p>
				</div>
				<Icon data={badge} size={24} className={styles.badgeIcon} />
			</div>
		</div>
	);
}
