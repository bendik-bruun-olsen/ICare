import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { account_circle } from "@equinor/eds-icons";
import Logo from "../Logo/Logo";

export default function Navbar() {
	return (
		<nav className={styles.navbar}>
			<Logo />
			<div className={styles.container}>
				<Icon
					className={styles.hamburgerMenuIcon}
					data={account_circle}
					size={40}
					// onClick={}
				/>
			</div>
		</nav>
	);
}
