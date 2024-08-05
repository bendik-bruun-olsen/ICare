import { CircularProgress } from "@equinor/eds-core-react";
import Navbar from "../components/Navbar/Navbar";
import Logo from "../components/Logo/Logo";

export default function LoadingPage() {
	return (
		<>
			<Navbar leftContent={<Logo />} centerContent="Loading" />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					flexDirection: "column",
				}}
			>
				<CircularProgress />
				<h2 style={{ color: "var(--blue)" }}>Loading</h2>
			</div>
		</>
	);
}
