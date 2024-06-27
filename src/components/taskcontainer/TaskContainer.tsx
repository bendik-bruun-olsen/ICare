import { Icon, Checkbox } from "@equinor/eds-core-react";
import { comment, more_horizontal } from "@equinor/eds-icons";
import styles from "./TaskContainer.module.css";

interface TaskContainerProps {
	toDoTitle: string;
	toDoDescription: string;
	toDoComment: string;
	taskStatus: "complete" | "incomplete" | "default";
	time: string;
}

export default function TaskContainer({
	toDoTitle,
	toDoDescription,
	toDoComment,
	taskStatus,
	time,
}: TaskContainerProps) {
	const statusClass = styles[`${taskStatus}Background`];

	return (
		<div className={styles.fullWrapper}>
			<div className={styles.checkBoxWrapper}>
				<Checkbox className={styles.checkBox} />
			</div>
			<div className={`${styles.toDoWrapper} ${statusClass}`}>
				<div className={styles.titleText}>
					<h1>
						{time} - {toDoTitle}
					</h1>
				</div>
				<div className={styles.descriptionSection}>
					<p>{toDoDescription}</p>
					<Icon data={more_horizontal} size={40} className={styles.moreIcon} />
				</div>
				<div className={styles.commentWrapper}>
					<div className={styles.commentSection}>
						<div className={styles.iconContainer}>
							<Icon data={comment} size={16} />
						</div>
						<p>{toDoComment}</p>
					</div>
				</div>
			</div>
		</div>
	);
}