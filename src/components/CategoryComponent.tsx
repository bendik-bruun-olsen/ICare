import styled from "styled-components";

const StyledCategory = styled.div`
  width: 200px;
`;

import React from "react";
import { Autocomplete } from "@equinor/eds-core-react";

const options: string[] = ["Food", "Medicine", "Social", "Exercise", "Others"];

const CategoryComponent: React.FC = () => {
  return (
    <StyledCategory>
      <Autocomplete<string> label="Category" options={options} />
    </StyledCategory>
  );
};

export default CategoryComponent;
