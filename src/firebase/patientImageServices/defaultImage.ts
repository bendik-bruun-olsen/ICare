import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { NotificationContext } from "../../types";

export const getDefaultPictureUrl = async (
	addNotification: NotificationContext["addNotification"]
) => {
	const storage = getStorage();
	const defaultPictureRef = ref(storage, "Default.png");
	try {
		const url = await getDownloadURL(defaultPictureRef);
		return url;
	} catch {
		addNotification("Error fetching default picture", NotificationType.ERROR);
	}
};
