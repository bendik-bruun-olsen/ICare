import { useEffect, useState } from "react";
import { Icon, Checkbox } from "@equinor/eds-core-react";
import { more_horizontal } from "@equinor/eds-icons";
import styles from "./ToDoTile.module.css";
import { ToDoStatus } from "../../types";
import { updateToDoStatusInDatabase } from "../../pages/ToDoPage/ToDoPage";

interface ToDoTileProps {
	toDoTitle: string;
	toDoDescription: string;
	toDoComment: string;
	time: string;
	taskStatus: ToDoStatus;
	toDoId: string;
}

export default function ToDoTile({
	toDoId,
	toDoTitle,
	toDoDescription,
	// toDoComment,
	taskStatus,
	time,
}: ToDoTileProps) {
	const [currentTaskStatus, setCurrentTaskStatus] =
		useState<ToDoStatus>(taskStatus);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModalVisibility = () => {
		setIsModalOpen((prev) => !prev);
	};

	function chooseTileStyle(currentToDoStatus: ToDoStatus) {
		if (currentToDoStatus === ToDoStatus.Checked) return styles.checked;
		if (currentToDoStatus === ToDoStatus.NotApplicable)
			return styles.notApplicable;
		return styles.default;
	}

	useEffect(() => {
		updateToDoStatusInDatabase(toDoId, currentTaskStatus);
	}, [currentTaskStatus, toDoId]);

	return (
		<div className={styles.checkboxAndToDoTileWrapper}>
			<Checkbox
				checked={currentTaskStatus === ToDoStatus.Checked}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setCurrentTaskStatus(
						e.target.checked
							? ToDoStatus.Checked
							: ToDoStatus.Unchecked
					)
				}
			/>
			<div
				className={`${styles.toDoWrapper} ${chooseTileStyle(
					currentTaskStatus
				)}`}
			>
				<div className={styles.titleText}>
					<h2>
						{time} - {toDoTitle}
					</h2>
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
										onClick={() => {
											setCurrentTaskStatus((prev) =>
												prev ===
												ToDoStatus.NotApplicable
													? ToDoStatus.Unchecked
													: ToDoStatus.NotApplicable
											);
											toggleModalVisibility();
										}}
									>
										<p>
											{currentTaskStatus ===
											ToDoStatus.NotApplicable
												? "Mark as applicable"
												: "Mark as N/A"}
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
					{/* <div className={styles.commentSection}>
						<div className={styles.iconContainer}>
							<Icon data={comment} size={16} />
						</div>
						<p>{toDoComment}</p>
					</div> */}
				</div>
			</div>
		</div>
	);
}
