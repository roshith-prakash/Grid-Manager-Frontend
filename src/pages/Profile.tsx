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
import TeamCard from "@/components/reuseit/TeamCard";
import LeagueCard from "@/components/reuseit/LeagueCard";
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
      <div className="lg:min-h-screen bg-slate-50 dark:bg-[#0a0a0a] dark:text-darkmodetext w-full pb-20 font-sans">
        
        {/* Premium Hero Section */}
        <div className="relative w-full overflow-hidden bg-white dark:bg-[#151515] border-b border-slate-200 dark:border-white/5 pb-16 pt-24 lg:pt-32">
          
          {/* Abstract Background Gradients */}
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[100%] rounded-full bg-gradient-to-br from-cta/10 to-transparent dark:from-darkmodeCTA/10 blur-3xl opacity-70"></div>
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[80%] rounded-full bg-gradient-to-bl from-blue-500/5 to-transparent dark:from-blue-500/10 blur-3xl opacity-70"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            
            {/* Avatar Container with Glow */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cta to-blue-500 dark:from-darkmodeCTA opacity-30 group-hover:opacity-70 blur transition-opacity duration-500"></div>
              <div className="relative bg-white dark:bg-[#151515] p-1.5 rounded-full">
                <Avatar
                  className="h-32 w-32 md:h-40 md:w-40 !text-5xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
                  imageSrc={dbUser?.photoURL}
                  fallBackText={dbUser?.name}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left flex flex-col justify-center min-h-[160px]">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between w-full">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {dbUser?.name}
                  </h1>
                  <p className="mt-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cta to-blue-600 dark:from-darkmodeCTA dark:to-blue-400 inline-block">
                    @{dbUser?.username}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-center gap-3 mt-4 md:mt-0">
                  <SecondaryButton
                    text={
                      <div className="flex items-center gap-2 font-semibold">
                        <BsPen className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </div>
                    }
                    className="!py-2.5 !px-5 shadow-sm hover:shadow-md transition-all border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm"
                    onClick={() => navigate("/edit-profile")}
                  />
                  <button
                    onClick={() => setIsDeleteProfileModalOpen(true)}
                    className="p-3 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors shadow-sm"
                    title="Delete Account"
                  >
                    <BsFillTrash3Fill className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {dbUser?.bio && (
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto md:mx-0">
                  {dbUser?.bio}
                </p>
              )}

              <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 w-fit px-4 py-2 rounded-2xl mx-auto md:mx-0">
                <TfiWrite className="w-4 h-4" />
                <span>
                  Joined {dayjs(new Date(dbUser?.createdAt)).format("MMM DD, YYYY")}
                </span>
              </div>
            </div>
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
              <div className="grid lg:px-20 md:grid-cols-2 lg:grid-cols-4 px-4 gap-6 mb-10">
                {teams &&
                  teams?.pages?.map((page) => {
                    return page?.data.teams?.map((team: any) => {
                      return (
                        <TeamCard
                          key={team?.id}
                          team={team}
                          isOwner={true}
                          hasWeekendStarted={hasWeekendStarted}
                          onEdit={() => {
                            setTeamId(team?.id);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => {
                            setTeamId(team?.id);
                            setIsDeleteTeamModalOpen(true);
                          }}
                          onClick={() => {
                            setTeamId(team?.id);
                            setIsTeamModalOpen(true);
                          }}
                          isChartExpanded={expandedChartTeamId === team?.id}
                          onToggleChart={(id) => setExpandedChartTeamId(expandedChartTeamId === id ? null : id)}
                        />
                      );
                    });
                  })}
                <div ref={ref}></div>
              </div>

              

                {loadingTeams &&
                  Array(4)
                    ?.fill(null)
                    ?.map((_, i) => {
                      return (
                        <div
                          key={i}
                          className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 animate-pulse"
                        >
                          {/* Team Header Skeleton */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-white/10 rounded-2xl"></div>
                            <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                          </div>

                          {/* Points Display Skeleton */}
                          <div className="mb-4">
                            <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-3">
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
              <div className="grid lg:px-20 md:grid-cols-2 lg:grid-cols-4 px-4 gap-6 mb-10">
                {leagues &&
                  leagues?.pages?.map((page) => {
                    return page?.data.leagues?.map((league: any) => {
                      return <LeagueCard key={league.leagueId} league={league} />;
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
                        <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 p-6 animate-pulse">
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
