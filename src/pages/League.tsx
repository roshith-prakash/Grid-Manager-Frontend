/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/utils/axiosInstance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Test from "./Test";
import AlertModal from "@/components/reuseit/AlertModal";
import Avatar from "@/components/reuseit/Avatar";
import { LuCirclePlus } from "react-icons/lu";
import { RiTeamLine } from "react-icons/ri";
import Card from "@/components/reuseit/Card";
import HashLoader from "react-spinners/HashLoader";
import { SecondaryButton } from "@/components";
import { useDBUser } from "@/context/UserContext";
import { useInView } from "react-intersection-observer";

const League = () => {
  const { leagueId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dbUser } = useDBUser();

  // Intersection observer to fetch new posts
  const { ref, inView } = useInView();

  // Fetch league data from server.
  const {
    data: league,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["league", leagueId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-league", {
        leagueId: leagueId,
      });
    },
  });

  // Fetching searched Posts
  const {
    data: teams,
    isLoading: loadingTeams,
    // error: postsError,
    fetchNextPage: fetchNextTeams,
    isFetchingNextPage: loadingNextTeams,
    // refetch: refetchTeams,
  } = useInfiniteQuery({
    queryKey: ["teams", leagueId],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-teams-in-a-league", {
        leagueId: leagueId,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: !!league?.data?.data?.leagueId,
  });

  // Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Document Title
  useEffect(() => {
    if (league?.data?.data?.name) {
      document.title = `${league?.data?.data?.name} | Grid Manager`;
    } else {
      document.title = "League | Grid Manager";
    }
  }, [league?.data]);

  // Fetching next set of posts or users
  useEffect(() => {
    if (inView) {
      fetchNextTeams();
    }
  }, [inView, fetchNextTeams, teams?.pages?.length]);

  return (
    <div>
      {league && (
        <>
          <AlertModal
            className="max-w-2xl w-full !px-0 lg:px-5 noscroller"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <Test
              leagueId={leagueId as string}
              onClose={() => setIsModalOpen(false)}
            />
          </AlertModal>

          <div className="p-6 space-y-6">
            {/* League Info */}
            <Card className="flex justify-between items-center py-3 px-6">
              <div>
                <h2 className="text-xl font-bold">
                  {league?.data?.data?.name}
                </h2>
                <p className="text-gray-500">
                  League ID: {league?.data?.data?.leagueId}
                </p>
                <p className="text-gray-500">
                  Teams: {league?.data?.data?.numberOfTeams}
                </p>
              </div>

              <SecondaryButton
                text={
                  <div className="flex gap-x-2 items-center">
                    <LuCirclePlus className="text-xl" />
                    <span>Add Team</span>
                  </div>
                }
                onClick={() => setIsModalOpen(true)}
              ></SecondaryButton>
            </Card>

            {/* User Info */}
            <Card>
              <div className="p-4 flex items-center space-x-4">
                <Avatar
                  imageSrc={league?.data?.data.User.photoURL}
                  fallBackText={league?.data?.data.User.name}
                ></Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {league?.data?.data.User.name}
                  </h3>
                  <p className="text-gray-500">
                    @{league?.data?.data.User.username}
                  </p>
                </div>
              </div>
            </Card>

            {/* Teams */}
            {teams &&
              teams?.pages?.map((page, pageIndex) => {
                return page?.data.teams?.map((team: any, index: number) => {
                  return (
                    <Card key={team.id} className="relative">
                      {team.User.id == dbUser?.id && (
                        <SecondaryButton
                          text={
                            <div className="flex gap-x-2 items-center">
                              <RiTeamLine className="text-xl" />
                              <span>Edit Team</span>
                            </div>
                          }
                          className="absolute top-5 right-5"
                        ></SecondaryButton>
                      )}
                      <div className="p-4 space-y-4">
                        <h3 className="text-2xl font-bold">
                          <span className="mr-2">
                            #
                            {pageIndex * page?.data.teams?.length + (index + 1)}
                          </span>
                          {team?.name}
                        </h3>
                        <p className="text-lg font-medium">
                          Score : {team?.score}
                        </p>

                        {/* Drivers */}
                        {/* <div>
                        <h4 className="font-semibold">Drivers:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {team.teamDrivers.map((driver: any) => (
                            <Card
                              key={driver?.id}
                              className="p-2 border-l-4"
                              style={{ borderColor: driver?.constructor_color }}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={driver?.image}
                                  alt={driver?.givenName}
                                  style={{
                                    backgroundColor: driver?.constructor_color,
                                  }}
                                  className="w-12  h-12 rounded-full"
                                />
                                <div className="flex items-center gap-x-4">
                                  <div>
                                    <p className="font-semibold">
                                      {driver?.givenName} {driver?.familyName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {driver?.constructor}
                                    </p>
                                  </div>
                                  <Badge
                                    style={{
                                      backgroundColor: driver?.constructor_color,
                                    }}
                                    className="text-transparent !px-1 font-bold bg-clip-text"
                                    text={driver?.code}
                                  ></Badge>
                                  <Badge
                                    style={{
                                      backgroundColor: driver?.constructor_color,
                                    }}
                                    className="text-transparent !px-1 font-bold bg-clip-text"
                                    text={driver?.permanentNumber}
                                  ></Badge>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div> */}

                        {/* Constructors */}
                        {/* <div>
                        <h4 className="font-semibold">Constructors:</h4>
                        <div className="flex space-x-2">
                          {team.teamConstructors.map((constructor: any) => (
                            <Badge
                              text={constructor.name}
                              className="px-4 bg-cta text-white font-medium py-2"
                            ></Badge>
                          ))}
                        </div>
                      </div> */}

                        <div className="py-4 flex items-center space-x-2">
                          <Avatar
                            className="h-12 w-12"
                            imageSrc={team.User.photoURL}
                            fallBackText={team.User.name}
                          ></Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {team.User.name}
                            </h3>
                            <p className="text-gray-500">
                              @{team.User.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                });
              })}

            {/* Team Loader */}
            {(loadingTeams || loadingNextTeams) && (
              <div className="flex justify-center items-center py-10">
                <HashLoader
                  color={"#9b0ced"}
                  loading={loadingTeams || loadingNextTeams}
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )}

            <div ref={ref}></div>
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

      {error && <p className="text-center">League does not exist!</p>}
    </div>
  );
};

export default League;
