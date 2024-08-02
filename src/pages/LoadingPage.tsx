import { CircularProgress } from "@equinor/eds-core-react";

export default function LoadingPage() {
	return (
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
	);
}
