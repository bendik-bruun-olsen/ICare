import { useRef, useState } from "react";
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
import { useNotification } from "../../hooks/useNotification";

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
	const { addNotification } = useNotification();
	const moreIconRef = useRef<SVGSVGElement>(null);
	const [displayDropdownAbove, setDisplayDropdownAbove] = useState(false);

	function chooseTileStyle(currentToDoStatus: ToDoStatus) {
		if (currentToDoStatus === ToDoStatus.checked) return styles.checked;
		if (currentToDoStatus === ToDoStatus.ignore)
			return styles.notApplicable;
		return styles.default;
	}

	const handleMenuClick = () => {
		if (moreIconRef.current) {
			const rect = moreIconRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			setDisplayDropdownAbove(spaceBelow < 180);
		}
		setIsModalOpen((prev) => !prev);
	};

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
					<div className={styles.menuIconContainer}>
						<Icon
							data={more_horizontal}
							size={40}
							className={styles.moreIcon}
							onClick={handleMenuClick}
							ref={moreIconRef}
						/>
						{isModalOpen && (
							<>
								<div
									className={styles.modalOverlay}
									onClick={handleMenuClick}
								></div>
								<div
									className={`${styles.modalContainer} ${
										displayDropdownAbove
											? styles.dropdownAbove
											: ""
									}`}
									onClick={(e) => e.stopPropagation()}
								>
									<ul className={styles.modalList}>
										<li
											className={styles.modalItem}
											onClick={() =>
												handleStatusChange(
													currentTaskStatus ===
														ToDoStatus.ignore
														? ToDoStatus.unchecked
														: ToDoStatus.ignore
												)
											}
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
		</div>
	);
}
