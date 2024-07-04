import { I18nProvider } from "@react-aria/i18n";
import { useState, useEffect } from "react";
import { DatePicker } from "@equinor/eds-core-react";
import styled from "styled-components";

const StyledDatePickerWrapper = styled.div`
	width: 200px;
`;

type StartAndEndDateProps = {
	label: string;
	value: string;
	onChange: (date: string) => void;
};

const StartAndEndDate: React.FC<StartAndEndDateProps> = ({
	label,
	value,
	onChange,
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
		console.log("localDate: ", localDate);

		setSelectedDate(localDate);
		onChange(localDate.toISOString().substring(0, 10));
	};

	return (
		<div>
			<I18nProvider locale="nb-NO">
				<StyledDatePickerWrapper>
					<DatePicker
						label={label}
						value={selectedDate}
						onChange={handleDateChange}
						formatOptions={{
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						}}
					/>
				</StyledDatePickerWrapper>
			</I18nProvider>
		</div>
	);
};

export default StartAndEndDate;
