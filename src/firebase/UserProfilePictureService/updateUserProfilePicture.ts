import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default async function updateUserProfilePicture(
	email: string,
	profilePictureUrl: string
): Promise<void> {
	const userDocRef = doc(db, "users", email);
	await updateDoc(userDocRef, { profilePictureUrl });
}
