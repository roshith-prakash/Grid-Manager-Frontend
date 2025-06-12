// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./reuseit/Table";
import { useState } from "react";
import { X } from "lucide-react";
import Accordion from "./reuseit/Accordion";

const ConstructorModal = ({
  constructorId,
  teamId,
  userId,
  isModalOpen,
  closeModal,
}: {
  constructorId: string;
  teamId?: string;
  userId?: string;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [tabValue, setTabValue] = useState("points");

  const {
    data: constructor,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["constructor", constructorId, teamId, userId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-constructors-stats", {
        constructorId,
        teamId,
        userId,
      });
    },
    enabled: !!constructorId,
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

  const groupedPointsHistory = constructor?.data?.constructor?.pointsHistory
    ? groupPointsByRace(constructor.data.constructor.pointsHistory)
    : [];

  const groupedTeamPointsHistory = constructor?.data?.constructor
    ?.teamPointsHistory
    ? groupPointsByRace(constructor.data.constructor.teamPointsHistory)
    : [];

  return (
    <Modal
      className="w-full !max-w-4xl px-0 py-0 noscroller"
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      {isLoading && (
        <>
          {/* Constructor Data */}
          <div className="flex flex-wrap">
            <div className="w-full md:w-[40%]">
              {/* Constructor Image Section */}
              <div className="h-52 bg-gray-500 animate-pulse  pb-5 py-4 px-5 border-b-2"></div>
            </div>
            {/* Constructor Info */}
            <div className="w-full md:flex-1 border-b-4">
              <div className="py-4 px-8 flex flex-col gap-y-2 ">
                <h3 className="h-6 w-52 bg-gray-500 animate-pulse rounded text-ellipsis text-nowrap font-semibold"></h3>

                <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>

                <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>

                <p className="h-4 w-40 bg-gray-500 animate-pulse rounded"></p>
              </div>
            </div>
          </div>

          {/* Constructor Points Scoring  */}
          <div className="mt-5 px-5 pb-20">
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
            Could not fetch constructor data!
          </p>
        </div>
      )}

      {constructor?.data?.constructor && (
        <>
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="w-10 absolute top-5 right-5 cursor-pointer h-10 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-white/50" />
          </button>

          {/* Constructor Data */}
          <div className="flex flex-wrap bg-white dark:bg-secondarydarkbg rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="w-full md:w-[40%]">
              {/* Constructor Image Section */}
              <div className="flex flex-col bg-slate-50 dark:bg-white/5 items-center justify-center p-6 h-full min-h-[300px]">
                <div className="space-y-6">
                  {/* Constructor Logo */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <img
                      src={
                        constructor?.data?.constructor?.logo ||
                        "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                      }
                      alt="Constructor Logo"
                      className="h-24 w-full object-contain"
                    />
                  </div>

                  {/* Constructor Car */}
                  <div className="flex justify-center">
                    <img
                      src={
                        constructor?.data?.constructor?.carImage ||
                        "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                      }
                      alt="Constructor Car"
                      className="h-32 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Constructor Info */}
            <div className="w-full md:flex-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700">
              <div className="py-6 px-8 space-y-4">
                {/* Constructor Name */}
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white truncate">
                    {constructor?.data?.constructor?.name}
                  </h3>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Points */}
                  <div className="bg-blue-50 dark:bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Total Points
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {constructor?.data?.constructor?.points}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="bg-green-50 dark:bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Price
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {constructor?.data?.constructor?.price} Cr.
                    </p>
                  </div>

                  {/* Team Points (if applicable) */}
                  {!!constructor?.data?.constructor?.pointsForTeam && (
                    <div className="bg-purple-50 dark:bg-white/5 rounded-lg p-4 sm:col-span-2">
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        Points For Your Team
                      </p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {constructor?.data?.constructor?.pointsForTeam}
                      </p>
                    </div>
                  )}

                  {/* Selection Percentage */}
                  <div className="bg-orange-50 dark:bg-white/5 rounded-lg p-4 sm:col-span-2">
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                      Selected by Teams
                    </p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {Number(
                        constructor?.data?.constructor?.chosenPercentage
                      ).toFixed(0)}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Points Scoring  */}
          <div className="mt-5 px-5 pb-20">
            {/* Tab Buttons */}
            {constructor?.data?.constructor?.teamPointsHistory ? (
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

                {constructor?.data?.constructor?.teamPointsHistory && (
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
                constructor?.data?.constructor?.pointsHistory?.length > 0 &&
                groupedPointsHistory?.map((race) => {
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
                constructor?.data?.constructor?.teamPointsHistory?.length > 0 &&
                groupedTeamPointsHistory?.map((race) => {
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

export default ConstructorModal;
