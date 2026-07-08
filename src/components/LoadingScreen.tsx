import { Zap } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bgwhite dark:bg-darkbg text-slate-900 dark:text-white">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-16 h-16 bg-cta/10 dark:bg-cta/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(155,12,237,0.3)]">
          <Zap className="w-8 h-8 text-cta" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cta dark:from-white dark:via-cta dark:to-cta bg-clip-text text-transparent">
          Grid Manager
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase text-sm">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
