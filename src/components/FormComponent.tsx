import { TextField } from "@equinor/eds-core-react";
import TitleDescriptionComponent from "./TitleDescriptionComponent";
import StartAndEndDate from "./StartAndEndDate";

const FormComponent = () => {
  return (
    <div>
      <TitleDescriptionComponent />
      <StartAndEndDate label="Start date" />
      {/* <TextField id="date" label="Select date" type="date" /> */}
      <TextField id="time" label="Select time" type="time" />
      <StartAndEndDate label="End date" />
    </div>
  );
};

export default FormComponent;
