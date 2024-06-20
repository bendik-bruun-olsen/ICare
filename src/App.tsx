import { AuthUser } from "./components/firebase/AuthUser";
import { CreateUser } from "./components/firebase/CreateUser";
import TaskContainer from "./components/TaskContainer/TaskContainer";

// <>
// 	<AuthUser />
// 	<br />
// 	<CreateUser />
// </>
function App() {
	return (
		<>
			<TaskContainer
				toDoTitle="09:10 - Daily Walk"
				toDoDescription="Went around mosvannet"
				toDoComment="He had to use the inhaler, pollen is high today"
			/>
		</>
	);
}

export default App;
