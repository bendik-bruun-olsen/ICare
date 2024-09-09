import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { User } from "../../types";

const updateUserData = async (
	email: string,
	data: Partial<User>
): Promise<void> => {
	const userDocRef = doc(db, "users", email);
	await updateDoc(userDocRef, { ...data });
};

export default updateUserData;
