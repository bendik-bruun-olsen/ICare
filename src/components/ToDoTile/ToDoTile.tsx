import { useEffect, useRef, useState } from "react";
import { Icon, Checkbox, Chip, Button } from "@equinor/eds-core-react";
import { arrow_back_ios, arrow_forward_ios, repeat } from "@equinor/eds-icons";
import styles from "./ToDoTile.module.css";
import { TodoItemInterface, ToDoStatus } from "../../types";
import { updateToDoStatusInDatabase } from "../../firebase/todoServices/updateTodo";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";
import { useNotification } from "../../hooks/useNotification";
import { capitalizeUsername } from "../../utils";
import { getNameFromEmail } from "../../firebase/userServices/getNameFromEmail";
import { useAuth } from "../../hooks/useAuth/useAuth";

interface ToDoTileProps {
	selectedDate: Date;
	todoItem: TodoItemInterface;
	onStatusChange: (todoId: string, newStatus: ToDoStatus) => void;
}

enum overflowStatus {
	hidden = "hidden",
	visible = "visible",
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
	const optionsIconRef = useRef<SVGSVGElement>(null);
	const [displayDropdownAbove, setDisplayDropdownAbove] = useState(false);
	const [createdByName, setCreatedByName] = useState("Unknown");
	const [completedBy, setCompletedBy] = useState<string | null>(
		todoItem.completedBy
	);
	const [isMenuExpanded, setIsMenuExpanded] = useState(false);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const defaultContentMaxHeight = 65;
	const [contentMaxHeight, setContentMaxHeight] = useState("30px");
	const [contentContainerOverflow, setContentContainerOverflow] = useState(
		overflowStatus.hidden
	);
	const currentUser = useAuth().userData?.email;

	useEffect(() => {
		const fetchNameFromEmail = async () => {
			if (completedBy) {
				const name = await getNameFromEmail(completedBy);
				if (name) {
					setCompletedBy(name);
				}
			}
		};
		fetchNameFromEmail();
	}, [completedBy]);

	useEffect(() => {
		const fetchNameFromEmail = async () => {
			const name = await getNameFromEmail(todoItem.createdBy);
			if (name) {
				setCreatedByName(name);
			}
		};
		fetchNameFromEmail();
	}, [todoItem.createdBy]);

	function chooseTileStyle(currentToDoStatus: ToDoStatus) {
		if (currentToDoStatus === ToDoStatus.checked) return styles.checked;
		if (currentToDoStatus === ToDoStatus.ignore) return styles.notApplicable;
		return styles.default;
	}

	const setOverflowStatus = () => {
		if (isMenuExpanded) {
			setTimeout(() => {
				setContentContainerOverflow(overflowStatus.visible);
			}, 300);
		}
		if (!isMenuExpanded) {
			setContentContainerOverflow(overflowStatus.hidden);
		}
	};

	useEffect(() => {
		setOverflowStatus();
		if (isMenuExpanded && contentContainerRef.current) {
			setContentMaxHeight(`${contentContainerRef.current.scrollHeight}px`);
		}
		if (!isMenuExpanded && contentContainerRef.current) {
			if (
				descriptionRef.current &&
				descriptionRef.current.scrollHeight < defaultContentMaxHeight
			) {
				setContentMaxHeight(`${descriptionRef.current.scrollHeight}px`);
				return;
			}
			setContentMaxHeight(`${defaultContentMaxHeight}px`);
		}
	}, [isMenuExpanded]);

	const handleOptionsClick = () => {
		if (optionsIconRef.current) {
			const rect = optionsIconRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			setDisplayDropdownAbove(spaceBelow < 180);
		}
		setIsModalOpen((prev) => !prev);
	};

	const handleStatusChange = async (newStatus: ToDoStatus) => {
		if (!currentUser) return;
		if (newStatus === "checked") {
			setCompletedBy(currentUser);
		} else {
			setCompletedBy(null);
		}

		setCurrentTaskStatus(newStatus);
		onStatusChange(todoItem.id, newStatus);
		await updateToDoStatusInDatabase(
			todoItem.id,
			newStatus,
			currentUser,
			addNotification
		);
	};

	const handleMenuExpand = () => {
		setIsMenuExpanded((prev) => !prev);
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
				<div className={styles.tags}>
					{todoItem.seriesId && (
						<div className={styles.seriesIconContainer}>
							<Icon data={repeat} size={16} />
						</div>
					)}
					<div
						className={
							currentChip.variant === "error" ? "" : styles.chipOutline
						}
					>
						<Chip
							variant={currentChip.variant as "default" | "active" | "error"}
						>
							{currentChip.label}
						</Chip>
					</div>
				</div>
				<h3 className={styles.title}>
					{`${todoItem.time} - ${todoItem.title}`}
				</h3>
				<div
					className={styles.contentContainer}
					style={{
						maxHeight: contentMaxHeight,
						overflow: contentContainerOverflow,
					}}
					ref={contentContainerRef}
				>
					<p className={styles.description} ref={descriptionRef}>
						{todoItem.description}
					</p>
					<div className={styles.metaDataAndOptionsContainer}>
						<div className={styles.metaDataContainer}>
							{completedBy && (
								<span className={styles.metaDataText}>
									{`Completed by ${capitalizeUsername(createdByName)}`}
								</span>
							)}
							<span className={styles.metaDataText}>
								{`Created by ${capitalizeUsername(createdByName)}`}
							</span>
						</div>
						<div className={styles.optionsMenuContainer}>
							<Button onClick={handleOptionsClick} ref={optionsIconRef}>
								Options
							</Button>
							{isModalOpen && (
								<>
									<div
										className={styles.modalOverlay}
										onClick={handleOptionsClick}
									></div>
									<div
										className={`${styles.modalContainer} ${
											displayDropdownAbove ? styles.dropdownAbove : ""
										}`}
										onClick={(e) => e.stopPropagation()}
									>
										<ul className={styles.modalList}>
											<li
												className={styles.modalItem}
												onClick={() =>
													handleStatusChange(
														currentTaskStatus === ToDoStatus.ignore
															? ToDoStatus.unchecked
															: ToDoStatus.ignore
													)
												}
											>
												<p>
													{currentTaskStatus === ToDoStatus.ignore
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
														state={{
															selectedDate,
														}}
													>
														<p>Edit/Delete All Tasks In Series</p>
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
				<div
					className={styles.expandMenuButtonContainer}
					onClick={handleMenuExpand}
				>
					<Button className={styles.expandMenuButton} variant={"ghost_icon"}>
						<Icon data={isMenuExpanded ? arrow_back_ios : arrow_forward_ios} />
					</Button>
				</div>
			</div>
		</div>
	);
}
