import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// Define User Type
type NextRaceType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional properties
};

// Define Context Type
type NextRaceContextType = {
  nextRace: NextRaceType | null;
  setNextRace: React.Dispatch<React.SetStateAction<NextRaceType | null>>;
};

// Creating Context with a default null value
const NextRaceContext = createContext<NextRaceContextType | null>(null);

// Hook to consume the context
// eslint-disable-next-line react-refresh/only-export-components
export function useGetNextRace() {
  const context = useContext(NextRaceContext);
  if (!context) {
    throw new Error("useGetNextRace must be used within a NextRaceProvider");
  }
  return context;
}

// UserProvider Component
export function NextRaceProvider({ children }: { children: ReactNode }) {
  const [nextRace, setNextRace] = useState<NextRaceType | null>(null);

  // Fetch current user information from database - UseQuery Method
  const { data } = useQuery({
    queryKey: ["nextRace"], // Use user ID for efficiency
    queryFn: async () => {
      return axiosInstance.get("/next-race");
    },
    staleTime: 60 * 1000 * 60 * 24,
  });

  // Set the state value
  useEffect(() => {
    if (data?.data?.nextRace) {
      setNextRace(data?.data?.nextRace);
    } else {
      setNextRace(null);
    }
  }, [data]);

  console.log("Next Race : ", data?.data?.nextRace);

  // Value object to be passed in context
  const value: NextRaceContextType = {
    nextRace,
    setNextRace,
  };

  return (
    // Context Provider
    <NextRaceContext.Provider value={value}>
      {children}
    </NextRaceContext.Provider>
  );
}
