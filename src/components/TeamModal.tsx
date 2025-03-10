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
        teamId: teamId,
      });
    },
  });

  return (
    <Modal
      className="w-full px-5 noscroller"
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      {team?.data?.team && (
        <>
          {/* Close div button */}
          <button
            onClick={closeModal}
            className="absolute right-5 text-2xl cursor-pointer"
          >
            <RxCross2 />
          </button>

          <div>
            <h1 className="text-center text-2xl font-medium">
              {team?.data?.team?.name}
            </h1>

            <div className="py-8">
              <p>League : {team?.data?.team?.League?.name}</p>
              <p>League ID : {team?.data?.team?.League?.leagueId}</p>

              <p>Available purse : {100 - team?.data?.team?.price} Cr</p>
              <p>Points Scored : {team?.data?.team?.score}</p>
            </div>

            <p className="text-xl text-center font-medium">Team Drivers </p>
            <div className="flex flex-wrap gap-x-2 gap-y-8 md:gap-10 justify-center pt-10">
              {team?.data?.team?.teamDrivers?.map((driver: any) => {
                return (
                  <div
                    className={`border-2 text-center rounded-sm dark:border-white/25  bg-white dark:bg-darkbg`}
                    key={driver?.driverId}
                    id={`${driver?.permanentNumber}`}
                  >
                    <div
                      className="pt-2"
                      style={{
                        backgroundColor: driver?.constructor_color,
                      }}
                    >
                      {driver?.image ? (
                        <img src={driver?.image} className="h-32 mx-auto" />
                      ) : (
                        <FaUserAlt className="text-8xl mx-auto" />
                      )}
                    </div>
                    <div className="px-2.5 py-3 flex flex-col gap-y-2">
                      <p className="pt-1">
                        {driver?.givenName} {driver?.familyName}
                      </p>
                      <p className="text-center">({driver?.code}) </p>
                      <p className="text-center">{driver?.constructor} </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-10 text-xl text-center font-medium">
              Team Constructors{" "}
            </p>
            <div className="flex flex-wrap gap-10 justify-center pt-10">
              {team?.data?.team?.teamConstructors?.map((constructor: any) => {
                return (
                  <div
                    className="border-2 dark:border-white/25 text-center rounded-sm p-3 bg-white dark:bg-darkbg"
                    key={constructor?.constructorId}
                    id={`${constructor?.constructorNumber}`}
                  >
                    {constructor?.name}

                    <div className="border-t-1 mt-2 dark:border-white/20 py-2">
                      {constructor?.price} Cr.
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {!isLoading && (
        <div className="flex justify-center items-center py-10">
          <HashLoader
            color={"#9b0ced"}
            loading={isLoading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {error && <p className="text-center">Could not fetch Team!</p>}
    </Modal>
  );
};

export default TeamModal;
