import { useState } from "react";
import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { account_circle } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { auth } from "../../firebase/firebase";

interface NavbarProps {
	leftContent: ReactNode;
	centerContent: string;
}

export default function Navbar({ leftContent, centerContent }: NavbarProps) {
	const { currentUser } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	const toggleModalVisibility = () => {
		setIsModalOpen((prev) => !prev);
	};

	const handleSignOut = async () => {
		try {
			await auth.signOut();
			navigate(Paths.LOGIN);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<nav className={styles.navbar}>
			<div className={styles.leftContent}>{leftContent}</div>
			<div className={styles.centerContent}>{centerContent}</div>
			<div className={styles.rightContent}>
				<Icon
					className={styles.userIcon}
					data={account_circle}
					size={32}
					onClick={toggleModalVisibility}
				/>
				<h3>{currentUser?.email?.split("@")[0]}</h3>
			</div>
			{isModalOpen && (
				<div
					className={styles.modalOverlay}
					onClick={toggleModalVisibility}
				>
					<ul
						className={styles.modalList}
						onClick={(e) => e.stopPropagation()}
					>
						<li className={styles.modalItem}>
							<NavLink className={styles.test} to={Paths.ABOUT}>
								About Us
							</NavLink>
						</li>
						<li className={styles.modalItem}>
							<button onClick={handleSignOut}>Sign Out</button>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}
