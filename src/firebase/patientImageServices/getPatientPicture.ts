import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const getPatientPicture = async (
  patientId: string
): Promise<string | null> => {
  const storage = getStorage();
  const storageRef = ref(storage, `patientImages/${patientId}/profile.jpg`);
  try {
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error fetching profile picture URL:", error);
    return null;
  }
};
