import Navbar from "../../components/Navbar/Navbar";
import ProfilePicture from "../../components/UserProfile/ProfilePicture";
import UserProfileForm from "../../components/UserProfile/UserProfileForm";
import styles from "./UserProfilePage.module.css";

export default function UserProfilePage(): JSX.Element {
	return (
		<div>
			<Navbar centerContent="User Profile" />
			<div className={styles.profileContainer}>
				<ProfilePicture />
				<UserProfileForm />
			</div>
		</div>
	);
}
