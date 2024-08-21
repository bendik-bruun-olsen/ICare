import { getDownloadURL, getStorage, ref } from "firebase/storage";

export const getDefaultPictureUrl = async () => {
	const storage = getStorage();
	const defaultPictureRef = ref(storage, "default-profile-image (Custom).png");
	try {
		const url = await getDownloadURL(defaultPictureRef);
		return url;
	} catch (err) {
		console.error(err);
		return "";
	}
};
