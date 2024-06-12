import { I18nProvider } from "@react-aria/i18n";
import { useState } from "react";
import { DatePicker } from "@equinor/eds-core-react";
import styled from "styled-components";

const StyledDatePickerWrapper = styled.div`
  width: 200px;
`;

type StartAndEndDateProps = {
  label: string;
};

const StartAndEndDate: React.FC<StartAndEndDateProps> = ({ label }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div>
      <I18nProvider locale="nb-NO">
        <StyledDatePickerWrapper>
          <DatePicker
            label={label}
            value={selectedDate}
            onChange={handleDateChange}
            formatOptions={{ day: "2-digit", month: "long", year: "numeric" }}
          />
        </StyledDatePickerWrapper>
      </I18nProvider>
    </div>
  );
};

export default StartAndEndDate;
