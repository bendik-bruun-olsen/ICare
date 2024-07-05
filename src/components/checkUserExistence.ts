// checkUserExistence.ts
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";

const checkUserExistence = async (email: string): Promise<boolean> => {
    const auth = getAuth();
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
};

export default checkUserExistence;
