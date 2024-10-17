import { useContext, useEffect, useRef, useState } from "react";
import { Icon, Checkbox, Chip, Button } from "@equinor/eds-core-react";
import { arrow_back_ios, arrow_forward_ios } from "@equinor/eds-icons";
import styles from "./AppointmentTile.module.css";
import { Appointment, AppointmentStatus, NotificationType } from "../../types";
import { capitalizeUsername } from "../../utils";
import getNameFromEmail from "../../firebase/userServices/getNameFromEmail";
import { useAuth } from "../../hooks/useAuth/useAuth";
import AppointmentModalOptions from "./AppointmentModalOptions";
import { NotificationContext } from "../../context/NotificationContext";
import { updateAppointmentStatusInDB } from "../../firebase/appointmentServices/updateAppoinmentStatusInDB";

interface AppointmentTileProps {
	selectedDate: Date;
	appointmentItem: Appointment;
	onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
}

enum overflowStatus {
	hidden = "hidden",
	visible = "visible",
}

export default function AppointmentTile({
	selectedDate,
	appointmentItem: appointmentItem,
	onStatusChange,
}: AppointmentTileProps): JSX.Element {
	const [currentTaskStatus, setCurrentTaskStatus] = useState<AppointmentStatus>(
		appointmentItem.status
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [displayDropdownAbove, setDisplayDropdownAbove] = useState(false);
	const [createdByName, setCreatedByName] = useState("unknown");
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
			if (appointmentItem.createdBy) {
				const name = await getNameFromEmail(appointmentItem.createdBy);

				if (name) {
					const capitalizedName = capitalizeUsername(name);
					setCreatedByName(capitalizedName);
				}
			}
		};
		fetchNames();
	}, [appointmentItem.createdBy]);

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

	return (
		<div className={styles.checkboxAndToDoTileWrapper}>
			<div
				className={`${styles.toDoWrapper} ${
					currentTaskStatus === AppointmentStatus.checked ? styles.checked : ""
				}`}
			>
				<h3 className={styles.title}>
					{`${appointmentItem.time} - ${appointmentItem.title}`}
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
						{appointmentItem.description}
					</p>
					<div className={styles.metaDataAndOptionsContainer}>
						<div className={styles.metaDataContainer}>
							<span className={styles.metaDataText}>
								{`Created by ${createdByName}`}
							</span>
						</div>
						<div className={styles.optionsMenuContainer}>
							<Button onClick={handleOptionsClick} ref={optionsIconRef}>
								Options
							</Button>
							{isModalOpen && (
								<AppointmentModalOptions
									isAbove={displayDropdownAbove}
									onClose={toggleModal}
									onStatusChange={handleStatusChange}
									currentTaskStatus={currentTaskStatus}
									appointmentItem={appointmentItem}
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
