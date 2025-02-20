import { ContextValue, useDarkMode } from "@/context/DarkModeContext";

const Landing = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode() as ContextValue;
  return (
    <div className="min-h-screen">
      <button className="my-5 mx-5" onClick={toggleDarkMode}>
        Toggle {isDarkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
};

export default Landing;
