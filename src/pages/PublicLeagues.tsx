/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Trophy,
  Users,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { axiosInstance } from "@/utils/axiosInstance";
import { useDBUser } from "@/context/UserContext";
import useDebounce from "@/utils/useDebounce";

const PublicLeagues = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();
  const { dbUser } = useDBUser();
  const { ref, inView } = useInView();

  // Title
  useEffect(() => {
    document.title = "Leagues | Grid Manager";
  }, []);

  // Check if user can join more leagues
  const { data: canUserJoinLeague } = useQuery({
    queryKey: ["numberOfLeagues", dbUser?.id],
    queryFn: async () => {
      return axiosInstance.post("/team/check-if-user-can-join-league", {
        userId: dbUser?.id,
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Fetch leagues with infinite scroll
  const {
    data: leagues,
    isLoading: loadingLeagues,
    fetchNextPage: fetchNextLeagues,
  } = useInfiniteQuery({
    queryKey: ["publicLeagues", dbUser?.id, debouncedSearch],
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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (inView) {
      fetchNextLeagues();
    }
  }, [inView, fetchNextLeagues]);

  const LoadingSkeleton = () => (
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

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <Trophy className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        No Leagues Found
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {debouncedSearch
          ? `No leagues match "${debouncedSearch}". Try a different search term.`
          : "No public leagues available at the moment."}
      </p>
      <button
        onClick={() => navigate("/create-league")}
        disabled={canUserJoinLeague?.data?.canUserJoinLeague === false}
        className="px-6 py-3 bg-cta hover:bg-hovercta disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-500 rounded-lg transition-colors flex items-center gap-2 mx-auto"
      >
        <Plus className="w-4 h-4" />
        Create the First League
      </button>
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Leagues</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Discover and join fantasy F1 competitions from around the world
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canUserJoinLeague?.data?.canUserJoinLeague === false && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>League limit reached (5/5)</span>
              </div>
            )}

            <button
              onClick={() => navigate("/create-league")}
              disabled={canUserJoinLeague?.data?.canUserJoinLeague === false}
              className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-cta hover:bg-hovercta disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-500 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create League
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leagues..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-white/25 rounded-lg  text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none "
            />
          </div>

          {debouncedSearch && (
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Showing results for{" "}
              <span className="font-semibold">"{debouncedSearch}"</span>
            </p>
          )}
        </div>

        {/* Leagues Grid */}
        {leagues && leagues.pages?.[0]?.data?.leagues.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leagues.pages.map((page) =>
                page?.data.leagues?.map((league: any) => {
                  if (!league?.name) return null;

                  return (
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
                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                              {league.User?.photoURL ? (
                                <img
                                  src={
                                    league.User.photoURL || "/placeholder.svg"
                                  }
                                  alt={league.User.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-slate-500" />
                              )}
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
                  );
                })
              )}
            </div>

            {/* Loading indicator for infinite scroll */}
            {loadingLeagues && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading more leagues...</span>
                </div>
              </div>
            )}

            {/* Intersection observer trigger */}
            <div ref={ref} className="h-4" />
          </div>
        ) : loadingLeagues ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default PublicLeagues;
