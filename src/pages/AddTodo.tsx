// import React from "react";

// const AddTodo = () => {
//   return (
//     <div>
//       <h1>AddTodo</h1>
//     </div>
//   );
// };

// export default AddTodo;

import { Checkbox, Button } from "@equinor/eds-core-react";
import TitleDescriptionComponent from "../components/TitleDescriptionComponent";
import StartAndEndDate from "../components/StartAndEndDate";
import TimePickerComponent from "../components/TimePickerComponent";
import CategoryComponent from "../components/CategoryComponent";
import DaysComponent from "../components/DaysComponent";
import AddButtonComponent from "../components/AddButtonComponenet";

const AddTodo = () => {
  return (
    <>
      <TitleDescriptionComponent />
      <Checkbox label="Repeat" />
      <StartAndEndDate label="Start date" />
      <TimePickerComponent />
      <StartAndEndDate label="End date" />
      <CategoryComponent />
      <DaysComponent />
      <AddButtonComponent label="Add" />
    </>
  );
};

export default AddTodo;
