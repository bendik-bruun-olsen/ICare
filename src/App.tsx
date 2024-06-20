import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { StateContextProvider } from "./context/StateContext";
import TaskContainer from "./components/TaskContainer/TaskContainer";

const App: React.FC = () => {
	return (
		// <StateContextProvider>
		// 	<RouterProvider router={router} />;
		// </StateContextProvider>
		<TaskContainer />
	);
};

export default App;
