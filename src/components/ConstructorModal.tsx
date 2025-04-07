import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import { RxCross2 } from "react-icons/rx";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./reuseit/Table";
import { useState } from "react";

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
            className="absolute bg-white dark:bg-secondarydarkbg dark:text-white hover:scale-110 text-darkbg hover:text-red-500 transition-all rounded-full p-1 top-5 right-5 text-2xl cursor-pointer"
          >
            <RxCross2 />
          </button>

          {/* Constructor Data */}
          <div className="flex flex-wrap">
            <div className="w-full md:w-[40%]">
              {/* Constructor Image Section */}
              <div className="flex flex-col bg-white items-center pb-5 py-4 px-5 border-b-2">
                <img
                  src={
                    constructor?.data?.constructor?.logo
                      ? constructor?.data?.constructor?.logo
                      : "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                  }
                  className="h-36 object-contain"
                />
                <img
                  src={
                    constructor?.data?.constructor?.carImage
                      ? constructor?.data?.constructor?.carImage
                      : "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                  }
                />
              </div>
            </div>
            {/* Constructor Info */}
            <div className="w-full md:flex-1 border-b-4">
              <div className="py-4 px-8 flex flex-col gap-y-2 ">
                <h3 className="text-2xl text-ellipsis text-nowrap font-semibold">
                  {constructor?.data?.constructor?.name}
                </h3>

                <p className="text-md">
                  Points:
                  <span className="font-semibold ml-1">
                    {constructor?.data?.constructor?.points}
                  </span>
                </p>

                {/* IF driver is already present in a team */}
                {constructor?.data?.constructor?.pointsForTeam ? (
                  <p className="text-md">
                    Points For Your Team:
                    <span className="font-semibold ml-1">
                      {constructor?.data?.constructor?.pointsForTeam}
                    </span>
                  </p>
                ) : (
                  <></>
                )}

                <p className="text-md">
                  Price:{" "}
                  <span className="font-semibold">
                    {constructor?.data?.constructor?.price} Cr.
                  </span>
                </p>

                <p className="text-md">
                  Teams in which constructor is present:{" "}
                  <span className="font-semibold">
                    {Number(
                      constructor?.data?.constructor?.chosenPercentage
                    ).toFixed(0)}
                    %{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Constructor Points Scoring  */}
          <div className="mt-5 px-5 pb-20">
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

            {tabValue == "points" &&
              constructor?.data?.constructor?.pointsHistory?.length > 0 && (
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
                    {constructor?.data?.constructor?.pointsHistory?.map(
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
              constructor?.data?.constructor?.teamPointsHistory?.length > 0 && (
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
                    {constructor?.data?.constructor?.teamPointsHistory?.map(
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

export default ConstructorModal;
