import { ref, listAll, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

export default async function deleteAllFilesInFolder(
	folderPath: string
): Promise<void> {
	const folderRef = ref(storage, folderPath);
	const listResult = await listAll(folderRef);
	const deletePromises = listResult.items.map((item) => deleteObject(item));
	await Promise.all(deletePromises);
}
