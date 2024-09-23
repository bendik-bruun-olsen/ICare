import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const getPatientPicture = async (
	patientId: string,
	file: File
): Promise<string | null> => {
	const storage = getStorage();
	const storageRef = ref(storage, `patientImages/${patientId}/${file.name}`);
	try {
		const downloadURL = await getDownloadURL(storageRef);
		return downloadURL;
	} catch (error) {
		console.error("Error fetching profile picture URL:", error);
		return null;
	}
};
