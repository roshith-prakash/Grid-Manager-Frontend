/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { FaUserAlt } from "react-icons/fa";
import Card from "@/components/reuseit/Card";
import { TeamModal } from "@/components";

const Leaderboard = () => {
  const [teamId, setTeamId] = useState("");
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Leaderboard | Grid Manager";
  }, []);

  const { data: mostSelectedDrivers } = useQuery({
    queryKey: ["most-selected-drivers"],
    queryFn: () => {
      return axiosInstance.get("/team/get-most-selected-drivers");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: mostSelectedConstructors } = useQuery({
    queryKey: ["most-selected-constructors"],
    queryFn: () => {
      return axiosInstance.get("/team/get-most-selected-constructors");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: highestScoringDrivers } = useQuery({
    queryKey: ["highest-scoring-drivers"],
    queryFn: () => {
      return axiosInstance.get("/team/get-highest-scoring-drivers");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: highestScoringConstructors } = useQuery({
    queryKey: ["highest-scoring-constructors"],
    queryFn: () => {
      return axiosInstance.get("/team/get-highest-scoring-constructors");
    },
    staleTime: 1000 * 60 * 15,
  });

  const { data: top3Teams } = useQuery({
    queryKey: ["top-3-teams"],
    queryFn: () => {
      return axiosInstance.get("/team/get-top-3-teams");
    },
    staleTime: 1000 * 60 * 15,
  });

  return (
    <>
      {/* View Team in Modal */}
      <TeamModal
        teamId={teamId}
        isModalOpen={isTeamModalOpen}
        closeModal={() => setIsTeamModalOpen(false)}
      />

      <div className="py-10 text-center">
        <h1 className="text-5xl font-semibold italic">Leaderboard</h1>

        {/* Most Selected Constructors */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-6">
            Most Selected Constructors
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {mostSelectedConstructors?.data?.constructors?.map(
              (constructor: any, index: number) => (
                <Card
                  key={constructor.name}
                  className="w-64 text-center border-2 shadow-lg overflow-hidden"
                >
                  <div className="bg-white p-5 border-b flex flex-col items-center">
                    <img
                      src={constructor?.logo || "/default-logo.png"}
                      className="h-36 object-contain"
                      alt={constructor?.name}
                    />
                    <img
                      src={constructor?.carImage || "/default-car.png"}
                      alt="Car"
                    />
                  </div>
                  <div className="py-4">
                    <p className="text-lg font-semibold">
                      #{index + 1}. {constructor?.name}
                    </p>
                    <p>
                      Selected in{" "}
                      {Number(constructor?.chosenPercentage).toFixed(0)}% of
                      teams.
                    </p>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        {/* Most Selected Drivers */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-6">Most Selected Drivers</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {mostSelectedDrivers?.data?.drivers?.map(
              (driver: any, index: number) => (
                <Card
                  key={driver.code}
                  className="w-56 text-center border-2 shadow-lg overflow-hidden"
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
                  <div className="py-4">
                    <h3 className="text-lg font-semibold">
                      #{index + 1}. {driver?.givenName} {driver?.familyName}
                    </h3>
                    <p>({driver?.code})</p>
                    <p>{driver?.constructor}</p>
                    <p>Selected in {driver?.chosenPercentage}% of teams.</p>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        {/* Highest Point Scoring Constructors */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-6">
            Highest Point Scoring Constructors
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {highestScoringConstructors?.data?.constructors?.map(
              (constructor: any, index: number) => (
                <Card
                  key={constructor.name}
                  className="w-64 text-center border-2 shadow-lg overflow-hidden"
                >
                  <div className="bg-white p-5 border-b flex flex-col items-center">
                    <img
                      src={constructor?.logo || "/default-logo.png"}
                      className="h-36 object-contain"
                      alt={constructor?.name}
                    />
                    <img
                      src={constructor?.carImage || "/default-car.png"}
                      alt="Car"
                    />
                  </div>
                  <div className="py-4">
                    <p className="text-lg font-semibold">
                      #{index + 1}. {constructor?.name}
                    </p>
                    <p>Points: {constructor?.points}</p>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        {/* Highest Point Scoring Drivers */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-6">
            Highest Point Scoring Drivers
          </h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {highestScoringDrivers?.data?.drivers?.map(
              (driver: any, index: number) => (
                <Card
                  key={driver.code}
                  className="w-60 text-center border-2 shadow-lg overflow-hidden"
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
                  <div className="py-4">
                    <h3 className="text-lg font-semibold">
                      #{index + 1}. {driver?.givenName} {driver?.familyName}
                    </h3>
                    <p>({driver?.code})</p>
                    <p>{driver?.constructor}</p>
                    <p>Points: {driver?.points}</p>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        {/* Top Teams */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-6">Top Teams</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {top3Teams?.data?.teams?.map((team: any, index: number) => (
              <Card
                key={team.id}
                className="w-fit p-5 text-center border-2 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  setTeamId(team?.id);
                  setIsTeamModalOpen(true);
                }}
              >
                <div className="p-5">
                  <h3 className="text-2xl font-bold">
                    #{index + 1}. {team?.name}
                  </h3>
                  <p className="pt-3 text-lg font-medium">
                    Points: {team?.score}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
