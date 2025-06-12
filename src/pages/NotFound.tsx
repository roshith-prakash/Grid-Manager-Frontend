import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Trophy } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Page Not Found | Grid Manager";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[12rem] md:text-[16rem] font-bold text-slate-200 dark:text-slate-700 leading-none select-none">
            404
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Looks like you've taken a wrong turn on the track. The page you're
            looking for doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5   text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-cta hover:bg-hovercta text-white rounded-lg transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          <button
            onClick={() => navigate("/leagues")}
            className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5   text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium"
          >
            <Trophy className="w-5 h-5" />
            View Leagues
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/leagues")}
              className="text-left cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                Leagues
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Browse and join leagues
              </div>
            </button>

            <button
              onClick={() => navigate("/leaderboard")}
              className="text-left cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                Leaderboard
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                View top teams and drivers
              </div>
            </button>

            <button
              onClick={() => navigate("/create-league")}
              className="text-left cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                Create League
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Start your own competition
              </div>
            </button>

            <button
              onClick={() => navigate("/faq")}
              className="text-left cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                FAQ
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Get help and answers
              </div>
            </button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          If you believe this is an error, please contact support or try
          refreshing the page.
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
