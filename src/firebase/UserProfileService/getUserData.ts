import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { User } from "../../types";

const getUserData = async (email: string): Promise<User | null> => {
	const userDocRef = doc(db, "users", email);
	const docSnap = await getDoc(userDocRef);
	if (docSnap.exists()) {
		return docSnap.data() as User;
	} else {
		console.error("No such document!");
		return null;
	}
};

export default getUserData;
