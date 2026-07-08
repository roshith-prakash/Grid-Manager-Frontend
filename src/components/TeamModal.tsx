/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { User, X, Trophy, Users, Car } from "lucide-react";
import PointsHistoryChart from "./PointsHistoryChart";
import { useState } from "react";
import { useDBUser } from "@/context/UserContext";
import DriverModal from "./DriverModal";
import ConstructorModal from "./ConstructorModal";
import Modal from "./reuseit/Modal";

const TeamModal = ({
  teamId,
  displayLeague = true,
  isModalOpen,
  closeModal,
}: {
  teamId: string;
  displayLeague?: boolean;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const [selectedConstructorId, setSelectedConstructorId] = useState("");
  const [isConstructorModalOpen, setIsConstructorModalOpen] = useState(false);

  const [tabValue, setTabValue] = useState("lineup");

  const { dbUser } = useDBUser();

  const {
    data: team,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team", teamId, dbUser?.id],
    queryFn: async () => {
      return axiosInstance.post("/team/get-team-by-id", {
        userId: dbUser?.id,
        teamId,
      });
    },
    enabled: !!teamId,
  });

  const {
    data: transfers,
    isLoading: isTransfersLoading,
  } = useQuery({
    queryKey: ["transfers", teamId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-transfer-history", {
        teamId,
        userId: dbUser?.id,
      });
    },
    enabled: !!teamId && tabValue === "transfers",
  });

  const LoadingSkeleton = () => (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200 dark:bg-slate-600"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
      </div>
    </div>
  );

  if (!isModalOpen) return null;

  return (
    <>
      <Modal
        className="w-full !max-w-4xl px-0 py-0 noscroller border-1"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <DriverModal
          teamId={teamId}
          userId={dbUser?.id}
          driverId={selectedDriverId}
          isModalOpen={isDriverModalOpen}
          closeModal={() => {
            setIsDriverModalOpen(false);
          }}
        />

        {/* View Constructor Data */}
        <ConstructorModal
          teamId={teamId}
          userId={dbUser?.id}
          constructorId={selectedConstructorId}
          isModalOpen={isConstructorModalOpen}
          closeModal={() => {
            setIsConstructorModalOpen(false);
          }}
        />

        <div className="bg-white dark:bg-secondarydarkbg rounded-2xl shadow-2xl border border-slate-200 dark:border-darkbg w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cta/10 dark:bg-cta/30 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-cta " />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Team Details
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="w-10 cursor-pointer h-10 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-white/50" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => setTabValue("lineup")}
              className={`flex-1 py-4 font-medium transition-colors ${
                tabValue === "lineup"
                  ? "text-cta border-b-2 border-cta dark:text-darkmodeCTA dark:border-darkmodeCTA"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Current Lineup
            </button>
            <button
              onClick={() => setTabValue("transfers")}
              className={`flex-1 py-4 font-medium transition-colors ${
                tabValue === "transfers"
                  ? "text-cta border-b-2 border-cta dark:text-darkmodeCTA dark:border-darkmodeCTA"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Transfer History
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto scroller max-h-[calc(90vh-80px)]">
            {isLoading && (
              <div className="p-6 space-y-8">
                {/* Team info skeleton */}
                <div className="text-center space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-lg w-64 mx-auto animate-pulse"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-48 mx-auto animate-pulse"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-lg w-56 mx-auto animate-pulse"></div>
                </div>

                {/* Drivers skeleton */}
                <div className="space-y-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-32 mx-auto animate-pulse"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <LoadingSkeleton key={i} type="driver" />
                      ))}
                  </div>
                </div>

                {/* Constructors skeleton */}
                <div className="space-y-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-40 mx-auto animate-pulse"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(2)
                      .fill(null)
                      .map((_, i) => (
                        <LoadingSkeleton key={i} type="constructor" />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Error Loading Team
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Could not fetch team data. Please try again.
                  </p>
                </div>
              </div>
            )}

            {tabValue === "lineup" && team?.data?.team && (
              <div className="p-6 space-y-8 pb-20">
                {/* Team Info */}
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {team.data.team.name}
                  </h1>

                  {displayLeague && (
                    <div className="space-y-2">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium">League:</span>{" "}
                        {team.data.team.League?.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        ID: {team.data.team.League?.leagueId}
                      </p>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 bg-cta/20 px-6 py-3 rounded-xl border border-cta">
                    <Trophy className="w-5 h-5 text-cta" />
                    <span className="text-lg font-bold text-cta dark:text-darkmodeCTA">
                      {team.data.team.score} Points
                    </span>
                  </div>
                </div>

                {/* Points History Chart */}
                <PointsHistoryChart
                  teamDrivers={team.data.team.teamDrivers ?? []}
                  teamConstructors={team.data.team.teamConstructors ?? []}
                />

                {/* Team Drivers */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Team Drivers
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {team.data.team.teamDrivers?.map((driver: any) => (
                      <div
                        key={driver.code}
                        onClick={() => {
                          setSelectedDriverId(driver?.driverId);
                          setIsDriverModalOpen(true);
                        }}
                        className="cursor-pointer group hover:scale-105 transition-transform duration-200"
                      >
                        <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                          <div
                            className="h-40 flex items-end justify-center px-4"
                            style={{
                              background: driver?.constructor_color
                                ? `linear-gradient(135deg, ${driver.constructor_color}40, ${driver.constructor_color}80)`
                                : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                            }}
                          >
                            {driver?.image ? (
                              <img
                                src={driver.image}
                                alt={driver.familyName}
                                className="h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="h-32 w-24 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                                <User className="w-12 h-12 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                              {driver?.givenName} {driver?.familyName}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              {driver?.code} • {driver?.constructor_name}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                Points
                              </span>
                              <span className="text-lg font-bold text-cta dark:text-darkmodeCTA">
                                {driver?.pointsForTeam}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Constructors */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2">
                    <Car className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Team Constructors
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.data.team.teamConstructors?.map(
                      (constructor: any) => (
                        <div
                          key={constructor.name}
                          onClick={() => {
                            setSelectedConstructorId(
                              constructor?.constructorId
                            );
                            setIsConstructorModalOpen(true);
                          }}
                          className="cursor-pointer group hover:scale-105 transition-transform duration-200"
                        >
                          <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <div className="h-40 bg-white border-b-2 flex flex-col items-center justify-center p-4">
                              <img
                                src={
                                  constructor?.logo ||
                                  "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                                }
                                className="h-16 object-contain mb-2"
                                alt={constructor?.name}
                              />
                              <img
                                src={
                                  constructor?.carImage ||
                                  "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                                }
                                alt="Car"
                                className="h-12 object-contain"
                              />
                            </div>
                            <div className="p-4 text-center">
                              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                                {constructor?.name}
                              </h3>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                  Points
                                </span>
                                <span className="text-lg font-bold text-cta dark:text-darkmodeCTA">
                                  {constructor?.pointsForTeam}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {tabValue === "transfers" && (
              <div className="p-6">
                {isTransfersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-slate-200 dark:bg-white/5 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : transfers?.data?.data?.length > 0 ? (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-white/20 before:to-transparent">
                    {transfers?.data?.data.map((transfer: any) => (
                      <div key={transfer.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-darkbg bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                          <Trophy className="w-4 h-4" />
                        </div>
                        
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                          <div className="text-sm font-medium text-cta dark:text-darkmodeCTA mb-3">
                            {new Date(transfer.createdAt).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>

                          <div className="space-y-3">
                            {(transfer.driversIn?.length > 0 || transfer.constructorsIn?.length > 0) && (
                              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
                                <div className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">Transferred In</div>
                                <ul className="space-y-1 text-sm text-green-900 dark:text-green-300">
                                  {transfer.driversIn?.map((d: string, i: number) => <li key={`di-${i}`}>• {d} (Driver)</li>)}
                                  {transfer.constructorsIn?.map((c: string, i: number) => <li key={`ci-${i}`}>• {c} (Constructor)</li>)}
                                </ul>
                              </div>
                            )}

                            {(transfer.driversOut?.length > 0 || transfer.constructorsOut?.length > 0) && (
                              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                                <div className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">Transferred Out</div>
                                <ul className="space-y-1 text-sm text-red-900 dark:text-red-300">
                                  {transfer.driversOut?.map((d: string, i: number) => <li key={`do-${i}`}>• {d} (Driver)</li>)}
                                  {transfer.constructorsOut?.map((c: string, i: number) => <li key={`co-${i}`}>• {c} (Constructor)</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No Transfer History
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      You haven't made any changes to this team yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TeamModal;
