import React, { useState } from "react";
import { Checkbox, TextField, Button } from "@equinor/eds-core-react";
import StartAndEndDate from "../components/StartAndEndDate";
// import CategoryComponent from "../components/CategoryComponent";
import DaysComponent from "../components/DaysComponent";
import styled from "styled-components";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import CategoryComponent from "../components/CategoryComponent";
// import { connectAuthEmulator } from "firebase/auth";

const StyleTimePicker = styled.div`
  width: 200px;
`;

const FormComponent: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  ); // Today's date
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10)
  ); // Today's date
  const [time, setTime] = useState("");
  const [selectCategory, setSelectCategory] = useState<string | null>(null); //check this
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleCheckboxChange = () => {
    setRepeat((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected option:", selectCategory);

    const newTodo = {
      title: title,
      description: description,
      repeat: repeat,
      startDate: startDate,
      endDate: repeat ? endDate : null,
      time: time,
      category: selectCategory,
      selectedDays: repeat ? selectedDays : [],
    };

    try {
      const docRef = await addDoc(collection(db, "AddToDo"), newTodo);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const handleSelectionChange = (value: string | null) => {
    setSelectCategory(value);
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
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
              selectedDays={selectedDays}
              onDayToggle={handleDayToggle}
            />
          </>
        )}
        <CategoryComponent
          selectedOption={selectCategory}
          onSelectionChange={handleSelectionChange}
        />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default FormComponent;
