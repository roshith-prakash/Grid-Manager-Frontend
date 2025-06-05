import { Countdown, PrimaryButton, SecondaryButton } from "@/components";
import { useGetNextRace } from "@/context/NextRaceContext";
import { useEffect } from "react";
import { useDBUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, Zap, Target, Calendar, MapPin } from "lucide-react";

import f1car from "@/assets/aston-1.png";

const Landing = () => {
  const { nextRace } = useGetNextRace();
  const { dbUser } = useDBUser();
  const navigate = useNavigate();

  // Set window title.
  useEffect(() => {
    document.title = "Home | Grid Manager";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br f">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cta/10 via-transparent to-blue-500/10"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-cta/10 dark:bg-cta/50 text-cta dark:text-white rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Fantasy F1 Platform
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-slate-800  to-cta dark:from-white dark:via-cta dark:to-cta  bg-clip-text text-transparent leading-tight">
                  Grid Manager
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl">
                  The ultimate fantasy F1 experience. Build your dream team,
                  compete with friends, and dominate the championship.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {dbUser ? (
                  <PrimaryButton
                    text="Enter the Grid"
                    onClick={() => navigate("/leagues")}
                  />
                ) : (
                  <PrimaryButton
                    onClick={() => navigate("/signup")}
                    text="Start Racing"
                  />
                )}
                <SecondaryButton
                  onClick={() => navigate("/faq")}
                  text="Learn More"
                />
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>5 Leagues</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Real Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>2 Free Changes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cta/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative">
                <img
                  src={f1car || "/placeholder.svg"}
                  className="w-full max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500"
                  alt="F1 Car"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Grid Manager?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Made by F1 fans for F1 fans — built for pure racing excitement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Real Scoring
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Points based on real F1 race results—qualifying, sprints &
                races.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Leagues
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Join or create up to 5 leagues. Compete with friends or the
                world.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Strategy
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Balance budgets, manage transfers, and plan every race.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Race Section */}
      {nextRace && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Next Race Weekend
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Get your team ready before the deadline
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-8 lg:p-12 border border-slate-200 dark:border-slate-700">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                      {nextRace.raceName}
                    </h3>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-6 py-3 rounded-xl">
                        <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        <span className="font-semibold">
                          Round {nextRace.round}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-6 py-3 rounded-xl">
                        <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        <span className="font-semibold">
                          {nextRace.Circuit?.circuitName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                      Team Lock-in Countdown
                    </p>
                    <div className="bg-slate-900 text-darkmodetext dark:bg-slate-950 rounded-2xl p-6">
                      <Countdown
                        targetDate={`${nextRace.FirstPractice?.date}T${nextRace.FirstPractice?.time}`}
                      />
                    </div>
                  </div>

                  <a
                    href="https://gridbox.vercel.app/schedule"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-semibold text-cta  hover:text-hovercta  dark:hover:text-cta transition-all "
                  >
                    <Calendar className="w-5 h-5 -translate-y-0.5" />
                    View Full Season Schedule
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold ">
              Ready to Build Your Championship Team?
            </h2>
            <p className="text-xl ">
              Join thousands of F1 fans competing in the most authentic fantasy
              racing experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!dbUser && (
                <PrimaryButton
                  text="Start Your Journey"
                  className="py-2.5"
                  onClick={() => navigate("/signup")}
                ></PrimaryButton>
              )}
              <SecondaryButton
                text="Learn How It Works"
                className="py-2.5"
                onClick={() => navigate("/faq")}
              ></SecondaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
