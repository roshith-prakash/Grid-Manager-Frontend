import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  EditProfile,
  Landing,
  Login,
  Onboarding,
  Signout,
  Signup,
  Profile,
  CreateLeague,
  User,
  League,
  PublicLeagues,
  Leaderboard,
  FAQ,
  Notices,
  NotFound,
} from "@/pages";
import { Footer, Navbar, Protector } from "./components";
import { useHasWeekendStarted } from "./functions/hasWeekendStarted";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { RiErrorWarningLine } from "react-icons/ri";

// import { useQuery } from "@tanstack/react-query";
// import { axiosInstance } from "./utils/axiosInstance";

function App() {
  const hasWeekendStarted = useHasWeekendStarted();

  const showPersistentToast = () => {
    toast(
      (t) => (
        <div className="flex items-center gap-4">
          <RiErrorWarningLine className="h-10 w-10" />
          <span className="text-sm md:text-base">
            The Race Weekend has started. Teams cannot be added or edited.
          </span>
          <button
            className="ml-auto px-3 py-1 bg-white text-red-600 font-medium rounded-md cursor-pointer transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </div>
      ),
      { duration: Infinity } // Keeps the toast open indefinitely
    );
  };

  useEffect(() => {
    if (hasWeekendStarted) {
      showPersistentToast();
    }
  }, [hasWeekendStarted]);

  // Check if new session data is added & update score.
  // const { data, error } = useQuery({
  //   queryKey: ["update-score"],
  //   queryFn: async () => {
  //     return axiosInstance.get("/update-scores");
  //   },
  //   staleTime: 60 * 1000 * 60 * 1,
  // });

  // console.log(data, error);

  return (
    <div className="min-h-screen font-f1 flex flex-col dark:bg-darkbg dark:text-darkmodetext">
      <BrowserRouter>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/signout" element={<Signout />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/notices" element={<Notices />} />

            <Route
              path="/leaderboard"
              element={
                <Protector>
                  <Leaderboard />
                </Protector>
              }
            />

            {/* Protected routes - Logged In User required. */}

            <Route
              path="/edit-profile"
              element={
                <Protector>
                  <EditProfile />
                </Protector>
              }
            />

            {/* View your profile */}
            <Route
              path="/profile"
              element={
                <Protector>
                  <Profile />
                </Protector>
              }
            />

            {/* View a User's Profile (Non Current user) */}
            <Route
              path="/user/:username"
              element={
                <Protector>
                  <User />
                </Protector>
              }
            />

            {/* Create a new league */}
            <Route
              path="/create-league"
              element={
                <Protector>
                  <CreateLeague />
                </Protector>
              }
            />

            {/* View all public leagues */}
            <Route
              path="/leagues"
              element={
                <Protector>
                  <PublicLeagues />
                </Protector>
              }
            />

            {/* View a specific league */}
            <Route
              path="/leagues/:leagueId"
              element={
                <Protector>
                  <League />
                </Protector>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
