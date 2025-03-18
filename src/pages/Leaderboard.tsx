import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";

const Leaderboard = () => {
  // Set page title
  useEffect(() => {
    document.title = "Leaderboard | Grid Manager";
  }, []);

  const { data: mostSelectedDrivers } = useQuery({
    queryKey: ["most-selected-drivers"],
    queryFn: () => {
      return axiosInstance.get("/team/get-most-selected-drivers");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: mostSelectedConstructors } = useQuery({
    queryKey: ["most-selected-constructors"],
    queryFn: () => {
      return axiosInstance.get("/team/get-most-selected-constructors");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: highestScoringDrivers } = useQuery({
    queryKey: ["highest-scoring-drivers"],
    queryFn: () => {
      return axiosInstance.get("/team/get-highest-scoring-drivers");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: highestScoringConstructors } = useQuery({
    queryKey: ["highest-scoring-constructors"],
    queryFn: () => {
      return axiosInstance.get("/team/get-highest-scoring-constructors");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: top3Teams } = useQuery({
    queryKey: ["top-3-teams"],
    queryFn: () => {
      return axiosInstance.get("/team/get-top-3-teams");
    },
    staleTime: 1000 * 60 * 15,
  });

  console.log(
    mostSelectedConstructors,
    mostSelectedDrivers,
    highestScoringConstructors,
    highestScoringDrivers,
    top3Teams
  );

  return <div>Leaderboard</div>;
};

export default Leaderboard;
