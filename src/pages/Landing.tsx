import { Countdown, PrimaryButton } from "@/components";
import { useGetNextRace } from "@/context/NextRaceContext";
import { useEffect } from "react";
import f1car from "@/assets/aston.png";
import { useDBUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { nextRace } = useGetNextRace();
  const { dbUser } = useDBUser();
  const navigate = useNavigate();

  // Set window title.
  useEffect(() => {
    document.title = "Home | Grid Manager";
  }, []);

  return (
    <>
      <div className="flex py-24 lg:py-10 lg:min-h-[80vh] flex-col lg:flex-row items-center">
        <div className="flex-1 px-10 flex gap-y-2 flex-col justify-center">
          <h1 className="text-6xl text-center lg:text-left font-semibold">
            Grid Manager
          </h1>
          <p className="text-3xl text-center lg:text-left px-1">
            Fantasy F1 - for the fans, by the fans.
          </p>
          {dbUser ? (
            <PrimaryButton
              text="Let's get started!"
              className="mt-6 mx-auto lg:mx-0"
              onClick={() => navigate("/leagues")}
            />
          ) : (
            <PrimaryButton
              onClick={() => navigate("/signup")}
              text="Sign up"
              className="mt-6 mx-auto lg:mx-0"
            />
          )}
        </div>
        <div className="flex-1">
          <img src={f1car} className="" alt="F1 Car" />
        </div>
      </div>
      <div className="p-8 max-w-4xl mx-auto text-center space-y-8">
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

            <a
              href={`https://gridbox.vercel.app/schedule`}
              target="_blank"
              rel="noreferrer"
              className="pt-5 text-xl cursor-pointer hover:underline"
            >
              Check out the schedule!
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default Landing;
