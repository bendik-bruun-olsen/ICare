import React, { useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera } from "@equinor/eds-icons";
import "./ProfilePicture.css";

interface ProfilePictureProps {
  selectedImage: string | null;
  previewUrl: string | null;
  isOptionsVisible: boolean;
  isGalleryVisible: boolean;
  imageUrls: string[];
  imageToSelect: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChooseImage: () => void;
  handleImageSelect: (url: string) => void;
  handleSaveSelectedImage: () => void;
  setIsOptionsVisible: (value: boolean) => void;
  setIsGalleryVisible: (value: boolean) => void;
  profileContainerRef: React.RefObject<HTMLDivElement>;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  selectedImage,
  previewUrl,
  isOptionsVisible,
  isGalleryVisible,
  imageUrls,
  imageToSelect,
  handleImageUpload,
  handleChooseImage,
  handleImageSelect,
  handleSaveSelectedImage,
  setIsOptionsVisible,
  setIsGalleryVisible,
  profileContainerRef,
}) => {
  const cameraIconRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
