import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";

interface LogoProps {
	size?: string;
	color?: string;
}

export default function Logo({
	size = "32px",
	color = "var(--white)",
}: LogoProps) {
	const navigate = useNavigate();
	const handleClick = () => navigate(Paths.HOME);
	return (
		<span
			onClick={handleClick}
			style={{
				color: color,
				textAlign: "center",
				fontSize: size,
				fontFamily: "'Lora', serif",
				fontWeight: "500",
				fontStyle: "italic",
				cursor: "pointer",
			}}
		>
			iCare
		</span>
	);
}
