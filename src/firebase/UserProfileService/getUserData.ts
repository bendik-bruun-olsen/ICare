import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { UserData } from "../../types";

const getUserData = async (email: string): Promise<UserData | null> => {
  const userDocRef = doc(db, "users", email);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  } else {
    console.error("No such document!");
    return null;
  }
};

export default getUserData;
