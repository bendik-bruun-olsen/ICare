import React from "react";
import { Button } from "@equinor/eds-core-react";

interface AddButtonProps {
  label: string;
}

const AddButtonComponent: React.FC<AddButtonProps> = ({ label }) => {
  return (
    <Button as="button" type="submit">
      {label}
    </Button>
  );
};

export default AddButtonComponent;
