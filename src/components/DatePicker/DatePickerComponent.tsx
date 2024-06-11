import { I18nProvider } from '@react-aria/i18n';
import { useState } from 'react';
import { DatePicker } from '@equinor/eds-core-react';
import styles from './DatePickerComponent.module.css'; 

const DatePickerComponent = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div className={styles.datePickerContainer}>
      <I18nProvider locale="en-GB">
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          formatOptions={{ day: '2-digit', month: '2-digit', year: 'numeric' }} 
        />
      </I18nProvider>
    </div>
  );
};

export default DatePickerComponent;
