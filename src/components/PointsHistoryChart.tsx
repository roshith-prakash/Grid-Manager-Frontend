// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart2 } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PointsEntry {
  round: number;
  raceName: string;
  session: string;
  points: number;
}

interface TeamMember {
  teamPointsHistory?: PointsEntry[];
  givenName?: string;
  familyName?: string;
  name?: string; // constructors
}

interface ChartDataPoint {
  round: number;
  raceName: string;
  shortName: string;
  pointsThisRound: number;
  cumulativePoints: number;
}

interface PointsHistoryChartProps {
  teamDrivers: TeamMember[];
  teamConstructors: TeamMember[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Shorten a race name for display on the X-axis */
const shortenRaceName = (name: string): string => {
  return name
    .replace(" Grand Prix", " GP")
    .replace("Grand Prix", "GP")
    .replace(" Formula 1", "")
    .replace("Formula 1 ", "");
};

/** Aggregate teamPointsHistory from all drivers + constructors into chart data */
const buildChartData = (
  teamDrivers: TeamMember[],
  teamConstructors: TeamMember[]
): ChartDataPoint[] => {
  const roundMap = new Map<
    number,
    { raceName: string; points: number }
  >();

  const processEntries = (entries: PointsEntry[] | undefined) => {
    if (!entries) return;
    entries.forEach(({ round, raceName, points }) => {
      const existing = roundMap.get(round);
      if (existing) {
        existing.points += points;
      } else {
        roundMap.set(round, { raceName, points });
      }
    });
  };

  teamDrivers?.forEach((d) => processEntries(d.teamPointsHistory));
  teamConstructors?.forEach((c) => processEntries(c.teamPointsHistory));

  // Sort by round and compute cumulative
  const sorted = Array.from(roundMap.entries()).sort(([a], [b]) => a - b);
  let cumulative = 0;

  return sorted.map(([round, { raceName, points }]) => {
    cumulative += points;
    return {
      round,
      raceName,
      shortName: shortenRaceName(raceName),
      pointsThisRound: points,
      cumulativePoints: cumulative,
    };
  });
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const perRace = payload.find((p: any) => p.dataKey === "pointsThisRound");
  const cumulative = payload.find(
    (p: any) => p.dataKey === "cumulativePoints"
  );
  const data = payload[0]?.payload as ChartDataPoint;

  return (
    <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-4 min-w-48">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
        Round {data?.round}
      </p>
      <p className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">
        {data?.raceName}
      </p>
      {perRace && (
        <div className="flex items-center justify-between gap-6 mb-1">
          <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: "#9b0ced" }}
            />
            Points This Race
          </span>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            {perRace.value}
          </span>
        </div>
      )}
      {cumulative && (
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: "#e040fb" }}
            />
            Total Points
          </span>
          <span className="font-bold text-cta dark:text-darkmodeCTA text-sm">
            {cumulative.value}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
    <div className="w-14 h-14 bg-cta/10 dark:bg-cta/20 rounded-full flex items-center justify-center">
      <BarChart2 className="w-7 h-7 text-cta/60 dark:text-darkmodeCTA/60" />
    </div>
    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
      No race data yet
    </p>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
      Points history will appear here after the first race weekend is scored.
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const PointsHistoryChart = ({
  teamDrivers,
  teamConstructors,
}: PointsHistoryChartProps) => {
  const chartData = buildChartData(teamDrivers, teamConstructors);
  const hasData = chartData.length > 0;

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 pt-5 pb-4 border-b border-slate-100 dark:border-white/10">
        <div className="w-8 h-8 bg-cta/10 dark:bg-cta/25 rounded-lg flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-cta dark:text-darkmodeCTA" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Points History
        </h3>
        {hasData && (
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-full">
            {chartData.length} race{chartData.length !== 1 ? "s" : ""} scored
          </span>
        )}
      </div>

      {/* Chart or empty state */}
      <div className="px-4 pt-5 pb-4">
        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* Recharts ComposedChart */}
            <div className="w-full overflow-x-auto scroller">
              <div style={{ minWidth: Math.max(chartData.length * 90, 320) }}>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#9b0ced"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#7123b0"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-white/10"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="shortName"
                      tick={{
                        fontSize: 11,
                        fill: "currentColor",
                        className: "text-slate-500 dark:text-slate-400",
                      }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={chartData.length > 6 ? -35 : 0}
                      textAnchor={chartData.length > 6 ? "end" : "middle"}
                      height={chartData.length > 6 ? 55 : 30}
                    />

                    {/* Left axis — per-race points, colored purple to match bars */}
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 11, fill: "#9b0ced" }}
                      tickLine={{ stroke: "#9b0ced", strokeWidth: 1 }}
                      axisLine={{ stroke: "#9b0ced", strokeWidth: 1 }}
                      width={52}
                      label={{
                        value: "Per Race",
                        angle: -90,
                        position: "insideLeft",
                        offset: 12,
                        style: { fill: "#9b0ced", fontSize: 11, fontWeight: 600 },
                      }}
                    />

                    {/* Right axis — cumulative total, colored pink to match line */}
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "#e040fb" }}
                      tickLine={{ stroke: "#e040fb", strokeWidth: 1 }}
                      axisLine={{ stroke: "#e040fb", strokeWidth: 1 }}
                      width={58}
                      label={{
                        value: "Total",
                        angle: 90,
                        position: "insideRight",
                        offset: 12,
                        style: { fill: "#e040fb", fontSize: 11, fontWeight: 600 },
                      }}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                      formatter={(value) =>
                        value === "pointsThisRound"
                          ? "Points This Race"
                          : "Cumulative Total"
                      }
                      wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    />

                    {/* Bars — per-race points */}
                    <Bar
                      yAxisId="left"
                      dataKey="pointsThisRound"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                      name="pointsThisRound"
                    />

                    {/* Line — cumulative total */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cumulativePoints"
                      stroke="#e040fb"
                      strokeWidth={2.5}
                      dot={{
                        fill: "#e040fb",
                        strokeWidth: 0,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#e040fb",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                      name="cumulativePoints"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Race-by-race breakdown table */}
            <div className="mt-4 border-t border-slate-100 dark:border-white/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
                Race-by-Race Breakdown
              </p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto scroller pr-1">
                {chartData.map((row) => (
                  <div
                    key={row.round}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex-shrink-0">
                        R{row.round}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                        {row.raceName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Race
                        </p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          +{row.pointsThisRound}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Total
                        </p>
                        <p className="text-sm font-bold text-cta dark:text-darkmodeCTA">
                          {row.cumulativePoints}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PointsHistoryChart;
