import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { StateContextProvider } from "./context/StateContext";
import ToDoHome from "./components/todohome/ToDoHome";

const App: React.FC = () => {
	return (
		// <StateContextProvider>
		// 	<RouterProvider router={router} />;
		// </StateContextProvider>
		<ToDoHome />
	);
};

export default App;
