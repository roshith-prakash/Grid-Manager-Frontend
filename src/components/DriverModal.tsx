import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import { RxCross2 } from "react-icons/rx";
import { FaUserAlt } from "react-icons/fa";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./reuseit/Table";
import { useState } from "react";

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
            className="absolute bg-white dark:bg-secondarydarkbg dark:text-white hover:scale-110 text-darkbg hover:text-red-500 transition-all rounded-full p-1 top-5 right-5 text-2xl cursor-pointer"
          >
            <RxCross2 />
          </button>

          {/* Driver Data */}
          <div className="flex flex-wrap">
            <div className="w-full md:w-[40%]">
              {/* Driver Image Section */}
              <div
                className="h-full w-full flex items-end justify-center pt-5"
                style={{
                  backgroundImage: `linear-gradient(${driver?.data?.driver?.constructor_color},#000)`,
                }}
              >
                {driver?.data?.driver?.image ? (
                  <img
                    src={driver?.data?.driver.image}
                    alt={driver?.data?.driver.familyName}
                    className="h-66 md:h-52 object-cover"
                  />
                ) : (
                  <FaUserAlt className="text-gray-400 text-4xl" />
                )}
              </div>
            </div>
            {/* Driver Data */}
            <div className="w-full md:flex-1 md:border-b-4 pt-4 md:pt-0 border-black">
              <div className="py-4 px-8 flex flex-col gap-y-2 ">
                <h3 className="text-2xl text-ellipsis text-nowrap font-semibold">
                  {driver?.data?.driver?.givenName}{" "}
                  {driver?.data?.driver?.familyName} (
                  {driver?.data?.driver?.code})
                </h3>
                <p className="text-xl">
                  Driver Number : #{driver?.data?.driver?.permanentNumber}
                </p>
                <p className="text-lg text-darkbg/70 dark:text-white/50">
                  {driver?.data?.driver?.constructor_name}
                </p>
                <p className="text-md">
                  Points:
                  <span className="font-semibold ml-1">
                    {driver?.data?.driver?.points}
                  </span>
                </p>

                {/* IF driver is already present in a team */}
                {driver?.data?.driver?.pointsForTeam ? (
                  <p className="text-md">
                    Points For Your Team:
                    <span className="font-semibold ml-1">
                      {driver?.data?.driver?.pointsForTeam}
                    </span>
                  </p>
                ) : (
                  <></>
                )}

                <p className="text-md">
                  Price:{" "}
                  <span className="font-semibold">
                    {driver?.data?.driver?.price} Cr.
                  </span>
                </p>

                {driver?.data?.driver?.chosenPercentage && (
                  <p className="text-md">
                    Teams in which driver is present:{" "}
                    <span className="font-semibold">
                      {Number(driver?.data?.driver?.chosenPercentage).toFixed(
                        0
                      )}
                      %{" "}
                    </span>
                  </p>
                )}
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

            {tabValue == "points" &&
              driver?.data?.driver?.pointsHistory?.length > 0 && (
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
                    {driver?.data?.driver?.pointsHistory?.map(
                      (session: {
                        round: number;
                        raceName: string;
                        session: string;
                        points: number;
                      }) => {
                        return (
                          <TableRow>
                            <TableCell> {session?.round}</TableCell>
                            <TableCell>{session?.raceName}</TableCell>
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
              )}

            {tabValue == "pointsForTeam" &&
              driver?.data?.driver?.teamPointsHistory?.length > 0 && (
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
                    {driver?.data?.driver?.teamPointsHistory?.map(
                      (session: {
                        round: number;
                        raceName: string;
                        session: string;
                        points: number;
                      }) => {
                        return (
                          <TableRow>
                            <TableCell> {session?.round}</TableCell>
                            <TableCell>{session?.raceName}</TableCell>
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
              )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default DriverModal;
