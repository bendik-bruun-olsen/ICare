import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { StateContextProvider } from "./context/StateContext";

<StateContextProvider>
	<RouterProvider router={router} />;
</StateContextProvider>;

const App: React.FC = () => {
	return (
		<StateContextProvider>
			<RouterProvider router={router} />;
		</StateContextProvider>
	);
};

export default App;
