import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Trophy,
  Users,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useDBUser } from "@/context/UserContext";
import { isValidTeamOrLeagueName } from "@/functions/regexFunctions";
import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";

const CreateLeague = () => {
  const [leagueName, setLeagueName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState<{ leagueName?: string }>({});
  const navigate = useNavigate();
  const { dbUser } = useDBUser();

  useEffect(() => {
    document.title = "Create League | Grid Manager";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
      const response = await axiosInstance.post("/team/create-league", {
        leagueName: leagueName,
        userId: dbUser?.id,
        isPrivate: isPrivate,
      });

      toast.success("League created successfully!");
      navigate(`/leagues/${response?.data?.data?.leagueId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          toast.error("You can create or join a maximum of 5 leagues.", {
            duration: 5000,
            icon: <AlertCircle className="w-5 h-5" />,
          });
        } else {
          toast.error("Could not create league. Please try again.");
        }
      } else {
        console.error("Unexpected error", err);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setDisabled(false);
    }
  };

  const isFormValid = leagueName.length > 0 && !errors.leagueName;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-cta/10 dark:bg-cta/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-cta dark:text-darkmodeCTA" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Create Your League
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Start your own fantasy F1 competition and invite friends to join
              the action
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-8">
            <div className="space-y-8">
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
                      Only accessible via direct link, hidden from public
                      listings
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

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={disabled || !isFormValid}
                className="w-full py-4 px-6 cursor-pointer bg-hovercta disabled:bg-slate-300 dark:disabled:bg-slate-500 text-white disabled:text-white/50 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {disabled ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating League...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    Create League
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              After creating your league, you'll be redirected to the league
              page where you can start inviting participants and creating teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeague;
