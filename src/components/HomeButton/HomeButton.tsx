import { Icon } from "@equinor/eds-core-react";
import { home } from "@equinor/eds-icons";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import styles from "./HomeButton.module.css";

export default function HomeButton() {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate(Paths.HOME);
	};

	return (
		<Icon className={styles.icon} data={home} size={40} onClick={handleClick} />
	);
}
