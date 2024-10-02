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
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  isUserLoggedIn: boolean;
  loading: boolean;
  userData: userDataType | null;
  currentPatientId: string | null;
  setCurrentPatientId: (patientId: string | null) => void;
}

interface Props {
  children?: ReactNode;
}

interface userDataType {
  name: string;
  email: string;
  type: string;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isUserLoggedIn: false,
  loading: true,
  userData: null,
  currentPatientId: null,
  setCurrentPatientId: () => {},
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<userDataType | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(
    localStorage.getItem("currentPatientId") || null
  );

  useEffect(() => {
    localStorage.setItem("currentPatientId", currentPatientId || "");
  }, [currentPatientId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsUserLoggedIn(true);
        const result = await fetchUserData(user.email);
        if (result) setUserData(result);
      }
      if (!user) {
        setCurrentUser(null);
        setIsUserLoggedIn(false);
        setUserData(null);
      }
      setLoading(false);
    });
    return (): void => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isUserLoggedIn,
        loading,
        userData,
        currentPatientId,
        setCurrentPatientId,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

async function fetchUserData(
  email: string | null
): Promise<userDataType | null> {
  if (!email) return null;

  const userDoc = doc(db, "users", email);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    return docSnap.data() as userDataType;
  }

  return null;
}
