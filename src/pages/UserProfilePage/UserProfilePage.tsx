import React, { useEffect, useState, useRef } from "react";
import { Input, Label, NativeSelect, Icon } from "@equinor/eds-core-react";
import { edit, camera } from "@equinor/eds-icons";
import "./UserProfilePage.css";
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
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const fullInfoContainerRef = useRef<HTMLDivElement>(null);
  const cameraIconRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      if (
        cameraIconRef.current &&
        !cameraIconRef.current.contains(event.target as Node) &&
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
                setIsOptionsVisible((prev) => !prev);
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
        <div className="fullInfoContainer" ref={fullInfoContainerRef}>
          <div className="userInfo">
            <h2>User Information</h2>
            <Icon
              data={edit}
              onClick={handleEditClick}
              style={{ color: isEditing ? "grey" : "black", cursor: "pointer" }}
            />
          </div>
          <div className="inputGroup">
            <Label htmlFor="name" label="Name" />
            <Input
              id="name"
              type="text"
              value={userData?.name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="inputGroup">
            <Label htmlFor="age" label="Age" />
            <Input
              id="age"
              type="number"
              value={userData?.age || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="inputGroup">
            <Label htmlFor="gender" label="Gender" />
            <NativeSelect
              id="gender"
              label=""
              value={userData?.gender || ""}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </NativeSelect>
          </div>
          <div className="inputGroup">
            <Label htmlFor="phone" label="Phone" />
            <Input
              id="phone"
              type="tel"
              value={userData?.phone || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="inputGroup">
            <Label htmlFor="email" label="Email" />
            <Input
              id="email"
              type="email"
              value={userData?.email || ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
