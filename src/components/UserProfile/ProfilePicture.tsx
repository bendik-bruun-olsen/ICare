import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera } from "@equinor/eds-icons";
import { db, storage } from "../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { useAuth } from "../../hooks/useAuth/useAuth";
import "./ProfilePicture.css";
import { UserData } from "../../types";

const ProfilePicture: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageToSelect, setImageToSelect] = useState<string | null>(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const cameraIconRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.email) {
        const userDocRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
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
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target as Node)
      ) {
        setIsOptionsVisible(false);
        setIsGalleryVisible(false);
        setPreviewUrl(null);
        setImageToSelect(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setSelectedImage(imageToSelect);
      setImageToSelect(null);
      setPreviewUrl(null);
      setIsOptionsVisible(false);
      setIsGalleryVisible(false);
    }
  };

  return (
    <div className="profile-picture-container" ref={profileContainerRef}>
      <div className="imageContainer">
        <div className="profile-pic-container">
          <img
            src={selectedImage || "/default-profile-image.jpg"}
            alt="Profile"
            className={`profile-pic ${previewUrl ? "blurred" : ""}`}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="profile-pic-overlay"
            />
          )}
        </div>
        <div
          className="camera-icon"
          onClick={() => {
            setIsOptionsVisible(!isOptionsVisible);
            if (isGalleryVisible) {
              setIsGalleryVisible(false);
              setIsOptionsVisible(false);
            }
          }}
          ref={cameraIconRef}
        >
          <Icon data={camera} />
        </div>

        {isOptionsVisible && (
          <div className="hover-options">
            <div
              onClick={() => {
                fileInputRef.current?.click();
                setIsOptionsVisible(false);
                setIsGalleryVisible(false);
              }}
              className="option"
            >
              Upload New Picture
            </div>
            <div onClick={handleChooseImage} className="option">
              Choose From Existing
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>
      {isGalleryVisible && imageUrls.length > 0 && (
        <div className="image-gallery">
          {imageUrls.map((url) => (
            <div key={url} className="gallery-item">
              <img
                src={url}
                alt="Gallery"
                className="gallery-image"
                onClick={() => handleImageSelect(url)}
              />
              {imageToSelect === url && (
                <button
                  onClick={handleSaveSelectedImage}
                  className="choose-button"
                >
                  Choose
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
