import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera_add_photo } from "@equinor/eds-icons";
import { db, storage } from "../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { useAuth } from "../../hooks/useAuth/useAuth";
import styles from "./ProfilePicture.module.css";
import { UserProfile } from "../../types";

const ProfilePicture: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Max file size: 5 MB"
  );
  const [isFileSizeError, setIsFileSizeError] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      if (currentUser?.email) {
        const userFolder = currentUser.email;
        const userDocRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;

          if (data.profilePictureUrl) {
            try {
              const storageRef = ref(storage, `profilePictures/${userFolder}/`);
              const listResult = await listAll(storageRef);

              if (listResult.items.length === 0) {
                await updateDoc(userDocRef, { profilePictureUrl: "" });
                loadDefaultProfilePicture();
              } else {
                setSelectedImage(data.profilePictureUrl);
              }
            } catch (error) {
              console.error(
                "Error checking profile picture in storage:",
                error
              );
              loadDefaultProfilePicture();
            }
          } else {
            loadDefaultProfilePicture();
          }
        } else {
          console.error("No such document! Loading default picture.");
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
      const defaultPicRef = ref(storage, "Default.png");
      const defaultUrl = await getDownloadURL(defaultPicRef);
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

      setErrorMessage("Max file size: 5 MB");
      setIsFileSizeError(false);
      const userFolder = currentUser?.email;
      const storageRef = ref(storage, `profilePictures/${userFolder}/`);

      try {
        const listResult = await listAll(storageRef);
        const deleteOldPic = listResult.items.map((item) => deleteObject(item));
        await Promise.all(deleteOldPic);

        const newFileName = `${Date.now()}_${file.name}`;
        const newStorageRef = ref(
          storage,
          `profilePictures/${userFolder}/${newFileName}`
        );

        const uploadTask = uploadBytesResumable(newStorageRef, file);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload error: ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (currentUser?.email) {
              await updateDoc(doc(db, "users", currentUser.email), {
                profilePictureUrl: downloadURL,
              });
              setSelectedImage(downloadURL);
            }
          }
        );
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
