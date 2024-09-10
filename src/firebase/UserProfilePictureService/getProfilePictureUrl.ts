import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase";

export default async function getProfilePictureUrl(
	path: string
): Promise<string | null> {
	const storageRef = ref(storage, path);
	const listResult = await listAll(storageRef);
	if (listResult.items.length > 0) {
		return getDownloadURL(listResult.items[0]);
	}
	return null;
}
