import { useEffect, useState, useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera_add_photo } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import styles from "./PatientProfilePicture.module.css";
import { PatientProfilePictureProps } from "../../types";
import Loading from "../Loading/Loading";
import { useNotification } from "../../hooks/useNotification";
import React from "react";

export default function PatientProfilePicture({
	setProfileImage,
}: PatientProfilePictureProps) {
	const { currentUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const { addNotification } = useNotification();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const profileContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!currentUser?.email) return;

			const patientId = "eVnketmrnfYTn4Vqqro6";

			try {
				const docSnap = await getDoc(doc(db, "patientdetails", patientId));
				let profilePictureUrl = docSnap.exists()
					? docSnap.data()?.profilePictureUrl
					: null;

				if (profilePictureUrl) {
					const storage = getStorage();
					const storageRef = ref(storage, profilePictureUrl);
					try {
						await getDownloadURL(storageRef);
					} catch (error) {
						profilePictureUrl = await getDefaultPictureUrl(addNotification);
						await updateDoc(doc(db, "users", currentUser.email), {
							profilePictureUrl: null,
						});
					}
				}

				if (!profilePictureUrl) {
					setIsLoading(true);
					profilePictureUrl = await getDefaultPictureUrl(addNotification);
					setIsLoading(false);
				}

				setSelectedImage(`${profilePictureUrl}?t=${new Date().getTime()}`);
			} catch (error) {
				console.error("Error fetching user data or image:", error);
				const defaultUrl = await getDefaultPictureUrl(addNotification);
				setSelectedImage(`${defaultUrl}?t=${new Date().getTime()}`);
			}
		};

		fetchData();
	}, [currentUser]);

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
