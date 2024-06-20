import React, { useState } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent";
import { db } from "../../config/firebase";
import { collection, addDoc, doc, Timestamp } from "firebase/firestore";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import styles from "./AddTodo.module.css";

const AddToDo: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [time, setTime] = useState("");
  const [selectCategory, setSelectCategory] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleCheckboxChange = () => {
    setRepeat((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // push data into firebase
    const newTodo = {
      title,
      description,
      repeat,
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: repeat ? Timestamp.fromDate(new Date(endDate)) : null,
      time,
      category: selectCategory,
      selectedDays: repeat ? selectedDays : [],
    };
    //
    try {
      const patientRef = doc(db, "patientdetails", "patient@patient.com");
      const todoRef = collection(patientRef, "todos");

      const todoDocRef = await addDoc(todoRef, newTodo);
      console.log("Document written with ID: ", todoDocRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleCategorySelectionChange = (value: string | null) => {
    setSelectCategory(value);
  };

  const onclickAddButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await handleSubmit(e);
    setTitle("");
    setDescription("");
    setRepeat(false);
    setStartDate(new Date().toISOString().substring(0, 10));
    setEndDate(new Date().toISOString().substring(0, 10));
    setTime("");
    setSelectCategory(null);
    setSelectedDays([]);
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Add To Do</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <div className={styles.fieldContainer}>
            <TitleDescription
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
            />
          </div>
          <div className={styles.fieldContainer}>
            <StartAndEndDate
              label="Start date"
              value={startDate}
              onChange={(date: string) => setStartDate(date)}
            />
          </div>
          <div className={styles.fieldContainer}>
            <TextField
              id="time"
              label="Select time"
              type="time"
              value={time}
              className={styles.time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTime(e.target.value)
              }
              style={{ width: "150px" }}
            />
          </div>
          <div className={styles.fieldContainer}>
            <Checkbox
              label="Repeat"
              checked={repeat}
              onChange={handleCheckboxChange}
            />
          </div>
          {repeat && (
            <>
              <div className={styles.fieldContainer}>
                <StartAndEndDate
                  label="End date"
                  value={endDate}
                  onChange={(date: string) => setEndDate(date)}
                />
              </div>
              <div className={styles.fieldContainer}>
                <DaysComponent
                  selectedDays={selectedDays}
                  onDayToggle={handleDayToggle}
                />
              </div>
            </>
          )}
          <div className={styles.fieldContainer}>
            <SelectCategory
              selectedOption={selectCategory}
              onSelectionChange={handleCategorySelectionChange}
            />
          </div>
          <AddButton label="Add" onClick={onclickAddButton} />
        </div>
      </form>
    </div>
  );
};
export default AddToDo;
