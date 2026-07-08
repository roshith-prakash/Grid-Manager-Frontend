import { Calendar, ChevronDown, ChevronUp, Edit3, Hash, Trash2, Trophy, Users } from "lucide-react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../utils/axiosInstance";
import PointsHistoryChart from "../PointsHistoryChart";

// ─── Inline chart for Points History ───
const InlineTeamChart = ({ teamId }: { teamId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["team-chart", teamId],
    queryFn: () => axiosInstance.post("/team/get-team-by-id", { teamId }),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="mt-3 rounded-2xl border border-slate-200 dark:border-white/10 p-6 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-40 mb-4" />
        <div className="h-40 bg-slate-100 dark:bg-white/5 rounded-xl" />
      </div>
    );
  }

  const team = data?.data?.team;
  if (!team) return null;

  return (
    <div className="mt-3">
      <PointsHistoryChart
        teamDrivers={team.teamDrivers ?? []}
        teamConstructors={team.teamConstructors ?? []}
      />
    </div>
  );
};

interface TeamCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  team: any;
  isOwner?: boolean;
  hasWeekendStarted?: boolean;
  onEdit?: (teamId: string) => void;
  onDelete?: (teamId: string) => void;
  onClick?: (teamId: string) => void;
  isChartExpanded?: boolean;
  onToggleChart?: (teamId: string) => void;
}

export default function TeamCard({
  team,
  isOwner = false,
  hasWeekendStarted = false,
  onEdit,
  onDelete,
  onClick,
  isChartExpanded = false,
  onToggleChart,
}: TeamCardProps) {
  return (
    <div className="max-w-sm min-w-[280px] mx-auto w-full">
      <div
        className="group bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-white/10 p-6 transition-all hover:shadow-2xl hover:-translate-y-1 hover:border-cta/50 shadow-md dark:hover:border-darkmodeCTA/50 cursor-pointer relative overflow-hidden duration-300"
        onClick={() => onClick?.(team?.id)}
      >
        {/* Action Buttons - Desktop (hover) */}
        {isOwner && (
          <div className="absolute z-20 top-4 right-4 hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              disabled={hasWeekendStarted}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(team?.id);
              }}
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 cursor-pointer border border-slate-100 dark:border-slate-700"
              title={
                hasWeekendStarted
                  ? "Race weekend has started. Teams cannot be edited."
                  : "Edit team"
              }
            >
              <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(team?.id);
              }}
              className="w-9 h-9 cursor-pointer rounded-xl bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:bg-red-50 dark:hover:bg-red-900/30 border border-slate-100 dark:border-slate-700"
              title="Delete team"
            >
              <Trash2 className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400" />
            </button>
          </div>
        )}

        {/* Team Header */}
        <div className="relative mb-5 z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cta/20 to-cta/5 dark:from-darkmodeCTA/30 dark:to-darkmodeCTA/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Trophy className="w-7 h-7 text-cta dark:text-darkmodeCTA" />
            </div>
            <h3 className="text-xl line-clamp-1 font-extrabold text-slate-900 dark:text-white group-hover:text-cta dark:group-hover:text-darkmodeCTA transition-colors">
              {team?.name}
            </h3>
          </div>
        </div>

        {/* Points Display */}
        <div className="relative z-10 mb-5">
          <div className="bg-slate-50/80 dark:bg-black/40 rounded-xl p-4 border border-slate-100 dark:border-white/5 group-hover:border-cta/20 dark:group-hover:border-darkmodeCTA/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Total Points
              </span>
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 group-hover:from-cta group-hover:to-hovercta dark:group-hover:from-darkmodeCTA dark:group-hover:to-cta transition-all">
                {team?.score}
              </span>
            </div>
          </div>
        </div>

        {/* League Information */}
        <div className="relative z-10 space-y-3 mb-5 px-1">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              League:
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {team?.League?.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              ID:
            </span>
            <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-md shadow-sm">
              {team?.League?.leagueId}
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Updated {dayjs(new Date(team?.updatedAt)).format("MMM DD, YYYY")}
            </span>
          </div>
        </div>

        {/* Action Buttons - Mobile (always visible) */}
        {isOwner && (
          <div className="flex lg:hidden gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-white/10">
            <button
              disabled={hasWeekendStarted}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(team?.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold border border-slate-200 dark:border-white/10"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(team?.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors font-bold border border-slate-200 dark:border-white/10"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}

        {/* Hover Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cta to-hovercta dark:from-darkmodeCTA dark:to-cta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl z-20"></div>
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cta/5 dark:bg-darkmodeCTA/5 rounded-full blur-3xl group-hover:bg-cta/10 dark:group-hover:bg-darkmodeCTA/10 transition-colors duration-500"></div>
      </div>

      {/* Points History toggle button (Only available if onToggleChart is passed, meaning it's the owner's view usually) */}
      {onToggleChart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleChart(team?.id);
          }}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#151515] hover:bg-cta/5 dark:hover:bg-cta/10 hover:border-cta/30 text-slate-600 dark:text-slate-400 hover:text-cta dark:hover:text-darkmodeCTA transition-all text-sm font-extrabold shadow-sm"
        >
          {isChartExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
          Points History
        </button>
      )}

      {/* Inline Points History Chart */}
      {isChartExpanded && <InlineTeamChart teamId={team?.id} />}
    </div>
  );
}
