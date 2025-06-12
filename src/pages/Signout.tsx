import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { LogOut, ArrowLeft, AlertTriangle } from "lucide-react";

const Signout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Sign out | Grid Manager";
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md mx-auto">
        {/* Card Container */}
        <div className="bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-slate-200 dark:border-white/5 p-8 text-center">
          {/* Icon */}
          <div className="w-14 h-14 bg-cta/10 dark:bg-cta/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 -translate-y-0.5 text-cta dark:cta" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Sign Out Confirmation
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Are you sure you want to sign out of your Grid Manager account?
            You'll need to sign in again to access your teams and leagues.
          </p>

          {/* Image */}
          <div className="mb-8">
            <img
              src="https://res.cloudinary.com/do8rpl9l4/image/upload/v1736741825/signout_xm5pl2.svg"
              alt="Sign out illustration"
              className="max-w-[60%] mx-auto pointer-events-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-cta hover:bg-hovercta text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your data will be saved and available when you sign back in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signout;
