import { useEffect, useRef, useState } from "react";
import { Icon, Checkbox, Chip } from "@equinor/eds-core-react";
import { more_horizontal, repeat } from "@equinor/eds-icons";
import styles from "./ToDoTile.module.css";
import { TodoItemInterface, ToDoStatus } from "../../types";
import { updateToDoStatusInDatabase } from "../../firebase/todoServices/updateTodo";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";
import { useNotification } from "../../hooks/useNotification";
import { capitalizeUsername } from "../../utils";
import { getNameFromEmail } from "../../firebase/userServices/getNameFromEmail";

interface ToDoTileProps {
	selectedDate: Date;
	todoItem: TodoItemInterface;
	onStatusChange: (todoId: string, newStatus: ToDoStatus) => void;
}

export default function ToDoTile({
	selectedDate,
	todoItem,
	onStatusChange,
}: ToDoTileProps) {
	const [currentTaskStatus, setCurrentTaskStatus] = useState<ToDoStatus>(
		todoItem.status
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { addNotification } = useNotification();
	const moreIconRef = useRef<SVGSVGElement>(null);
	const [displayDropdownAbove, setDisplayDropdownAbove] = useState(false);
	const [createdByName, setCreatedByName] = useState("Unknown");
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	useEffect(() => {
		const fetchName = async () => {
			const result = await getNameFromEmail(todoItem.createdBy);
			if (result) {
				setCreatedByName(result);
			}
		};
		fetchName();
	}, [todoItem.createdBy]);

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
		onStatusChange(todoItem.id, newStatus);
		await updateToDoStatusInDatabase(
			todoItem.id,
			newStatus,
			addNotification
		);
	};

	const chipMapping = {
		[ToDoStatus.checked]: { variant: "active", label: "Completed" },
		[ToDoStatus.unchecked]: { variant: "default", label: "Active" },
		[ToDoStatus.ignore]: { variant: "error", label: "Ignored" },
	};
	const currentChip = chipMapping[currentTaskStatus];

	const titleLimit = 60;
	const isTitleLong = todoItem.title.length > titleLimit;
	const displayedTitle = isTitleLong
		? todoItem.title.slice(0, titleLimit) + "..."
		: todoItem.title;

	const descriptionLimit = 100;
	const isDescriptionLong = todoItem.description.length > descriptionLimit;
	const displayedDescription = isDescriptionExpanded
		? todoItem.description
		: todoItem.description.slice(0, descriptionLimit) + "...";

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
				<div className={styles.tags}>
					{todoItem.seriesId && (
						<div className={styles.seriesIconContainer}>
							<Icon data={repeat} size={16} />
						</div>
					)}
					<div
						className={
							currentChip.variant === "error"
								? ""
								: styles.chipOutline
						}
					>
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
				</div>
				<h3 className={styles.title}>
					{`${todoItem.time} - ${displayedTitle}`}
				</h3>
				<p className={styles.description}>
					{displayedDescription}
					{isDescriptionLong && (
						<>
							<span
								className={styles.showMore}
								onClick={() =>
									setIsDescriptionExpanded((prev) => !prev)
								}
							>
								{isDescriptionExpanded
									? " show less"
									: " show more"}
							</span>
						</>
					)}
				</p>
				<div className={styles.menuContainer}>
					<span
						className={styles.createdBy}
					>{`Created by ${capitalizeUsername(createdByName)}`}</span>
					<Icon
						data={more_horizontal}
						size={40}
						className={styles.menuIcon}
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
												todoItem.id
											)}
											state={{ selectedDate }}
										>
											<p>Edit/Delete This Task</p>
										</Link>
									</li>
									{todoItem.seriesId && (
										<li className={styles.modalItem}>
											<Link
												to={Paths.EDIT_TODO_SERIES.replace(
													":seriesId",
													todoItem.seriesId
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
