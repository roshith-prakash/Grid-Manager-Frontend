import { changeCost } from "@/constants/constants";
import { useEffect } from "react";

const FAQ = () => {
  //  Page Title
  useEffect(() => {
    document.title = "FAQ & How to Play | Grid Manager";
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto text-left space-y-8">
      <h1 className="text-4xl py-4 font-bold text-primary text-center">
        FAQ & How to Play
      </h1>

      {/* What is Grid Manager? */}
      <section className="space-y-6 mt-16">
        <h2 className="text-2xl font-semibold">What is Grid Manager?</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Grid Manager is a Fantasy F1 platform designed for fans, by fans.
          Create your dream team, compete with friends, and strategize to become
          the best manager on the grid!
        </p>
      </section>

      {/* How to Play */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">How to Play?</h2>
        <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            You can create or join up to{" "}
            <span className="font-bold">5 leagues</span>.
          </li>
          <li>
            Each league allows you to create up to{" "}
            <span className="font-bold">2 teams</span>.
          </li>
          <li>Pick your drivers and team within the budget constraints.</li>
          <li>
            Your team can be updated as many times as you like before the first
            race. After the first race, you can make{" "}
            <span className="font-bold">2 free changes per week</span>. Any
            additional change will cost{" "}
            <span className="font-bold">{changeCost} points</span>.
          </li>
          <li>Earn points based on real-world race performances.</li>
          <li>Compete with other players in your leagues for the top spot!</li>
        </ul>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium">
              Can I change my team after creating it?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Yes, you can make unlimited changes before the first race.
              Afterwards, you're allowed 2 free changes per week. Any extra
              changes will cost {changeCost} points each.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              When is the deadline for changes?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Drivers and constructors in a team can be swapped before the race
              weekend starts (i.e. before the First Practice session).
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">How are points calculated?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Points are based on real F1 race performances, including Grand
              Prix finishing positions, qualifying, and sprints.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              What happens if I leave a league?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              To leave a league you created, you must delete the league. To
              leave a league you did not create, delete all your teams in that
              league. Once a league / team is deleted, it cannot be recovered.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              What happens to the scoring history of removed drivers or
              constructors?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              The scoring history for a specific driver or constructor is
              removed once they are removed from the team. However, the points
              they contributed while in the team will still count.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
