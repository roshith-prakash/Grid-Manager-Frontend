import { useEffect, useState } from "react";
import useDebounce from "../utils/useDebounce";
import { Input, SecondaryButton } from "../components";
import { IoIosSearch } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import Avatar from "@/components/reuseit/Avatar";
import { LuCirclePlus } from "react-icons/lu";
import { useDBUser } from "@/context/UserContext";

const PublicLeagues = () => {
  // State for user input - passed to debouncer
  const [search, setSearch] = useState("");
  // Debouncing the input of the user
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  const { dbUser } = useDBUser();

  // Intersection observer to fetch new leagues
  const { ref, inView } = useInView();

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetching searched leagues
  const {
    data: leagues,
    isLoading: loadingLeagues,
    // error: leaguesError,
    fetchNextPage: fetchNextLeagues,
    isFetchingNextPage: loadingNextLeagues,
  } = useInfiniteQuery({
    queryKey: ["searchPosts", debouncedSearch, dbUser?.id],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/search-public-leagues", {
        searchTerm: debouncedSearch,
        page: pageParam,
        userId: dbUser?.id,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled:
      debouncedSearch != null &&
      debouncedSearch != undefined &&
      debouncedSearch.length != 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Fetching next set of leagues
  useEffect(() => {
    if (inView) {
      fetchNextLeagues();
    }
  }, [inView, fetchNextLeagues, leagues?.pages?.length]);

  return (
    <>
      <div className="min-h-[70vh] dark:bg-darkbg dark:text-darkmodetext md:min-h-[65vh] lg:min-h-[60vh] px-8 lg:px-10 py-10">
        <div>
          <div className="flex justify-between items-center">
            {/* Gradient Title */}
            <h1 className="text-hovercta dark:text-darkmodeCTA text-4xl font-semibold">
              Find a League!
            </h1>

            <SecondaryButton
              className="border-transparent dark:hover:!text-cta shadow-md"
              text={
                <div className="flex  gap-x-2 items-center">
                  <LuCirclePlus className="text-xl" />
                  <span className="">Add</span>
                </div>
              }
              onClick={() => navigate("/create-league")}
            ></SecondaryButton>
          </div>

          {/* Input box */}
          <div className="flex flex-col items-center">
            <div className="relative my-10 mt-14 w-full md:w-[80%] lg:w-[70%] flex justify-center">
              <IoIosSearch className="absolute left-2 top-6 text-greyText text-xl" />
              <Input
                value={search}
                className="pl-10"
                placeholder={"Search and find a league!"}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p>( Note : Private Leagues will not be displayed. )</p>
          </div>

          {/* Showing the input entered by the user */}
          {debouncedSearch && (
            <p className="font-medium py-5">
              Showing search results for &quot;{debouncedSearch}&quot;
            </p>
          )}

          {leagues && leagues?.pages?.[0]?.data?.leagues.length > 0 && (
            <div className="py-10 lg:px-5 flex justify-center flex-wrap gap-8">
              {/* Map leagues if leagues are found */}
              {leagues &&
                leagues?.pages?.map((page) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return page?.data.leagues?.map((league: any) => {
                    if (league?.name) {
                      return (
                        <Link
                          className="bg-darkbg/0.5 max-w-60 w-full rounded-xl flex flex-col  px-5 py-5 transition-all shadow-lg hover:scale-105  hover:bg-white/10 dark:bg-white/5"
                          to={`/leagues/${league?.leagueId}`}
                        >
                          <div className="flex-1">
                            <p className="text-lg text-ellipsis text-nowrap font-semibold">
                              {league?.name}
                            </p>
                            <p className="text-md dark:text-white/80 text-darkbg/70">
                              League ID: {league?.leagueId}
                            </p>
                            <p className="text-md dark:text-white/80 text-darkbg/70">
                              Number of Teams: {league?.numberOfTeams}
                            </p>
                          </div>

                          {/* Author section - link to user's page. */}
                          <Link
                            to={`/user/${league?.User?.username}`}
                            className="mt-5 flex gap-x-3 items-center w-fit hover:underline"
                          >
                            {/* User's profile picture or avatar on left */}
                            <Avatar
                              imageSrc={league?.User.photoURL}
                              fallBackText={league?.User.name}
                            ></Avatar>
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
                      );
                    }
                  });
                })}
            </div>
          )}

          {(loadingLeagues || loadingNextLeagues) && (
            <div className="flex justify-center items-center py-10">
              <HashLoader
                color={"#9b0ced"}
                loading={loadingLeagues || loadingNextLeagues}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}

          {/* If no leagues are found */}
          {leagues && leagues?.pages?.[0]?.data?.leagues.length == 0 && (
            <div className="flex flex-col justify-center pt-10">
              <div className="flex justify-center">
                <img
                  src={
                    "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742462679/Starman-bro_rgnlwy.svg"
                  }
                  className="max-w-[30%]"
                />
              </div>
              <p className="text-center mt-5 text-2xl font-medium">
                Uh oh! Couldn&apos;t find any leagues.
              </p>
            </div>
          )}

          <div ref={ref}></div>
        </div>
      </div>
    </>
  );
};

export default PublicLeagues;
