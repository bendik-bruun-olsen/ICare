import { useEffect, useState, useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera_add_photo } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import styles from "./PatientProfilePicture.module.css";
import { PatientProfilePictureProps } from "../../types";
import Loading from "../Loading/Loading";
import { getPatient } from "../../firebase/patientServices/getPatient";
import { useNotification } from "../../hooks/useNotification";

export default function PatientProfilePicture({
	setProfileImage,
}: PatientProfilePictureProps) {
	const { currentUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const { addNotification } = useNotification();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const profileContainerRef = useRef<HTMLDivElement>(null);

	// PatientId is fetched from useContext, which hasn't been made yet
	const patientId = null;
	const isEditingPatient = !!patientId;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				if (isEditingPatient) {
					const patient = await getPatient(patientId, addNotification);
					if (!patient) return;

					if (!patient.profilePictureUrl) {
						const defaultPictureUrl = await getDefaultPictureUrl(
							addNotification
						);
						if (!defaultPictureUrl) return;
						setSelectedImage(defaultPictureUrl);
						return;
					}
					if (patient.profilePictureUrl) {
						setSelectedImage(patient.profilePictureUrl);
					}
				}

				if (!isEditingPatient) {
					const defaultPictureUrl = await getDefaultPictureUrl(addNotification);
					if (!defaultPictureUrl) return;
					setSelectedImage(defaultPictureUrl);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [isEditingPatient]);

	const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0] && currentUser?.email) {
			const image = e.target.files[0];
			setProfileImage(image);
			setSelectedImage(URL.createObjectURL(image));
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="profile-container" ref={profileContainerRef}>
			<div className={styles.profilePictureContainer}>
				<img
					src={selectedImage || ""}
					alt="Profile picture"
					style={{
						width: "150px",
						height: "150px",
						borderRadius: "50%",
						objectFit: "cover",
					}}
				/>
				<div
					className={styles.cameraIcon}
					onClick={() => fileInputRef.current?.click()}
				>
					<Icon data={camera_add_photo} />
				</div>
				<input
					accept="image/*"
					id="icon-button-file"
					type="file"
					capture="user"
					onChange={handleImageAdd}
					style={{ display: "none" }}
					ref={fileInputRef}
				/>
			</div>
		</div>
	);
}
