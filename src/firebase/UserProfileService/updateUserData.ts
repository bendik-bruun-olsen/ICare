import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { UserData } from "../../types";

const updateUserData = async (
  email: string,
  data: Partial<UserData>
): Promise<void> => {
  const userDocRef = doc(db, "users", email);
  await updateDoc(userDocRef, { ...data });
};

export default updateUserData;
