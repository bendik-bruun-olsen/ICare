import { useState } from "react";
import { restaurant, group, walk, placeholder_icon } from "@equinor/eds-icons";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import styles from "./HomePage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import TaskContainer from "../../components/TaskContainer/TaskContainer";

const HomePage = () => {
	const [currentTaskStatus, setCurrentTaskStatus] = useState<
		"complete" | "incomplete" | "default"
	>("default");

	const handleTaskStatusChange = (
		newStatus: "complete" | "incomplete" | "default"
	) => {
		setCurrentTaskStatus(newStatus);
	};

	return (
		<>
			<Navbar leftContent={<h2>LogoTest</h2>} centerContent="Home" />
			<div className={styles.remainingTodosWrapper}>
				<RemainingTodos
					categoryTitle="Food"
					completedTodosCount="3"
					allTodosCount="6"
					icon={restaurant}
				/>
				<RemainingTodos
					categoryTitle="Medicine"
					completedTodosCount="2"
					allTodosCount="5"
					icon={placeholder_icon}
				/>
				<RemainingTodos
					categoryTitle="Social"
					completedTodosCount="1"
					allTodosCount="1"
					icon={group}
				/>
				<RemainingTodos
					categoryTitle="Exercise"
					completedTodosCount="2"
					allTodosCount="3"
					icon={walk}
				/>
			</div>
			<div>
				<TaskContainer
					toDoTitle="Walk around mosvannet"
					toDoDescription="Big walk around mosvannet"
					toDoComment="Very good walk"
					time="08:30"
					taskStatus={currentTaskStatus}
					handleTaskStatusChange={handleTaskStatusChange}
				/>
			</div>
		</>
	);
};

export default HomePage;
