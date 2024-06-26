import React, {
	useContext,
	useState,
	useEffect,
	createContext,
	ReactNode,
} from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
	currentUser: User | null;
	isUserLoggedIn: boolean;
	loading: boolean;
}

interface Props {
	children?: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	isUserLoggedIn: false,
	loading: true,
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user);
				setIsUserLoggedIn(true);
			} else {
				setCurrentUser(null);
				setIsUserLoggedIn(false);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, isUserLoggedIn, loading }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
