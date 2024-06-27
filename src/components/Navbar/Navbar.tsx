import { useState } from "react";
import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { person, contacts, contact_email, log_out } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Paths } from "../../paths";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
	leftContent: ReactNode;
	centerContent: string;
}

export default function Navbar({ leftContent, centerContent }: NavbarProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const username = useAuth().userData?.name;
	const capitalizedUsername =
		(username ?? "").toLowerCase().charAt(0).toUpperCase() +
		(username ?? "").slice(1);

	const toggleModalVisibility = () => {
		setIsModalOpen((prev) => !prev);
	};

	const handleSignOut = async () => {
		try {
			await auth.signOut();
		} catch (err) {
			navigate(Paths.ERROR);
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
				<span>{capitalizedUsername}</span>
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
								<span>Contact Details</span>
							</NavLink>
						</li>
						<li className={styles.modalItem}>
							<NavLink to={Paths.ABOUT}>
								<Icon data={contacts} size={24} />
								<span>About Us</span>
							</NavLink>
						</li>
						<li className={styles.modalItem}>
							<div
								className={styles.signOutContainer}
								onClick={handleSignOut}
							>
								<Icon data={log_out} size={24} />
								<span>Sign Out</span>
							</div>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}
