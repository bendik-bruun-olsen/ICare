import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default async function getDefaultProfilePictureUrl(): Promise<string> {
	const defaultPicRef = ref(storage, "Default.png");
	return getDownloadURL(defaultPicRef);
}
