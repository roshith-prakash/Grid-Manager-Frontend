"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Trophy,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle2,
  X,
  Users,
} from "lucide-react";
import { useDBUser } from "@/context/UserContext";
import { isValidTeamOrLeagueName } from "@/functions/regexFunctions";
import { axiosInstance } from "@/utils/axiosInstance";

interface EditLeagueModalProps {
  league: {
    leagueId: string;
    private: boolean;
    name: string;
  };
  onClose: () => void;
  refetchFunction: () => void;
}

const EditLeagueModal = ({
  league,
  onClose,
  refetchFunction,
}: EditLeagueModalProps) => {
  const [leagueName, setLeagueName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState<{ leagueName?: string }>({});
  const { dbUser } = useDBUser();

  useEffect(() => {
    if (league?.leagueId) {
      setLeagueName(league.name);
      setIsPrivate(league.private);
    }
  }, [league]);

  const validateLeagueName = (name: string) => {
    if (!name || name.length === 0) {
      return "Please enter a name for your league";
    }
    if (name.length > 30) {
      return "League name cannot exceed 30 characters";
    }
    if (!isValidTeamOrLeagueName(name)) {
      return "League name must be at least 3 characters long and include at least one letter. It may also contain numbers and spaces.";
    }
    return null;
  };

  const handleNameChange = (value: string) => {
    setLeagueName(value);
    const error = validateLeagueName(value);
    setErrors((prev) => ({ ...prev, leagueName: error || undefined }));
  };

  const handleSubmit = async () => {
    const nameError = validateLeagueName(leagueName);
    if (nameError) {
      setErrors({ leagueName: nameError });
      return;
    }

    setDisabled(true);
    setErrors({});

    try {
      await axiosInstance.post("/team/edit-league", {
        userId: dbUser?.id,
        leagueId: league?.leagueId,
        leagueName: leagueName,
        isPrivate: isPrivate,
      });

      toast.success("League updated successfully!");
      refetchFunction();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Could not update league. Please try again.");
    } finally {
      setDisabled(false);
    }
  };

  const isFormValid = leagueName.length > 0 && !errors.leagueName;

  return (
    <div>
      <div className="bg-white dark:bg-white/5 rounded-lg shadow-2xl border  w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cta/10 dark:bg-cta/30 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-cta dark:text-darkmodeCTA" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Edit League
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 cursor-pointer h-10 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-white/50" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* League Name */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                League Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={leagueName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter your league name"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors bg-transparent ${
                    errors.leagueName
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                      : leagueName && !errors.leagueName
                      ? "border-green-300 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400"
                      : "border-slate-300 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400"
                  } focus:outline-none focus:ring-0`}
                  maxLength={30}
                />
                {leagueName && !errors.leagueName && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {errors.leagueName && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>

              {/* Character Count */}
              <div className="flex justify-between items-center text-sm">
                <div>
                  {errors.leagueName && (
                    <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.leagueName}
                    </p>
                  )}
                </div>
                <span
                  className={`${
                    leagueName.length > 25
                      ? "text-red-500"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {leagueName.length}/30
                </span>
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                League Privacy
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Public Option */}
                <div
                  onClick={() => setIsPrivate(false)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    !isPrivate
                      ? "border-cta dark:border-darkmodeCTA bg-cta/10 dark:bg-cta/30"
                      : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        !isPrivate
                          ? "bg-cta/10 dark:bg-cta/30"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}
                    >
                      <Globe
                        className={`w-4 h-4 ${
                          !isPrivate
                            ? "text-cta dark:text-darkmodeCTA"
                            : "text-slate-500"
                        }`}
                      />
                    </div>
                    <h3
                      className={`font-semibold ${
                        !isPrivate
                          ? "text-cta dark:text-white"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      Public League
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Visible to everyone and appears in the leagues directory
                  </p>
                </div>

                {/* Private Option */}
                <div
                  onClick={() => setIsPrivate(true)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    isPrivate
                      ? "border-cta dark:border-darkmodeCTA bg-cta/10 dark:bg-cta/30"
                      : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isPrivate
                          ? "bg-cta/10 dark:bg-cta/30"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}
                    >
                      <Lock
                        className={`w-4 h-4 ${
                          isPrivate
                            ? "text-cta dark:text-darkmodeCTA"
                            : "text-slate-500"
                        }`}
                      />
                    </div>
                    <h3
                      className={`font-semibold ${
                        isPrivate
                          ? "text-cta dark:text-white"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      Private League
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Only accessible via direct link, hidden from public listings
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-cta/5 dark:bg-cta/30 border border-cta/5 dark:border-cta/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-cta dark:text-white/95 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-hovercta dark:text-white/95">
                    League Limits
                  </h4>
                  <p className="text-sm text-hovercta dark:text-white/95">
                    You can create or join a maximum of 5 leagues. Each league
                    can have unlimited teams and participants.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={disabled || !isFormValid}
                className="flex-1 px-4 py-3 bg-cta hover:bg-hovercta cursor-pointer disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-500 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {disabled ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    Update League
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-slate-600 dark:text-white bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/20 cursor-pointer rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLeagueModal;
