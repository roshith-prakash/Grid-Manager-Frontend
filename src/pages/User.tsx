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
              {user?.data?.user?.photoURL ? (
                <img
                  src={
                    user?.data?.user?.photoURL
                      ? user?.data?.user?.photoURL
                      : "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736740649/account_glotqh.png"
                  }
                  className={`bg-white rounded-full h-32 w-32 border-8 border-secondarydarkbg dark:border-darkgrey `}
                />
              ) : (
                <img
                  src={
                    user?.data?.user?.photoURL
                      ? user?.data?.user?.photoURL
                      : "https://res.cloudinary.com/do8rpl9l4/image/upload/v1740987081/accountcircle_axsjlm.png"
                  }
                  onClick={() => {
                    if (user?.data?.user?.photoURL) {
                      window.open(user?.data?.user?.photoURL);
                    }
                  }}
                  className={`bg-secondarydarkbg rounded-full h-32 w-32 border-8 border-secondarydarkbg ${
                    user?.data?.user?.photoURL && "cursor-pointer"
                  } `}
                />
              )}
            </div>

            <div className="px-2">
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
              <>
                <div className="flex justify-center flex-wrap py-10 px-5 gap-10">
                  {teams &&
                    teams?.pages?.map((page) => {
                      return page?.data.teams?.map((team: any) => {
                        return (
                          <div
                            className=" bg-[#e1e1e1]/25 rounded-xl flex flex-col dark:bg-white/5  p-3 transition-all hover:shadow-md hover:bg-white/10 cursor-pointer"
                            onClick={() => {
                              setTeamId(team?.id);
                              setIsTeamModalOpen(true);
                            }}
                          >
                            <Card
                              key={team?.id}
                              className="!bg-transparent p-4 border-none shadow-none w-fit text-center"
                            >
                              <p className="text-lg font-semibold text-darkbg dark:text-white">
                                {team?.name}
                              </p>
                              <p className="text-md text-gray-600 dark:text-white/70">
                                Points:{" "}
                                <span className="font-medium">
                                  {team?.score}
                                </span>
                              </p>
                              <p className="text-md text-gray-600 dark:text-white/70">
                                {team?.League?.name}
                              </p>
                              <p className="text-md text-gray-600 dark:text-white/70">
                                League ID: {team?.League?.leagueId}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-white/50 mt-2">
                                Last Updated:{" "}
                                {dayjs(new Date(team?.updatedAt)).format(
                                  "MMM DD, YYYY"
                                )}
                              </p>
                            </Card>
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

                {/* If no leagues are found */}
                {teams && teams?.pages?.[0]?.data?.teams.length == 0 && (
                  <div className="flex flex-col justify-center pt-10">
                    <p className="text-center text-xl py-8 font-semibold">
                      No Teams present.
                    </p>
                  </div>
                )}

                <div ref={ref}></div>
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 py-10 px-2 gap-x-2 gap-y-10">
                  {leagues &&
                    leagues?.pages?.map((page) => {
                      return page?.data.leagues?.map((league: any) => {
                        return (
                          <>
                            <Link
                              className="mx-auto bg-[#e1e1e1]/25 max-w-3xs w-full rounded-xl flex flex-col dark:bg-white/5  px-5 py-5 transition-all hover:shadow-md hover:bg-white/10"
                              to={`/leagues/${league?.leagueId}`}
                            >
                              <div className="flex-1">
                                <p className="text-xl mb-4 font-semibold">
                                  {league?.name}
                                </p>
                                <p className="text-md dark:text-white/80 text-darkbg/70">
                                  League ID: {league?.leagueId}
                                </p>
                                <p className="text-md dark:text-white/80 text-darkbg/70">
                                  Number of Teams: {league?.numberOfTeams}
                                </p>
                                <p className="text-md dark:text-white/80 text-darkbg/70">
                                  Private: {String(league?.private)}
                                </p>
                              </div>

                              {/* Author section - link to user's page. */}
                              <Link
                                to={`/user/${league?.User?.username}`}
                                className="mt-5 flex gap-x-3 items-center w-fit hover:underline"
                              >
                                {/* User's profile picture or avatar on left */}
                                <Avatar
                                  imageSrc={league?.User?.photoURL}
                                  fallBackText={league?.User?.name}
                                />
                                {/* User's name & username on the right */}
                                <div>
                                  <p className="text-md font-semibold break-all">
                                    {league?.User?.name}
                                  </p>
                                  <p className="text-sm text-darkbg/50 dark:text-white/50 break-all">
                                    @{league?.User?.username}
                                  </p>
                                </div>
                              </Link>
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
                      No Leagues present.
                    </p>
                  </div>
                )}

                <div ref={ref}></div>
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
