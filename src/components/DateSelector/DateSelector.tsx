// DatePickerComponent.tsx
import { I18nProvider } from "@react-aria/i18n";
import { DatePicker } from "@equinor/eds-core-react";
import { FC } from "react";
import styles from "./DateSelector.module.css";
import { Icon } from "@equinor/eds-core-react";
import { arrow_back_ios, arrow_forward_ios } from "@equinor/eds-icons";

interface DatesSelectorProps {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
}

const DateSelector: FC<DatesSelectorProps> = ({
	selectedDate,
	setSelectedDate,
}) => {
	const handleDateChange = (newDate: Date): void => {
		setSelectedDate(newDate);
	};

	const handlePrevDate = (): void => {
		const prevDate = new Date(selectedDate);
		prevDate.setDate(prevDate.getDate() - 1);
		setSelectedDate(prevDate);
	};

	const handleNextDate = (): void => {
		const nextDate = new Date(selectedDate);
		nextDate.setDate(nextDate.getDate() + 1);
		setSelectedDate(nextDate);
	};

	return (
		<I18nProvider locale="nb-NO">
			<div className={styles.datePickerWrapper}>
				<Icon
					data={arrow_back_ios}
					onClick={handlePrevDate}
					color={"var(--blue)"}
					size={24}
				/>
				<div className={styles.spacer} />
				<DatePicker
					value={selectedDate}
					onChange={handleDateChange}
					formatOptions={{
						day: "2-digit",
						month: "long",
						year: "numeric",
					}}
				/>
				<div className={styles.spacer} />
				<Icon
					data={arrow_forward_ios}
					onClick={handleNextDate}
					color={"var(--blue)"}
					size={24}
				/>
			</div>
		</I18nProvider>
	);
};

export default DateSelector;
