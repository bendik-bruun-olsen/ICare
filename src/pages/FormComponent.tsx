import React, { useState } from "react";
import { Checkbox, TextField, Button } from "@equinor/eds-core-react";
import StartAndEndDate from "../components/StartAndEndDate";
import CategoryComponent from "../components/CategoryComponent";
import DaysComponent from "../components/DaysComponent";
import styled from "styled-components";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const StyleTimePicker = styled.div`
  width: 200px;
`;

const FormComponent: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("_");
  const [frequency, setFrequency] = useState<string[]>([]);

  const handleCheckboxChange = () => {
    setRepeat((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo = {
      title: title,
      description: description,
      repeat: repeat,
      startDate: startDate,
      endDate: repeat ? endDate : null,
      time: time,
      category: category,
      frequency: repeat ? frequency : [],
    };

    try {
      const docRef = await addDoc(collection(db, "AddToDo"), newTodo);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="title"
            label="Title*"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>
        <div>
          <TextField
            id="description"
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />
        </div>
        <Checkbox
          label="Repeat"
          checked={repeat}
          onChange={handleCheckboxChange}
        />
        <StartAndEndDate
          label="Start date"
          value={startDate}
          onChange={(date: string) => setStartDate(date)}
        />
        <StyleTimePicker>
          <TextField
            id="time"
            label="Select time"
            type="time"
            value={time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTime(e.target.value)
            }
          />
        </StyleTimePicker>
        {repeat && (
          <>
            <StartAndEndDate
              label="End date"
              value={endDate}
              onChange={(date: string) => setEndDate(date)}
            />
            <DaysComponent
              selectedDays={frequency}
              onChange={(days: string[]) => setFrequency(days)}
            />
          </>
        )}
        <CategoryComponent
          value={category}
          onChange={(newCategory: string) => setCategory(newCategory)}
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default FormComponent;

// const FormComponent: React.FC = () => {
//   return (
//     <div>
//       <h1>FormComponent</h1>
//     </div>
//   );
// };

// export default FormComponent;
