import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserProfilePicUrl } from "../../types";

const getUserProfile = async (
  email: string
): Promise<UserProfilePicUrl | null> => {
  const userDocRef = doc(db, "users", email);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfilePicUrl;
  } else {
    console.error("No such document!");
    return null;
  }
};

export default getUserProfile;
