import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { account_circle } from "@equinor/eds-icons";
import Logo from "../Logo/Logo";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar() {
	const location = useLocation();

	useEffect(() => {
		console.log("pathname: ", location.pathname);
	}, [location]);

	return (
		<nav className={styles.navbar}>
			<Logo />
			<div className={styles.pageTitleContainer}>
				<h1> {location.pathname}</h1>
			</div>
			<div className={styles.userContainer}>
				<Icon
					className={styles.userIcon}
					data={account_circle}
					size={40}
					// onClick={}
				/>
			</div>
		</nav>
	);
}
