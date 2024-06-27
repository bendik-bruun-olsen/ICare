import React from "react";
import router from "./routes";
<<<<<<< HEAD
import { StateContextProvider } from "./context/StateContext";
import AppointmentsQuickView from "./components/AppointmentsQuickView/AppointmentsQuickView";

const App: React.FC = () => {
	return (
		<StateContextProvider>
			<RouterProvider router={router} />
		</StateContextProvider>
=======
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth/useAuth";

const App: React.FC = () => {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
>>>>>>> development
	);
};

export default App;
