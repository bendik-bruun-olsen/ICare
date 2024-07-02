// import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Checkbox, TextField } from "@equinor/eds-core-react";
import StartAndEndDate from "../../components/StartAndEndDate";
import SelectCategory from "../../components/SelectCategory";
import DaysComponent from "../../components/DaysComponent";
import TitleDescription from "../../components/TitleDescription";
import AddButton from "../../components/AddButton";
import styles from "./EditTodoPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import HomeButton from "../../components/HomeButton/HomeButton";
import { editTodo } from "../../firebase/todoServices/editTodo";
import { getTodo } from "../../firebase/todoServices/getTodo";
import { TodoType } from "../../types/TodoType";

export default function EditTodoPage() {
	// const todoId = useParams<{ id: string }>().id;
	const todoId = "vfrIdkn8BkCDJmaZfznJ";
	const [todo, setTodo] = useState<TodoType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTodoById = async () => {
			setIsLoading(true);
			try {
				const fetchedTodo = await getTodo(todoId);
				if (fetchedTodo) {
					const convertedTodo = {
						...fetchedTodo,
						startDate: fetchedTodo.startDate.toDate(),
						endDate: fetchedTodo.endDate?.toDate(),
					};
					setTodo(convertedTodo);
				}
			} catch (e) {
				console.error("Error fetching document: ", e);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTodoById();
	}, [todoId]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("e.target: ", e.target);
		const { name, value } = e.target;
		setTodo((prev) => ({ ...prev, [name]: value }));
	};

	const handleCheckboxChange = () => {
		setTodo((prev) => ({ ...prev, repeat: !prev.repeat }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (todo) {
				console.log(todo);

				await editTodo(todoId, todo);
				console.log("Todo edited successfully");
			}
		} catch (e) {
			console.error("Error editing document: ", e);
		}
	};

	if (isLoading) return <h1>Loading....</h1>;

	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="Edit ToDo" />
			<div className="pageWrapper">
				<div className={styles.mainContainer}>
					<form onSubmit={handleSubmit}>
						<div className={styles.formContainer}>
							<TitleDescription
								title={todo?.title || ""}
								setTitle={(title) =>
									setTodo((prev) => ({ ...prev, title }))
								}
								description={todo?.description || ""}
								setDescription={(description) =>
									setTodo((prev) => ({
										...prev,
										description,
									}))
								}
							/>
							<StartAndEndDate
								label="Start date"
								value={todo?.startDate || ""}
								onChange={(startDate) =>
									setTodo((prev) => ({ ...prev, startDate }))
								}
							/>
							<TextField
								id="time"
								label="Select time"
								type="time"
								value={todo?.time || ""}
								className={styles.time}
								onChange={handleChange}
								style={{ width: "150px" }}
							/>
							{todo?.repeat && (
								<>
									{/* <StartAndEndDate
										label="End date"
										value={todo?.endDate || ""}
										onChange={(endDate) =>
											setTodo((prev) => ({
												...prev,
												endDate,
											}))
										}
									/> */}
									<DaysComponent
										selectedDays={todo?.selectedDays || []}
										onDayToggle={(day) =>
											setTodo((prev) => {
												const isDaySelected =
													prev?.selectedDays?.includes(
														day
													);
												return {
													...prev,
													selectedDays: isDaySelected
														? prev?.selectedDays.filter(
																(d) => d !== day
														  )
														: [
																...(prev?.selectedDays ||
																	[]),
																day,
														  ],
												};
											})
										}
									/>
								</>
							)}
							<SelectCategory
								selectedOption={todo?.category || null}
								onSelectionChange={(category) =>
									setTodo((prev) => ({ ...prev, category }))
								}
							/>
							<Checkbox
								label="Repeat"
								checked={todo?.repeat || false}
								onChange={handleCheckboxChange}
							/>
							<AddButton label="Save" onClick={handleSubmit} />
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
