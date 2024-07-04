// DatePickerComponent.tsx
import { I18nProvider } from "@react-aria/i18n";
import { DatePicker } from "@equinor/eds-core-react";
import styled from "styled-components";
import { FC } from "react";

const DatePickerWrapper = styled.div`
	display: flex;
	align-items: center;
`;

interface DatePickerComponentProps {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
}

const DatePickerComponent: FC<DatePickerComponentProps> = ({
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
		<>
			<I18nProvider locale="nb-NO">
				<div>
					<DatePickerWrapper>
						<div style={{ display: "flex", alignItems: "center" }}>
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
					</DatePickerWrapper>
				</div>
			</I18nProvider>
		</>
	);
};

export default DatePickerComponent;
