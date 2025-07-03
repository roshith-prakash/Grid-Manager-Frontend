/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate, useParams } from "react-router-dom";
import { SecondaryButton, TeamModal } from "../components";
import { useDBUser } from "../context/UserContext";
import dayjs from "dayjs";
import { TfiWrite } from "react-icons/tfi";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import Profile from "./Profile";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Card from "@/components/reuseit/Card";
import { Calendar, Hash, Trophy, Users } from "lucide-react";
import Avatar from "@/components/reuseit/Avatar";

const User = () => {
  const { username } = useParams();
  const { dbUser } = useDBUser();
  const navigate = useNavigate();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [tabValue, setTabValue] = useState("teams");

  // Intersection observer to fetch new teams/leagues
  const { ref, inView } = useInView();

  // Fetch user data from server.
  const {
    data: user,
    isLoading: loadingUser,
    // error: userError,
  } = useQuery({
    queryKey: ["userProfile", username, dbUser?.id],
    queryFn: async () => {
      return axiosInstance.post("/user/get-user-info", {
        userId: dbUser?.id,
        username: username,
      });
    },
  });

  // Fetching user's leagues
  const {
    data: leagues,
    isLoading: loadingLeagues,
    // error: ,
    fetchNextPage: fetchNextLeagues,
  } = useInfiniteQuery({
    queryKey: ["userLeagues", user?.data?.user?.username],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-user-public-leagues", {
        userId: dbUser?.id,
        username: user?.data?.user?.username,
        page: pageParam,
        currentUserId: dbUser?.id,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: !!user?.data?.user?.username,
  });

  // Fetching user's teams
  const {
    data: teams,
    isLoading: loadingTeams,
    // error: teamsError,
    fetchNextPage: fetchNextTeams,
  } = useInfiniteQuery({
    queryKey: ["userTeams", user?.data?.user?.username, dbUser?.id],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-user-public-teams", {
        userId: dbUser?.id,
        username: user?.data?.user?.username,
        page: pageParam,
        currentUserId: dbUser?.id,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: !!user?.data?.user?.username,
  });

  // Set window title.
  useEffect(() => {
    if (user) {
      document.title = `${user?.data?.user?.name} | Grid Manager`;
    } else {
      document.title = `${username} | Grid Manager`;
    }
  }, [user, username]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  // If the profile is the current user's profile, show the profile component.
  if (username == dbUser?.username) {
    return <Profile />;
  }

  return (
    <>
      <TeamModal
        teamId={teamId}
        isModalOpen={isTeamModalOpen}
        closeModal={() => setIsTeamModalOpen(false)}
      />

      {/* If data is being fetched*/}
      {loadingUser && (
        <div className="lg:min-h-screen bg-bgwhite dark:bg-darkbg dark:text-darkmodetext w-full pb-20">
          {/* Background color div */}
          <div className="bg-secondarydarkbg  border-b-4 border-black h-48"></div>

          {/* Profile Info Div */}
          <div className="bg-white dark:bg-secondarydarkbg dark:border-white/25 shadow-xl -translate-y-14 border-2 min-h-52 pt-20 pb-10 rounded-lg mx-5 md:mx-10 lg:mx-20">
            {/* Floating Image */}
            <div className="absolute w-full -top-16 flex justify-center">
              <div
                className={`bg-gray-500  rounded-full h-32 w-32 border-8 `}
              />
            </div>

            <div className="px-2">
              {/* Name of the user */}
              <p className="h-6 w-48 bg-gray-500 animate-pulse rounded mx-auto"></p>
              {/* Username of the user */}
              <p className="mt-2 h-4 w-48 bg-gray-500 animate-pulse rounded mx-auto "></p>
            </div>

            <hr className="my-5 mx-2 dark:border-white/25" />

            {/* Date when user joined the journal */}
            <div className="mt-5 text-greyText h-4 w-56 bg-gray-500 animate-pulse rounded mx-auto"></div>
          </div>

          {/* Tab Buttons */}
          <div className="flex">
            {/* Teams Tab Button */}
            <div
              className={`flex-1 py-3 text-center transition-all duration-300 border-b-4`}
            >
              Teams
            </div>
            {/* Leagues Tab Button */}
            <div
              className={`flex-1 py-3 text-center transition-all duration-300 border-b-4 `}
            >
              Leagues
            </div>
          </div>

          <div>
            {tabValue == "teams" ? (
              <div className="flex justify-center flex-wrap py-10 px-5 gap-10">
                {loadingUser &&
                  Array(4)
                    ?.fill(null)
                    ?.map(() => {
                      return (
                        <div className="flex justify-center items-center py-10">
                          <div className=" bg-[#e1e1e1]/25 rounded-xl flex flex-col dark:bg-white/5  p-3 transition-all hover:shadow-md hover:bg-white/10">
                            <Card className="!bg-transparent flex flex-col gap-y-3 p-4 border-none shadow-none w-fit text-center">
                              <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                              <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                              <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                              <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                              <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                            </Card>
                          </div>
                        </div>
                      );
                    })}
                <div ref={ref}></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 py-10 px-2 gap-x-2 gap-y-10">
                {Array(4)
                  ?.fill(null)
                  ?.map(() => {
                    return (
                      <div className="mx-auto bg-[#e1e1e1]/25 max-w-3xs w-full rounded-xl flex flex-col dark:bg-white/5  px-5 py-5 transition-all hover:shadow-md hover:bg-white/10">
                        <div className="flex-1  flex flex-col gap-y-2">
                          <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                          <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                          <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                          <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                        </div>

                        {/* Author section - link to user's page. */}
                        <div className="mt-5 flex gap-x-3 items-center w-fit hover:underline">
                          {/* User's profile picture or avatar on left */}
                          <div className="px-0.5 h-10 w-10 rounded-full bg-gray-500  animate-pulse mb-4 " />
                          {/* User's name & username on the right */}
                          <div className="flex flex-col gap-y-2">
                            <p className="bg-gray-500 animate-pulse h-4 w-36 rounded"></p>
                            <p className="bg-gray-500 animate-pulse h-4 w-36 rounded"></p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* If user was found */}
      {user && (
        <div className="lg:min-h-screen bg-bgwhite dark:bg-darkbg dark:text-darkmodetext w-full pb-20">
          {/* Background color div */}
          <div className="bg-secondarydarkbg  border-b-4 border-black h-48"></div>

          {/* Profile Info Div */}
          <div className="bg-white dark:bg-secondarydarkbg dark:border-white/25 shadow-xl -translate-y-14 border-2 min-h-52 pt-20 pb-10 rounded-lg mx-5 md:mx-10 lg:mx-20">
            {/* Floating Image */}
            <div className="absolute w-full -top-16 flex justify-center">
              <div>
                <Avatar
                  className="h-34 w-34 !text-5xl border-secondarydarkbg border-10"
                  imageSrc={user?.data?.user?.photoURL}
                  fallBackText={user?.data?.user?.name}
                />
              </div>
            </div>

            <div className="px-2 pt-3">
              {/* Name of the user */}
              <p className="text-center text-3xl font-bold">
                {user?.data?.user?.name}
              </p>
              {/* Username of the user */}
              <p className="mt-2 text-center text-xl font-medium">
                @{user?.data?.user.username}
              </p>
              {/* User's bio */}
              {user?.data?.user?.bio && (
                <p className="px-4 my-10 text-md text-center">
                  {user?.data?.user?.bio}
                </p>
              )}
            </div>

            <hr className="my-5 mx-2 dark:border-white/25" />

            {/* Date when user joined the journal */}
            <div className="mt-5 text-greyText flex justify-center items-center gap-x-2">
              <TfiWrite /> Became a Grid Manager on{" "}
              {dayjs(new Date(user?.data?.user?.createdAt)).format(
                "MMM DD, YYYY"
              )}
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex">
            {/* Teams Tab Button */}
            <button
              onClick={() => setTabValue("teams")}
              className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4 ${
                tabValue == "teams" && "border-cta"
              }`}
            >
              Teams
            </button>
            {/* Leagues Tab Button */}
            <button
              onClick={() => setTabValue("leagues")}
              className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4  ${
                tabValue == "leagues" && "border-cta"
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
                    {user?.data?.user?.name}'s Teams
                  </h1>
                </div>
                <div className="grid lg:px-20 md:grid-cols-2 lg:grid-cols-4 px-2 gap-x-6 gap-y-10">
                  {teams &&
                    teams?.pages?.map((page) => {
                      return page?.data.teams?.map((team: any) => {
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
                      ?.map(() => {
                        return (
                          <div className="flex justify-center items-center py-10">
                            <div className=" bg-[#e1e1e1]/25 rounded-xl flex flex-col dark:bg-white/5  p-3 transition-all hover:shadow-md hover:bg-white/10">
                              <Card className="!bg-transparent flex flex-col gap-y-3 p-4 border-none shadow-none w-fit text-center">
                                <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                                <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                                <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                                <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                                <p className="h-5 w-44 bg-gray-500 animate-pulse rounded"></p>
                              </Card>
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
                    {user?.data?.user?.name}'s Leagues
                  </h1>
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
                          <div className="mx-auto bg-[#e1e1e1]/25 max-w-3xs w-full rounded-xl flex flex-col dark:bg-white/5  px-5 py-5 transition-all hover:shadow-md hover:bg-white/10">
                            <div className="flex-1  flex flex-col gap-y-2">
                              <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                              <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                              <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                              <p className="bg-gray-500 animate-pulse h-4 w-48 rounded"></p>
                            </div>

                            {/* Author section - link to user's page. */}
                            <div className="mt-5 flex gap-x-3 items-center w-fit hover:underline">
                              {/* User's profile picture or avatar on left */}
                              <div className="px-0.5 h-10 w-10 rounded-full bg-gray-500  animate-pulse mb-4 " />
                              {/* User's name & username on the right */}
                              <div className="flex flex-col gap-y-2">
                                <p className="bg-gray-500 animate-pulse h-4 w-36 rounded"></p>
                                <p className="bg-gray-500 animate-pulse h-4 w-36 rounded"></p>
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
      )}

      {/* If user cannot be found */}
      {!loadingUser && !user && (
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[60vh] flex justify-center items-center pb-48">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              Uh oh. We couldn&apos;t find that user. Go Back?
            </p>
            <div className="mt-10 flex flex-col gap-10 justify-center items-center">
              {/* Image */}
              <img
                src={
                  "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736742020/user_nbfigi.svg"
                }
                className="max-w-[70%] lg:max-w-[60%] pointer-events-none"
              />
              {/* Button to navigate back */}
              <div>
                <SecondaryButton
                  onClick={() => navigate("/")}
                  text="Go Back Home"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
