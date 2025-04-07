import { Countdown, PrimaryButton, SecondaryButton } from "@/components";
import { useGetNextRace } from "@/context/NextRaceContext";
import { useEffect } from "react";
import { useDBUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

import f1car from "@/assets/aston.png";

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
      {/* Hero Section */}
      <div className="flex py-24 lg:py-10 lg:min-h-[80vh] overflow-hidden flex-col xl:flex-row items-center">
        <div className="flex-1 px-10 flex gap-y-2 flex-col justify-center">
          <h1 className="text-6xl text-center xl:text-left font-semibold">
            Grid Manager
          </h1>
          <p className="text-3xl text-center xl:text-left px-1">
            Fantasy F1 - for the fans, by the fans.
          </p>
          <div className="flex mt-6 justify-center items-center xl:justify-start gap-x-4">
            {dbUser ? (
              <PrimaryButton
                text="Let's get started!"
                onClick={() => navigate("/leagues")}
              />
            ) : (
              <PrimaryButton
                onClick={() => navigate("/signup")}
                text="Sign up"
              />
            )}

            <SecondaryButton
              onClick={() => navigate("/faq")}
              text="Know more"
            />
          </div>
        </div>
        <div className="flex-1">
          <img
            src={f1car}
            className=" w-[50rem] scale-[1.75] ml-[40%] lg:ml-[30%] "
            alt="F1 Car"
          />
        </div>
      </div>

      {/* Next Race */}
      <div className="p-8 max-w-4xl mx-auto text-center">
        {nextRace && (
          <section className="mt-5">
            <div className=" flex flex-col items-center space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md">
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
          </section>
        )}
      </div>
    </>
  );
};

export default Landing;
