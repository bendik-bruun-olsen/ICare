import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera_add_photo } from "@equinor/eds-icons";
import getUserProfile from "../../firebase/UserProfilePictureService/getUserProfile";
import updateUserProfilePicture from "../../firebase/UserProfilePictureService/updateUserProfilePicture";
import getProfilePictureUrl from "../../firebase/UserProfilePictureService/getProfilePictureUrl";
import uploadProfilePicture from "../../firebase/UserProfilePictureService/uploadProfilePicture";
import deleteAllFilesInFolder from "../../firebase/UserProfilePictureService/deleteAllFilesInFolder";
import getDefaultProfilePictureUrl from "../../firebase/UserProfilePictureService/getDefaultProfilePictureUrl";
import { useAuth } from "../../hooks/useAuth/useAuth";
import styles from "./ProfilePicture.module.css";

const ProfilePicture: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Max file size: 1 MB"
  );
  const [isFileSizeError, setIsFileSizeError] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      if (currentUser?.email) {
        const userFolder = currentUser.email;
        const userProfile = await getUserProfile(currentUser.email);

        if (userProfile?.profilePictureUrl) {
          try {
            const imageUrl = await getProfilePictureUrl(
              `profilePictures/${userFolder}/`
            );
            if (imageUrl) {
              setSelectedImage(imageUrl);
            } else {
              await updateUserProfilePicture(currentUser.email, "");
              loadDefaultProfilePicture();
            }
          } catch (error) {
            console.error("Error checking profile picture in storage:", error);
            loadDefaultProfilePicture();
          }
        } else {
          loadDefaultProfilePicture();
        }
      } else {
        loadDefaultProfilePicture();
      }
    };

    fetchUserProfilePic();
  }, [currentUser]);

  const loadDefaultProfilePicture = async () => {
    try {
      const defaultUrl = await getDefaultProfilePictureUrl();
      setSelectedImage(defaultUrl);
    } catch (error) {
      console.error("Error loading default profile picture:", error);
      setSelectedImage("/Default.png");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 1) {
        setErrorMessage("File is too big. Max size is 1 MB.");
        setIsFileSizeError(true);
        return;
      }

      setErrorMessage("Max file size: 1 MB");
      setIsFileSizeError(false);
      const userFolder = currentUser?.email;
      const storagePath = `profilePictures/${userFolder}/`;

      try {
        await deleteAllFilesInFolder(storagePath);
        const newFileName = `${Date.now()}_${file.name}`;
        const downloadURL = await uploadProfilePicture(
          `${storagePath}${newFileName}`,
          file
        );
        if (currentUser?.email) {
          await updateUserProfilePicture(currentUser.email, downloadURL);
          setSelectedImage(downloadURL);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        setErrorMessage("Failed to upload profile picture. Please try again.");
        setIsFileSizeError(true);
      }
    }
  };

  return (
    <div className={styles.profilePictureContainer}>
      <div className={styles.imageContainer}>
        <div className={styles.profilePicContainer}>
          <img
            src={selectedImage || "/default-profile-image.jpg"}
            alt="Profile"
            className={styles.profilePic}
          />
          <div
            className={`${styles.errorMessage} ${
              isFileSizeError ? styles.error : ""
            }`}
          >
            {errorMessage}
          </div>
        </div>
        <input
          type="file"
          id="imageFile"
          capture="user"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <div
          className={styles.cameraIcon}
          onClick={() => fileInputRef.current?.click()}
        >
          <Icon data={camera_add_photo} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
