/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/utils/axiosInstance";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateTeamModal,
  EditLeagueModal,
  EditTeamModal,
  PrimaryButton,
  SecondaryButton,
  TeamModal,
} from "@/components";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlertModal from "@/components/reuseit/AlertModal";
import Avatar from "@/components/reuseit/Avatar";
import { LuCirclePlus } from "react-icons/lu";
import { RiTeamLine } from "react-icons/ri";
import Card from "@/components/reuseit/Card";
import { useDBUser } from "@/context/UserContext";
import { useInView } from "react-intersection-observer";
import { BsFillTrash3Fill, BsPen } from "react-icons/bs";
import toast from "react-hot-toast";
import { IoMdShare } from "react-icons/io";
import { useHasWeekendStarted } from "@/functions/hasWeekendStarted";
import Tooltip from "@/components/reuseit/Tooltip";

const League = () => {
  const { leagueId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);
  const [isEditLeagueModalOpen, setIsEditLeagueModalOpen] = useState(false);
  const [isDeleteLeagueModalOpen, setIsDeleteLeagueModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState("allTeams");
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { dbUser } = useDBUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasWeekendStarted = useHasWeekendStarted();

  // Intersection observer to fetch new leagues
  const { ref, inView } = useInView();

  // Fetch league data from server.
  const { data: canUserJoinLeague } = useQuery({
    queryKey: ["numberOfLeagues", dbUser?.id],
    queryFn: async () => {
      return axiosInstance.post("/team/check-if-user-can-join-league", {
        userId: dbUser?.id,
      });
    },
  });

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
        userId: dbUser?.id,
        leagueId: leagueId,
      });
    },
  });

  // Fetching all teams in the league
  const {
    data: teams,
    isLoading: loadingTeams,
    // error: teamsError,
    fetchNextPage: fetchNextTeams,
    refetch: refetchTeams,
    // refetch: refetchTeams,
  } = useInfiniteQuery({
    queryKey: ["allTeams", leagueId],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-teams-in-a-league", {
        userId: dbUser?.id,
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

  // Fetching user's teams in the league
  const {
    data: userTeams,
    isLoading: loadingUserTeams,
    // error: teamsError,
    refetch: refetchUserTeams,
  } = useQuery({
    queryKey: ["userTeams", dbUser?.id, leagueId],
    queryFn: () => {
      return axiosInstance.post("/team/get-user-league-teams", {
        userId: dbUser?.id,
        leagueId: leagueId,
      });
    },
    enabled: !!league?.data?.data?.leagueId,
  });

  // Delete a selected team
  const deleteTeam = () => {
    setDisabled(true);
    axiosInstance
      .post("/team/delete-team", { teamId: teamId, userId: dbUser?.id })
      .then(() => {
        toast.success("Team Deleted.");
        refetchLeague();
        refetchTeams();
        refetchUserTeams();
        setDisabled(false);
        setIsDeleteTeamModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setIsDeleteTeamModalOpen(false);
        setDisabled(false);
        toast.error("Something went wrong.");
      });
  };

  const deleteLeague = () => {
    setDisabled(true);
    axiosInstance
      .post("/team/delete-league", { leagueId: leagueId, userId: dbUser?.id })
      .then(async () => {
        toast.success("League Deleted.");
        await queryClient.refetchQueries({
          queryKey: ["userLeagues", dbUser?.username],
          refetchType: "active",
        });
        setIsDeleteLeagueModalOpen(false);
        setDisabled(false);
        navigate("/leagues");
      })
      .catch((err) => {
        console.log(err);
        setIsDeleteLeagueModalOpen(false);
        setDisabled(false);
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
    if (tabValue == "allTeams" && inView) {
      fetchNextTeams();
    }
  }, [tabValue, inView, fetchNextTeams, teams?.pages?.length]);

  return (
    <div>
      {league && (
        <>
          {/* View Team in Modal */}
          <TeamModal
            teamId={teamId}
            isModalOpen={isTeamModalOpen}
            closeModal={() => setIsTeamModalOpen(false)}
          />

          {/* Create A Team */}
          <AlertModal
            className="max-w-2xl w-full !px-0 lg:px-5 noscroller"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <CreateTeamModal
              leagueId={leagueId as string}
              onClose={() => setIsModalOpen(false)}
              refetchFunction={() => {
                refetchLeague();
                refetchTeams();
                refetchUserTeams();
              }}
            />
          </AlertModal>

          {/* Edit a Team */}
          <AlertModal
            className="max-w-2xl w-full !px-0 lg:px-5 noscroller"
            isOpen={isEditTeamModalOpen}
            onClose={() => {
              setIsEditTeamModalOpen(false);
            }}
          >
            <EditTeamModal
              onClose={() => {
                setIsEditTeamModalOpen(false);
              }}
              refetchFunction={() => {
                refetchTeams();
                refetchUserTeams();
              }}
              teamId={teamId}
            />
          </AlertModal>

          {/* Edit the League */}
          <AlertModal
            className="!px-0 lg:px-5 py-0 noscroller border-none"
            isOpen={isEditLeagueModalOpen}
            onClose={() => {
              setIsEditLeagueModalOpen(false);
            }}
          >
            <EditLeagueModal
              onClose={() => {
                setIsEditLeagueModalOpen(false);
              }}
              refetchFunction={() => {
                refetchLeague();
              }}
              league={league?.data?.data}
            />
          </AlertModal>

          {/* Delete Team Modal */}
          <AlertModal
            isOpen={isDeleteTeamModalOpen}
            className="max-w-xl"
            onClose={() => setIsDeleteTeamModalOpen(false)}
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
                  disabled={disabled}
                  disabledText="Please Wait..."
                  className="text-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                  onClick={deleteTeam}
                  text="Delete"
                />
                <SecondaryButton
                  disabled={disabled}
                  disabledText="Please Wait..."
                  className="text-sm"
                  onClick={() => {
                    setIsDeleteTeamModalOpen(false);
                  }}
                  text="Cancel"
                />
              </div>
            </div>
          </AlertModal>

          {/* Delete League Modal */}
          <AlertModal
            isOpen={isDeleteLeagueModalOpen}
            className="max-w-xl"
            onClose={() => setIsDeleteLeagueModalOpen(false)}
          >
            <div className="flex flex-col gap-y-2">
              {/* Title */}
              <h1 className="dark:text-darkmodetext font-bold text-2xl">
                Are you sure you want to delete this league?
              </h1>

              {/* Subtitle */}
              <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70">
                This action cannot be reversed. All teams within the league will
                be deleted.
              </h2>

              {/* Buttons */}
              <div className="mt-5 flex gap-x-5 justify-end">
                <PrimaryButton
                  disabled={disabled}
                  disabledText="Please Wait..."
                  className="text-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                  onClick={deleteLeague}
                  text="Delete"
                />
                <SecondaryButton
                  disabled={disabled}
                  disabledText="Please Wait..."
                  className="text-sm"
                  onClick={() => {
                    setIsDeleteLeagueModalOpen(false);
                  }}
                  text="Cancel"
                />
              </div>
            </div>
          </AlertModal>

          <div className="p-6 space-y-6">
            {/* League Info */}
            <Card className="py-5 px-6">
              <div className="flex flex-wrap gap-8 justify-center md:justify-between items-center">
                {/* Title */}
                <h2 className="text-xl text-center md:text-left font-bold">
                  {league?.data?.data?.name}
                </h2>

                {/* Buttons */}
                <div className="hidden md:flex flex-wrap flex-1 gap-y-5 justify-around md:justify-end items-center gap-x-4">
                  <SecondaryButton
                    className="border-transparent dark:hover:!text-cta shadow-md"
                    text={
                      <div className="flex gap-x-2 items-center">
                        <IoMdShare className="text-xl" />
                        <span className="">Share</span>
                      </div>
                    }
                    onClick={() => {
                      toast.success("Link to League Copied!");
                      navigator?.clipboard?.writeText(window.location.href);
                    }}
                  ></SecondaryButton>
                  {league?.data?.data?.User.id == dbUser?.id && (
                    <SecondaryButton
                      className="border-transparent dark:hover:!text-cta shadow-md"
                      text={
                        <div className="flex gap-x-2 items-center">
                          <BsPen className="text-xl" />
                          <span className="">Edit</span>
                        </div>
                      }
                      onClick={() => setIsEditLeagueModalOpen(true)}
                    ></SecondaryButton>
                  )}
                  <Tooltip
                    displayed={
                      hasWeekendStarted ||
                      (canUserJoinLeague?.data?.canUserJoinLeague == false &&
                        league?.data?.data?.User?.id != dbUser?.id) ||
                      userTeams?.data?.teams?.length >= 2
                    }
                    text={
                      hasWeekendStarted
                        ? "Race weekend has started. Teams cannot be added."
                        : canUserJoinLeague?.data?.canUserJoinLeague == false &&
                          league?.data?.data?.User?.id != dbUser?.id
                        ? "Can join a maximum of 5 leagues."
                        : userTeams?.data?.teams?.length >= 2
                        ? "Maximum of 2 teams can be added per league."
                        : ""
                    }
                  >
                    <SecondaryButton
                      disabled={
                        hasWeekendStarted ||
                        (canUserJoinLeague?.data?.canUserJoinLeague == false &&
                          league?.data?.data?.User?.id != dbUser?.id) ||
                        userTeams?.data?.teams?.length >= 2
                      }
                      className="border-transparent dark:hover:!text-cta  dark:disabled:hover:!text-gray-400 shadow-md"
                      text={
                        <div className="flex  gap-x-2 items-center">
                          <LuCirclePlus className="text-xl" />
                          <span className="">Add</span>
                        </div>
                      }
                      onClick={() => setIsModalOpen(true)}
                    ></SecondaryButton>
                  </Tooltip>
                  {league?.data?.data?.User.id == dbUser?.id && (
                    <SecondaryButton
                      text={
                        <div className="flex justify-center items-center  gap-x-2">
                          <BsFillTrash3Fill className="text-xl cursor-pointer " />
                          <span className="">Delete</span>
                        </div>
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteLeagueModalOpen(true);
                      }}
                      disabled={disabled}
                      disabledText="Please wait..."
                      className="border-transparent dark:!border-2 shadow-md hover:bg-red-600 text-red-600 dark:text-white hover:!text-white dark:hover:!text-red-600"
                    />
                  )}
                </div>
              </div>

              {/* League Info */}
              <div className="py-8 text-md font-medium flex flex-col items-center md:items-start gap-y-2">
                <p className="text-black/75 dark:text-white/60">
                  League ID: {league?.data?.data?.leagueId}
                </p>
                <p className="text-black/75 dark:text-white/60">
                  Private League: {String(league?.data?.data?.private)}
                </p>
                <p className="text-black/75 dark:text-white/60">
                  Teams: {league?.data?.data?.numberOfTeams}
                </p>
              </div>

              {/* Smaller screen buttons */}
              <div className="flex md:hidden flex-wrap flex-1 gap-y-5 justify-around md:justify-end items-center gap-x-4">
                <SecondaryButton
                  className="border-transparent dark:hover:!text-cta shadow-md"
                  text={
                    <div className="flex gap-x-2 items-center">
                      <IoMdShare className="text-xl" />
                      <span className="">Share</span>
                    </div>
                  }
                  onClick={() => {
                    toast.success("Link to League Copied!");
                    navigator?.clipboard?.writeText(window.location.href);
                  }}
                ></SecondaryButton>
                {league?.data?.data?.User.id == dbUser?.id && (
                  <SecondaryButton
                    className="border-transparent dark:hover:!text-cta shadow-md"
                    text={
                      <div className="flex gap-x-2 items-center">
                        <BsPen className="text-xl" />
                        <span className="">Edit</span>
                      </div>
                    }
                    onClick={() => setIsEditLeagueModalOpen(true)}
                  ></SecondaryButton>
                )}
                <Tooltip
                  position="top"
                  displayed={
                    hasWeekendStarted ||
                    (canUserJoinLeague?.data?.canUserJoinLeague == false &&
                      league?.data?.data?.User?.id != dbUser?.id) ||
                    userTeams?.data?.teams?.length >= 2
                  }
                  text={
                    hasWeekendStarted
                      ? "Race weekend has started. Teams cannot be added."
                      : canUserJoinLeague?.data?.canUserJoinLeague == false &&
                        league?.data?.data?.User?.id != dbUser?.id
                      ? "Can join a maximum of 5 leagues."
                      : userTeams?.data?.teams?.length >= 2
                      ? "Maximum of 2 teams can be added per league."
                      : ""
                  }
                >
                  <SecondaryButton
                    disabled={
                      hasWeekendStarted ||
                      (canUserJoinLeague?.data?.canUserJoinLeague == false &&
                        league?.data?.data?.User?.id != dbUser?.id) ||
                      userTeams?.data?.teams?.length >= 2
                    }
                    className="border-transparent dark:hover:!text-cta  dark:disabled:hover:!text-gray-400 shadow-md"
                    text={
                      <div className="flex  gap-x-2 items-center">
                        <LuCirclePlus className="text-xl" />
                        <span className="">Add</span>
                      </div>
                    }
                    onClick={() => setIsModalOpen(true)}
                  ></SecondaryButton>
                </Tooltip>
                {league?.data?.data?.User.id == dbUser?.id && (
                  <SecondaryButton
                    text={
                      <div className="flex justify-center items-center  gap-x-2">
                        <BsFillTrash3Fill className="text-xl cursor-pointer " />
                        <span className="">Delete</span>
                      </div>
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteLeagueModalOpen(true);
                    }}
                    disabled={disabled}
                    disabledText="Please wait..."
                    className="border-transparent dark:!border-2 shadow-md hover:bg-red-600 text-red-600 dark:text-white hover:!text-white dark:hover:!text-red-600"
                  />
                )}
              </div>
            </Card>

            {/* User Info */}
            <Card>
              <Link
                to={`/user/${league?.data?.data.User.username}`}
                className="p-4 flex items-center space-x-4 w-fit"
              >
                <Avatar
                  imageSrc={league?.data?.data.User.photoURL}
                  fallBackText={league?.data?.data.User.name}
                ></Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {league?.data?.data.User.name}
                  </h3>
                  <p className="text-black/75 dark:text-white/60">
                    @{league?.data?.data.User.username}
                  </p>
                </div>
              </Link>
            </Card>

            {/* Tab Buttons */}
            <div className="flex pt-8">
              {/* Teams Tab Button */}
              <button
                onClick={() => setTabValue("allTeams")}
                className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4 ${
                  tabValue == "allTeams" &&
                  "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
                }`}
              >
                All Teams
              </button>
              {/* Leagues Tab Button */}
              <button
                onClick={() => setTabValue("userTeams")}
                className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4  ${
                  tabValue == "userTeams" &&
                  "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
                }`}
              >
                Your Teams
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {tabValue == "allTeams" ? (
                <>
                  {/* All Teams */}
                  <div className="flex py-10 flex-col gap-5">
                    {teams &&
                      teams?.pages?.map((page, pageIndex) => {
                        return page?.data.teams?.map(
                          (team: any, index: number) => {
                            return (
                              <Card
                                onClick={() => {
                                  setTeamId(team?.id);
                                  setIsTeamModalOpen(true);
                                }}
                                key={team.id}
                                className="relative rounded-md border-2 cursor-pointer transition-all"
                              >
                                <div className="p-5 space-y-4">
                                  <div className="flex flex-wrap gap-y-4 gap-x-4 justify-between items-center">
                                    <h3 className="text-xl font-bold ">
                                      <span className="mr-2">
                                        #
                                        {pageIndex *
                                          teams?.pages[0]?.data?.teams?.length +
                                          (index + 1)}
                                        .
                                      </span>
                                      {team?.name}
                                    </h3>

                                    {/* Edit & Delete Buttons */}
                                    {team.User.id === dbUser?.id && (
                                      <div className="hidden md:flex flex-wrap flex-1 justify-end gap-x-4">
                                        <Tooltip
                                          displayed={hasWeekendStarted}
                                          text={
                                            "Race weekend has started. Teams cannot be edited."
                                          }
                                        >
                                          <SecondaryButton
                                            disabled={hasWeekendStarted}
                                            className="border-transparent shadow-md hover:text-cta"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setTeamId(team?.id);
                                              setIsEditTeamModalOpen(true);
                                            }}
                                            text={
                                              <div className="flex gap-x-2 items-center">
                                                <RiTeamLine className="text-lg" />
                                                <span>Edit</span>
                                              </div>
                                            }
                                          />
                                        </Tooltip>
                                        <SecondaryButton
                                          text={
                                            <div className="flex items-center gap-x-2">
                                              <BsFillTrash3Fill className="text-lg" />
                                              <span>Delete</span>
                                            </div>
                                          }
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setTeamId(team?.id);
                                            setIsDeleteTeamModalOpen(true);
                                          }}
                                          disabled={disabled}
                                          disabledText="Please wait..."
                                          className="border-transparent text-red-500 hover:bg-red-600 hover:text-white shadow-md"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <p className="text-md font-medium">
                                    Points: {team?.score}
                                  </p>

                                  <Link
                                    to={`/user/${team.User.username}`}
                                    className="py-3 flex items-center space-x-3 w-fit hover:underline"
                                  >
                                    <Avatar
                                      className="h-12 w-12"
                                      imageSrc={team.User.photoURL}
                                      fallBackText={team.User.name}
                                    />
                                    <div>
                                      <h3 className="text-md font-semibold ">
                                        {team.User.name}
                                      </h3>
                                      <p className="text-sm text-darkbg/50 dark:text-white/50">
                                        @{team.User.username}
                                      </p>
                                    </div>
                                  </Link>

                                  {/* Buttons for small screens */}
                                  {team.User.id === dbUser?.id && (
                                    <div className="flex  md:hidden justify-end gap-x-4">
                                      <div className="flex-1">
                                        <Tooltip
                                          position="top"
                                          displayed={hasWeekendStarted}
                                          text={
                                            "Race weekend has started. Teams cannot be edited."
                                          }
                                        >
                                          <SecondaryButton
                                            disabled={hasWeekendStarted}
                                            className="border-transparent w-full  shadow-md hover:text-cta"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setTeamId(team?.id);
                                              setIsEditTeamModalOpen(true);
                                            }}
                                            text={
                                              <div className="flex justify-center gap-x-2 items-center">
                                                <RiTeamLine className="text-lg" />
                                                <span>Edit</span>
                                              </div>
                                            }
                                          />
                                        </Tooltip>
                                      </div>
                                      <SecondaryButton
                                        text={
                                          <div className="flex justify-center gap-x-2 items-center">
                                            <BsFillTrash3Fill className="text-lg" />
                                            <span>Delete</span>
                                          </div>
                                        }
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTeamId(team?.id);
                                          setIsDeleteTeamModalOpen(true);
                                        }}
                                        disabledText="Please wait..."
                                        className="border-transparent flex-1 text-red-500 hover:bg-red-600 hover:text-white shadow-md"
                                      />
                                    </div>
                                  )}
                                </div>
                              </Card>
                            );
                          }
                        );
                      })}

                    {(teams?.pages?.[0]?.data?.teams.length == 0 ||
                      teams?.pages?.[0]?.data?.teams[0] == null) && (
                      <p className="text-center text-xl font-semibold py-8">
                        No teams present in the league.
                      </p>
                    )}

                    <div ref={ref}></div>

                    {/* Loader */}
                    {loadingTeams &&
                      Array(4)
                        ?.fill(null)
                        ?.map(() => {
                          return (
                            <Card className="relative rounded-md border-2 cursor-pointer transition-all">
                              <div className="p-5 space-y-4">
                                <div className="flex flex-wrap gap-y-4 gap-x-4 justify-between items-center">
                                  <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse font-bold "></h3>
                                </div>

                                <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>

                                <div className="py-3 flex items-center space-x-3 w-fit hover:underline">
                                  <div className="h-12 w-12 bg-gray-500 animate-pulse rounded-full" />
                                  <div>
                                    <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse "></h3>
                                    <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                  </div>
                </>
              ) : (
                <>
                  <div className="py-10 md:px-20 flex gap-x-4 justify-between px-8">
                    {/* Gradient Title */}
                    <h1 className="text-hovercta dark:text-darkmodeCTA text-4xl font-semibold">
                      Your Teams
                    </h1>

                    <Tooltip
                      displayed={
                        hasWeekendStarted ||
                        (canUserJoinLeague?.data?.canUserJoinLeague == false &&
                          league?.data?.data?.User?.id != dbUser?.id) ||
                        userTeams?.data?.teams?.length >= 2
                      }
                      text={
                        hasWeekendStarted
                          ? "Race weekend has started. Teams cannot be added or edited."
                          : canUserJoinLeague?.data?.canUserJoinLeague ==
                              false &&
                            league?.data?.data?.User?.id != dbUser?.id
                          ? "Can join a maximum of 5 leagues."
                          : userTeams?.data?.teams?.length >= 2
                          ? "Maximum of 2 teams can be added per league."
                          : ""
                      }
                    >
                      <SecondaryButton
                        disabled={
                          hasWeekendStarted ||
                          (canUserJoinLeague?.data?.canUserJoinLeague ==
                            false &&
                            league?.data?.data?.User?.id != dbUser?.id) ||
                          userTeams?.data?.teams?.length >= 2
                        }
                        className="border-transparent dark:hover:!text-cta  dark:disabled:hover:!text-gray-400 shadow-md"
                        text={
                          <div className="flex  gap-x-2 items-center">
                            <LuCirclePlus className="text-xl" />
                            <span className="">Add</span>
                          </div>
                        }
                        onClick={() => setIsModalOpen(true)}
                      ></SecondaryButton>
                    </Tooltip>
                  </div>

                  {/* User Teams */}
                  <div className="flex py-10  flex-col gap-5">
                    {userTeams &&
                      userTeams?.data?.teams?.length > 0 &&
                      userTeams?.data?.teams?.map((team: any) => {
                        return (
                          <Card
                            onClick={() => {
                              setTeamId(team?.id);
                              setIsTeamModalOpen(true);
                            }}
                            key={team.id}
                            className="relative rounded-md border-2 cursor-pointer transition-all"
                          >
                            <div className="p-5 space-y-4">
                              <div className="flex flex-wrap gap-y-4 gap-x-4 justify-between items-center">
                                <h3 className="text-xl font-bold  ">
                                  #{team?.position}. {team?.name}
                                </h3>

                                {/* Edit & Delete Buttons */}
                                {team.User.id === dbUser?.id && (
                                  <div className="hidden md:flex flex-wrap flex-1 justify-end gap-x-4">
                                    <div>
                                      <Tooltip
                                        displayed={hasWeekendStarted}
                                        text={
                                          "Race weekend has started. Teams cannot be edited."
                                        }
                                      >
                                        <SecondaryButton
                                          disabled={hasWeekendStarted}
                                          className="border-transparent w-full  shadow-md hover:text-cta"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setTeamId(team?.id);
                                            setIsEditTeamModalOpen(true);
                                          }}
                                          text={
                                            <div className="flex justify-center gap-x-2 items-center">
                                              <RiTeamLine className="text-lg" />
                                              <span>Edit</span>
                                            </div>
                                          }
                                        />
                                      </Tooltip>
                                    </div>
                                    <SecondaryButton
                                      text={
                                        <div className="flex items-center gap-x-2">
                                          <BsFillTrash3Fill className="text-lg" />
                                          <span>Delete</span>
                                        </div>
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTeamId(team?.id);
                                        setIsDeleteTeamModalOpen(true);
                                      }}
                                      disabled={disabled}
                                      disabledText="Please wait..."
                                      className="border-transparent text-red-500 hover:bg-red-600 hover:text-white shadow-md"
                                    />
                                  </div>
                                )}
                              </div>

                              <p className="text-md font-medium">
                                Points: {team?.score}
                              </p>

                              <Link
                                to={`/user/${team.User.username}`}
                                className="py-3 flex items-center space-x-3 w-fit hover:underline"
                              >
                                <Avatar
                                  className="h-12 w-12"
                                  imageSrc={team.User.photoURL}
                                  fallBackText={team.User.name}
                                />
                                <div>
                                  <h3 className="text-md font-semibold ">
                                    {team.User.name}
                                  </h3>
                                  <p className="text-sm text-darkbg/50 dark:text-white/50">
                                    @{team.User.username}
                                  </p>
                                </div>
                              </Link>

                              {/* Buttons for small screens */}
                              {team.User.id === dbUser?.id && (
                                <div className="flex md:hidden justify-end gap-x-4">
                                  <div className="flex-1">
                                    <Tooltip
                                      position="top"
                                      displayed={hasWeekendStarted}
                                      text={
                                        "Race weekend has started. Teams cannot be edited."
                                      }
                                    >
                                      <SecondaryButton
                                        disabled={hasWeekendStarted}
                                        className="border-transparent w-full  shadow-md hover:text-cta"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTeamId(team?.id);
                                          setIsEditTeamModalOpen(true);
                                        }}
                                        text={
                                          <div className="flex justify-center gap-x-2 items-center">
                                            <RiTeamLine className="text-lg" />
                                            <span>Edit</span>
                                          </div>
                                        }
                                      />
                                    </Tooltip>
                                  </div>
                                  <SecondaryButton
                                    text={
                                      <div className="flex justify-center gap-x-2 items-center">
                                        <BsFillTrash3Fill className="text-lg" />
                                        <span>Delete</span>
                                      </div>
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTeamId(team?.id);
                                      setIsDeleteTeamModalOpen(true);
                                    }}
                                    disabledText="Please wait..."
                                    className="border-transparent flex-1 text-red-500 hover:bg-red-600 hover:text-white shadow-md"
                                  />
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}

                    {userTeams && userTeams?.data?.teams?.length <= 0 && (
                      <p className="text-center text-xl py-8 font-semibold">
                        You have not created any teams in this league.
                      </p>
                    )}

                    <div ref={ref}></div>

                    {loadingUserTeams &&
                      Array(2)
                        ?.fill(null)
                        ?.map(() => {
                          return (
                            <Card className="relative rounded-md border-2 cursor-pointer transition-all">
                              <div className="p-5 space-y-4">
                                <div className="flex flex-wrap gap-y-4 gap-x-4 justify-between items-center">
                                  <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse font-bold "></h3>
                                </div>

                                <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>

                                <div className="py-3 flex items-center space-x-3 w-fit hover:underline">
                                  <div className="h-12 w-12 bg-gray-500 animate-pulse rounded-full" />
                                  <div>
                                    <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse "></h3>
                                    <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {isLoading && (
        <div className="p-6 space-y-6">
          {/* League Info */}
          <Card className="py-5 px-6">
            <div className="flex flex-wrap gap-8 justify-center md:justify-between items-center">
              {/* Title */}
              <h2 className="h-7 w-60 animate-pulse rounded bg-gray-500"></h2>

              {/* Buttons */}
              <div className="hidden md:flex flex-wrap flex-1 gap-y-5 justify-around md:justify-end items-center gap-x-4">
                <SecondaryButton
                  disabled={true}
                  className="border-transparent dark:hover:!text-cta shadow-md"
                  text={
                    <div className="flex gap-x-2 items-center">
                      <IoMdShare className="text-xl" />
                      <span className="">Share</span>
                    </div>
                  }
                ></SecondaryButton>

                <Tooltip displayed={true} text={"League has not loaded."}>
                  <SecondaryButton
                    disabled={true}
                    className="border-transparent dark:hover:!text-cta  dark:disabled:hover:!text-gray-400 shadow-md"
                    text={
                      <div className="flex  gap-x-2 items-center">
                        <LuCirclePlus className="text-xl" />
                        <span className="">Add</span>
                      </div>
                    }
                  ></SecondaryButton>
                </Tooltip>
              </div>
            </div>

            {/* League Info */}
            <div className="py-8 text-md font-medium flex flex-col items-center md:items-start gap-y-2">
              <p className="h-4 w-40 animate-pulse rounded bg-gray-500"></p>
              <p className="h-4 w-40 animate-pulse rounded bg-gray-500"></p>
              <p className="h-4 w-40 animate-pulse rounded bg-gray-500"></p>
            </div>

            {/* Smaller screen buttons */}
            <div className="flex md:hidden flex-wrap flex-1 gap-y-5 justify-around md:justify-end items-center gap-x-4">
              <SecondaryButton
                disabled={true}
                className="border-transparent dark:hover:!text-cta shadow-md"
                text={
                  <div className="flex gap-x-2 items-center">
                    <IoMdShare className="text-xl" />
                    <span className="">Share</span>
                  </div>
                }
              ></SecondaryButton>

              <Tooltip
                position="top"
                displayed={true}
                text={"League has not loaded."}
              >
                <SecondaryButton
                  disabled={true}
                  className="border-transparent dark:hover:!text-cta  dark:disabled:hover:!text-gray-400 shadow-md"
                  text={
                    <div className="flex  gap-x-2 items-center">
                      <LuCirclePlus className="text-xl" />
                      <span className="">Add</span>
                    </div>
                  }
                ></SecondaryButton>
              </Tooltip>
            </div>
          </Card>

          {/* User Info */}
          <Card>
            <div className="p-4 flex items-center space-x-4 w-fit">
              <div className="h-12 w-12 rounded-full animate-pulse bg-gray-500"></div>
              <div className="flex flex-col gap-y-2">
                <h3 className="h-4 w-40 animate-pulse rounded bg-gray-500"></h3>
                <p className="h-4 w-40 animate-pulse rounded bg-gray-500"></p>
              </div>
            </div>
          </Card>

          {/* Tab Buttons */}
          <div className="flex pt-8">
            {/* Teams Tab Button */}
            <div
              className={`flex-1 text-center py-3  transition-all duration-300 border-b-4`}
            >
              All Teams
            </div>
            {/* Leagues Tab Button */}
            <div
              className={`flex-1 text-center py-3  transition-all duration-300 border-b-4 `}
            >
              Your Teams
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {tabValue == "allTeams" ? (
              <>
                {/* All Teams */}
                <div className="flex py-10 flex-col gap-5">
                  {Array(4)
                    ?.fill(null)
                    ?.map(() => {
                      return (
                        <Card className="relative rounded-md border-2 cursor-pointer transition-all">
                          <div className="p-5 space-y-4">
                            <div className="flex flex-wrap gap-y-4 gap-x-4 justify-between items-center">
                              <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse font-bold "></h3>
                            </div>

                            <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>

                            <div className="py-3 flex items-center space-x-3 w-fit hover:underline">
                              <div className="h-12 w-12 bg-gray-500 animate-pulse rounded-full" />
                              <div className="flex flex-col gap-y-2">
                                <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse "></h3>
                                <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </>
            ) : (
              <>
                <div className="py-10 md:px-20 flex gap-x-4 justify-between px-8">
                  {/* Gradient Title */}
                  <h1 className="text-hovercta dark:text-darkmodeCTA text-4xl font-semibold">
                    Your Teams
                  </h1>

                  <Tooltip displayed={true} text={"League has not loaded"}>
                    <SecondaryButton
                      disabled={true}
                      className="border-transparent dark:hover:!text-cta  dark:disabled:hover:!text-gray-400 shadow-md"
                      text={
                        <div className="flex  gap-x-2 items-center">
                          <LuCirclePlus className="text-xl" />
                          <span className="">Add</span>
                        </div>
                      }
                    ></SecondaryButton>
                  </Tooltip>
                </div>

                {/* User Teams */}
                <div className="flex py-10  flex-col gap-5">
                  {Array(2)
                    ?.fill(null)
                    ?.map(() => {
                      return (
                        <Card className="relative rounded-md border-2 cursor-pointer transition-all">
                          <div className="p-5 space-y-4">
                            <div className="flex flex-wrap gap-y-4 gap-x-4 justify-between items-center">
                              <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse font-bold "></h3>
                            </div>

                            <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>

                            <div className="py-3 flex items-center space-x-3 w-fit hover:underline">
                              <div className="h-12 w-12 bg-gray-500 animate-pulse rounded-full" />
                              <div className="flex flex-col gap-y-2">
                                <h3 className="h-4 w-40 rounded bg-gray-500 animate-pulse "></h3>
                                <p className="h-4 w-40 rounded bg-gray-500 animate-pulse"></p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="min-h-72 flex justify-center items-center">
          <p className="text-center text-xl font-semibold px-5">
            League does not exist.
          </p>
        </div>
      )}
    </div>
  );
};

export default League;
