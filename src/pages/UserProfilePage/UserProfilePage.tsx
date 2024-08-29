import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import ProfilePicture from "../../components/UserProfile/ProfilePicture";
import UserProfileForm from "../../components/UserProfile/UserProfileForm";
import styles from "./UserProfilePage.module.css";
import Logo from "../../components/Logo/Logo";

const UserProfilePage: React.FC = () => {
  return (
    <div>
      <Navbar leftContent={<Logo />} centerContent="User Profile" />
      <div className={styles.profileContainer}>
        <ProfilePicture />
        <UserProfileForm />
      </div>
    </div>
  );
};

export default UserProfilePage;
