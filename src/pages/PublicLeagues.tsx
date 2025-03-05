import { useEffect, useState } from "react";
import useDebounce from "../utils/useDebounce";
import { Input } from "../components";
import { IoIosSearch } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import Avatar from "@/components/reuseit/Avatar";

const PublicLeagues = () => {
  // State for user input - passed to debouncer
  const [search, setSearch] = useState("");
  // Debouncing the input of the user
  const debouncedSearch = useDebounce(search);

  // Intersection observer to fetch new posts
  const { ref, inView } = useInView();

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetching searched Posts
  const {
    data: leagues,
    isLoading: loadingLeagues,
    // error: postsError,
    fetchNextPage: fetchNextLeagues,
    isFetchingNextPage: loadingNextLeagues,
  } = useInfiniteQuery({
    queryKey: ["searchPosts", debouncedSearch],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/search-public-leagues", {
        searchTerm: debouncedSearch,
        page: pageParam,
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
  });

  // Fetching next set of posts or users
  useEffect(() => {
    if (inView) {
      fetchNextLeagues();
    }
  }, [inView, fetchNextLeagues, leagues?.pages?.length]);

  return (
    <>
      <div className="min-h-[70vh] dark:bg-darkbg dark:text-darkmodetext md:min-h-[65vh] lg:min-h-[60vh] px-8 lg:px-10 py-10">
        <div>
          {/* Gradient Title */}
          <h1 className="text-hovercta dark:text-darkmodeCTA text-4xl font-semibold">
            Find a League!
          </h1>

          {/* Input box */}
          <div className="flex justify-center">
            <div className="relative my-10 mt-14 w-full md:w-[80%] lg:w-[70%] flex justify-center">
              <IoIosSearch className="absolute left-2 top-6 text-greyText text-xl" />
              <Input
                value={search}
                className="pl-10"
                placeholder={"Search and find a league!"}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Showing the input entered by the user */}
          {debouncedSearch && (
            <p className="font-medium">
              Showing search results for &quot;{debouncedSearch}&quot;
            </p>
          )}

          {leagues && leagues?.pages?.[0]?.data?.leagues.length > 0 && (
            <div className="py-10 lg:px-5 grid grid-cols-1 md:grid-cols-2">
              {/* Map posts if posts are found */}
              {leagues &&
                leagues?.pages?.map((page) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return page?.data.leagues?.map((league: any) => {
                    console.log(league);
                    if (league?.name) {
                      return (
                        <Link
                          className="border-2 rounded-xl bg-white/5 w-fit px-5 py-5"
                          to={`/leagues/${league?.leagueId}`}
                        >
                          <p>League Name : {league?.name}</p>

                          <p>League Id : {league?.leagueId}</p>

                          <p>Number of Teams : {league?.numberOfTeams}</p>

                          {/* Author section - link to user's page. */}
                          <Link
                            to={`/user/${league?.User?.username}`}
                            className="mt-5 flex gap-x-3 items-center w-fit"
                          >
                            {/* User's profile picture or avatar on left */}
                            {league?.User?.photoURL ? (
                              <img
                                src={league?.User?.photoURL}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <Avatar
                                imageSrc={league?.User?.photoURL}
                                fallBackText={league?.User?.name}
                              />
                            )}
                            {/* User's name & username on the right */}
                            <div>
                              <p className="break-all font-medium">
                                {league?.User?.name}
                              </p>
                              <p className="break-all">
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

          {/* If no posts are found */}
          {leagues && leagues?.pages?.[0]?.data?.leagues.length == 0 && (
            <div className="flex flex-col justify-center pt-10">
              <div className="flex justify-center">
                <img
                  src={
                    "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736740067/homeNoPosts_bxhmtk.svg"
                  }
                  className="max-w-[30%]"
                />
              </div>
              <p className="text-center mt-5 text-2xl font-medium">
                Uh oh! Couldn&apos;t find any posts.
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
