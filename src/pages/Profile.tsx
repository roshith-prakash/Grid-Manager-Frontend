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
import { useInfiniteQuery } from "@tanstack/react-query";
import Card from "@/components/reuseit/Card";
import { useInView } from "react-intersection-observer";
import HashLoader from "react-spinners/HashLoader";
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

  // Intersection observer to fetch new teams / leagues
  const { ref, inView } = useInView();

  // Fetching user's leagues
  const {
    data: leagues,
    isLoading: loadingLeagues,
    // error: leaguesError,
    fetchNextPage: fetchNextLeagues,
    isFetchingNextPage: loadingNextLeagues,
    // refetch: refetchLeagues,
  } = useInfiniteQuery({
    queryKey: ["userLeagues", dbUser?.username],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-user-leagues", {
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
    isFetchingNextPage: loadingNextTeams,
    refetch: refetchTeams,
  } = useInfiniteQuery({
    queryKey: ["userTeams", dbUser?.username],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/team/get-user-teams", {
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
          .post("/user/delete-user", { username: dbUser?.username })
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

    // Deleting user from firebase
  };

  // Delete a selected team
  const deleteTeam = () => {
    axiosInstance
      .post("/team/delete-team", { teamId: teamId })
      .then(() => {
        toast.success("Team Deleted.");
        refetchTeams();
        setIsDeleteTeamModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
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
            {dbUser?.photoURL ? (
              <img
                src={dbUser?.photoURL}
                className="bg-secondarydarkbg  rounded-full h-32 w-32 border-8 border-secondarydarkbg dark:border-darkgrey pointer-events-none"
              />
            ) : (
              <img
                src={
                  "https://res.cloudinary.com/do8rpl9l4/image/upload/v1740987081/accountcircle_axsjlm.png"
                }
                className="bg-secondarydarkbg  rounded-full h-32 w-32 border-8 border-secondarydarkbg dark:border-darkgrey pointer-events-none"
              />
            )}
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
          <div className="px-2">
            <p className="text-center text-3xl font-bold">{dbUser?.name}</p>
            <p className="mt-2 text-center text-xl font-medium">
              @{dbUser?.username}
            </p>
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
              <div className="flex justify-center flex-wrap py-10 px-5 gap-10">
                {teams &&
                  teams?.pages?.map((page) => {
                    return page?.data.teams?.map((team: any) => {
                      console.log(team);
                      return (
                        <div
                          className="relative cursor-pointer"
                          onClick={() => {
                            setTeamId(team?.id);
                            setIsTeamModalOpen(true);
                          }}
                        >
                          <div className="flex gap-2 absolute top-3 right-3">
                            {" "}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeamId(team?.id);
                                setIsEditModalOpen(true);
                              }}
                              className="text-xl  cursor-pointer"
                            >
                              <BsPen className="text-xl hover:text-cta dark:hover:text-darkmodeCTA transition-all cursor-pointer" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeamId(team?.id);
                                setIsDeleteTeamModalOpen(true);
                              }}
                              className="text-xl  cursor-pointer"
                            >
                              <BsFillTrash3Fill className="text-red-500" />
                            </button>
                          </div>
                          <Card key={team?.id} className="p-3 w-fit">
                            <p>{team?.name}</p>
                            <p>Points : {team?.score}</p>
                            <p>{team?.League?.name}</p>
                            <p>{team?.League?.leagueId}</p>

                            <p>
                              {" "}
                              Last Updated at :{" "}
                              {dayjs(new Date(team?.updatedAt)).format(
                                "MMM DD, YYYY"
                              )}
                            </p>
                          </Card>
                        </div>
                      );
                    });
                  })}
              </div>

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

              {/* If no leagues are found */}
              {teams && teams?.pages?.[0]?.data?.teams.length == 0 && (
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
                    Uh oh! Couldn&apos;t find any teams.
                  </p>
                </div>
              )}

              <div ref={ref}></div>
            </>
          ) : (
            // Leagues
            <>
              <div className="flex justify-center flex-wrap py-10 px-5 gap-10">
                {leagues &&
                  leagues?.pages?.map((page) => {
                    return page?.data.leagues?.map((league: any) => {
                      console.log(league);
                      return (
                        <>
                          <Link
                            className="border-2 rounded-xl bg-white/5 w-fit px-5 py-5"
                            to={`/leagues/${league?.leagueId}`}
                          >
                            <p>League Name : {league?.name}</p>

                            <p>League Id : {league?.leagueId}</p>

                            <p>Number of Teams : {league?.numberOfTeams}</p>

                            <p>Private : {String(league?.private)}</p>

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
                        </>
                      );
                    });
                  })}
              </div>

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
                        "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736740067/homeNoPosts_bxhmtk.svg"
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
