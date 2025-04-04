import newlogo from "@/assets/newlogo-dark.png";

const Footer = () => {
  return (
    <footer
      className={`bg-secondarydarkbg border-darkmodetext border-t-2 font-inter min-h-50vh px-010 relative mt-20 pt-36 pb-20 text-white`}
    >
      {/* Floating Div */}
      <div className="border-darkmodetext absolute -top-16 left-1/2 flex h-32 w-[90vw] -translate-x-1/2 items-center justify-around rounded-lg bg-[#1f1e1e] text-white lg:w-[80vw] border-2">
        <p className="text-xl px-5 text-center font-medium">
          Grid Manager - Fantasy F1 for the fans, by the fans!
        </p>
      </div>

      {/* Main Footer section */}
      <div className="flex  flex-col-reverse items-center justify-center pt-3 lg:flex-row">
        <div className="flex lg:flex-1 flex-col items-center justify-center">
          <p className="hidden lg:block text-5xl font-bold">Grid Manager</p>
          <p className="text-2xl font-medium text-center pt-5">
            Experience the thrill of Fantasy F1 like never before!
          </p>
        </div>

        {/* Image - hidden on smaller screens */}
        <div className="lg:flex-1 items-center justify-center lg:flex">
          <img
            src={newlogo}
            alt="Grid Manager"
            className="pointer-events-none h-72"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
