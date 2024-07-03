// DatePickerComponent.tsx
import { I18nProvider } from "@react-aria/i18n";
import { DatePicker } from "@equinor/eds-core-react";
import { FC } from "react";
import styles from "./DateSelector.module.css";

interface DatesSelectorProps {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
}

const DateSelector: FC<DatesSelectorProps> = ({
	selectedDate,
	setSelectedDate,
}) => {
	const handleDateChange = (newDate: Date) => {
		setSelectedDate(newDate);
	};

	const handlePrevDate = () => {
		const prevDate = new Date(selectedDate);
		prevDate.setDate(prevDate.getDate() - 1);
		setSelectedDate(prevDate);
	};

	const handleNextDate = () => {
		const nextDate = new Date(selectedDate);
		nextDate.setDate(nextDate.getDate() + 1);
		setSelectedDate(nextDate);
	};

	return (
		<I18nProvider locale="nb-NO">
			<div className={styles.datePickerWrapper}>
				<button onClick={handlePrevDate}>&lt;</button>
				<div style={{ width: "10px" }} />
				<DatePicker
					value={selectedDate}
					onChange={handleDateChange}
					formatOptions={{
						day: "2-digit",
						month: "long",
						year: "numeric",
					}}
				/>
				<div style={{ width: "10px" }} />
				<button onClick={handleNextDate}>&gt;</button>
			</div>
		</I18nProvider>
	);
};

export default DateSelector;
