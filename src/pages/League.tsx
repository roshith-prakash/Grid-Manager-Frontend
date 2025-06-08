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
import { LuCirclePlus } from "react-icons/lu";
import Card from "@/components/reuseit/Card";
import { useDBUser } from "@/context/UserContext";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import { IoMdShare } from "react-icons/io";
import { useHasWeekendStarted } from "@/functions/hasWeekendStarted";
import Tooltip from "@/components/reuseit/Tooltip";
import { Edit3, Plus, Share2, Trash2, Trophy, User } from "lucide-react";

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
            {/* League Header */}
            <div className="dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-8 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  {/* League name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cta/20 dark:bg-cta/30 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-cta dark:text-darkmodeCTA" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {league?.data?.data?.name}
                    </h1>
                  </div>

                  {/* Details */}
                  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        ID:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {league?.data?.data?.leagueId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        Privacy:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {league?.data?.data?.private ? "Private" : "Public"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        Teams:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {league?.data?.data?.numberOfTeams}
                      </span>
                    </div>
                  </div>

                  {/* League Owner */}
                  <Link
                    to={`/user/${league?.data?.data.User.username}`}
                    className="flex items-center gap-3 w-fit hover:bg-slate-100 dark:hover:bg-white/15 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      {league?.data?.data?.User?.photoURL ? (
                        <img
                          src={league?.data?.data?.User?.photoURL}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {league?.data?.data.User.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        @{league?.data?.data.User.username}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      navigator?.clipboard?.writeText(window.location.href);
                      toast.success("League link copied!");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 cursor-pointer text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>

                  {league?.data?.data?.User.id === dbUser?.id && (
                    <button
                      onClick={() => setIsEditLeagueModalOpen(true)}
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
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
                    <button
                      onClick={() => setIsModalOpen(true)}
                      disabled={
                        hasWeekendStarted ||
                        (canUserJoinLeague?.data?.canUserJoinLeague == false &&
                          league?.data?.data?.User?.id != dbUser?.id) ||
                        userTeams?.data?.teams?.length >= 2
                      }
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-cta hover:bg-hovercta disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-500 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Team
                    </button>
                  </Tooltip>

                  {league?.data?.data?.User.id === dbUser?.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteLeagueModalOpen(true);
                      }}
                      disabled={disabled}
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-700/30 hover:bg-red-200 dark:hover:bg-red-500/50 text-red-600 dark:text-red-300 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {disabled ? "Please wait..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            </div>

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
                  <div className="grid pt-10 lg:px-20 md:grid-cols-2 lg:grid-cols-4 px-2 gap-x-14 gap-y-10">
                    {teams &&
                      teams?.pages?.map((page, pageIndex) => {
                        return page?.data.teams?.map(
                          (team: any, index: number) => {
                            return (
                              <div className="max-w-sm min-w-xs mx-auto">
                                <div
                                  className="group bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 transition-all hover:shadow-lg hover:border-black/25 shadow dark:hover:border-white/25 cursor-pointer relative overflow-hidden"
                                  onClick={() => {
                                    setTeamId(team?.id);
                                    setIsTeamModalOpen(true);
                                  }}
                                >
                                  {/* Team Header */}
                                  <div className="relative mb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-10 h-10 bg-cta/20 dark:bg-cta/30 rounded-lg flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-cta dark:text-darkmodeCTA" />
                                      </div>
                                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                                        #{pageIndex * 4 + index + 1}.{" "}
                                        {team?.name}
                                      </h3>
                                    </div>
                                  </div>

                                  {/* Points Display */}
                                  <div className="relative z-10 mb-4">
                                    <div className="bg-slate-50 dark:bg-white/10 rounded-lg p-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                          Total Points
                                        </span>
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                          {team?.score}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Team Owner */}
                                  <div className="pt-4 border-t border-slate-200 dark:border-white/15">
                                    <Link
                                      to={`/user/${team.User?.username}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors"
                                    >
                                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        {team.User?.photoURL ? (
                                          <img
                                            src={
                                              team.User.photoURL ||
                                              "/placeholder.svg"
                                            }
                                            alt={team.User.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                          />
                                        ) : (
                                          <User className="w-5 h-5 text-slate-500" />
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-slate-900 dark:text-white truncate">
                                          {team.User?.name}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                          @{team.User?.username}
                                        </p>
                                      </div>
                                    </Link>
                                  </div>

                                  {/* Hover Indicator */}
                                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cta to-hovercta transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                </div>
                              </div>
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
                  <div className="grid pb-10 lg:px-20 md:grid-cols-2 lg:grid-cols-4 px-2 gap-x-14 gap-y-10">
                    {userTeams &&
                      userTeams?.data?.teams?.length > 0 &&
                      userTeams?.data?.teams?.map((team: any) => {
                        return (
                          <div className="max-w-sm min-w-xs mx-auto">
                            <div
                              className="group bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 transition-all hover:shadow-lg hover:border-black/25 shadow dark:hover:border-white/25 cursor-pointer relative overflow-hidden"
                              onClick={() => {
                                setTeamId(team?.id);
                                setIsTeamModalOpen(true);
                              }}
                            >
                              {/* Action Buttons */}
                              <div className="absolute z-5 top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  disabled={hasWeekendStarted}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTeamId(team?.id);
                                    setIsEditTeamModalOpen(true);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-md hover:shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 cursor-pointer"
                                  title={
                                    hasWeekendStarted
                                      ? "Race weekend has started. Teams cannot be edited."
                                      : "Edit team"
                                  }
                                >
                                  <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTeamId(team?.id);
                                    setIsDeleteTeamModalOpen(true);
                                  }}
                                  className="w-8 h-8 cursor-pointer rounded-lg bg-white dark:bg-slate-700 shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:bg-red-50 dark:hover:bg-red-900/30"
                                  title="Delete team"
                                >
                                  <Trash2 className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400" />
                                </button>
                              </div>

                              {/* Team Header */}
                              <div className="relative mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-cta/20 dark:bg-cta/30 rounded-lg flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-cta dark:text-darkmodeCTA" />
                                  </div>
                                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
                                    #{team?.position}. {team?.name}
                                  </h3>
                                </div>
                              </div>

                              {/* Points Display */}
                              <div className="relative z-10 mb-4">
                                <div className="bg-slate-50 dark:bg-white/10 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                      Total Points
                                    </span>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                      {team?.score}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Team Owner */}
                              <div className="pt-4 border-t border-slate-200 dark:border-white/15">
                                <Link
                                  to={`/user/${team.User?.username}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors"
                                >
                                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    {team.User?.photoURL ? (
                                      <img
                                        src={
                                          team.User.photoURL ||
                                          "/placeholder.svg"
                                        }
                                        alt={team.User.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 text-slate-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white truncate">
                                      {team.User?.name}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                      @{team.User?.username}
                                    </p>
                                  </div>
                                </Link>
                              </div>

                              {/* Hover Indicator */}
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cta to-hovercta transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </div>
                          </div>
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
