import { doc, updateDoc } from "firebase/firestore";
import {
	getStorage,
	getDownloadURL,
	listAll,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { db } from "../firebase";

const storage = getStorage();

export const uploadProfilePicture = async (
	file: File,
	userEmail: string
): Promise<string> => {
	const storageRef = ref(storage, `patientPictures/${userEmail}/${file.name}`);
	const uploadTask = uploadBytesResumable(storageRef, file);

	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			null,
			(error) => reject(error),
			async () => {
				try {
					const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
					resolve(downloadUrl);
				} catch (error) {
					reject(error);
				}
			}
		);
	});
};

export const updateProfilePictureUrl = async (
	userEmail: string,
	downloadUrl: string
): Promise<void> => {
	const userDocRef = doc(db, "patientdetails", userEmail);
	await updateDoc(userDocRef, { profilePictureUrl: downloadUrl });
};

export const listProfilePictures = async (
	userEmail: string
): Promise<string[]> => {
	const storageRef = ref(storage, `patientPictures/${userEmail}`);
	const listResult = await listAll(storageRef);
	return listResult.items.map((item) => item.fullPath);
};
