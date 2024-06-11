import NavLinks from "../NavLinks/NavLinks";
import Logo from "../Logo/Logo";
import styles from "./MobileNav.module.css";
import { Icon } from "@equinor/eds-core-react";
import { menu, close } from "@equinor/eds-icons";
import { useState } from "react";

export default function MobileNav() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClick = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<nav className={styles.MobileNav}>
			<Logo />
			<Icon
				className={styles.hamburgerMenuIcon}
				data={isOpen ? close : menu}
				size={40}
				onClick={handleClick}
			/>
			{isOpen && (
				<>
					<NavLinks />
					<div className={styles.backdrop} />
				</>
			)}
		</nav>
	);
}
