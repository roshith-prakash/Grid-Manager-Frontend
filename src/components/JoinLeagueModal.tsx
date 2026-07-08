import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/utils/axiosInstance";
import { Trophy, ArrowRight } from "lucide-react";
import Modal from "./reuseit/Modal";
import PrimaryButton from "./reuseit/PrimaryButton";

const JoinLeagueModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [leagueId, setLeagueId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!leagueId.trim()) {
      setError("Please enter a valid League ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/team/get-league", {
        leagueId: leagueId.trim(),
      });

      if (response?.data?.data) {
        // League found, navigate to it
        navigate(`/leagues/${leagueId.trim()}`);
        onClose();
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.data || "Could not find a league with that ID."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Join Private League
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Enter the League ID provided by the creator to join.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="e.g., L-12345678"
              value={leagueId}
              onChange={(e) => {
                setLeagueId(e.target.value);
                setError("");
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                error
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-200 dark:border-white/10 focus:border-cta dark:focus:border-cta"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
            />
            {error && (
              <p className="text-red-500 text-sm text-left mt-2">{error}</p>
            )}
          </div>

          <PrimaryButton
            text={
              <div className="flex items-center justify-center gap-2 w-full">
                {isLoading ? "Searching..." : "Find League"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </div>
            }
            onClick={handleJoin}
            disabled={isLoading || !leagueId.trim()}
            className="w-full !py-3"
          />
        </div>
      </div>
    </Modal>
  );
};

export default JoinLeagueModal;
