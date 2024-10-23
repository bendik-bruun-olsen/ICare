import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth/useAuth";
import { NotificationProvider } from "./context/NotificationContext";
import Snacbar from "./components/Snacbar/Snacbar";

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <Snacbar />
      </NotificationProvider>
    </AuthProvider>
  );
}
