import { createBrowserRouter, Outlet } from "react-router-dom";
import { Paths } from "./paths";
import { useAuth } from "./hooks/useAuth/useAuth";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import Signup from "./pages/Signup/SignupPage";
import ToDoPage from "./pages/ToDoPage/ToDoPage";
import AddTodoPage from "./pages/AddTodoPage/AddTodoPage";
import EditToDoPage from "./pages/EditTodoPage/EditTodoPage";
import Appointment from "./pages/AppointmentsPage/AppointmentPage";
import AddAppointmentPage from "./pages/AddAppointmentPage/AddAppointmentPage";
import EditAppointment from "./pages/EditAppointment/EditAppointmentPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import RecoverPasswordPage from "./pages/RecoverPassword/RecoverPasswordPage";
import ResetPasswordPage from "./pages/ResetPassword/ResetPasswordPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import { Navigate } from "react-router-dom";
import CreatePatientPage from "./pages/CreatePatientPage/CreatePatientPage";
import PatientDetailsPage from "./pages/PatientDetailsPage/PatientDetailsPage";
import PatientOverviewPage from "./pages/PatientOverviewPage/PatientOverviewPage";

const RequireAuthWrapper = (): JSX.Element => {
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
    path: Paths.RESET_PASSWORD,
    element: <ResetPasswordPage />,
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
    element: <AddTodoPage />,
  },
  {
    path: Paths.EDIT_TODO,
    element: <EditToDoPage />,
  },
  {
    path: Paths.APPOINTMENT,
    element: <Appointment />,
  },
  {
    path: Paths.ADD_APPOINTMENT,
    element: <AddAppointmentPage />,
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
    path: Paths.USER_PROFILE,
    element: <UserProfilePage />,
  },
  {
    path: Paths.CREATE_PATIENT,
    element: <CreatePatientPage />,
  },
  {
    path: Paths.PATIENT_DETAILS,
    element: <PatientDetailsPage />,
  },
  {
    path: Paths.PATIENT_OVERVIEW,
    element: <PatientOverviewPage />,
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
