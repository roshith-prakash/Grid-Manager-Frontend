import { useState } from "react";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMoon } from "react-icons/io5";
import { IoSunnySharp } from "react-icons/io5";
import { ContextValue, useDarkMode } from "@/context/DarkModeContext";
import { useDBUser } from "@/context/UserContext";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import SignupModal from "../SignupModal";
import LoginModal from "../LoginModal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuth } from "@/context/AuthContext";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { FaUserPlus } from "react-icons/fa6";
import { PiSignOutFill } from "react-icons/pi";
import { SiF1 } from "react-icons/si";
import Avatar from "./Avatar";
import AlertModal from "./AlertModal";

import logoDark from "@/assets/car-dark.png";
import logo from "@/assets/car.png";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode() as ContextValue;
  const { dbUser } = useDBUser();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (link: string) => {
    navigate(link);
    setOpen(false);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsSignOutModalOpen(false);
        navigate("/");
      })
      .catch((error) => {
        setIsSignOutModalOpen(false);
        console.log(error);
      });
  };

  return (
    <>
      {/* Log Out Modal */}
      <AlertModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
      >
        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <h1 className="dark:text-darkmodetext font-bold text-2xl">
            Are you sure you want to sign out?
          </h1>

          {/* Subtitle */}
          <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70">
            You will need to log in again to access your account.
          </h2>

          <div className="mt-5 flex gap-x-5 justify-end">
            <PrimaryButton
              className="text-sm"
              onClick={handleLogout}
              text="Log out"
            />
            <SecondaryButton
              className="text-sm"
              onClick={() => setIsSignOutModalOpen(false)}
              text="Cancel"
            />
          </div>
        </div>
      </AlertModal>

      {/* Sign Up Modal */}
      <SignupModal
        moveToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        isModalOpen={isSignUpModalOpen}
        setIsModalOpen={() => setIsSignUpModalOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        moveToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        isModalOpen={isLoginModalOpen}
        setIsModalOpen={() => setIsLoginModalOpen(false)}
      />

      <nav
        className={`dark:bg-darkbg relative z-2 flex items-center justify-between bg-white px-10 py-3 font-f1 dark:text-white`}
      >
        {/* Grid Manager */}
        <Link to="/" aria-label="Home" className="flex gap-x-2 items-center">
          <img
            src={isDarkMode ? logoDark : logo}
            alt="Grid Manager"
            className="h-8 cursor-pointer"
          />
          <span className="hidden md:block font-semibold text-2xl">
            Grid Manager
          </span>
        </Link>

        {/* LG screen links */}
        <div className="hidden items-center -translate-x-14 gap-x-8 font-medium lg:flex">
          {/* Home Page */}
          <Link
            to="/"
            className="hover:text-cta dark:hover:text-darkmodeCTA transition-all"
          >
            Home
          </Link>

          {dbUser ? (
            <>
              <Link
                to="/leagues"
                className="hover:text-cta dark:hover:text-darkmodeCTA transition-all"
              >
                Leagues
              </Link>
              <Link
                to="/leaderboard"
                className="hover:text-cta dark:hover:text-darkmodeCTA transition-all"
              >
                Leaderboard
              </Link>
              <button
                onClick={() => setIsSignOutModalOpen(true)}
                className="cursor-pointer hover:text-cta dark:hover:text-darkmodeCTA transition-all"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              {location.pathname != "/signup" && (
                <button
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="cursor-pointer hover:text-cta dark:hover:text-darkmodeCTA transition-all"
                >
                  Sign up
                </button>
              )}

              {location.pathname != "/signin" && (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="cursor-pointer hover:text-cta dark:hover:text-darkmodeCTA transition-all"
                >
                  Sign in
                </button>
              )}
            </>
          )}

          {/* FAQ Page */}
          <Link
            to="/faq"
            className="hover:text-cta dark:hover:text-darkmodeCTA transition-all"
          >
            FAQ
          </Link>
        </div>

        {/* Theme + Popover - Large Screen */}
        <div className="flex items-center gap-x-5">
          {/* Theme change button */}
          <button
            aria-label="Change Theme"
            className="hidden cursor-pointer lg:flex"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <IoSunnySharp className="hover:text-darkmodeCTA text-2xl transition-all" />
            ) : (
              <IoMoon className="hover:text-cta text-2xl transition-all" />
            )}
          </button>
          <div className="hidden lg:block">
            <Popover>
              <PopoverTrigger className="flex items-center cursor-pointer">
                {dbUser ? (
                  <Avatar
                    border
                    borderClassName="bg-gradient-to-br from-darkmodeCTA via-cta to-hovercta"
                    imageSrc={dbUser?.photoURL}
                    fallBackText={dbUser?.name}
                  />
                ) : (
                  <Avatar />
                )}
              </PopoverTrigger>
              <PopoverContent className="dark:bg-darkgrey dark:border-2 w-auto mt-2 mr-4 py-0 px-1">
                <div className="py-1 min-w-48 flex flex-col gap-y-1">
                  {/* View Profile */}
                  {dbUser && (
                    <>
                      <Link
                        to="/profile"
                        className={`flex flex-col gap-y-2 font-medium text-cta dark:text-darkmodeCTA  hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey hover:text-hovercta dark:hover:text-cta text-lg py-2 px-5 rounded  w-full transition-all`}
                      >
                        <p className="text-center">{dbUser?.name}</p>
                        <p className="text-center">@{dbUser?.username}</p>
                      </Link>

                      <hr />
                    </>
                  )}

                  {/* Edit Profile */}
                  {dbUser && (
                    <>
                      <NavLink
                        to="/edit-profile"
                        className={({ isActive }) =>
                          `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey w-full transition-all ${
                            isActive && "bg-slate-100 dark:bg-white/20"
                          }`
                        }
                      >
                        <CgProfile className="text-xl" />
                        Edit Profile
                      </NavLink>
                      <hr />
                    </>
                  )}

                  {dbUser && (
                    <>
                      <NavLink
                        to="/create-league"
                        className={({ isActive }) =>
                          `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey w-full transition-all ${
                            isActive && "bg-slate-100 dark:bg-white/20"
                          }`
                        }
                      >
                        <SiF1 className="text-xl" />
                        Create League
                      </NavLink>
                      <hr />
                    </>
                  )}

                  {/* Onboarding */}
                  {currentUser && !dbUser && (
                    <>
                      <NavLink
                        to="/onboarding"
                        className={({ isActive }) =>
                          `flex gap-x-5 items-center font-medium bg-purple-100 dark:bg-darkgrey text-lg py-2 px-5 rounded w-full transition-all ${
                            isActive && "bg-slate-100 dark:bg-white/20"
                          }`
                        }
                      >
                        <RiAccountPinCircleLine className="text-xl animate-pulse" />
                        <p className="animate-pulse">Profile</p>
                      </NavLink>
                      <hr />
                    </>
                  )}

                  {/* Log Out */}
                  {currentUser && (
                    <button
                      onClick={() => setIsSignOutModalOpen(true)}
                      className="cursor-pointer flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey w-full transition-all"
                    >
                      <PiSignOutFill className="text-xl" />
                      Sign out
                    </button>
                  )}

                  {/* Sign up */}
                  {!currentUser && (
                    <>
                      <button
                        onClick={() => setIsSignUpModalOpen(true)}
                        className={`cursor-pointer flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey  w-full transition-all `}
                      >
                        <FaUserPlus className="text-xl" />
                        Sign up
                      </button>
                      <hr />
                    </>
                  )}

                  {/* Log in */}
                  {!currentUser && (
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className={`cursor-pointer flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey  w-full transition-all `}
                    >
                      <CgLogOut className="text-xl rotate-180" />
                      Sign in
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Open Drawer */}
        <div className="flex items-center gap-x-10 font-medium lg:hidden">
          {/* Toggle Light & Dark Mode */}
          <button
            className="cursor-pointer"
            aria-label="Change Theme"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <IoSunnySharp className="hover:text-cta text-xl transition-all" />
            ) : (
              <IoMoon className="hover:text-cta text-xl transition-all" />
            )}
          </button>

          {/* Pop over component */}
          <Popover>
            <PopoverTrigger className="flex items-center cursor-pointer">
              {dbUser ? (
                <Avatar
                  border
                  borderClassName="bg-gradient-to-br  from-[#ec8cff] to-cta"
                  imageSrc={dbUser?.photoURL}
                  fallBackText={dbUser?.name}
                />
              ) : (
                <Avatar />
              )}
            </PopoverTrigger>
            <PopoverContent className="dark:bg-darkgrey dark:border-2 w-auto mt-2 mr-4 py-0 px-1">
              <div className="py-1 min-w-48 flex flex-col gap-y-1">
                {/* View Profile */}
                {dbUser && (
                  <>
                    <Link
                      to="/profile"
                      className={`flex flex-col gap-y-2 font-medium text-cta dark:text-darkmodeCTA  hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey hover:text-hovercta dark:hover:text-cta text-lg py-2 px-5 rounded  w-full transition-all`}
                    >
                      <p className="text-center">{dbUser?.name}</p>
                      <p className="text-center">@{dbUser?.username}</p>
                    </Link>

                    <hr />
                  </>
                )}

                {/* Edit Profile */}
                {dbUser && (
                  <>
                    <NavLink
                      to="/edit-profile"
                      className={({ isActive }) =>
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey w-full transition-all ${
                          isActive && "bg-slate-100 dark:bg-white/20"
                        }`
                      }
                    >
                      <CgProfile className="text-xl" />
                      Edit Profile
                    </NavLink>
                    <hr />
                  </>
                )}

                {dbUser && (
                  <>
                    <NavLink
                      to="/create-league"
                      className={({ isActive }) =>
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey w-full transition-all ${
                          isActive && "bg-slate-100 dark:bg-white/20"
                        }`
                      }
                    >
                      <SiF1 className="text-xl" />
                      Create League
                    </NavLink>
                    <hr />
                  </>
                )}

                {/* Onboarding */}
                {currentUser && !dbUser && (
                  <>
                    <NavLink
                      to="/onboarding"
                      className={({ isActive }) =>
                        `flex gap-x-5 items-center font-medium bg-purple-100 dark:bg-darkgrey text-lg py-2 px-5 rounded w-full transition-all ${
                          isActive && "bg-slate-100 dark:bg-white/20"
                        }`
                      }
                    >
                      <RiAccountPinCircleLine className="text-xl animate-pulse" />
                      <p className="animate-pulse">Profile</p>
                    </NavLink>
                    <hr />
                  </>
                )}

                {/* Log Out */}
                {currentUser && (
                  <NavLink
                    to="/signout"
                    className="cursor-pointer flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey w-full transition-all"
                  >
                    <PiSignOutFill className="text-xl" />
                    Sign out
                  </NavLink>
                )}

                {/* Sign up */}
                {!currentUser && (
                  <>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey  w-full transition-all ${
                          isActive && "bg-slate-100 dark:bg-white/20"
                        }`
                      }
                    >
                      <FaUserPlus className="text-xl" />
                      Sign up
                    </NavLink>
                    <hr />
                  </>
                )}

                {/* Log in */}
                {!currentUser && (
                  <NavLink
                    to="/signin"
                    className={({ isActive }) =>
                      `flex gap-x-5 items-center font-medium text-lg py-2 px-5 rounded hover:bg-slate-50 dark:hover:bg-white/10 dark:hover:bg-darkgrey w-full transition-all ${
                        isActive && "bg-slate-100 dark:bg-white/20"
                      }`
                    }
                  >
                    <CgLogOut className="text-xl rotate-180" />
                    Sign in
                  </NavLink>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Hamburger Button to open the drawer */}
          <button onClick={() => setOpen(true)} className="cursor-pointer">
            <RxHamburgerMenu className="text-xl" aria-label="Open menu" />
          </button>
        </div>

        {/* Drawer Menu */}
        <div
          className={`dark:bg-darkbg scroller fixed top-0 right-0 z-50 h-screen w-full overflow-y-auto bg-white pb-6 text-center text-xl shadow-md md:text-lg ${
            open ? "translate-x-0" : "translate-x-[100%]"
          } transition-all duration-500`}
          role="dialog"
          aria-modal="true"
          aria-label="Drawer Menu"
        >
          <div className="mb-14 h-14 flex items-center justify-between px-10 pt-4.5 lg:px-10">
            <button
              className="cursor-pointer flex gap-x-2 items-center"
              onClick={() => handleSearch("/")}
              aria-label="Home"
            >
              <img
                src={isDarkMode ? logoDark : logo}
                alt="Grid Manager"
                className="h-8 cursor-pointer"
              />
              <span className="font-semibold text-2xl">Grid Manager</span>
            </button>
            <RxCross2
              onClick={() => setOpen(false)}
              className="hover:text-cta dark:hover:text-darkmodeCTA cursor-pointer text-2xl transition-all"
              aria-label="Close menu"
            />
          </div>

          <div className="mt-20 flex flex-col items-center justify-between gap-y-12 px-8 text-xl font-medium">
            {/*  Add your links here */}
            <button
              onClick={() => handleSearch("/")}
              className="hover:text-cta w-fit cursor-pointer transition-all"
              tabIndex={0}
              aria-label="Go to Home"
            >
              Home
            </button>

            {dbUser ? (
              <>
                <button
                  onClick={() => handleSearch("/leagues")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Leagues"
                >
                  Leagues
                </button>
                <button
                  onClick={() => handleSearch("/leaderboard")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Leaderboard"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => handleSearch("/signout")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSearch("/signup")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Sign up"
                >
                  Sign up
                </button>{" "}
                <button
                  onClick={() => handleSearch("/signin")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Sign in"
                >
                  Sign in
                </button>
              </>
            )}

            <button
              onClick={() => handleSearch("/faq")}
              className="hover:text-cta w-fit cursor-pointer transition-all"
              tabIndex={0}
              aria-label="FAQ Page"
            >
              FAQ
            </button>
          </div>

          {/* Footer Text   */}
          <div className="absolute bottom-24 left-1/2 w-full -translate-x-1/2 pl-1 text-sm lg:bottom-10"></div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
