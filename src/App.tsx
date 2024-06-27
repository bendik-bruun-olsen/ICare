import React from "react";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth/useAuth";

const App: React.FC = () => {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
};

export default App;
