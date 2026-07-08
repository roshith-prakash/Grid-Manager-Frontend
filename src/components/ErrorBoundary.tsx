import React, { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import PrimaryButton from "./reuseit/PrimaryButton";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bgwhite dark:bg-darkbg flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              We're sorry, but an unexpected error occurred. Please try refreshing the page.
            </p>
            <PrimaryButton 
              text="Refresh Page"
              onClick={() => window.location.reload()}
              className="w-full justify-center"
            />
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl text-left w-full overflow-auto text-xs text-red-600 dark:text-red-400 font-mono">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
