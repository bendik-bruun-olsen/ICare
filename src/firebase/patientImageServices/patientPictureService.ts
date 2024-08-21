// import { doc, updateDoc } from "firebase/firestore";
// import {
// 	getStorage,
// 	getDownloadURL,
// 	ref,
// 	uploadBytesResumable,
// } from "firebase/storage";

// const storage = getStorage();

// export const uploadProfilePicture = async (
// 	file: File,
// 	patientId: string | null
// ) => {
// 	if (!patientId) {
// 		const storageRef = ref(storage, "patientPictures");
// 		const id = storageRef.
// 	}
// 	if (patientId) {
// 		const storageRef = ref(storage, `patientPictures/${patientId}/${file.name}`);
// 		const uploadTask = uploadBytesResumable(storageRef, file);

// 	}
// }
