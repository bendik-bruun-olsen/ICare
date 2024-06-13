import React from "react";
import { Button } from "@equinor/eds-core-react";

interface AddButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const AddButtonComponent: React.FC<AddButtonProps> = ({ label, onClick }) => {
  return (
    <Button as="button" type="submit" onClick={onClick}>
      {label}
    </Button>
  );
};

export default AddButtonComponent;
