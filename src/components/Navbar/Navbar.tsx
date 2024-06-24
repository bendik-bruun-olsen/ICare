import { useState } from "react";
import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { person, contacts, contact_email, log_out } from "@equinor/eds-icons";
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
			<div className={styles.centerContent}>
				<h1>{centerContent}</h1>
			</div>
			<div
				className={styles.rightContent}
				onClick={toggleModalVisibility}
			>
				<Icon className={styles.userIcon} data={person} size={32} />
				<p>{currentUser?.email?.split("@")[0]}</p>
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
							<NavLink to={Paths.CONTACT}>
								<Icon data={contact_email} size={24} />
								<p>Contact Details</p>
							</NavLink>
						</li>
						<li className={styles.modalItem}>
							<NavLink to={Paths.ABOUT}>
								<Icon data={contacts} size={24} />
								<p>About Us</p>
							</NavLink>
						</li>
						<li className={styles.modalItem}>
							<div
								className={styles.signOutContainer}
								onClick={handleSignOut}
							>
								<Icon data={log_out} size={24} />
								<p>Sign Out</p>
							</div>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}
