import NavLinks from "../NavLinks/NavLinks";
import Logo from "../Logo/Logo";
import styles from "./DesktopNav.module.css";

export default function DesktopNav() {
	return (
		<nav className={styles.DesktopNav}>
			<Logo />
			<NavLinks />
		</nav>
	);
}
