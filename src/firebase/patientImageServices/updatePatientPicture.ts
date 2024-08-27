import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateProfilePictureUrl = async (
	userEmail: string,
	downloadUrl: string
): Promise<void> => {
	const userDocRef = doc(db, "patientdetails", userEmail);
	await updateDoc(userDocRef, { profilePictureUrl: downloadUrl });
};
