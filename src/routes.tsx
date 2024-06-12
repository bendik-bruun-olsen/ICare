// src/routes.js

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import { Paths } from "./utils/paths";

const router = createBrowserRouter([
	{
		path: Paths.HOME,
		element: <Home />,
	},
	{
		path: Paths.LOGIN,
		element: <Login />,
	},
	{
		path: Paths.SIGNUP,
		element: <Signup />,
	},
	{
		path: Paths.TODO,
		element: <Todo />,
	},
	{
		path: Paths.ADD_TODO,
		element: <AddTodo />,
	},
	{
		path: Paths.EDIT_TODO,
		element: <EditTodo />,
	},
	{
		path: Paths.APPOINTMENT,
		element: <Appointment />,
	},
	{
		path: Paths.ADD_APPOINTMENT,
		element: <AddAppointment />,
	},
	{
		path: Paths.EDIT_APPOINTMENT,
		element: <EditAppointment />,
	},
	{
		path: Paths.CONTACT,
		element: <Contact />,
	},
	{
		path: Paths.NOT_FOUND,
		element: <NotFound />,
	},
]);
export default router;
