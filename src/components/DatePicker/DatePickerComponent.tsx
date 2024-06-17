import { I18nProvider } from "@react-aria/i18n";
import { useState } from "react";
import { DatePicker } from "@equinor/eds-core-react";
import styled from "styled-components";

const DatePickerWrapper = styled.div`
  display: flex;
  // flex-direction: row;
  align-items: center;
`;

const DatePickerComponent = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
    <div>
      <I18nProvider locale="nb-NO">
        <div>
          <DatePickerWrapper>
            <button onClick={handlePrevDate}>&lt;</button>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              formatOptions={{
                day: "2-digit",
                month: "long",
                year: "numeric",
              }}
            />
            <button onClick={handleNextDate}>&gt;</button>
          </DatePickerWrapper>
        </div>
      </I18nProvider>
    </div>
  );
};

export default DatePickerComponent;
