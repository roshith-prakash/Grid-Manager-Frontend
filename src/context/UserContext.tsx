import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { useUser } from "@clerk/clerk-react";
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
  const { user } = useUser();

  // Fetch current user information from database - UseQuery Method
  const { data, refetch: fetchUser } = useQuery({
    queryKey: ["dbUser", user?.id], // Use user ID for efficiency
    queryFn: async () => {
      if (!user) return null;
      const response = await axiosInstance.post<{ user: UserType }>(
        "/auth/get-current-user",
        {
          user,
        }
      );
      return response.data.user;
    },
    refetchInterval: 60000,
    enabled: !!user,
  });

  // Set the state value
  useEffect(() => {
    if (data) {
      setDbUser(data);
    } else {
      setDbUser(null);
    }
  }, [data]);

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
