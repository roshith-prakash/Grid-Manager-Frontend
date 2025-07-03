/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditTeamModal,
  PrimaryButton,
  SecondaryButton,
  TeamModal,
} from "../components";
import { useDBUser } from "../context/UserContext";
import { BsFillTrash3Fill, BsPen } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TfiWrite } from "react-icons/tfi";
import { axiosInstance } from "../utils/axiosInstance";
import { auth } from "../firebase/firebase";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import AlertModal from "@/components/reuseit/AlertModal";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useHasWeekendStarted } from "@/functions/hasWeekendStarted";
import Tooltip from "@/components/reuseit/Tooltip";
import { LuCirclePlus } from "react-icons/lu";
import { Calendar, Edit3, Hash, Trash2, Trophy, Users } from "lucide-react";
import Avatar from "@/components/reuseit/Avatar";

const Profile = () => {
  const navigate = useNavigate();
  const { dbUser, setDbUser } = useDBUser();
  const [disabled, setDisabled] = useState(false);
  const [tabValue, setTabValue] = useState("teams");
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] =
    useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);
  const [teamId, setTeamId] = useState("");

  const hasWeekendStarted = useHasWeekendStarted();

  // Intersection observer to fetch new teams / leagues
  const { ref, inView } = useInView();

  // Fetch league data from server.
  const { data: canUserCreateLeague } = useQuery({
    queryKey: ["numberOfLeagues", dbUser?.id],
    queryFn: async () => {
      return axiosInstance.post("/team/check-if-user-can-join-league", {
        userId: dbUser?.id,
      });
    },
  });

  // Fetching user's leagues
  const {
    data: leagues,
    isLoading: loadingLeagues,
    // error: leaguesError,
    fetchNextPage: fetchNextLeagues,
    // refetch: refetchLeagues,
  } = useInfiniteQuery({
    queryKey: ["userLeagues", dbUser?.username],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-user-leagues", {
        userId: dbUser?.id,
        username: dbUser?.username,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: !!dbUser?.username,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Fetching user's teams
  const {
    data: teams,
    isLoading: loadingTeams,
    // error: teamsError,
    fetchNextPage: fetchNextTeams,
    refetch: refetchTeams,
  } = useInfiniteQuery({
    queryKey: ["userTeams", dbUser?.username],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-user-teams", {
        userId: dbUser?.id,
        username: dbUser?.username,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: !!dbUser?.username,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Set window title.
  useEffect(() => {
    document.title = `${dbUser?.name} | Grid Manager`;
  }, [dbUser]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Delete the user
  const deleteUser = () => {
    setDisabled(true);
    const user = auth.currentUser;

    user
      ?.delete()
      ?.then(() => {
        axiosInstance
          .post("/user/delete-user", { userId: dbUser?.id })
          .then(() => {
            toast.success("User Deleted.");
            setDbUser(null);
            setDisabled(false);
            setIsDeleteProfileModalOpen(false);
            navigate("/");
          })
          .catch((err) => {
            setDisabled(false);
            setIsDeleteProfileModalOpen(false);
            console.log(err);
            toast.error("Something went wrong.");
          });
      })
      .catch((error) => {
        setDisabled(false);
        console.log(error);
        setIsDeleteProfileModalOpen(false);
        const errorMessage = error?.message;
        if (String(errorMessage).includes("auth/requires-recent-login")) {
          toast.error("Please login again before deleting your account.");
        } else {
          toast.error("Something went wrong.");
        }
      });
  };

  // Delete a selected team
  const deleteTeam = () => {
    setDisabled(true);
    axiosInstance
      .post("/team/delete-team", { teamId: teamId, userId: dbUser?.id })
      .then(() => {
        toast.success("Team Deleted.");
        refetchTeams();
        setDisabled(false);
        setIsDeleteTeamModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setDisabled(false);
        setIsDeleteTeamModalOpen(false);
        toast.error("Something went wrong.");
      });
  };

  // Fetch next page when end div reached.
  useEffect(() => {
    if (tabValue == "teams") {
      if (inView) {
        fetchNextTeams();
      }
    }

    if (tabValue == "leagues") {
      if (inView) {
        fetchNextLeagues();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, fetchNextTeams, fetchNextLeagues]);

  return (
    <>
      {/* Delete Account Modal */}
      <AlertModal
        isOpen={isDeleteProfileModalOpen}
        className="max-w-xl"
        onClose={() => setIsDeleteProfileModalOpen(false)}
      >
        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <h1 className="dark:text-darkmodetext font-bold text-2xl">
            Are you sure you want to delete your account?
          </h1>

          {/* Subtitle */}
          <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70">
            This action cannot be reversed. Deleting your account will remove
            all your teams and leagues.
          </h2>

          {/* Buttons */}
          <div className="mt-5 flex gap-x-5 justify-end">
            <PrimaryButton
              className="text-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
              onClick={deleteUser}
              disabled={disabled}
              disabledText="Please Wait..."
              text="Delete"
            />
            <SecondaryButton
              className="text-sm"
              disabled={disabled}
              disabledText="Please Wait..."
              onClick={() => setIsDeleteProfileModalOpen(false)}
              text="Cancel"
            />
          </div>
        </div>
      </AlertModal>

      {/* View Team in Modal */}
      <TeamModal
        teamId={teamId}
        isModalOpen={isTeamModalOpen}
        closeModal={() => setIsTeamModalOpen(false)}
      />

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
          refetchFunction={() => {
            refetchTeams();
          }}
          teamId={teamId}
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

      {/* Main */}
      <div className="lg:min-h-screen bg-bgwhite dark:bg-darkbg dark:text-darkmodetext w-full pb-20">
        {/* Background color div */}
        <div className="bg-secondarydarkbg dark:bg-darkgrey border-b-4 border-black h-48 dark:border-white/10"></div>

        {/* Profile Info Div */}
        <div className="bg-white dark:bg-secondarydarkbg dark:border-white/25 shadow-xl -translate-y-14 border-2 min-h-52 pt-20 pb-10 rounded-lg mx-5 md:mx-10 lg:mx-20">
          {/* Floating Image */}
          <div className="absolute w-full -top-16 flex justify-center">
            <div>
              <Avatar
                className="h-34 w-34 !text-5xl border-secondarydarkbg border-10"
                imageSrc={dbUser?.photoURL}
                fallBackText={dbUser?.name}
              />
            </div>
          </div>

          {/* Edit & delete icon on small screen */}
          <div className="lg:hidden absolute flex gap-x-4 right-6 top-5">
            <BsPen
              className="text-xl hover:text-cta dark:hover:text-darkmodeCTA transition-all cursor-pointer"
              onClick={() => navigate("/edit-profile")}
            />
            <button
              onClick={() => setIsDeleteProfileModalOpen(true)}
              className="text-xl  cursor-pointer"
            >
              <BsFillTrash3Fill className=" cursor-pointer text-red-500" />
            </button>
          </div>

          {/* Edit & delete button on large screen */}
          <div className="hidden absolute lg:flex gap-x-4 right-6 top-5">
            <SecondaryButton
              text={
                <div className="flex items-center gap-x-2">
                  <BsPen />
                  <p>Edit</p>
                </div>
              }
              className="border-transparent dark:hover:!text-cta shadow-md"
              onClick={() => navigate("/edit-profile")}
            />
            <SecondaryButton
              text={
                <div className="flex justify-center items-center  gap-x-2">
                  <BsFillTrash3Fill className=" cursor-pointer " />
                  Delete
                </div>
              }
              onClick={() => setIsDeleteProfileModalOpen(true)}
              className="border-transparent dark:!border-2 shadow-md hover:bg-red-600 text-red-600 dark:text-white hover:!text-white dark:hover:!text-red-600"
            />
          </div>

          {/* Name, Username and Bio + Stat Count */}
          <div className="px-2 pt-3">
            {/* Name of the user */}
            <p className="text-center text-3xl font-bold">{dbUser?.name}</p>
            {/* Username of the user */}
            <p className="mt-2 text-center text-xl font-medium">
              @{dbUser?.username}
            </p>
            {/* User's bio */}
            {dbUser?.bio && (
              <p className="px-4 my-10 text-md text-center">{dbUser?.bio}</p>
            )}
          </div>

          {/* Separator */}
          <hr className="my-5 mx-2 dark:border-white/25" />

          {/* Day of joining */}
          <div className="mt-5 text-greyText flex justify-center items-center gap-x-2">
            <TfiWrite /> Became a Grid Manager on{" "}
            {dayjs(new Date(dbUser?.createdAt)).format("MMM DD, YYYY")}.
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex">
          {/* Teams Tab Button */}
          <button
            onClick={() => setTabValue("teams")}
            className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4 ${
              tabValue == "teams" &&
              "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
            }`}
          >
            Teams
          </button>
          {/* Leagues Tab Button */}
          <button
            onClick={() => setTabValue("leagues")}
            className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4  ${
              tabValue == "leagues" &&
              "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
            }`}
          >
            Leagues
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {tabValue == "teams" ? (
            // Teams
            <>
              <div className="py-14 md:px-20 flex gap-x-4 justify-between px-8">
                {/* Gradient Title */}
                <h1 className="text-hovercta dark:text-darkmodeCTA text-4xl font-semibold">
                  Your Teams
                </h1>
                <Tooltip
                  displayed={
                    canUserCreateLeague?.data?.canUserJoinLeague == false
                  }
                  text={"Can create or join a maximum of 5 leagues."}
                >
                  <SecondaryButton
                    disabled={
                      canUserCreateLeague?.data?.canUserJoinLeague == false
                    }
                    className="border-transparent dark:hover:!text-cta dark:disabled:hover:!text-gray-400 shadow-md"
                    text={
                      <div className="flex gap-x-2 items-center">
                        <LuCirclePlus className="text-xl" />
                        <span className="">Join a League</span>
                      </div>
                    }
                    onClick={() => navigate("/leagues")}
                  ></SecondaryButton>
                </Tooltip>
              </div>
              <div className="grid lg:px-20 md:grid-cols-2 lg:grid-cols-4 px-2 gap-x-6 gap-y-10">
                {teams &&
                  teams?.pages?.map((page) => {
                    return page?.data.teams?.map((team: any) => {
                      console.log(team?.User);
                      return (
                        <div className="max-w-sm min-w-xs mx-auto">
                          <div
                            className="group bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 transition-all hover:shadow-lg hover:border-black/25 shadow dark:hover:border-white/25 cursor-pointer relative overflow-hidden"
                            onClick={() => {
                              setTeamId(team?.id);
                              setIsTeamModalOpen(true);
                            }}
                          >
                            {/* Action Buttons - Desktop (hover) */}

                            <div className="absolute z-5 top-4 right-4 hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                disabled={hasWeekendStarted}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTeamId(team?.id);
                                  setIsEditModalOpen(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-lg hover:shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 cursor-pointer"
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
                                <h3 className="text-xl line-clamp-1 font-bold text-slate-900 dark:text-white group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
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

                            {/* League Information */}
                            <div className="relative z-10 space-y-3 mb-4">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  League:
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {team?.League?.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  ID:
                                </span>
                                <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                                  {team?.League?.leagueId}
                                </span>
                              </div>
                            </div>

                            {/* Last Updated */}
                            <div className="relative z-10 pt-3 border-t border-slate-200 dark:border-slate-600">
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  Updated{" "}
                                  {dayjs(new Date(team?.updatedAt)).format(
                                    "MMM DD, YYYY"
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons - Mobile (always visible) */}
                            <div className="flex lg:hidden gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/15">
                              <button
                                disabled={hasWeekendStarted}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTeamId(team?.id);
                                  setIsEditModalOpen(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Edit
                                </span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTeamId(team?.id);
                                  setIsDeleteTeamModalOpen(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Delete
                                </span>
                              </button>
                            </div>

                            {/* Hover Indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cta to-hovercta transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                          </div>
                        </div>
                      );
                    });
                  })}

                {loadingTeams &&
                  Array(4)
                    ?.fill(null)
                    ?.map((_, i) => {
                      return (
                        <div
                          key={i}
                          className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 animate-pulse"
                        >
                          {/* Team Header Skeleton */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-white/10 rounded-lg"></div>
                            <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                          </div>

                          {/* Points Display Skeleton */}
                          <div className="mb-4">
                            <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20"></div>
                                <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-16"></div>
                              </div>
                            </div>
                          </div>

                          {/* Team Owner Skeleton */}
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                              <div>
                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24 mb-1"></div>
                                <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-20"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                <div ref={ref}></div>
              </div>

              {/* If no teams are found */}
              {teams && teams?.pages?.[0]?.data?.teams.length == 0 && (
                <div className="flex flex-col justify-center pt-10">
                  <p className="text-center text-xl py-8 font-semibold">
                    You have not created any teams.
                  </p>
                </div>
              )}
            </>
          ) : (
            // Leagues
            <>
              <div className="py-14 md:px-20 flex justify-between px-8">
                {/* Gradient Title */}
                <h1 className="text-hovercta dark:text-darkmodeCTA text-4xl font-semibold">
                  Your Leagues
                </h1>
                <Tooltip
                  displayed={
                    canUserCreateLeague?.data?.canUserJoinLeague == false
                  }
                  text={"Can create or join a maximum of 5 leagues."}
                >
                  <SecondaryButton
                    disabled={
                      canUserCreateLeague?.data?.canUserJoinLeague == false
                    }
                    className="border-transparent dark:hover:!text-cta dark:disabled:hover:!text-gray-400 shadow-md"
                    text={
                      <div className="flex gap-x-2 items-center">
                        <LuCirclePlus className="text-xl" />
                        <span className="">Create League</span>
                      </div>
                    }
                    onClick={() => navigate("/create-league")}
                  ></SecondaryButton>
                </Tooltip>
              </div>
              <div className="grid lg:px-20 md:grid-cols-2 lg:grid-cols-4 px-2 gap-x-6 gap-y-10">
                {leagues &&
                  leagues?.pages?.map((page) => {
                    return page?.data.leagues?.map((league: any) => {
                      return (
                        <>
                          <Link
                            key={league.leagueId}
                            to={`/leagues/${league.leagueId}`}
                            className="group bg-grey/5 dark:bg-white/5 shadow rounded-xl border border-slate-200 dark:border-white/10 p-6 hover:shadow-lg hover:border-black/25 dark:hover:border-white/25 transition-all"
                          >
                            <div className="space-y-4">
                              {/* League Info */}
                              <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors mb-3">
                                  {league.name}
                                </h3>

                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <span className="font-medium">ID:</span>
                                    <span className="font-mono">
                                      {league.leagueId}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Users className="w-4 h-4" />
                                    <span>{league.numberOfTeams} teams</span>
                                  </div>
                                </div>
                              </div>

                              {/* League Creator */}
                              <div className="pt-4 border-t border-slate-200 dark:border-white/15">
                                <Link
                                  to={`/user/${league.User?.username}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors"
                                >
                                  <div>
                                    <Avatar
                                      imageSrc={league?.User?.photoURL}
                                      fallBackText={league?.User?.name}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white truncate">
                                      {league.User?.name}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                      @{league.User?.username}
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </Link>
                        </>
                      );
                    });
                  })}
                <div ref={ref}></div>
              </div>

              {loadingLeagues && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 py-10 px-2 gap-x-2 gap-y-10">
                  {Array(4)
                    ?.fill(null)
                    ?.map(() => {
                      return (
                        <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 p-6 animate-pulse">
                          <div className="space-y-4">
                            <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
                              <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-2/3"></div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                              <div className="h-10 w-10 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                              <div className="space-y-1">
                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div>
                                <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-20"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* If no leagues are found */}
              {leagues && leagues?.pages?.[0]?.data?.leagues.length == 0 && (
                <div className="flex flex-col justify-center pt-10">
                  <p className="text-center text-xl py-8 font-semibold">
                    You have not created or joined any leagues.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
