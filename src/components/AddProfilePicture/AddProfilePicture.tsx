import { useEffect, useState, useRef } from "react";
import { Icon } from "@equinor/eds-core-react";
import { camera_add_photo } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import styles from "./AddProfilePicture.module.css";
import { AddProfilePictureProps } from "../../types";

export default function AddProfilePicture({
	setProfileImage,
}: AddProfilePictureProps) {
	const { currentUser } = useAuth();
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const profileContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!currentUser?.email) return;

			try {
				const docSnap = await getDoc(doc(db, "users", currentUser.email));
				let profilePictureUrl = docSnap.exists()
					? docSnap.data()?.profilePictureUrl
					: null;

				if (profilePictureUrl) {
					const storage = getStorage();
					const storageRef = ref(storage, profilePictureUrl);
					try {
						await getDownloadURL(storageRef);
					} catch (error) {
						profilePictureUrl = await getDefaultPictureUrl();
						await updateDoc(doc(db, "users", currentUser.email), {
							profilePictureUrl: null,
						});
					}
				}

				if (!profilePictureUrl) {
					profilePictureUrl = await getDefaultPictureUrl();
				}

				setSelectedImage(`${profilePictureUrl}?t=${new Date().getTime()}`);
			} catch (error) {
				console.error("Error fetching user data or image:", error);
				const defaultUrl = await getDefaultPictureUrl();
				setSelectedImage(`${defaultUrl}?t=${new Date().getTime()}`);
			}
		};

		fetchUserData();
	}, [currentUser]);

	const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0] && currentUser?.email) {
			const image = e.target.files[0];
			setProfileImage(image);
			setSelectedImage(URL.createObjectURL(image));
		}
	};

	return (
		<div className="profile-container" ref={profileContainerRef}>
			<div className={styles.profilePictureContainer}>
				<img
					src={selectedImage || ""}
					alt="Profile"
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
