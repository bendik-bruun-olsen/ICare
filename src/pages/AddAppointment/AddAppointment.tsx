import React, { useState } from "react";
import { TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate";
import { db } from "../../firebase/firebase";
import { collection, addDoc, doc, Timestamp } from "firebase/firestore";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import styles from "../AddTodo/AddTodo.module.css";

const AddAppointment: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const [startDate, setStartDate] = useState(
		new Date().toISOString().substring(0, 10)
	);
	const [time, setTime] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // push data into firebase
    const newTodo = {
      title,
      description,
      startDate: Timestamp.fromDate(new Date(startDate)),
      time,
    };
    try {
      const patientRef = doc(db, "patientdetails", "patient@patient.com");
      const appointmentRef = collection(patientRef, "appointments");


			const appointmentDocRef = await addDoc(appointmentRef, newTodo);
			console.log("Document written with ID: ", appointmentDocRef.id);
		} catch (e) {
			console.error("Error in adding appointment document: ", e);
		}
	};

	const onclickAddButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
		await handleSubmit(e);
		setTitle("");
		setDescription("");
		setStartDate(new Date().toISOString().substring(0, 10));
		setTime("");
	};

	return (
		<div className={styles.mainContainer}>
			<h1>Add Appointments</h1>
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
							label="Select Date"
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
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => setTime(e.target.value)}
							style={{ width: "150px" }}
						/>
					</div>
					<AddButton label="Add" onClick={onclickAddButton} />
				</div>
			</form>
		</div>
	);
};
export default AddAppointment;
