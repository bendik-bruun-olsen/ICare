import { useEffect, useState, useRef, useContext } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera_add_photo } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import styles from "./PatientProfilePicture.module.css";
import { NotificationType, PatientProfilePictureProps } from "../../types";
import { getPatient } from "../../firebase/patientServices/getPatient";
import { NotificationContext } from "../../context/NotificationContext";
import { updateProfilePictureUrl } from "../../firebase/patientImageServices/updatePatientPicture";
import { getPatientPicture } from "../../firebase/patientImageServices/getPatientPicture";

export default function PatientProfilePicture({
  setProfileImage,
  showIcon = true,
  showMaxFileSize = true,
}: PatientProfilePictureProps): JSX.Element {
  const { currentPatientId } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addNotification } = useContext(NotificationContext);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Max file size: 1 MB"
  );
  const [isFileSizeError, setIsFileSizeError] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  const patientId = currentPatientId;
  const isEditingPatient = !!patientId;

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (isEditingPatient) {
          const patient = await getPatient(patientId, addNotification);

          if (!patient) return;

          const imageUrl = await getPatientPicture(patientId);

          if (imageUrl) {
            setSelectedImage(imageUrl);
          }

          if (!imageUrl) {
            const defaultPictureUrl = await getDefaultPictureUrl(
              addNotification
            );
            if (!defaultPictureUrl) return;
            setSelectedImage(defaultPictureUrl);
          }
        }

        if (!isEditingPatient) {
          const defaultPictureUrl = await getDefaultPictureUrl(addNotification);
          if (!defaultPictureUrl) return;
          setSelectedImage(defaultPictureUrl);
        }
      } catch (error) {
        addNotification("Failed to fetch patient data", NotificationType.ERROR);
      }
    };
    fetchData();
  }, [isEditingPatient, patientId]);

  const handleImageAdd = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 1) {
        setErrorMessage("File is too big. Max size is 1 MB.");
        setIsFileSizeError(true);
        return;
      }

      setIsFileSizeError(false);
      const image = e.target.files[0];
      setProfileImage(image);
      setSelectedImage(URL.createObjectURL(image));
    }
  };

  return (
    <div ref={profileContainerRef}>
      <div className={styles.profilePictureContainer}>
        <img
          src={selectedImage || ""}
          alt="Profile picture"
          className={styles.image}
        />
        {showIcon && (
          <>
            {showMaxFileSize && (
              <div
                className={`${styles.errorMessage} ${
                  isFileSizeError ? styles.error : ""
                }`}
              >
                {errorMessage}
              </div>
            )}
            <div
              className={styles.cameraIcon}
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon data={camera_add_photo} />
            </div>
            <input
              accept="image/*"
              type="file"
              capture="user"
              onChange={handleImageAdd}
              className={styles.imageInput}
              ref={fileInputRef}
            />
          </>
        )}
      </div>
    </div>
  );
}
