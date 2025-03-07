import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { axiosInstance } from "../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// Define User Type
type UserType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional properties
};

// Define Context Type
type DbUserContextType = {
  dbUser: UserType | null;
  setDbUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  fetchUser: () => void;
};

// Creating Context with a default null value
const UserContext = createContext<DbUserContextType | null>(null);

// Hook to consume the context
// eslint-disable-next-line react-refresh/only-export-components
export function useDBUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useDBUser must be used within a UserProvider");
  }
  return context;
}

// UserProvider Component
export function UserProvider({ children }: { children: ReactNode }) {
  const [dbUser, setDbUser] = useState<UserType | null>(null);
  const { currentUser } = useAuth();

  // Fetch current user information from database - UseQuery Method
  const { data, refetch: fetchUser } = useQuery({
    queryKey: ["dbUser", currentUser], // Use user ID for efficiency
    queryFn: async () => {
      return axiosInstance.post("/user/get-current-user", {
        user: currentUser,
      });
    },
    refetchInterval: 300 * 1000,
    enabled: !!currentUser,
  });

  // Set the state value
  useEffect(() => {
    if (data?.data?.user) {
      setDbUser(data?.data?.user);
    } else {
      setDbUser(null);
    }
  }, [currentUser?.email, data]);

  // Value object to be passed in context
  const value: DbUserContextType = {
    dbUser,
    setDbUser,
    fetchUser,
  };

  return (
    // Context Provider
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}
