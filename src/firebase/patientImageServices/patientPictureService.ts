import { doc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db } from "../firebase";

const storage = getStorage();

export const uploadProfilePicture = async (
  patientId: string,
  file: File
): Promise<string | File> => {
  const storageRef = ref(storage, `patientImages/${patientId}/profile.jpg`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadUrl = await getDownloadURL(uploadTask.ref);
  const patientRef = doc(db, "patientdetails", patientId);
  await updateDoc(patientRef, { profilePictureUrl: downloadUrl });
  return downloadUrl;
};
