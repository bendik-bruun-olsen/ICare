import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Logout from "./pages/LogoutPage";
import Signup from "./pages/SignupPage";
import Todo from "./pages/TodoPage";
import AddTodo from "./pages/AddTodo";
import EditTodo from "./pages/EditTodoPage";
import Appointment from "./pages/AppointmentPage";
import AddAppointment from "./pages/AddAppointment";
import EditAppointment from "./pages/EditAppointmentPage";
import Contact from "./pages/ContactPage1";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:Login",
    element: <Login />,
  },
  {
    path: "/:Logout",
    element: <Logout />,
  },

  {
    path: "/:Signup",
    element: <Signup />,
  },
  {
    path: "/:Todo",
    element: <Todo />,
  },
  {
    path: "/:AddTodo",
    element: <AddTodo />,
  },
  {
    path: "/:EditTodo",
    element: <EditTodo />,
  },
  {
    path: "/:Appointment",
    element: <Appointment />,
  },
  {
    path: "/:AddAppointment",
    element: <AddAppointment />,
  },
  {
    path: "/:EditAppointment",
    element: <EditAppointment />,
  },

  {
    path: "/:contact",
    element: <Contact />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
