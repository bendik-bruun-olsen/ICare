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

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/logout",
		element: <Logout />,
	},

	{
		path: "/signup",
		element: <Signup />,
	},
	{
		path: "/todo",
		element: <Todo />,
	},
	{
		path: "/add-todo",
		element: <AddTodo />,
	},
	{
		path: "/edit-todo",
		element: <EditTodo />,
	},
	{
		path: "/appointment",
		element: <Appointment />,
	},
	{
		path: "/add-appointment",
		element: <AddAppointment />,
	},
	{
		path: "/edit-appointment",
		element: <EditAppointment />,
	},

	{
		path: "/contact",
		element: <Contact />,
	},

	{
		path: "*",
		element: <NotFound />,
	},
]);
export default router;
