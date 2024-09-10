import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";

export default async function checkUserExistence(
	email: string
): Promise<boolean> {
	const auth = getAuth();
	const signInMethods = await fetchSignInMethodsForEmail(auth, email);
	return signInMethods.length > 0;
}
