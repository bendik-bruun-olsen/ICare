import { Button } from "@equinor/eds-core-react";
import styles from "./DaysComponent.module.css";
import { Variants } from "@equinor/eds-core-react/dist/types/components/types";

const buttons = [
	{ label: "monday", text: "M" },
	{ label: "tuesday", text: "T" },
	{ label: "wednesday", text: "W" },
	{ label: "thursday", text: "T" },
	{ label: "friday", text: "F" },
	{ label: "saturday", text: "S" },
	{ label: "sunday", text: "S" },
];

interface DaysComponentProps {
	selectedDays: string[];
	onDayToggle: (day: string) => void;
	variant: Variants | undefined;
}

const DaysComponent: React.FC<DaysComponentProps> = ({
	selectedDays,
	onDayToggle,
	variant,
}) => {
	const handleButtonClick = (label: string) => {
		onDayToggle(label);
	};

	const selectedIndexes = buttons
		.map((button, index) => ({
			index,
			isSelected: selectedDays.includes(button.label),
		}))
		.filter((button) => button.isSelected)
		.map((button) => button.index);

	const getOutlineClass = () => {
		switch (variant) {
			case "error":
				return styles.errorOutline;
			case "warning":
				return styles.warningOutline;
			case "success":
				return styles.successOutline;
			default:
				return styles.transparentOutline;
		}
	};

	return (
		<div className={styles.wrapper}>
			<span style={{ color: "#6F6F6F", fontWeight: 500 }}>Frequency</span>
			<div className={`${styles.buttonsContainer} ${getOutlineClass()}`}>
				<Button.Toggle
					multiple
					aria-label="days selection"
					selectedIndexes={selectedIndexes}
				>
					{buttons.map((button, index) => (
						<Button
							key={index}
							aria-label="days"
							onClick={() => handleButtonClick(button.label)}
						>
							{button.text}
						</Button>
					))}
				</Button.Toggle>
			</div>
		</div>
	);
};

export default DaysComponent;
