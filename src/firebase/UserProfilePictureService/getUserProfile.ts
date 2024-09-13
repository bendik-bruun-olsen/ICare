import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserProfilePicUrl } from "../../types";

export default async function getUserProfile(
  email: string
): Promise<UserProfilePicUrl | null> {
  const userDocRef = doc(db, "users", email);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfilePicUrl;
  }
  console.error("No such document!");
  return null;
}
