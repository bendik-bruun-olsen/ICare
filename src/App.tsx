import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { StateContextProvider } from "./context/StateContext";
import AppointmentsQuickView from "./components/AppointmentsQuickView/AppointmentsQuickView";

const App: React.FC = () => {
	return (
		// <StateContextProvider>
		// 	<RouterProvider router={router} />;
		// </StateContextProvider>
		<AppointmentsQuickView />
	);
};

export default App;
