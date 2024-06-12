import { Button } from "@equinor/eds-core-react";

const buttons = [
  { label: "monday", text: "M" },
  { label: "tuesday", text: "T" },
  { label: "wednesday", text: "W" },
  { label: "thursday", text: "T" },
  { label: "friday", text: "F" },
  { label: "saturday", text: "S" },
  { label: "sunday", text: "S" },
];

const DaysComponent = () => {
  return (
    <Button.Toggle multiple aria-label="days selection">
      {buttons.map((button, index) => (
        <Button key={index} aria-label={button.label}>
          {button.text}
        </Button>
      ))}
    </Button.Toggle>
  );
};

export default DaysComponent;
