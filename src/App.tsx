import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Logout from "./pages/LogoutPage";
import Signup from "./pages/SignupPage";
import Todo from "./pages/TodoPage";
import AddTodo from "./pages/AddTodo/AddTodo";
import EditTodo from "./pages/EditTodoPage";
import Appointment from "./pages/AppointmentPage";
import AddAppointment from "./pages/AddAppointment/AddAppointment";
import EditAppointment from "./pages/EditAppointmentPage";
import Contact from "./pages/ContactPage1";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:login",
    element: <Login />,
  },
  {
    path: "/:logout",
    element: <Logout />,
  },

  {
    path: "/:signup",
    element: <Signup />,
  },
  {
    path: "/:todo",
    element: <Todo />,
  },
  {
    path: "/:addtodo",
    element: <AddTodo />,
  },
  {
    path: "/:edittodo",
    element: <EditTodo />,
  },
  {
    path: "/:appointment",
    element: <Appointment />,
  },
  {
    path: "/:addappointment",
    element: <AddAppointment />,
  },
  {
    path: "/:editappointment",
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
