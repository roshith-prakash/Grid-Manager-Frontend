import { ContextValue, useDarkMode } from "@/context/DarkModeContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { isDarkMode } = useDarkMode() as ContextValue;

  return (
    <footer
      className={`${
        isDarkMode
          ? "bg-secondarydarkbg border-darkmodetext border-t-2"
          : "from-cta to-hovercta bg-gradient-to-b"
      } font-inter min-h-50vh px-010 relative mt-20 pt-36 pb-20 text-white`}
    >
      {/* Floating Div */}
      <div className="dark:border-darkmodetext absolute -top-16 left-1/2 flex h-32 w-[90vw] -translate-x-1/2 items-center justify-around rounded-lg bg-[#1f1e1e] text-white lg:w-[80vw] dark:border-2">
        <p className="text-xl font-medium">
          Grid Manager - Fantasy F1 for the fans, by the fans!
        </p>
      </div>

      {/* Main Footer section */}
      <div className="flex flex-col pt-3 lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-5xl font-bold">Grid Manager</p>
          <p className="text-2xl font-medium pt-5">
            Fantasy F1 brought to life!
          </p>
        </div>

        {/* Image - hidden on smaller screens */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <img src={logo} alt="" className="pointer-events-none h-60" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
