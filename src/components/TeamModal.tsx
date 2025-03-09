/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/utils/axiosInstance";
import Modal from "./reuseit/Modal";
import { useQuery } from "@tanstack/react-query";
import { FaUserAlt } from "react-icons/fa";
import HashLoader from "react-spinners/HashLoader";

const TeamModal = ({
  teamId,
  isModalOpen,
  setIsModalOpen,
}: {
  teamId: string;
  isModalOpen: boolean;
  setIsModalOpen: () => void;
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

  console.log(team?.data?.team);

  return (
    <Modal
      className="w-full noscroller"
      isOpen={isModalOpen}
      onClose={setIsModalOpen}
    >
      {team?.data?.team && (
        <>
          <div>
            <h1 className="text-center text-2xl font-medium">
              {team?.data?.team?.name}
            </h1>

            <p>{team?.data?.team?.League?.name}</p>
            <p>{team?.data?.team?.League?.leagueId}</p>

            <p>Available purse : {100 - team?.data?.team?.price} Cr</p>
            <p>Points : {team?.data?.team?.score}</p>

            <p className="mt-10 text-xl font-medium">Team Drivers </p>
            <div className="flex flex-wrap gap-10 justify-center pt-10">
              {team?.data?.team?.teamDrivers?.map((driver: any) => {
                return (
                  <div className="border-1 rounded px-3">
                    {driver?.image ? (
                      <img
                        src={driver?.image}
                        className="h-28 mx-auto"
                        style={{
                          backgroundColor: driver?.constructor_color,
                        }}
                      />
                    ) : (
                      <FaUserAlt className="text-8xl mx-auto" />
                    )}
                    <p className="pt-1">
                      {driver?.givenName} {driver?.familyName}
                    </p>
                    <p className="text-center">({driver?.code}) </p>
                    <p className="text-center">{driver?.constructor} </p>

                    <div className="border-t-1 mt-2 py-2">
                      {driver?.price} Cr.
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-10 text-xl font-medium">Team Constructors </p>
            <div className="flex flex-wrap gap-10 justify-center pt-10">
              {team?.data?.team?.teamConstructors?.map((constructor: any) => {
                return (
                  <div className="border-1 rounded px-3">
                    {constructor?.name}

                    <div className="border-t-1 mt-2 py-2">
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
