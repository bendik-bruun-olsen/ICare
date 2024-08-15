import { useEffect, useState } from "react";
import { Icon, Checkbox } from "@equinor/eds-core-react";
import { more_horizontal } from "@equinor/eds-icons";
import styles from "./ToDoTile.module.css";
import { ToDoStatus } from "../../types";
import { updateToDoStatusInDatabase } from "../../firebase/todoServices/updateTodo";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";
import { useNotification } from "../../context/NotificationContext";

interface ToDoTileProps {
	toDoTitle: string;
	toDoDescription: string;
	time: string;
	taskStatus: ToDoStatus;
	todoId: string;
	seriesId: string | null;
	selectedDate: Date;
	onStatusChange: (todoId: string, newStatus: ToDoStatus) => void;
}

export default function ToDoTile({
	todoId,
	toDoTitle,
	toDoDescription,
	taskStatus,
	time,
	seriesId,
	selectedDate,
	onStatusChange,
}: ToDoTileProps) {
	const [currentTaskStatus, setCurrentTaskStatus] =
		useState<ToDoStatus>(taskStatus);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleModalVisibility = () => {
		setIsModalOpen((prev) => !prev);
	};
	const { addNotification } = useNotification();

	function chooseTileStyle(currentToDoStatus: ToDoStatus) {
		if (currentToDoStatus === ToDoStatus.checked) return styles.checked;
		if (currentToDoStatus === ToDoStatus.ignore)
			return styles.notApplicable;
		return styles.default;
	}

	const handleStatusChange = async (newStatus: ToDoStatus) => {
		setCurrentTaskStatus(newStatus);
		await updateToDoStatusInDatabase(todoId, newStatus, addNotification);
		onStatusChange(todoId, newStatus);
	};

	return (
		<div className={styles.checkboxAndToDoTileWrapper}>
			<Checkbox
				checked={currentTaskStatus === ToDoStatus.checked}
				onChange={() =>
					handleStatusChange(
						currentTaskStatus === ToDoStatus.checked
							? ToDoStatus.unchecked
							: ToDoStatus.checked
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
										onClick={() => (
											handleStatusChange(
												currentTaskStatus ===
													ToDoStatus.ignore
													? ToDoStatus.unchecked
													: ToDoStatus.ignore
											),
											toggleModalVisibility()
										)}
									>
										<p>
											{currentTaskStatus ===
											ToDoStatus.ignore
												? "Mark as applicable"
												: "Mark as N/A"}
										</p>
									</li>
									<li className={styles.modalItem}>
										<Link
											to={Paths.EDIT_TODO_ITEM.replace(
												":todoId",
												todoId
											)}
											state={{ selectedDate }}
										>
											<p>Edit/Delete This Task</p>
										</Link>
									</li>
									{seriesId && (
										<li className={styles.modalItem}>
											<Link
												to={Paths.EDIT_TODO_SERIES.replace(
													":seriesId",
													seriesId
												)}
												state={{ selectedDate }}
											>
												<p>
													Edit/Delete All Tasks In
													Series
												</p>
											</Link>
										</li>
									)}
								</ul>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
