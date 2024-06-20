import styled from "styled-components";
import React from "react";
import { Autocomplete } from "@equinor/eds-core-react";

const StyledCategory = styled.div`
  width: 150px;
`;

const options: string[] = ["Food", "Medicine", "Social", "Exercise", "Others"];

interface CategoryComponentProps {
  selectedOption: string | null;
  onSelectionChange: (value: string | null) => void;
}

const SelectCategory: React.FC<CategoryComponentProps> = ({
  selectedOption,
  onSelectionChange,
}) => {
  return (
    <StyledCategory>
      <Autocomplete<string>
        label="Category"
        options={options}
        initialSelectedOptions={selectedOption ? [selectedOption] : []}
        onOptionsChange={({ selectedItems }) =>
          onSelectionChange(selectedItems[0] ?? null)
        }
      />
    </StyledCategory>
  );
};

export default SelectCategory;
