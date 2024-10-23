import { I18nProvider } from "@react-aria/i18n";
import { useState, useEffect } from "react";
import { DatePicker } from "@equinor/eds-core-react";
import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
import styles from "./StartAndEndDate.module.css";

interface StartAndEndDate {
  label: string;
  value: Date;
  onChange: (date: string) => void;
  variant?: Variants;
  minValue?: Date;
}

const StartAndEndDate: React.FC<StartAndEndDate> = ({
  label,
  value,
  onChange,
  variant,
  minValue,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (newDate: Date): void => {
    if (newDate === null) {
      return;
    }
    setSelectedDate(value);

    onChange(newDate.toISOString().substring(0, 10));
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
