import styles from "./TaskOptionsModal.module.css";
import { Link } from "react-router-dom";
import { TodoItemInterface, ToDoStatus } from "../../types";
import { Paths } from "../../paths";

interface Props {
	isAbove: boolean;
	onClose: () => void;
	onStatusChange: (newStatus: ToDoStatus) => Promise<void>;
	currentTaskStatus: ToDoStatus;
	todoItem: TodoItemInterface;
	selectedDate: Date;
}

export default function TaskOptionsModal({
	isAbove,
	onClose,
	onStatusChange,
	currentTaskStatus,
	todoItem,
	selectedDate,
}: Props) {
	return (
		<>
			<div className={styles.modalOverlay} onClick={onClose}></div>
			<div
				className={`${styles.modalContainer} ${
					isAbove ? styles.dropdownAbove : ""
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<ul className={styles.modalList}>
					<li
						className={styles.modalItem}
						onClick={() =>
							onStatusChange(
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
							to={Paths.EDIT_TODO_ITEM.replace(":todoId", todoItem.id)}
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
								<p>Edit/Delete All Tasks In Series</p>
							</Link>
						</li>
					)}
				</ul>
			</div>
		</>
	);
}
