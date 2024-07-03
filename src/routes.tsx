import { createBrowserRouter, Outlet } from "react-router-dom";
import { Paths } from "./paths";
import { useAuth } from "./hooks/useAuth/useAuth";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/LoginPage";
import Signup from "./pages/Signup/SignupPage";
import ToDoPage from "./pages/ToDo/ToDoPage";
import AddTodo from "./pages/AddTodo/AddTodo";
import EditTodo from "./pages/EditTodoPage";
import Appointment from "./pages/AppointmentPage";
import AddAppointment from "./pages/AddAppointment/AddAppointment";
import EditAppointment from "./pages/EditAppointmentPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import AboutUsPage from "./pages/AboutUsPage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage/RecoverPasswordPage";
import { Navigate } from "react-router-dom";

const RequireAuthWrapper = () => {
	const { isUserLoggedIn } = useAuth();
	return isUserLoggedIn ? <Outlet /> : <Navigate to={Paths.LOGIN} replace />;
};

const unprotectedRoutes = [
	{
		path: Paths.LOGIN,
		element: <Login />,
	},
	{
		path: Paths.SIGNUP,
		element: <Signup />,
	},
	{
		path: Paths.RECOVER_PASSWORD,
		element: <RecoverPasswordPage />,
	},
	{
		path: Paths.ERROR,
		element: <ErrorPage />,
	},
];

const protectedRoutes = [
	{
		path: Paths.HOME,
		element: <HomePage />,
	},
	{
		path: Paths.TODO,
		element: <ToDoPage />,
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
		element: <ContactDetailsPage />,
	},
	{
		path: Paths.ABOUT,
		element: <AboutUsPage />,
	},
];

const router = createBrowserRouter([
	{
		element: <RequireAuthWrapper />,
		children: protectedRoutes,
	},
	...unprotectedRoutes,
]);

export default router;
