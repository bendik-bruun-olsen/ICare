import { redirect } from "react-router-dom";
import { auth } from "./firebase";
import { Paths } from "../paths";

export const doSignOut = async () => {
	try {
		await auth.signOut();
	} catch (e) {
		console.error(e);
	} finally {
		console.log("hello!");
		redirect(Paths.LOGIN);
	}
};
