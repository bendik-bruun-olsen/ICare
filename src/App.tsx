import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { StateContextProvider } from "./context/StateContext";
import TaskContainer from "./components/taskcontainer/TaskContainer";

<StateContextProvider>
	<RouterProvider router={router} />;
</StateContextProvider>;

const App: React.FC = () => {
	return (
		// <StateContextProvider>
		// 	<RouterProvider router={router} />;
		// </StateContextProvider>
		<TaskContainer
			toDoTitle="hello"
			toDoComment="hi"
			toDoDescription="bte"
			taskStatus="default"
		/>
	);
};

export default App;
