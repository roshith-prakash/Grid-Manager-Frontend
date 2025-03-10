/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/utils/axiosInstance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlertModal from "@/components/reuseit/AlertModal";
import Avatar from "@/components/reuseit/Avatar";
import { LuCirclePlus } from "react-icons/lu";
import { RiTeamLine } from "react-icons/ri";
import Card from "@/components/reuseit/Card";
import HashLoader from "react-spinners/HashLoader";
import {
  CreateTeamModal,
  EditTeamModal,
  PrimaryButton,
  SecondaryButton,
} from "@/components";
import { useDBUser } from "@/context/UserContext";
import { useInView } from "react-intersection-observer";
import { BsFillTrash3Fill } from "react-icons/bs";
import toast from "react-hot-toast";

const League = () => {
  const { leagueId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { dbUser } = useDBUser();

  // Intersection observer to fetch new leagues
  const { ref, inView } = useInView();

  // Fetch league data from server.
  const {
    data: league,
    isLoading,
    error,
    refetch: refetchLeague,
  } = useQuery({
    queryKey: ["league", leagueId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-league", {
        leagueId: leagueId,
      });
    },
  });

  // Fetching teams in the league
  const {
    data: teams,
    isLoading: loadingTeams,
    // error: teamsError,
    fetchNextPage: fetchNextTeams,
    isFetchingNextPage: loadingNextTeams,
    refetch: refetchTeams,
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

  const deleteTeam = () => {
    axiosInstance
      .post("/team/delete-team", { teamId: teamId })
      .then(() => {
        toast.success("Team Deleted.");
        refetchLeague();
        refetchTeams();
        setIsDeleteModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setIsDeleteModalOpen(false);
        toast.error("Something went wrong.");
      });
  };

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

  // Fetching next set of teams
  useEffect(() => {
    if (inView) {
      fetchNextTeams();
    }
  }, [inView, fetchNextTeams, teams?.pages?.length]);

  return (
    <div>
      {league && (
        <>
          {/* Create A Team */}
          <AlertModal
            className="max-w-2xl w-full !px-0 lg:px-5 noscroller"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <CreateTeamModal
              leagueId={leagueId as string}
              onClose={() => setIsModalOpen(false)}
            />
          </AlertModal>

          {/* Edit a Team */}
          <AlertModal
            className="max-w-2xl w-full !px-0 lg:px-5 noscroller"
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
            }}
          >
            <EditTeamModal
              onClose={() => {
                setIsEditModalOpen(false);
              }}
              teamId={teamId}
            />
          </AlertModal>

          {/* Delete Account Modal */}
          <AlertModal
            isOpen={isDeleteModalOpen}
            className="max-w-xl"
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <div className="flex flex-col gap-y-2">
              {/* Title */}
              <h1 className="dark:text-darkmodetext font-bold text-2xl">
                Are you sure you want to delete your team?
              </h1>

              {/* Subtitle */}
              <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70">
                This action cannot be reversed.
              </h2>

              {/* Buttons */}
              <div className="mt-5 flex gap-x-5 justify-end">
                <PrimaryButton
                  className="text-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                  onClick={deleteTeam}
                  text="Delete"
                />
                <SecondaryButton
                  className="text-sm"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                  }}
                  text="Cancel"
                />
              </div>
            </div>
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
                className="dark:hover:!text-cta"
                text={
                  <div className="flex  gap-x-2 items-center">
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
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between">
                          <h3 className="text-2xl font-bold">
                            <span className="mr-2">
                              #
                              {pageIndex * page?.data.teams?.length +
                                (index + 1)}
                            </span>
                            {team?.name}
                          </h3>

                          {/* Edit & Delete Buttons */}
                          {team.User.id == dbUser?.id && (
                            <div className="flex gap-x-5">
                              {/* Edit Button */}
                              <SecondaryButton
                                className="border-transparent dark:hover:!text-cta shadow-md"
                                onClick={() => {
                                  setTeamId(team?.id);
                                  setIsEditModalOpen(true);
                                }}
                                text={
                                  <div className="flex gap-x-2 items-center">
                                    <RiTeamLine className="text-xl" />
                                    <span>Edit Team</span>
                                  </div>
                                }
                              ></SecondaryButton>
                              <SecondaryButton
                                text={
                                  <div className="flex justify-center items-center  gap-x-2">
                                    <BsFillTrash3Fill className=" cursor-pointer " />
                                    Delete
                                  </div>
                                }
                                onClick={() => {
                                  setTeamId(team?.id);
                                  setIsDeleteModalOpen(true);
                                }}
                                disabledText="Please wait..."
                                className="border-transparent dark:!border-2 shadow-md hover:bg-red-600 text-red-600 dark:text-white hover:!text-white dark:hover:!text-red-600"
                              />
                            </div>
                          )}
                        </div>

                        <p className="text-lg font-medium">
                          Score : {team?.score}
                        </p>

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
