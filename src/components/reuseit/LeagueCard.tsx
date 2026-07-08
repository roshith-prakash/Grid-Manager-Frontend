import { Link } from "react-router-dom";
import { Users, Shield } from "lucide-react";
import Avatar from "./Avatar";

interface LeagueCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  league: any;
}

export default function LeagueCard({ league }: LeagueCardProps) {
  return (
    <div className="max-w-sm min-w-[280px] mx-auto w-full">
      <Link
        to={`/leagues/${league.leagueId}`}
        className="group relative block bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-white/10 p-6 transition-all hover:shadow-2xl hover:-translate-y-1 hover:border-cta/50 shadow-md dark:hover:border-darkmodeCTA/50 overflow-hidden duration-300"
      >
        <div className="relative z-10 space-y-5">
          {/* League Info */}
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors line-clamp-2">
                {league.name}
              </h3>
              {league.private && (
                <div
                  className="bg-slate-100 dark:bg-white/10 p-1.5 rounded-lg"
                  title="Private League"
                >
                  <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <span className="font-semibold">ID:</span>
                <span className="font-mono font-bold bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-md shadow-sm">
                  {league.leagueId}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Users className="w-4 h-4" />
                <span className="font-semibold">
                  {league.numberOfTeams} teams
                </span>
              </div>
            </div>
          </div>

          {/* League Creator */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10">
            <Link
              to={`/user/${league.User?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl p-2 -m-2 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10 group/author"
            >
              <div>
                <Avatar
                  className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm group-hover/author:border-cta dark:group-hover/author:border-darkmodeCTA transition-colors"
                  imageSrc={league?.User?.photoURL}
                  fallBackText={league?.User?.name}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 dark:text-white truncate group-hover/author:text-cta dark:group-hover/author:text-darkmodeCTA transition-colors">
                  {league.User?.name}
                </p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  @{league.User?.username}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Hover Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cta to-hovercta dark:from-darkmodeCTA dark:to-cta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl z-20"></div>

        {/* Subtle Background Glow */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cta/5 dark:bg-darkmodeCTA/5 rounded-full blur-3xl group-hover:bg-cta/10 dark:group-hover:bg-darkmodeCTA/10 transition-colors duration-500 pointer-events-none"></div>
      </Link>
    </div>
  );
}
