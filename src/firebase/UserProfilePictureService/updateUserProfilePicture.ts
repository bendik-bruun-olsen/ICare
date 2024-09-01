import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const updateUserProfilePicture = async (
  email: string,
  profilePictureUrl: string
): Promise<void> => {
  const userDocRef = doc(db, "users", email);
  await updateDoc(userDocRef, { profilePictureUrl });
};

export default updateUserProfilePicture;
