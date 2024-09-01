import { ref, listAll, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

const deleteAllFilesInFolder = async (folderPath: string): Promise<void> => {
  const folderRef = ref(storage, folderPath);
  const listResult = await listAll(folderRef);
  const deletePromises = listResult.items.map((item) => deleteObject(item));
  await Promise.all(deletePromises);
};

export default deleteAllFilesInFolder;
