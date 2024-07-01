import { useState, useMemo } from "react";
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
	const [currentTaskStatus, setCurrentTaskStatus] = useState<
		"complete" | "incomplete" | "default"
	>(taskStatus);

	const statusClass = useMemo(() => {
		switch (currentTaskStatus) {
			case "complete":
				return styles.complete;
			case "incomplete":
				return styles.incomplete;
			default:
				return "";
		}
	}, [currentTaskStatus]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModalVisibility = () => {
		setIsModalOpen((prev) => !prev);
	};

	const handleTaskStatus = (
		newStatus: "complete" | "incomplete" | "default"
	) => {
		setCurrentTaskStatus(newStatus);
	};

	return (
		<div className={styles.fullWrapper}>
			<div className={styles.checkBoxWrapper}>
				<Checkbox
					className={styles.checkBox}
					checked={currentTaskStatus === "complete"}
					onChange={(e) =>
						handleTaskStatus(e.target.checked ? "complete" : "default")
					}
				/>
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
									<li
										className={styles.modalItem}
										onClick={() =>
											handleTaskStatus(
												currentTaskStatus === "incomplete"
													? "default"
													: "incomplete"
											)
										}
									>
										<p>
											{currentTaskStatus === "incomplete"
												? "Mark as in progress"
												: "Mark as incomplete"}
										</p>
									</li>
									<li className={styles.modalItem}>
										<p>Edit/Delete</p>
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
