import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { NotificationContextType } from "../../types";

export const getDefaultPictureUrl = async (
	addNotification: NotificationContextType["addNotification"]
) => {
	const storage = getStorage();
	const defaultPictureRef = ref(storage, "Default.png");
	try {
		const url = await getDownloadURL(defaultPictureRef);
		return url;
	} catch {
		addNotification("Error fetching default picture", "error");
	}
};
