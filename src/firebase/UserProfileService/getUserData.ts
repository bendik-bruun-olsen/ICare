import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { User } from "../../types";

export default async function getUserData(email: string): Promise<User | null> {
  const userDocRef = doc(db, "users", email);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  console.error("No such document!");
  return null;
}
