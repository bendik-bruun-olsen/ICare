import { useContext, useEffect, useRef, useState } from "react";
import { Icon, Checkbox, Chip, Button } from "@equinor/eds-core-react";
import { arrow_back_ios, arrow_forward_ios, repeat } from "@equinor/eds-icons";
import styles from "./ToDoTile.module.css";
import { ToDo, ToDoStatus } from "../../types";
import { updateToDoStatusInDatabase } from "../../firebase/todoServices/updateTodo";
import { capitalizeUsername } from "../../utils";
import getNameFromEmail from "../../firebase/userServices/getNameFromEmail";
import { useAuth } from "../../hooks/useAuth/useAuth";
import TaskOptionsModal from "../TaskOptionsModal/TaskOptionsModal";
import { NotificationContext } from "../../context/NotificationContext";

interface ToDoTileProps {
	selectedDate: Date;
	todoItem: ToDo;
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
}: ToDoTileProps): JSX.Element {
	const [currentTaskStatus, setCurrentTaskStatus] = useState<ToDoStatus>(
		todoItem.status
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [displayDropdownAbove, setDisplayDropdownAbove] = useState(false);
	const [createdByName, setCreatedByName] = useState("Unknown");
	const [completedByName, setCompletedByName] = useState<string | null>(null);
	const [isMenuExpanded, setIsMenuExpanded] = useState(false);
	const [contentMaxHeight, setContentMaxHeight] = useState("30px");
	const [contentContainerOverflow, setContentContainerOverflow] = useState(
		overflowStatus.hidden
	);

	const { addNotification } = useContext(NotificationContext);
	const currentUser = useAuth().userData?.email;

	const contentContainerRef = useRef<HTMLDivElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const optionsIconRef = useRef<SVGSVGElement>(null);
	const overflowTimeoutRef = useRef<number | undefined>();

	const defaultContentMaxHeight = 65;

	useEffect(() => {
		const fetchNames = async (): Promise<void> => {
			if (todoItem.createdBy) {
				const name = await getNameFromEmail(todoItem.createdBy);
				if (name) {
					const capitalizedName = capitalizeUsername(name);
					setCreatedByName(capitalizedName);
				}
			}
			if (todoItem.completedBy) {
				const name = await getNameFromEmail(todoItem.completedBy);
				if (name) {
					const capitalizedName = capitalizeUsername(name);
					setCompletedByName(capitalizedName);
				}
			}
		};
		fetchNames();
	}, [todoItem.createdBy, todoItem.completedBy]);

	useEffect(() => {
		const fetchCompletedByNameUsingEmail = async (): Promise<void> => {
			if (todoItem.completedBy) {
				const name = await getNameFromEmail(todoItem.completedBy);
				if (name) {
					const capitalizedName = capitalizeUsername(name);
					setCompletedByName(capitalizedName);
				}
			}
		};
		fetchCompletedByNameUsingEmail();
	}, [todoItem.completedBy]);

	useEffect(() => {
		setOverflowStatus();
		if (isMenuExpanded && contentContainerRef.current) {
			setContentMaxHeight(`${contentContainerRef.current.scrollHeight}px`);
		}
		if (!isMenuExpanded && contentContainerRef.current) {
			if (descriptionRef.current) {
				const calculatedHeight =
					descriptionRef.current.scrollHeight < defaultContentMaxHeight
						? descriptionRef.current.scrollHeight
						: defaultContentMaxHeight;
				setContentMaxHeight(`${calculatedHeight}px`);
			}
		}
	}, [isMenuExpanded]);

	const setOverflowStatus = (): void => {
		if (overflowTimeoutRef.current) {
			clearTimeout(overflowTimeoutRef.current);
		}
		if (isMenuExpanded) {
			overflowTimeoutRef.current = window.setTimeout(() => {
				setContentContainerOverflow(overflowStatus.visible);
			}, 300);
		}
		if (!isMenuExpanded) {
			setContentContainerOverflow(overflowStatus.hidden);
		}
	};

	const handleMenuExpand = (): void => {
		setIsMenuExpanded((prev) => !prev);
	};

	const toggleModal = (): void => setIsModalOpen((prev) => !prev);

	const handleOptionsClick = (): void => {
		if (optionsIconRef.current) {
			const rect = optionsIconRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			setDisplayDropdownAbove(spaceBelow < 180);
		}
		toggleModal();
	};

	const handleStatusChange = async (newStatus: ToDoStatus): Promise<void> => {
		if (!currentUser) return;

		setCurrentTaskStatus(newStatus);

		if (newStatus === ToDoStatus.checked) {
			const name = await getNameFromEmail(currentUser);
			if (!name) return;
			const capitalizedName = capitalizeUsername(name);
			setCompletedByName(capitalizedName);
		}
		if (newStatus === ToDoStatus.unchecked) {
			setCompletedByName(null);
		}

		onStatusChange(todoItem.id, newStatus);
		await updateToDoStatusInDatabase(
			todoItem.id,
			newStatus,
			currentUser,
			addNotification
		);
	};

	const renderChip = (): JSX.Element => {
		const chipMapping = {
			[ToDoStatus.checked]: { variant: "active", label: "Completed" },
			[ToDoStatus.unchecked]: { variant: "default", label: "Active" },
			[ToDoStatus.ignore]: { variant: "error", label: "Ignored" },
		};
		const currentChip = chipMapping[currentTaskStatus];

		return (
			<div
				className={currentChip.variant === "error" ? "" : styles.chipOutline}
			>
				<Chip variant={currentChip.variant as "default" | "active" | "error"}>
					{currentChip.label}
				</Chip>
			</div>
		);
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
				disabled={currentTaskStatus === ToDoStatus.ignore}
			/>
			<div
				className={`${styles.toDoWrapper} ${
					currentTaskStatus === ToDoStatus.checked ? styles.checked : ""
				}`}
			>
				<div className={styles.tags}>
					{todoItem.seriesId && (
						<div className={styles.seriesIconContainer}>
							<Icon data={repeat} size={16} />
						</div>
					)}
					{renderChip()}
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
							{completedByName && (
								<span className={styles.metaDataText}>
									{`Completed by ${completedByName}`}
								</span>
							)}
							<span className={styles.metaDataText}>
								{`Created by ${createdByName}`}
							</span>
						</div>
						<div className={styles.optionsMenuContainer}>
							<Button onClick={handleOptionsClick} ref={optionsIconRef}>
								Options
							</Button>
							{isModalOpen && (
								<TaskOptionsModal
									isAbove={displayDropdownAbove}
									onClose={toggleModal}
									onStatusChange={handleStatusChange}
									currentTaskStatus={currentTaskStatus}
									todoItem={todoItem}
									selectedDate={selectedDate}
								/>
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
