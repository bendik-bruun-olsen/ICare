import { useState } from "react";
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

	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModalVisibility = () => {
		setIsModalOpen((prev) => !prev);
	};

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
					<Icon
						data={more_horizontal}
						size={40}
						className={styles.moreIcon}
						onClick={toggleModalVisibility}
					/>
					{isModalOpen && (
						<>
							<div
								className={styles.modalOverlay}
								onClick={toggleModalVisibility}
							></div>
							<div
								className={styles.modalContainer}
								onClick={(e) => e.stopPropagation()}
							>
								<ul className={styles.modalList}>
									<li className={styles.modalItem}>
										<p>Mark as Incomplete</p>
									</li>
									<li className={styles.modalItem}>
										<p>Edit/Delete </p>
									</li>
									<li className={styles.modalItem}>
										<p>Add Comment</p>
									</li>
								</ul>
							</div>
						</>
					)}
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
