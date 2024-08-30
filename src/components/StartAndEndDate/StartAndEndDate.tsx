import { I18nProvider } from "@react-aria/i18n";
import { useState, useEffect } from "react";
import { DatePicker } from "@equinor/eds-core-react";
import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
import styles from "./StartAndEndDate.module.css";

type StartAndEndDateProps = {
	label: string;
	value: string;
	onChange: (date: string) => void;
	variant: Variants | undefined;
	minValue: Date | undefined;
};

const StartAndEndDate: React.FC<StartAndEndDateProps> = ({
	label,
	value,
	onChange,
	variant,
	minValue,
}) => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date(value));

	useEffect(() => {
		setSelectedDate(new Date(value));
	}, [value]);

	const handleDateChange = (newDate: Date) => {
		if (newDate === null) {
			return;
		}

		const localDate = new Date(
			newDate.getFullYear(),
			newDate.getMonth(),
			newDate.getDate(),
			12
		);

		setSelectedDate(localDate);
		onChange(localDate.toISOString().substring(0, 10));
	};

	return (
		<div>
			<I18nProvider locale="nb-NO">
				<div className={styles.wrapper}>
					<DatePicker
						label={label}
						value={selectedDate}
						onChange={handleDateChange}
						formatOptions={{
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						}}
						variant={variant}
						minValue={minValue}
					/>
				</div>
			</I18nProvider>
		</div>
	);
};

export default StartAndEndDate;
