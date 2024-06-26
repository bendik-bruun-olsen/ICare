import React, {
	useContext,
	useState,
	useEffect,
	createContext,
	ReactNode,
} from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { db } from "../../firebase/firebase";

interface AuthContextType {
	currentUser: User | null;
	isUserLoggedIn: boolean;
	loading: boolean;
	usersName: string | null;
}

interface Props {
	children?: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	isUserLoggedIn: false,
	loading: true,
	usersName: null,
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	const [usersName, setUsersName] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setCurrentUser(user);
				setIsUserLoggedIn(true);
				const usersName = await fetchUsersName(user.email);
				setUsersName(usersName);
			} else {
				setCurrentUser(null);
				setIsUserLoggedIn(false);
				setUsersName(null);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{ currentUser, isUserLoggedIn, loading, usersName }}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};

async function fetchUsersName(email: string | null): Promise<string | null> {
	if (!email) return null;

	return null;
}
