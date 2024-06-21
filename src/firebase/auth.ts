import { redirect } from "react-router-dom";
import { auth } from "./firebase";
import { Paths } from "../paths";
import { useEffect } from "react";

export const doSignOut = async () => {
	try {
		await auth.signOut();
	} catch (e) {
		console.error(e);
	}
};
