import { ContextValue, useDarkMode } from "@/context/DarkModeContext";

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
        <p className="text-xl font-medium">Let's Talk!</p>
        <button className="flex cursor-pointer items-center gap-x-2 rounded-full border-2 border-white px-5 py-2 font-medium text-white transition-all hover:bg-white hover:text-black">
          Click Me !
        </button>
      </div>

      {/* Main Footer section */}
      <div className="flex flex-col pt-3 lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center">
          Add your content here
        </div>

        {/* Image - hidden on smaller screens */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <img
            src={
              "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736843158/logodark_gs3pnp.png"
            }
            alt=""
            className="er-events-none h-60"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
