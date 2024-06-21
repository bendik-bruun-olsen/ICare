import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { account_circle } from "@equinor/eds-icons";
import Logo from "../Logo/Logo";
import { useLocation } from "react-router-dom";
import { pageTitleFormatter } from "../../utils/pageTitleFormatter";
import { useAuth } from "../../hooks/useAuth/useAuth";

export default function Navbar() {
	const location = useLocation();

	const { currentUser } = useAuth();

	return (
		<nav className={styles.navbar}>
			<Logo />
			<div className={styles.pageTitleContainer}>
				<h1>{pageTitleFormatter(location.pathname)}</h1>
			</div>
			<div className={styles.userContainer}>
				<Icon
					className={styles.userIcon}
					data={account_circle}
					size={40}
					// onClick={}
				/>
				{/* Split is temporary, until name can be fetched from the database */}
				<p>{currentUser?.email?.split("@")[0]}</p>
			</div>
		</nav>
	);
}
