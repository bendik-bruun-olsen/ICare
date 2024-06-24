import { useState } from "react";
import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { account_circle } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { doSignOut } from "../../firebase/auth";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Paths } from "../../paths";

interface NavbarProps {
	leftContent: ReactNode;
	centerContent: string;
}

export default function Navbar({ leftContent, centerContent }: NavbarProps) {
	const { currentUser } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
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
					onClick={openModal}
				/>
				<h3>{currentUser?.email?.split("@")[0]}</h3>
			</div>
			{isModalOpen && (
				<div className={styles.modalOverlay} onClick={closeModal}>
					<ul
						className={styles.modalContent}
						onClick={(e) => e.stopPropagation()}
					>
						<li>
							<NavLink to={Paths.ABOUT}>About Us</NavLink>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}
