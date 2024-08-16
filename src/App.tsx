import React from "react";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth/useAuth";
import { NotificationProvider } from "./context/NotificationContext";
import SnackBar from "./components/SnackBar/SnackBar";

const App: React.FC = () => {
	return (
		<AuthProvider>
			<NotificationProvider>
				<RouterProvider router={router} />
				<SnackBar />
			</NotificationProvider>
		</AuthProvider>
	);
};

export default App;
