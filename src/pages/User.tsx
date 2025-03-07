import { useNavigate, useParams } from "react-router-dom";
import { SecondaryButton } from "../components";
import { useDBUser } from "../context/UserContext";
import dayjs from "dayjs";
import { TfiWrite } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import Profile from "./Profile";
import HashLoader from "react-spinners/HashLoader";
import { useEffect } from "react";

const User = () => {
  // Get Post Id from params.
  const { username } = useParams();

  const { dbUser } = useDBUser();

  const navigate = useNavigate();

  // Fetch user data from server.
  const {
    data: user,
    isLoading: loadingUser,
    // error: userError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      return axiosInstance.post("/user/get-user-info", {
        username: username,
      });
    },
  });

  // Set window title.
  useEffect(() => {
    document.title = `${user?.data?.user?.name} | Grid Manager`;
  }, [user]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (username == dbUser?.username) {
    return <Profile />;
  }

  return (
    <>
      {/* If data is being fetched*/}
      {loadingUser && (
        <div className="dark:bg-darkbg min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] p-20 pb-40 flex justify-center items-center">
          <HashLoader
            color={"#9b0ced"}
            loading={loadingUser}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
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
                  className={`bg-secondarydarkbg rounded-full h-32 w-32 border-8 border-secondarydarkbg dark:border-darkgrey ${
                    user?.data?.user?.photoURL && "cursor-pointer"
                  } `}
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
