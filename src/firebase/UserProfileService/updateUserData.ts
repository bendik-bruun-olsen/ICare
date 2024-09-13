import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { User } from "../../types";

export default async function updateUserData(
	email: string,
	data: Partial<User>
): Promise<void> {
	const userDocRef = doc(db, "users", email);
	await updateDoc(userDocRef, { ...data });
}
