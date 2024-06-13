import React from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import TitleDescriptionComponent from "./TitleDescriptionComponent";
import StartAndEndDate from "./StartAndEndDate";
import AddButtonComponent from "./AddButtonComponent";
import CategoryComponent from "./CategoryComponent";
import DaysComponent from "./DaysComponent";
import styled from "styled-components";

const StyleTimePicker = styled.div`
  width: 200px;
`;

const FormComponent: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TitleDescriptionComponent />
        <Checkbox label="Repeat" />
        <StartAndEndDate label="Start date" />
        <StyleTimePicker>
          <TextField id="time" label="Select time" type="time" />
        </StyleTimePicker>
        <StartAndEndDate label="End date" />
        <CategoryComponent />
        <DaysComponent />
      </div>
      <AddButtonComponent label="Add" onClick={() => {}} />
    </form>
  );
};

export default FormComponent;
