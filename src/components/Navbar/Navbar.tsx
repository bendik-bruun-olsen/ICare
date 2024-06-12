import styles from "./Navbar.module.css";
import NavLinks from "../NavLinks/NavLinks";
import { Icon } from "@equinor/eds-core-react";
import { menu, close } from "@equinor/eds-icons";
import { useState } from "react";
import Logo from "../Logo/Logo";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClick = () => {
		setIsOpen((prev: boolean) => !prev);
	};

	return (
		<>
			<nav className={styles.navbar}>
				<Logo />
				<Icon
					className={styles.hamburgerMenuIcon}
					data={isOpen ? close : menu}
					size={40}
					onClick={handleClick}
				/>
				{isOpen && (
					<>
						<div className={styles.backdrop} />
						<NavLinks />
					</>
				)}
				<div className={styles.desktopMenu}>
					<NavLinks />
				</div>
			</nav>
		</>
	);
}
