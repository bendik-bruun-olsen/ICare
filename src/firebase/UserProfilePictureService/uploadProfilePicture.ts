import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default async function uploadProfilePicture(
	path: string,
	file: File
): Promise<string> {
	const storageRef = ref(storage, path);
	const uploadTask = uploadBytesResumable(storageRef, file);
	await new Promise<void>((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			null,
			(error) => {
				console.error("Upload error: ", error);
				reject(error);
			},
			async () => {
				resolve();
			}
		);
	});
	return getDownloadURL(uploadTask.snapshot.ref);
}
