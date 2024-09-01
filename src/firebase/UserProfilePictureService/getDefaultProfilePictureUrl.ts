import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const getDefaultProfilePictureUrl = async (): Promise<string> => {
  const defaultPicRef = ref(storage, "Default.png");
  return getDownloadURL(defaultPicRef);
};

export default getDefaultProfilePictureUrl;
