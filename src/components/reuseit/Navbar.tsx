import { useState } from "react";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { IoMoon } from "react-icons/io5";
import { IoSunnySharp } from "react-icons/io5";
import { ContextValue, useDarkMode } from "@/context/DarkModeContext";
import { useDBUser } from "@/context/UserContext";
import Modal from "./Modal";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import SignupModal from "../SignupModal";
import LoginModal from "../LoginModal";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode() as ContextValue;
  const { dbUser } = useDBUser();
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
      <nav
        className={`dark:bg-darkbg relative z-2 flex items-center justify-between bg-white px-10 py-3 font-sans shadow-xl dark:text-white dark:shadow-md dark:shadow-white/30`}
      >
        <Link to="/" aria-label="Home">
          <img src={logo} alt="Logo" className="h-12 cursor-pointer" />
        </Link>

        {/* LG screen links */}
        <div className="hidden items-center gap-x-8 font-medium lg:flex">
          <Link
            to="/"
            className="hover:text-cta dark:hover:text-darkmodeCTA transition-all"
          >
            Home
          </Link>
          {dbUser ? (
            <>
              {/* Log Out Modal */}
              <Modal
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
              </Modal>
              <button
                onClick={() => setIsSignOutModalOpen(true)}
                className="cursor-pointer"
              >
                Signout
              </button>
            </>
          ) : (
            <>
              <SignupModal
                moveToLogin={() => {
                  setIsSignUpModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                isModalOpen={isSignUpModalOpen}
                setIsModalOpen={() => setIsSignUpModalOpen(false)}
              />
              <button
                onClick={() => setIsSignUpModalOpen(true)}
                className="cursor-pointer"
              >
                Sign Up
              </button>

              <LoginModal
                moveToSignup={() => {
                  setIsLoginModalOpen(false);
                  setIsSignUpModalOpen(true);
                }}
                isModalOpen={isLoginModalOpen}
                setIsModalOpen={() => setIsLoginModalOpen(false)}
              />
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="cursor-pointer"
              >
                Login
              </button>
            </>
          )}
        </div>

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
          <div className="mb-14 flex items-center justify-between px-10 pt-3.5 lg:px-10">
            <button onClick={() => handleSearch("/")} aria-label="Home">
              <img src="Your Logo" alt="Logo" className="h-12 cursor-pointer" />
            </button>
            <RxCross2
              onClick={() => setOpen(false)}
              className="hover:text-cta cursor-pointer text-2xl transition-all"
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
                  onClick={() => handleSearch("/signout")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Signout"
                >
                  Signout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSearch("/signup")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Signout"
                >
                  Sign up
                </button>{" "}
                <button
                  onClick={() => handleSearch("/login")}
                  className="hover:text-cta w-fit cursor-pointer transition-all"
                  tabIndex={0}
                  aria-label="Signout"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {/* Footer Text   */}
          <div className="absolute bottom-24 left-1/2 w-full -translate-x-1/2 pl-1 text-sm lg:bottom-10"></div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
