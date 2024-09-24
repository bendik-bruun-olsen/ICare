import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updateProfilePictureUrl = async (
  patientId: string,
  downloadUrl: string
): Promise<void> => {
  const userDocRef = doc(db, "patientdetails", `${patientId}`);
  await updateDoc(userDocRef, { profilePictureUrl: downloadUrl });
};
