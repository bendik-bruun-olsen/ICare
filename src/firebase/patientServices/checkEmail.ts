import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const checkEmailExists = async (email: string) => {
	const ref = collection(db, "users");
	const q = query(ref, where("email", "==", email));
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		return false;
	}
	return true;
};
