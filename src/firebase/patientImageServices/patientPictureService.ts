import { doc, updateDoc } from "firebase/firestore";
import {
	getStorage,
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { db } from "../firebase";

const storage = getStorage();

export const uploadProfilePicture = async (file: File, patientId: string) => {
	const storageRef = ref(storage, `patientImages/${patientId}`);
	await uploadBytesResumable(storageRef, file);
	const downloadUrl = await getDownloadURL(storageRef);
	const patientRef = doc(db, "patientdetails", patientId);
	await updateDoc(patientRef, { profilePictureUrl: downloadUrl });
};
