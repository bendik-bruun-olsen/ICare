import Navbar from "./Navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}
