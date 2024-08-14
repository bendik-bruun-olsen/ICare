import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import BackHomeButton from "../../components/BackHomeButton";
import { db, storage } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { UserData } from "../../types";
import UserProfileForm from "../../components/UserProfile/UserProfileForm";
import ProfilePicture from "../../components/UserProfile/ProfilePicture";
import "./UserProfilePage.css";

const UserProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageToSelect, setImageToSelect] = useState<string | null>(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const fullInfoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.email) {
        const userDocRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);
          setSelectedImage(data.profilePictureUrl || null);
        } else {
          console.error("No such document!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fullInfoContainerRef.current &&
        !fullInfoContainerRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const updatedData = { ...userData, [id]: value } as UserData;
    setUserData(updatedData);

    if (currentUser?.email) {
      try {
        const userDocRef = doc(db, "users", currentUser.email);
        await updateDoc(userDocRef, { [id]: value });
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const userFolder = currentUser?.email || "default";
      const storageRef = ref(
        storage,
        `profilePictures/${userFolder}/${file.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (currentUser?.email) {
              updateDoc(doc(db, "users", currentUser.email), {
                profilePictureUrl: downloadURL,
              });
              setUserData((prevData) => {
                if (prevData) {
                  return {
                    ...prevData,
                    profilePictureUrl: downloadURL,
                  };
                }
                return prevData;
              });
              setSelectedImage(downloadURL);
              setPreviewUrl(null);
              setIsOptionsVisible(false);
              setIsGalleryVisible(false);
            }
          });
        }
      );
    }
  };

  const handleChooseImage = async () => {
    const userFolder = currentUser?.email || "default";
    const storageRef = ref(storage, `profilePictures/${userFolder}/`);
    try {
      const listResult = await listAll(storageRef);
      const urls = await Promise.all(
        listResult.items.map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        })
      );
      setImageUrls(urls);
      setIsOptionsVisible(false);
      setIsGalleryVisible(true);
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  const handleImageSelect = (url: string) => {
    setImageToSelect(url);
    setPreviewUrl(url);
  };

  const handleSaveSelectedImage = () => {
    if (currentUser?.email && imageToSelect) {
      updateDoc(doc(db, "users", currentUser.email), {
        profilePictureUrl: imageToSelect,
      });
      setUserData((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            profilePictureUrl: imageToSelect,
          };
        }
        return prevData;
      });
      setSelectedImage(imageToSelect);
      setImageToSelect(null);
      setPreviewUrl(null);
      setIsOptionsVisible(false);
      setIsGalleryVisible(false);
    }
  };

  return (
    <div>
      <Navbar leftContent={<BackHomeButton />} centerContent="User Profile" />
      <div className="profile-container">
        <ProfilePicture
          selectedImage={selectedImage}
          previewUrl={previewUrl}
          isOptionsVisible={isOptionsVisible}
          isGalleryVisible={isGalleryVisible}
          imageUrls={imageUrls}
          imageToSelect={imageToSelect}
          handleImageUpload={handleImageUpload}
          handleChooseImage={handleChooseImage}
          handleImageSelect={handleImageSelect}
          handleSaveSelectedImage={handleSaveSelectedImage}
          setIsOptionsVisible={setIsOptionsVisible}
          setIsGalleryVisible={setIsGalleryVisible}
        />
        <UserProfileForm
          userData={userData}
          isEditing={isEditing}
          handleEditClick={handleEditClick}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
