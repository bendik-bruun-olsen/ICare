import { I18nProvider } from "@react-aria/i18n";
import { useState } from "react";
import { DatePicker } from "@equinor/eds-core-react";
import styles from "./DatePickerComponent.module.css";
import styled from "styled-components";

const StyledDatePicker = styled(DatePicker)`
  width: 200px;
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
    <div className={styles.datePickerContainer}>
      <I18nProvider locale="nb-NO">
        <div className={styles.dateNavigateContainer}>
          <button onClick={handlePrevDate}>&lt;</button>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            formatOptions={{ day: "2-digit", month: "long", year: "numeric" }}
          />
          <button onClick={handleNextDate}>&gt;</button>
        </div>
      </I18nProvider>
    </div>
  );
};

export default DatePickerComponent;
