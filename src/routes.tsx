import { createBrowserRouter } from "react-router-dom";
import { Paths } from "./paths";
import { useAuth } from "./hooks/useAuth/useAuth";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/LoginPage";
import Signup from "./pages/SignupPage";
import Todo from "./pages/TodoPage";
import AddTodo from "./pages/AddTodo/AddTodo";
import EditTodo from "./pages/EditTodoPage";
import Appointment from "./pages/AppointmentPage";
import AddAppointment from "./pages/AddAppointment/AddAppointment";
import EditAppointment from "./pages/EditAppointmentPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import ErrorPage from "./pages/ErrorPage";
import AboutUsPage from "./pages/AboutUsPage";
import React from "react";
import { Navigate } from "react-router-dom";

// const HomeOrLogin: React.FC = () => {
// 	const { isUserLoggedIn } = useAuth();
// 	return isUserLoggedIn ? <HomePage /> : <Login />;
// };

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isUserLoggedIn } = useAuth();
	return isUserLoggedIn ? (
		<>{children}</>
	) : (
		<Navigate to={Paths.LOGIN} replace />
	);
};

const router = createBrowserRouter([
	{
		path: Paths.HOME,
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
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
		element: (
			<ProtectedRoute>
				<Appointment />
			</ProtectedRoute>
		),
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
		element: <ContactDetailsPage />,
	},
	{
		path: Paths.ABOUT,
		element: <AboutUsPage />,
	},
	{
		path: Paths.ERROR,
		element: <ErrorPage />,
	},
]);
export default router;
