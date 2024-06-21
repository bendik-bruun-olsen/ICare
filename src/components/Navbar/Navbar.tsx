import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { account_circle } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { doSignOut } from "../../firebase/auth";
import { ReactNode } from "react";

interface NavbarProps {
	leftContent: ReactNode;
	centerContent: string;
}

export default function Navbar({ leftContent, centerContent }: NavbarProps) {
	const { currentUser } = useAuth();

	return (
		<nav className={styles.navbar}>
			<div className={styles.leftContent}>{leftContent}</div>
			<div className={styles.centerContent}>{centerContent}</div>
			<div className={styles.rightContent}>
				<Icon
					className={styles.userIcon}
					data={account_circle}
					size={40}
					onClick={doSignOut}
				/>
				<p>{currentUser?.email?.split("@")[0]}</p>
			</div>
		</nav>
	);
}
