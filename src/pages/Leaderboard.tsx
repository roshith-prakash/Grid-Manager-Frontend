/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { User, Trophy, TrendingUp, Users, Car, Target } from "lucide-react";
import { ConstructorModal, DriverModal, TeamModal } from "@/components";
import { useDBUser } from "@/context/UserContext";

const Leaderboard = () => {
  const [teamId, setTeamId] = useState("");
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const [selectedConstructorId, setSelectedConstructorId] = useState("");
  const [isConstructorModalOpen, setIsConstructorModalOpen] = useState(false);

  const { dbUser } = useDBUser();

  // Set page title
  useEffect(() => {
    document.title = "Leaderboard | Grid Manager";
  }, []);

  const { data: mostSelectedDrivers, isLoading: isLoadingMostSelectedDrivers } =
    useQuery({
      queryKey: ["most-selected-drivers"],
      queryFn: () => {
        return axiosInstance.post("/team/get-most-selected-drivers", {
          userId: dbUser?.id,
        });
      },
      staleTime: 1000 * 60 * 15,
    });

  const {
    data: mostSelectedConstructors,
    isLoading: isLoadingMostSelectedConstructors,
  } = useQuery({
    queryKey: ["most-selected-constructors"],
    queryFn: () => {
      return axiosInstance.post("/team/get-most-selected-constructors", {
        userId: dbUser?.id,
      });
    },
    staleTime: 1000 * 60 * 15,
  });

  const {
    data: highestScoringDrivers,
    isLoading: isLoadingHighestPointScoringDrivers,
  } = useQuery({
    queryKey: ["highest-scoring-drivers"],
    queryFn: () => {
      return axiosInstance.post("/team/get-highest-scoring-drivers", {
        userId: dbUser?.id,
      });
    },
    staleTime: 1000 * 60 * 15,
  });

  const {
    data: highestScoringConstructors,
    isLoading: isLoadingHighestPointScoringConstructors,
  } = useQuery({
    queryKey: ["highest-scoring-constructors"],
    queryFn: () => {
      return axiosInstance.post("/team/get-highest-scoring-constructors", {
        userId: dbUser?.id,
      });
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: top3Teams, isLoading: isLoadingTopTeams } = useQuery({
    queryKey: ["top-3-teams"],
    queryFn: () => {
      return axiosInstance.post("/team/get-top-3-teams", {
        userId: dbUser?.id,
      });
    },
    staleTime: 1000 * 60 * 15,
  });

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      case 2:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gradient-to-r from-slate-400 to-slate-600 text-white";
    }
  };

  const LoadingSkeleton = ({
    type,
  }: {
    type: "team" | "driver" | "constructor";
  }) => (
    <div className="bg-white w-66 dark:bg-white/5 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden animate-pulse">
      {type !== "team" && (
        <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"></div>
      )}

      {type !== "team" ? (
        <div className="p-6 space-y-3">
          <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded-lg w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
        </div>
      ) : (
        <div className="space-y-3 p-5">
          <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded-lg w-3/4"></div>
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-600 rounded"></div>
            <div className="h-4 w-10 bg-slate-200 dark:bg-slate-600 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Modals */}
      <TeamModal
        teamId={teamId}
        displayLeague={false}
        isModalOpen={isTeamModalOpen}
        closeModal={() => setIsTeamModalOpen(false)}
      />

      <DriverModal
        userId={dbUser?.id}
        driverId={selectedDriverId}
        isModalOpen={isDriverModalOpen}
        closeModal={() => setIsDriverModalOpen(false)}
      />

      <ConstructorModal
        userId={dbUser?.id}
        constructorId={selectedConstructorId}
        isModalOpen={isConstructorModalOpen}
        closeModal={() => setIsConstructorModalOpen(false)}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-cta/10 dark:bg-cta/50 text-cta dark:text-white rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4 mr-2" />
            Championship Stats
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800  to-cta dark:from-white dark:via-cta dark:to-cta bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Track the best performing teams, drivers, and constructors in the
            championship
          </p>
        </div>

        {/* Top Teams */}
        <section className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="w-8 h-8 text-cta" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Championship Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {isLoadingTopTeams
              ? Array(3)
                  .fill(null)
                  .map((_, i) => <LoadingSkeleton key={i} type="team" />)
              : top3Teams?.data?.teams?.map((team: any, index: number) => (
                  <div
                    key={team.id}
                    onClick={() => {
                      setTeamId(team?.id);
                      setIsTeamModalOpen(true);
                    }}
                    className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                      <div className="relative p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={` top-5.5 right-4 px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(
                              index
                            )}`}
                          >
                            #{index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                            {team?.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">
                            Total Points
                          </span>
                          <span className="text-2xl font-bold text-cta dark:text-darkmodeCTA">
                            {team?.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* Most Selected Drivers */}
        <section className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-cta dark:text-darkmodeCTA" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Most Popular Drivers
            </h2>
          </div>

          <div className="flex justify-center flex-wrap gap-6">
            {isLoadingMostSelectedDrivers
              ? Array(3)
                  .fill(null)
                  .map((_, i) => <LoadingSkeleton key={i} type="driver" />)
              : mostSelectedDrivers?.data?.drivers?.map(
                  (driver: any, index: number) => (
                    <div
                      key={driver.code}
                      onClick={() => {
                        setSelectedDriverId(driver?.driverId);
                        setIsDriverModalOpen(true);
                      }}
                      className="group min-w-2xs cursor-pointer transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                        <div
                          className="relative h-48 flex items-end justify-center px-4"
                          style={{
                            background: driver?.constructor_color
                              ? `linear-gradient(135deg, ${driver.constructor_color}40, ${driver.constructor_color}80)`
                              : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                          }}
                        >
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(
                              index
                            )}`}
                          >
                            #{index + 1}
                          </div>
                          {driver?.image ? (
                            <img
                              src={driver.image || "/placeholder.svg"}
                              alt={driver.familyName}
                              className="h-40 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-40 w-32 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                              <User className="w-16 h-16 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                            {driver?.givenName} {driver?.familyName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            ({driver?.code})
                          </p>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                            {driver?.constructor}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              Selection Rate
                            </span>
                            <span className="text-lg font-bold text-cta dark:text-darkmodeCTA">
                              {Number(driver?.chosenPercentage).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
          </div>
        </section>

        {/* Most Selected Constructors */}
        <section className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Car className="w-8 h-8 text-cta dark:text-darkmodeCTA" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Popular Constructors
            </h2>
          </div>

          <div className="flex justify-center flex-wrap gap-6">
            {isLoadingMostSelectedConstructors
              ? Array(3)
                  .fill(null)
                  .map((_, i) => <LoadingSkeleton key={i} type="constructor" />)
              : mostSelectedConstructors?.data?.constructors?.map(
                  (constructor: any, index: number) => (
                    <div
                      key={constructor.name}
                      onClick={() => {
                        setSelectedConstructorId(constructor?.constructorId);
                        setIsConstructorModalOpen(true);
                      }}
                      className="group min-w-2xs cursor-pointer transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                        <div className="relative bg-white p-6 h-48 flex flex-col items-center justify-center">
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(
                              index
                            )}`}
                          >
                            #{index + 1}
                          </div>
                          <img
                            src={
                              constructor?.logo ||
                              "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                            }
                            className="h-20 object-contain mb-2"
                            alt={constructor?.name}
                          />
                          <img
                            src={
                              constructor?.carImage ||
                              "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                            }
                            alt="Car"
                            className="h-16 object-contain"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cta dark:group-hover:dark:text-darkmodeCTA transition-colors">
                            {constructor?.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              Selection Rate
                            </span>
                            <span className="text-lg font-bold text-cta dark:text-darkmodeCTA">
                              {Number(constructor?.chosenPercentage).toFixed(0)}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
          </div>
        </section>

        {/* Highest Point Scoring Drivers */}
        <section className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Top Scoring Drivers
            </h2>
          </div>

          <div className="flex justify-center flex-wrap gap-6">
            {isLoadingHighestPointScoringDrivers
              ? Array(3)
                  .fill(null)
                  .map((_, i) => <LoadingSkeleton key={i} type="driver" />)
              : highestScoringDrivers?.data?.drivers?.map(
                  (driver: any, index: number) => (
                    <div
                      key={driver.code}
                      onClick={() => {
                        setSelectedDriverId(driver?.driverId);
                        setIsDriverModalOpen(true);
                      }}
                      className="group min-w-2xs cursor-pointer transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                        <div
                          className="relative h-48 flex items-end justify-center px-4"
                          style={{
                            background: driver?.constructor_color
                              ? `linear-gradient(135deg, ${driver.constructor_color}40, ${driver.constructor_color}80)`
                              : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                          }}
                        >
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(
                              index
                            )}`}
                          >
                            #{index + 1}
                          </div>
                          {driver?.image ? (
                            <img
                              src={driver.image || "/placeholder.svg"}
                              alt={driver.familyName}
                              className="h-40 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-40 w-32 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                              <User className="w-16 h-16 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                            {driver?.givenName} {driver?.familyName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            ({driver?.code})
                          </p>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                            {driver?.constructor}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              Points
                            </span>
                            <span className="text-lg font-bold text-cta dark:text-darkmodeCTA">
                              {driver?.points}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
          </div>
        </section>

        {/* Highest Point Scoring Constructors */}
        <section className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-cta dark:text-darkmodeCTA" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Top Scoring Constructors
            </h2>
          </div>

          <div className="flex justify-center flex-wrap gap-6">
            {isLoadingHighestPointScoringConstructors
              ? Array(3)
                  .fill(null)
                  .map((_, i) => <LoadingSkeleton key={i} type="constructor" />)
              : highestScoringConstructors?.data?.constructors?.map(
                  (constructor: any, index: number) => (
                    <div
                      key={constructor.name}
                      onClick={() => {
                        setSelectedConstructorId(constructor?.constructorId);
                        setIsConstructorModalOpen(true);
                      }}
                      className="group min-w-2xs cursor-pointer transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                        <div className="relative bg-white p-6 h-48 flex flex-col items-center justify-center">
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${getRankBadgeColor(
                              index
                            )}`}
                          >
                            #{index + 1}
                          </div>
                          <img
                            src={
                              constructor?.logo ||
                              "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                            }
                            className="h-20 object-contain mb-2"
                            alt={constructor?.name}
                          />
                          <img
                            src={
                              constructor?.carImage ||
                              "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                            }
                            alt="Car"
                            className="h-16 object-contain"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                            {constructor?.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              Points
                            </span>
                            <span className="text-lg font-bold text-cta dark:text-darkmodeCTA">
                              {constructor?.points}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Leaderboard;
