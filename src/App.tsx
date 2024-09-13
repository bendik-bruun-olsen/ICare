import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth/useAuth";
import { NotificationProvider } from "./context/NotificationContext";
import Snackbar from "./components/Snackbar/Snackbar";

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <Snackbar />
      </NotificationProvider>
    </AuthProvider>
  );
}
