// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import { FaUserAlt } from "react-icons/fa";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./reuseit/Table";
import { useState } from "react";
import Accordion from "./reuseit/Accordion";
import { X } from "lucide-react";

const DriverModal = ({
  driverId,
  teamId,
  userId,
  isModalOpen,
  closeModal,
}: {
  driverId: string;
  teamId?: string;
  userId?: string;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [tabValue, setTabValue] = useState("points");

  const {
    data: driver,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["driver", driverId, teamId, userId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-drivers-stats", {
        driverId,
        teamId,
        userId,
      });
    },
    enabled: !!driverId,
  });

  const groupPointsByRace = (pointsHistory) => {
    const grouped = {};

    pointsHistory.forEach((entry) => {
      const key = `${entry.round}-${entry.raceName}`;

      if (!grouped[key]) {
        grouped[key] = {
          round: entry.round,
          raceName: entry.raceName,
          sessions: [],
          totalPoints: 0,
        };
      }

      grouped[key].sessions.push(entry);
      grouped[key].totalPoints += entry.points;
    });

    return Object.values(grouped);
  };

  const groupedPointsHistory = driver?.data?.driver?.pointsHistory
    ? groupPointsByRace(driver.data.driver.pointsHistory)
    : [];

  const groupedTeamPointsHistory = driver?.data?.driver?.teamPointsHistory
    ? groupPointsByRace(driver.data.driver.teamPointsHistory)
    : [];

  return (
    <Modal
      className="w-full !max-w-4xl px-0 py-0 noscroller"
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      {isLoading && (
        <>
          {/* Driver Data */}
          <div className="flex flex-wrap">
            <div className="w-full md:w-[40%]">
              {/* Driver Image Section */}
              <div className="h-52 bg-gray-500 animate-pulse  pb-5 py-4 px-5 border-b-2"></div>
            </div>
            {/* Driver Data */}
            <div className="w-full md:flex-1 md:border-b-4 pt-4 md:pt-0 border-black">
              <div className="py-4 px-8 flex flex-col gap-y-2 ">
                <h3 className="h-4 w-64 bg-gray-500 animate-pulse rounded"></h3>
                <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>
                <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>
                <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>

                <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>
              </div>
            </div>
          </div>

          {/* Driver Points Scoring  */}
          <div className="mt-5 px-5 pb-20">
            {/* Tab Buttons */}

            <p className="text-2xl ml-1 font-semibold pb-2">Points: </p>

            <Table className="w-full mt-5">
              <TableHead>
                <TableRow>
                  <TableHeader>Round</TableHeader>
                  <TableHeader>Race</TableHeader>
                  <TableHeader>Session</TableHeader>
                  <TableHeader>Points Scored</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array(5)
                  .fill(null)
                  ?.map(() => {
                    return (
                      <TableRow>
                        <TableCell>
                          {" "}
                          <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>
                        </TableCell>
                        <TableCell>
                          <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>
                        </TableCell>
                        <TableCell className="font-semibold">
                          <p className="h-4 w-10 bg-gray-500 animate-pulse rounded"></p>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {error && (
        <div className="min-h-72 flex justify-center items-center">
          <p className="text-center text-xl font-semibold px-5">
            Could not fetch driver data!
          </p>
        </div>
      )}

      {driver?.data?.driver && (
        <>
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="w-10 absolute top-5 right-5 cursor-pointer h-10 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-white/50" />
          </button>

          {/* Driver Data */}
          <div className="flex flex-wrap">
            <div className="w-full md:w-[40%]">
              {/* Driver Image Section */}
              <div
                className="h-full w-full flex items-end justify-center pt-5"
                style={{
                  background: driver?.data?.driver?.constructor_color
                    ? `linear-gradient(135deg, ${driver?.data?.driver?.constructor_color}40, ${driver?.data?.driver?.constructor_color}80)`
                    : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                }}
              >
                {driver?.data?.driver?.image ? (
                  <img
                    src={driver?.data?.driver.image}
                    alt={driver?.data?.driver.familyName}
                    className="h-66 md:h-auto object-cover"
                  />
                ) : (
                  <FaUserAlt className="text-gray-400 text-4xl" />
                )}
              </div>
            </div>
            {/* Driver Data */}
            <div className="w-full md:flex-1 md:border-b-2 pt-4 md:pt-0 border-slate-200 dark:border-slate-700">
              <div className="py-6 px-8 space-y-4">
                {/* Driver Name & Code */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                    {driver?.data?.driver?.givenName}{" "}
                    {driver?.data?.driver?.familyName}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-lg font-mono font-semibold">
                      {driver?.data?.driver?.code}
                    </span>
                    <span className="text-lg">
                      #{driver?.data?.driver?.permanentNumber}
                    </span>
                  </div>
                </div>

                {/* Constructor */}
                <div className="bg-slate-50 dark:bg-white/10 rounded-lg p-3">
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    {driver?.data?.driver?.constructor_name}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Points */}
                  <div className="bg-blue-50 dark:bg-white/10 rounded-lg p-3">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Total Points
                    </p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {driver?.data?.driver?.points}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="bg-green-50 dark:bg-white/10 rounded-lg p-3">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Price
                    </p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      {driver?.data?.driver?.price} Cr.
                    </p>
                  </div>

                  {/* Team Points (if applicable) */}
                  {driver?.data?.driver?.pointsForTeam && (
                    <div className="bg-purple-50 dark:bg-white/10 rounded-lg p-3 sm:col-span-2">
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        Points For Your Team
                      </p>
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        {driver?.data?.driver?.pointsForTeam}
                      </p>
                    </div>
                  )}

                  {/* Selection Percentage (if applicable) */}
                  {driver?.data?.driver?.chosenPercentage && (
                    <div className="bg-orange-50 dark:bg-white/10 rounded-lg p-3 sm:col-span-2">
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        Selected by Teams
                      </p>
                      <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                        {Number(driver?.data?.driver?.chosenPercentage).toFixed(
                          0
                        )}
                        %
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Driver Points Scoring  */}
          <div className="mt-5 px-5 pb-20">
            {/* Tab Buttons */}
            {driver?.data?.driver?.teamPointsHistory ? (
              <div className="flex">
                {/* Drivers Tab Button */}
                <button
                  onClick={() => setTabValue("points")}
                  className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4 ${
                    tabValue == "points" &&
                    "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
                  }`}
                >
                  Points
                </button>

                {driver?.data?.driver?.teamPointsHistory && (
                  <>
                    {/* Constructors Tab Button */}
                    <button
                      onClick={() => setTabValue("pointsForTeam")}
                      className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4  ${
                        tabValue == "pointsForTeam" &&
                        "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
                      }`}
                    >
                      Points For Your Team
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="text-2xl ml-1 font-semibold pb-2">Points: </p>
            )}

            <div className="mt-3">
              {tabValue == "points" &&
                driver?.data?.driver?.pointsHistory?.length > 0 &&
                groupedPointsHistory?.map((race) => {
                  console.log(race);
                  return (
                    <Accordion
                      className="border-b-2"
                      text={
                        <div className="flex justify-between items-center w-full pr-5 mt-1">
                          <p className="font-medium text-slate-900 dark:text-white truncate mr-3">
                            {race?.raceName}
                          </p>
                          <span className="text-lg w-28 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-lg font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
                            Points : {race?.totalPoints}
                          </span>
                        </div>
                      }
                    >
                      <Table className="w-full mt-5">
                        <TableHead>
                          <TableRow>
                            <TableHeader>Session</TableHeader>
                            <TableHeader>Points Scored</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {race.sessions?.map(
                            (session: {
                              round: number;
                              raceName: string;
                              session: string;
                              points: number;
                            }) => {
                              return (
                                <TableRow>
                                  <TableCell> {session?.session}</TableCell>
                                  <TableCell className="font-semibold">
                                    {" "}
                                    {session?.points}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </Accordion>
                  );
                })}

              {tabValue == "pointsForTeam" &&
                driver?.data?.driver?.teamPointsHistory?.length > 0 &&
                groupedTeamPointsHistory?.map((race) => {
                  console.log(race);
                  return (
                    <Accordion
                      className="border-b-2"
                      text={
                        <div className="flex justify-between items-center w-full pr-5 mt-1">
                          <p className="font-medium text-slate-900 dark:text-white truncate mr-3">
                            {race?.raceName}
                          </p>
                          <span className="text-lg w-28 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-lg font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
                            Points : {race?.totalPoints}
                          </span>
                        </div>
                      }
                    >
                      <Table className="w-full mt-5">
                        <TableHead>
                          <TableRow>
                            <TableHeader>Session</TableHeader>
                            <TableHeader>Points Scored</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {race.sessions?.map(
                            (session: {
                              round: number;
                              raceName: string;
                              session: string;
                              points: number;
                            }) => {
                              return (
                                <TableRow>
                                  <TableCell> {session?.session}</TableCell>
                                  <TableCell className="font-semibold">
                                    {" "}
                                    {session?.points}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </Accordion>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DriverModal;
