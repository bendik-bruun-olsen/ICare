import {
	useContext,
	useState,
	useEffect,
	createContext,
	ReactNode,
} from "react";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
	currentUser: User | null;
	isUserLoggedIn: boolean;
	loading: boolean;
	error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	isUserLoggedIn: false,
	loading: true,
	error: null,
});

interface Props {
	children?: ReactNode;
}

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, initializeUser);
		return unsubscribe;
	}, []);

	async function initializeUser(user: User | null) {
		if (user) {
			setCurrentUser({ ...user });
			setIsUserLoggedIn(true);
		} else {
			setCurrentUser(null);
			setIsUserLoggedIn(false);
		}
		setLoading(false);
	}

	// const value = {
	//     currentUser,
	//     isUserLoggedIn,
	//     loading,
	//     error,
	// }

	return (
		<AuthContext.Provider
			value={{ currentUser, isUserLoggedIn, loading, error }}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};
