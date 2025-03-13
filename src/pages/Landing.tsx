import { useEffect } from "react";

const Landing = () => {
  // Set window title.
  useEffect(() => {
    document.title = "Home | Grid Manager";
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center">
        Welcome to Grid Manager
      </h1>

      <div className="grid gap-6 mt-6">
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold">About Grid Manager</h2>
          <p className="text-gray-600 mt-2">
            Grid Manager is your go-to F1 fantasy app, allowing you to
            experience the thrill of Formula 1 in a whole new way. Create your
            dream team, track race performances, and engage with a community of
            F1 enthusiasts.
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold">How It Works</h2>
          <p className="text-gray-600 mt-2">
            Choose your drivers and teams based on real-world F1 events. Your
            team's performance is determined by actual race results, strategy
            choices, and in-game scoring metrics.
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold">Stay Updated</h2>
          <p className="text-gray-600 mt-2">
            Keep track of the latest race schedules, team news, and driver
            insights to make the best decisions for your fantasy team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
