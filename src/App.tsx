import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Paths } from "./utils/paths";

const App: React.FC = () => {
	return <RouterProvider router={router} />;
};

export default App;
