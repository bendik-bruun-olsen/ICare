import { useState } from 'react';
import { DatePicker } from '@equinor/eds-core-react';
import styles from './DatePickerComponent.module.css'; 


const DatePickerComponent=()=>{


const [selectedDate, setSelectedDate]=useState<Date>(new Date())

const handleDateChange=(newDate:Date)=>{
  setSelectedDate(newDate)
}

  return(
    <div className={styles.dateInputField}>
      <DatePicker
      label="Select Date"
      value={selectedDate} onChange={handleDateChange}
      />
    </div>
  )
}

export default DatePickerComponent;


