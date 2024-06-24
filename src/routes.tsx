import { createBrowserRouter } from "react-router-dom";
import { Paths } from "./utils/paths";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login/LoginPage";
import Home from "./pages/HomePage/HomePage";
import Signup from "./pages/SignupPage";
import Todo from "./pages/TodoPage";
import AddTodo from "./pages/AddTodo/AddTodo";
import EditTodo from "./pages/EditTodoPage";
import Appointment from "./pages/AppointmentPage";
import AddAppointment from "./pages/AddAppointment/AddAppointment";
import EditAppointment from "./pages/EditAppointmentPage";
import Contact from "./pages/ContactPage1";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: Paths.HOME,
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: Paths.HOME,
        element: <Home />,
        index: true,
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
        path: Paths.ERROR,
        element: <ErrorPage />,
      },
    ],
  },
]);
export default router;
