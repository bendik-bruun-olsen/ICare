import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { StateContextProvider } from "./context/StateContext";

const App: React.FC = () => {
  return (
    <StateContextProvider>
      <RouterProvider router={router} />;
    </StateContextProvider>
  );
};

export default App;
