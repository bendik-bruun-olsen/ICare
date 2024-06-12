import { AuthUser } from "./components/firebase/AuthUser";
import { CreateUser } from "./components/firebase/CreateUser";
import TaskContainer from "./components/taskcontainer/TaskContainer";

// <>
// 	<AuthUser />
// 	<br />
// 	<CreateUser />
// </>
function App() {
	return (
		<>
			<TaskContainer />
		</>
	);
}

export default App;
