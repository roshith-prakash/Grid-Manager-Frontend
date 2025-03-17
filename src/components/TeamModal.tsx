/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import { FaUserAlt } from "react-icons/fa";
import HashLoader from "react-spinners/HashLoader";
import { RxCross2 } from "react-icons/rx";

const TeamModal = ({
  teamId,
  isModalOpen,
  closeModal,
}: {
  teamId: string;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const {
    data: team,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-team-by-id", {
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
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <HashLoader
            color={"#9b0ced"}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {error && <p className="text-center">Could not fetch Team!</p>}

      {team?.data?.team && (
        <>
          <button
            onClick={closeModal}
            className="absolute right-5 text-2xl cursor-pointer"
          >
            <RxCross2 />
          </button>

          <div className="max-w-4xl mx-auto p-6">
            {/* Team name */}
            <h1 className="text-center text-3xl italic font-semibold mb-6">
              {team.data.team.name}
            </h1>

            {/* League data */}
            <div className="text-lg font-medium pt-4 space-y-2 text-center">
              <p>League: {team.data.team.League?.name}</p>
              <p>League ID: {team.data.team.League?.leagueId}</p>
              <p>Points Scored: {team.data.team.score}</p>
            </div>

            <p className="text-3xl font-semibold text-center mt-16 my-8">
              Team Drivers
            </p>

            {/* Drivers */}
            <div className="flex flex-wrap gap-6 justify-center pt-6">
              {team.data.team.teamDrivers?.map((driver: any) => (
                <div
                  key={driver.code}
                  className="flex flex-col w-56 rounded overflow-hidden border-2 dark:border-white/25 border-darkbg/50 shadow-lg"
                >
                  <div
                    className="pt-2 flex items-end justify-center"
                    style={{ backgroundColor: driver?.constructor_color }}
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
                    <p className="text-sm">{driver?.constructor}</p>
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
                  key={constructor.name}
                  className="flex dark:border-white/25 flex-col w-64 text-center border-2 overflow-hidden rounded shadow-lg"
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

                  <p className="py-4 text-lg font-semibold">
                    {constructor?.name}
                  </p>
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
