import { useState } from "react";
import { Icon, Checkbox, Chip } from "@equinor/eds-core-react";
// import {
// 	layers,
// 	copy,
// 	list,
// 	repeat,
// 	bookmark_collection,
// 	library_books,
// 	receipt,
// } from "@equinor/eds-icons";
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
		onStatusChange(todoId, newStatus);
		await updateToDoStatusInDatabase(todoId, newStatus, addNotification);
	};

	const chipMapping = {
		[ToDoStatus.checked]: { variant: "active", label: "Completed" },
		[ToDoStatus.unchecked]: { variant: "default", label: "Active" },
		[ToDoStatus.ignore]: { variant: "error", label: "Ignored" },
	};
	const currentChip = chipMapping[currentTaskStatus];

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
				disabled={currentTaskStatus === ToDoStatus.ignore}
			/>
			<div
				className={`${styles.toDoWrapper} ${chooseTileStyle(
					currentTaskStatus
				)}`}
			>
				<div className={styles.titleSection}>
					<div className={styles.titleContainer}>
						<h2>{`${time} - ${toDoTitle}`}</h2>
						{/* <Icon data={library_books} size={24} /> */}
					</div>
					<Chip
						variant={
							currentChip.variant as
								| "default"
								| "active"
								| "error"
						}
					>
						{currentChip.label}
					</Chip>
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
