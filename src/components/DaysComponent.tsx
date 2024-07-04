import { Button } from "@equinor/eds-core-react";
import "./DaysComponent.css";

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
}

const DaysComponent: React.FC<DaysComponentProps> = ({
	selectedDays,
	onDayToggle,
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

	return (
		<div className="button-container">
			<span style={{ color: "#6F6F6F", fontWeight: 500 }}>Frequency</span>
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
	);
};

export default DaysComponent;
