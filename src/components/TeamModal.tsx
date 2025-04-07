/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import { FaUserAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import DriverModal from "./DriverModal";
import { useState } from "react";
import { useDBUser } from "@/context/UserContext";
import ConstructorModal from "./ConstructorModal";
import Card from "./reuseit/Card";

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

  return (
    <Modal
      className="w-full !max-w-4xl px-5 noscroller"
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      {/* View Driver Data */}
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

      {isLoading && (
        <div className="max-w-4xl mx-auto p-6">
          {/* Team name */}
          <h1 className="mx-auto h-7 w-60 bg-gray-500 animate-pulse rounded mb-6"></h1>

          <p className="mx-auto h-8 w-60 bg-gray-500 animate-pulse rounded mt-8"></p>

          <p className="text-3xl font-semibold text-center mt-16 my-8">
            Team Drivers
          </p>

          {/* Drivers */}
          <div className="flex flex-wrap gap-6 justify-center pt-6">
            {Array(5)
              .fill(null)
              .map(() => {
                return (
                  <Card className="w-64 text-center border-2 shadow-lg overflow-hidden">
                    <div className="bg-white animate-pulse p-5 border-b flex flex-col items-center">
                      <div className="h-52 object-contain" />
                    </div>
                    <div className="flex flex-col gap-y-2 pt-4 pb-3">
                      <p className="bg-gray-500 animate-pulse p-2 w-48 mx-auto rounded"></p>
                      <p className="bg-gray-500 animate-pulse p-2 w-20 mx-auto rounded"></p>
                      <p className="bg-gray-500 animate-pulse p-2 w-48 mx-auto rounded"></p>
                    </div>
                  </Card>
                );
              })}
          </div>

          <p className="text-3xl font-semibold text-center mt-16 my-8">
            Team Constructors
          </p>

          {/* Constructors */}
          <div className="flex flex-wrap gap-6 justify-center pt-6">
            {Array(2)
              .fill(null)
              .map(() => {
                return (
                  <Card className="w-64 text-center border-2 shadow-lg overflow-hidden">
                    <div className="bg-white animate-pulse p-5 border-b flex flex-col items-center">
                      <div className="h-52 object-contain" />
                    </div>
                    <div className="flex flex-col gap-y-2 pt-4">
                      <p className="bg-gray-500 animate-pulse p-3 w-48 mx-auto rounded"></p>
                      <p className="bg-gray-500 animate-pulse p-3 w-48 mx-auto rounded"></p>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {error && (
        <div className="min-h-72 flex justify-center items-center">
          <p className="text-center text-xl font-semibold px-5">
            Could not fetch team!
          </p>
        </div>
      )}

      {team?.data?.team && (
        <>
          {/* Close div button */}
          <button
            onClick={closeModal}
            className="absolute dark:bg-white bg-secondarydarkbg text-white hover:scale-110 dark:text-darkbg hover:text-red-500 transition-all rounded-full p-1 top-5 right-5 text-2xl cursor-pointer"
          >
            <RxCross2 />
          </button>

          <div className="max-w-4xl mx-auto p-6">
            {/* Team name */}
            <h1 className="text-center text-3xl italic font-semibold mb-6">
              {team.data.team.name}
            </h1>

            {/* League data */}
            {displayLeague && (
              <div className="text-lg font-medium pt-4 space-y-2 text-center">
                <p>League: {team.data.team.League?.name}</p>
                <p>League ID: {team.data.team.League?.leagueId}</p>
              </div>
            )}

            <p className="text-2xl w-fit mx-auto px-2 border-2 font-semibold py-2 rounded-lg border-darkbg/25 dark:border-white/25 mt-8">
              Points Scored: {team.data.team.score}
            </p>

            <p className="text-3xl font-semibold text-center mt-16 my-8">
              Team Drivers
            </p>

            {/* Drivers */}
            <div className="flex flex-wrap gap-6 justify-center pt-6">
              {team.data.team.teamDrivers?.map((driver: any) => (
                <div
                  onClick={() => {
                    setSelectedDriverId(driver?.driverId);
                    setIsDriverModalOpen(true);
                  }}
                  key={driver.code}
                  className="flex cursor-pointer flex-col w-56 rounded overflow-hidden border-2 dark:border-white/25 shadow-lg"
                >
                  <div
                    className="pt-2 flex items-end justify-center"
                    style={{
                      backgroundImage: `linear-gradient(${driver?.constructor_color},#000)`,
                    }}
                  >
                    {driver?.image ? (
                      <img
                        src={driver.image}
                        alt={driver.familyName}
                        className="h-40 object-cover"
                      />
                    ) : (
                      <FaUserAlt className="text-gray-400 text-4xl" />
                    )}
                  </div>

                  <div className="py-4 px-4 text-center">
                    <h3 className="text-lg font-semibold">
                      {driver?.givenName} {driver?.familyName}
                    </h3>
                    <p>({driver?.code})</p>
                    <p className="text-sm">{driver?.constructor_name}</p>

                    <p className="text-lg font-semibold py-2">
                      Points Scored : {driver?.pointsForTeam}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-3xl font-semibold text-center mt-16 my-8">
              Team Constructors
            </p>

            {/* Constructors */}
            <div className="flex flex-wrap gap-6 justify-center pt-6">
              {team.data.team.teamConstructors?.map((constructor: any) => (
                <div
                  onClick={() => {
                    setSelectedConstructorId(constructor?.constructorId);
                    setIsConstructorModalOpen(true);
                  }}
                  key={constructor.name}
                  className="flex cursor-pointer dark:border-white/25 flex-col w-64 text-center border-2 overflow-hidden rounded shadow-lg"
                >
                  <div className="flex bg-white flex-col items-center pb-5 px-5 border-b">
                    <img
                      src={
                        constructor?.logo ||
                        "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                      }
                      className="h-36 object-contain"
                      alt={constructor?.name}
                    />
                    <img
                      src={
                        constructor?.carImage ||
                        "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                      }
                      alt="Car"
                    />
                  </div>

                  <div className="py-4">
                    <p className=" text-lg font-semibold">
                      {constructor?.name}
                    </p>

                    <p className="text-lg font-semibold py-2">
                      Points Scored : {constructor?.pointsForTeam}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default TeamModal;
