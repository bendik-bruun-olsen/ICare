import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { CircularProgress } from "@equinor/eds-core-react";

const App: React.FC = () => {
	return (
		<RouterProvider
			router={router}
			fallbackElement={<CircularProgress />}
		/>
	);
};

export default App;
