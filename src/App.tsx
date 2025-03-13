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

function App() {
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
