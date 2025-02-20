import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Defining the shape of the AuthContext
type AuthContextType = {
  userLoggedIn: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

// Creating Context
const AuthContext = createContext<AuthContextType | null>(null);

// Hook to consume the context
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// AuthProvider Component that provides the auth context to all its children
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe();
  }, []);

  // Function to set the state when user signs in or out
  async function initializeUser(user: User | null) {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  // Value object to be passed in context
  const value: AuthContextType = {
    userLoggedIn,
    currentUser,
    setCurrentUser,
  };

  return (
    // Context Provider
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
