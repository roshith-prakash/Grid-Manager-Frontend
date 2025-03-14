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
} from "@/pages";
import { Footer, Navbar, Protector } from "./components";
// import { useHasWeekendStarted } from "./functions/hasWeekendStarted";
// import { useEffect } from "react";
// import toast from "react-hot-toast";
// import { RiErrorWarningLine } from "react-icons/ri";

function App() {
  // const hasWeekendStarted = useHasWeekendStarted();

  // const showPersistentToast = () => {
  //   toast(
  //     (t) => (
  //       <div className="flex items-center gap-4">
  //         <RiErrorWarningLine className="h-10 w-10" />
  //         <span className="text-sm md:text-base">
  //           The Race Weekend has started. Teams cannot be added or edited.
  //         </span>
  //         <button
  //           className="ml-auto px-3 py-1 bg-white text-red-600 font-medium rounded-md cursor-pointer transition"
  //           onClick={() => toast.dismiss(t.id)}
  //         >
  //           Dismiss
  //         </button>
  //       </div>
  //     ),
  //     { duration: Infinity } // Keeps the toast open indefinitely
  //   );
  // };

  // useEffect(() => {
  //   if (hasWeekendStarted) {
  //     showPersistentToast();
  //   }
  // }, [hasWeekendStarted]);

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

            {/* View a User's Profile (Non Logged in user) */}
            <Route path="/user/:username" element={<User />} />

            <Route
              path="/create-league"
              element={
                <Protector>
                  <CreateLeague />
                </Protector>
              }
            />

            <Route
              path="/leagues"
              element={
                <Protector>
                  <PublicLeagues />
                </Protector>
              }
            />

            <Route
              path="/leagues/:leagueId"
              element={
                <Protector>
                  <League />
                </Protector>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
