import React, { useEffect, useState, useRef } from "react";
import { Button, Icon } from "@equinor/eds-core-react";
import { camera } from "@equinor/eds-icons";
import { useAuth } from "../../hooks/useAuth/useAuth";
import {
	uploadProfilePicture,
	updateProfilePictureUrl,
} from "../../firebase/imageServices/profilePictureService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNotification } from "../../context/NotificationContext";
import { getDefaultPictureUrl } from "../../firebase/imageServices/defaultImage";
import {
	getDownloadURL,
	getStorage,
	listAll,
	ref,
	StorageReference,
} from "firebase/storage";
import styles from "./UploadProfilePicture.module.css";

const UserProfilePage: React.FC = () => {
	const { currentUser } = useAuth();
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [showOptions, setShowOptions] = useState(false);
	const [showGallery, setShowGallery] = useState(false);
	const { addNotification } = useNotification();

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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!profileContainerRef.current?.contains(event.target as Node)) {
				setShowOptions(false);
				setShowGallery(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0] && currentUser?.email) {
			try {
				const downloadURL = await uploadProfilePicture(
					e.target.files[0],
					currentUser.email
				);
				await updateProfilePictureUrl(currentUser.email, downloadURL);
				setSelectedImage(`${downloadURL}?t=${new Date().getTime()}`);
				setShowOptions(false);
				addNotification("Image uploaded successfully", "success");
			} catch (error) {
				console.error("Error uploading image:", error);
				addNotification("Error uploading image", "error");
			}
		}
	};

	const handleChooseImage = async () => {
		if (!currentUser?.email) return;

		try {
			const storage = getStorage();
			const storageRef = ref(storage, `profilePictures/${currentUser.email}/`);
			const listResult = await listAll(storageRef);

			const urls = await Promise.all(
				listResult.items.map(async (itemRef: StorageReference) => {
					return await getDownloadURL(itemRef);
				})
			);

			setImageUrls(urls);
			setShowOptions(false);
			setShowGallery(true);
		} catch (error) {
			console.error("Error fetching images: ", error);
		}
	};

	const handleImageSelect = async (url: string) => {
		if (!currentUser?.email) return;

		try {
			await updateProfilePictureUrl(currentUser.email, url);
			setSelectedImage(`${url}?t=${new Date().getTime()}`);
			setShowGallery(false);
		} catch (error) {
			console.error("Error saving selected image:", error);
		}
	};

	return (
		<div className="profile-container" ref={profileContainerRef}>
			<div className={styles.profilePictureContainer}>
				<img
					src={selectedImage || ""}
					alt="Profile"
					style={{
						width: "85px",
						height: "85px",
						borderRadius: "50%",
						objectFit: "cover",
					}}
				/>
				{showGallery && (
					<div className={styles.imageGallery}>
						{imageUrls.map((url) => (
							<div key={url} className="gallery-item">
								<img
									src={`${url}?t=${new Date().getTime()}`}
									alt="Gallery"
									className={styles.galleryImage}
									onClick={() => handleImageSelect(url)}
									style={{
										height: "85px",
										width: "85px",
										borderRadius: "50%",
										objectFit: "cover",
									}}
								/>
							</div>
						))}
					</div>
				)}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginTop: "5px",
					}}
					onClick={() => setShowOptions(!showOptions)}
				>
					<Icon data={camera} />
				</div>
				{showOptions && (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Button
							onClick={() => fileInputRef.current?.click()}
							className="option"
							style={{ marginRight: "5px" }}
						>
							Upload New Picture
						</Button>
						<Button onClick={handleChooseImage} className="option">
							Choose From Existing
						</Button>
					</div>
				)}
				<input
					type="file"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleImageUpload}
				/>
			</div>
		</div>
	);
};

export default UserProfilePage;
