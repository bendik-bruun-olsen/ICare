import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default async function getNameFromEmail(
	email: string
): Promise<string | null> {
	try {
		const userRef = doc(db, "users", email);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) return null;

		return userSnap.data().name.toString();
	} catch {
		return null;
	}
}
