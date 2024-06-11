import styles from "./Navbar.module.css";
import DesktopNav from "../DesktopNav/DesktopNav";
import MobileNav from "../MobileNav/MobileNav";

export default function Navbar() {
	return (
		<>
			<div className={styles.DesktopNav}>
				<DesktopNav />
			</div>
			<div className={styles.MobileNav}>
				<MobileNav />
			</div>
		</>
	);
}
