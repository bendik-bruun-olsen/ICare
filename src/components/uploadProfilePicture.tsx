import React, { useEffect, useState, useRef } from "react";
import { Button, Icon } from "@equinor/eds-core-react";
import { camera } from "@equinor/eds-icons";
import { useAuth } from "../hooks/useAuth/useAuth";
import {
	uploadProfilePicture,
	listProfilePictures,
	updateProfilePictureUrl,
} from "../firebase/imageServices/profilePictureService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNotification } from "../context/NotificationContext";
import { getDefaultPictureUrl } from "../firebase/imageServices/defaultImage";

const UserProfilePage: React.FC = () => {
	const { currentUser } = useAuth();
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [defaultImage, setDefaultImage] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [showOptions, setShowOptions] = useState(false);
	const [showGallery, setShowGallery] = useState(false);
	const { addNotification } = useNotification();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const profileContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!currentUser?.email) return;
			const docSnap = await getDoc(doc(db, "users", currentUser.email));
			if (docSnap.exists())
				setSelectedImage(docSnap.data()?.profilePictureUrl || null);
		};
		fetchUserData();
	}, [currentUser]);

	useEffect(() => {
		const fetchDefaultImage = async () => {
			const url = await getDefaultPictureUrl();
			setDefaultImage(url);
		};
		fetchDefaultImage();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!profileContainerRef.current?.contains(event.target as Node)) {
				setShowOptions(false);
				setShowGallery(false);
				setPreviewUrl(null);
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
				setSelectedImage(downloadURL);
				setShowOptions(false);
				addNotification("Image uploaded successfully", "success");
			} catch (error) {
				addNotification("Error uploading image", "error");
			}
		}
	};

	const handleChooseImage = async () => {
		if (!currentUser?.email) return;
		try {
			const urls = await listProfilePictures(currentUser.email);
			setImageUrls(urls);
			setShowGallery(true);
			setShowOptions(false);
		} catch (error) {
			console.error("Error fetching images:", error);
		}
	};

	const handleImageSelect = async (url: string) => {
		if (!currentUser?.email) return;
		try {
			await updateProfilePictureUrl(currentUser.email, url);
			setSelectedImage(url);
			setPreviewUrl(null);
			setShowGallery(false);
		} catch (error) {
			console.error("Error saving selected image:", error);
		}
	};

	return (
		<div className="profile-container" ref={profileContainerRef}>
			<div className="profile-picture-container">
				<img
					src={selectedImage || previewUrl || defaultImage || "fallback-url"}
					alt="Profile"
					className={`profile-pic ${previewUrl ? "blurred" : ""}`}
				/>
				{showGallery && (
					<div className="image-gallery">
						{imageUrls.map((url) => (
							<div key={url} className="gallery-item">
								<img
									src={url}
									alt="Gallery"
									className="gallery-image"
									onClick={() => handleImageSelect(url)}
								/>
							</div>
						))}
					</div>
				)}
				<div
					className="camera-icon"
					onClick={() => setShowOptions(!showOptions)}
				>
					<Icon data={camera} />
				</div>
				{showOptions && (
					<div className="hover-options">
						<Button
							onClick={() => fileInputRef.current?.click()}
							className="option"
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
