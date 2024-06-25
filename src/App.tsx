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
		<AppointmentsQuickView
			firstAppointment="08:30 - Meeting with doctor"
			secondAppointment="11:00 - Meeting with chiropractor"
		/>
	);
};

export default App;
