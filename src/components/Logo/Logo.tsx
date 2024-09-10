import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import styles from "./Logo.module.css";

interface LogoProps {
	fontSize?: string;
	color?: string;
}

export default function Logo({
	fontSize = "32px",
	color = "var(--white)",
}: LogoProps): JSX.Element {
	const navigate = useNavigate();
	const handleClick = (): void => navigate(Paths.HOME);
	return (
		<span
			onClick={handleClick}
			className={styles.logo}
			style={{ fontSize, color }}
		>
			iCare
		</span>
	);
}
