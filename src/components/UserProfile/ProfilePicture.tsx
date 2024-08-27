import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera } from "@equinor/eds-icons";
import { db, storage } from "../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../hooks/useAuth/useAuth";
import "./ProfilePicture.css";
import { UserData } from "../../types";

const ProfilePicture: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the user's profile picture or the default picture
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.email) {
        const userDocRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          if (data.profilePictureUrl) {
            setSelectedImage(data.profilePictureUrl);
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

    fetchUserData();
  }, [currentUser]);

  // Load the default profile picture from Firebase Storage
  const loadDefaultProfilePicture = async () => {
    try {
      const defaultPicRef = ref(storage, "Default.png"); // Adjust this path if Default.png is in a subfolder
      const defaultUrl = await getDownloadURL(defaultPicRef);
      setSelectedImage(defaultUrl);
    } catch (error) {
      console.error("Error loading default profile picture:", error);
      // Fallback to a local default image if Firebase storage fails
      setSelectedImage("/default-profile-image.jpg");
    }
  };

  // Handle the image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const userFolder = currentUser?.email || "default";
      const storageRef = ref(
        storage,
        `profilePictures/${userFolder}/${file.name}`
      );

      try {
        const uploadTask = uploadBytesResumable(storageRef, file);

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
      }
    }
  };

  return (
    <div className="profile-picture-container">
      <div className="imageContainer">
        <div className="profile-pic-container">
          <img
            src={selectedImage || "/default-profile-image.jpg"}
            alt="Profile"
            className="profile-pic"
          />
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
          className="camera-icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Icon data={camera} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
