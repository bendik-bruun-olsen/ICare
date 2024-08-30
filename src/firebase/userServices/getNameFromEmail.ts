import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getNameFromEmail = async (email: string) => {
	try {
		const userRef = doc(db, "users", email);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			return null;
		}

		return userSnap.data().name;
	} catch {
		return null;
	}
};
