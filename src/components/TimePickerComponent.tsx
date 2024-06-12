import React, { useState } from "react";
import TimePicker from "react-time-picker";

const TimePickerComponent: React.FC = () => {
  const [time, setTime] = useState<string | null>("12:00");

  const onChange = (newTime: string | null) => {
    setTime(newTime);
  };

  return (
    <div>
      <h1>Selected Time: {time}</h1>
      <TimePicker onChange={onChange} value={time} />
    </div>
  );
};

export default TimePickerComponent;
