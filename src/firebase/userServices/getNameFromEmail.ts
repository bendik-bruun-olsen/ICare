import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default async function getNameFromEmail(
	email: string
): Promise<DocumentData | null> {
	try {
		const userRef = doc(db, "users", email);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) return null;

		return userSnap.data().name;
	} catch {
		return null;
	}
}
