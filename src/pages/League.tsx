import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Test from "./Test";
import AlertModal from "@/components/reuseit/AlertModal";

const League = () => {
  const { leagueId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch league data from server.
  const {
    data: league,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["league", leagueId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-league", {
        leagueId: leagueId,
      });
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      {league && (
        <AlertModal
          className="max-w-2xl noscroller"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Test
            leagueId={leagueId as string}
            onClose={() => setIsModalOpen(false)}
          />
        </AlertModal>
      )}
      {!isLoading && <p>League ID: {leagueId}</p>}
      {error && <p>League does not exist!</p>}
      <button onClick={() => setIsModalOpen(true)}>Add Team</button>
    </div>
  );
};

export default League;
