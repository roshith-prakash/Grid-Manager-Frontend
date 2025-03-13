import { Countdown } from "@/components";
import { useGetNextRace } from "@/context/NextRaceContext";
import { useEffect } from "react";

const Landing = () => {
  // Set window title.
  useEffect(() => {
    document.title = "Home | Grid Manager";
  }, []);

  const { nextRace } = useGetNextRace();

  return (
    <div className="p-8 max-w-4xl mx-auto text-center space-y-8">
      <h1 className="text-4xl font-bold text-primary">
        Welcome to Grid Manager!
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-darkbg/70 dark:text-white/70">
        Fantasy F1 - for the fans, by the fans.
      </h2>

      {nextRace && (
        <div className="mt-10 flex flex-col items-center space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <p className="text-4xl md:text-5xl font-bold ">
            {nextRace?.raceName}
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-lg md:text-xl font-medium">
            <p className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg shadow">
              Round: <span className="font-bold">{nextRace?.round}</span>
            </p>
            <span className="hidden md:block w-px h-6 bg-gray-500"></span>
            <p className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg shadow">
              {nextRace?.Circuit?.circuitName}
            </p>
          </div>

          <p className="text-lg md:text-xl mt-5 font-medium text-gray-700 dark:text-gray-300">
            Teams will get locked in:
          </p>
          <Countdown
            targetDate={`${nextRace?.FirstPractice?.date}T${nextRace?.FirstPractice?.time}`}
          />
        </div>
      )}
    </div>
  );
};

export default Landing;
