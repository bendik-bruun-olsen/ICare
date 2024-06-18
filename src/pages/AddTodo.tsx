// import React from "react";

// const AddTodo = () => {
//   return (
//     <div>
//       <h1>AddTodo</h1>
//     </div>
//   );
// };

// export default AddTodo;

// import React from "react";
// import { Checkbox, TextField } from "@equinor/eds-core-react";
// import TitleDescriptionComponent from "../components/TitleDescriptionComponent";
// import StartAndEndDate from "../components/StartAndEndDate";
// import AddButtonComponent from "../components/AddButtonComponent";
// import CategoryComponent from "../components/CategoryComponent";
// import DaysComponent from "../components/DaysComponent";
// import styled from "styled-components";

// const StyleTimePicker = styled.div`
//   width: 200px;
// `;

// const FormComponent: React.FC = () => {
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const newTodo = {
//       title,
//       description,
//       startDate,
//       endDate: repeat ? endDate : null,
//       time,
//       category,
//       frequency: repeat ? frequency : [],
//       repeat,
//     };
//     console.log(newTodo);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <TitleDescriptionComponent />
//         <Checkbox label="Repeat" />
//         <StartAndEndDate label="Start date" />
//         <StyleTimePicker>
//           <TextField id="time" label="Select time" type="time" />
//         </StyleTimePicker>
//         <StartAndEndDate label="End date" />
//         <CategoryComponent />
//         <DaysComponent />
//       </div>
//       <AddButtonComponent label="Add" />
//     </form>
//   );
// };

// export default FormComponent;
