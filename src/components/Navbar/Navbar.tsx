import { useState } from "react";
import styles from "./Navbar.module.css";
import { Icon } from "@equinor/eds-core-react";
import { person, contacts, log_out, account_circle } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { NavLink } from "react-router-dom";
import { Paths } from "../../paths";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { capitalizeUsername } from "../../utils";
import Logo from "../Logo/Logo";
import { NotificationType } from "../../types";

interface NavbarProps {
	centerContent: string;
}

export default function Navbar({ centerContent }: NavbarProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const username = useAuth().userData?.name;
	const { addNotification } = useNotification();

	const toggleModalVisibility = () => {
		setIsModalOpen((prev) => !prev);
	};

	const handleSignOut = async () => {
		try {
			await auth.signOut();
			addNotification("Logged out successfully!", NotificationType.SUCCESS);
		} catch {
			navigate(Paths.ERROR);
			addNotification("Error! Please try again later", NotificationType.ERROR);
		}
	};

	return (
		<nav className={styles.navbar}>
			<div className={styles.leftContent}>
				<Logo />
			</div>
			<div className={styles.centerContent}>
				<h1>{centerContent}</h1>
			</div>
			<div className={styles.rightContent} onClick={toggleModalVisibility}>
				<Icon className={styles.userIcon} data={person} size={32} />
				<span>{capitalizeUsername(username ?? "")}</span>
			</div>
			{isModalOpen && (
				<div className={styles.modalOverlay} onClick={toggleModalVisibility}>
					<ul className={styles.modalList} onClick={(e) => e.stopPropagation()}>
						<li className={styles.modalItem}>
							<NavLink to={Paths.USER_PROFILE}>
								<Icon data={account_circle} size={24} />
								<span>User Profile</span>
							</NavLink>
						</li>
						<li className={styles.modalItem}>
							<NavLink to={Paths.ABOUT}>
								<Icon data={contacts} size={24} />
								<span>About Us</span>
							</NavLink>
						</li>
						<li className={styles.modalItem}>
							<div className={styles.signOutContainer} onClick={handleSignOut}>
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
