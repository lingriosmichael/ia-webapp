import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type {
  ProjectImpactStoryGoalProgressEntry,
  ProjectImpactStoryGoalStatus,
} from "@/services/apiClient";
import {
  formatImpactStoryValue,
  truncateChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import {
  goalProgressStatusColor,
  IMPACT_STORY_COLORS,
} from "./projectImpactStoryChartColors";

// Deterministic, always-rendered counterpart to the LLM-selected chart plan
// — see projectImpactStoryPage.tsx, which shows this whenever
// goalProgressEntries is non-empty, independent of whatever the chart plan
// selected this run. Every entry already carries a resolved measuredValue/
// targetValue (see projectImpactStoryGoalProgress.ts on the backend), so
// unlike the ranked/distribution charts elsewhere on this page, color here
// is a genuine status signal (good/warn/risk), not rank — per the collision
// rule, a series that means good/bad wears status tokens, never a
// sequential ramp.
const MAX_CATEGORY_LABEL_LENGTH = 24;

const STATUS_LEGEND_ORDER: ProjectImpactStoryGoalStatus[] = [
  "good",
  "warn",
  "risk",
];

export function ProjectImpactStoryGoalProgressChart({
  entries,
}: {
  entries: ProjectImpactStoryGoalProgressEntry[];
}) {
  const { t, i18n } = useTranslation();

  const data = [...entries]
    .sort((a, b) => b.progressPercent - a.progressPercent)
    .map((entry) => ({
      entryId: entry.entryId,
      fullLabel: entry.label,
      label: truncateChartLabel(entry.label, MAX_CATEGORY_LABEL_LENGTH),
      activityName: entry.activityName,
      value: entry.progressPercent / 100,
      status: entry.status,
    }));

  const chartHeight = Math.max(100, data.length * 32);
  const statusLabel = (status: ProjectImpactStoryGoalStatus) =>
    t(
      `impactStory.goalProgressStatus${status[0]!.toUpperCase()}${status.slice(1)}`,
    );
  const presentStatuses = STATUS_LEGEND_ORDER.filter((status) =>
    data.some((entry) => entry.status === status),
  );

  return (
    <ImpactStoryBoardCard
      title={t("impactStory.goalProgressChartTitle")}
      subtitle={t("impactStory.goalProgressChartSubtitle")}
    >
      <div
        style={{ height: chartHeight }}
        role="img"
        aria-label={t("impactStory.goalProgressAriaLabel", {
          summary: data
            .map(
              (entry) =>
                `${entry.fullLabel}: ${formatImpactStoryValue(entry.value, "percentage", i18n.language)}`,
            )
            .join(", "),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 4, right: 36 }}
          >
            <CartesianGrid
              stroke={IMPACT_STORY_COLORS.lineSoft}
              horizontal={false}
            />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={126}
              tick={{ fontSize: 10, fill: IMPACT_STORY_COLORS.inkSoft }}
            />
            <Tooltip
              labelFormatter={(_, payload) =>
                (
                  payload?.[0]?.payload as
                    { fullLabel?: string; activityName?: string } | undefined
                )?.fullLabel ?? ""
              }
              formatter={(value: ValueType | undefined) =>
                typeof value === "number"
                  ? [
                      formatImpactStoryValue(
                        value,
                        "percentage",
                        i18n.language,
                      ),
                      t("impactStory.goalProgressChartTitle"),
                    ]
                  : ""
              }
              cursor={{ fill: IMPACT_STORY_COLORS.lineSoft }}
            />
            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              barSize={18}
              background={{
                fill: IMPACT_STORY_COLORS.lineSoft,
                radius: 8,
              }}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.entryId}
                  fill={goalProgressStatusColor(entry.status)}
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={10}
                formatter={(value: unknown) =>
                  typeof value === "number"
                    ? formatImpactStoryValue(value, "percentage", i18n.language)
                    : ""
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {presentStatuses.map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: goalProgressStatusColor(status) }}
              aria-hidden="true"
            />
            <span className="text-[0.72rem] leading-[1.4] text-muted-foreground">
              {statusLabel(status)}
            </span>
          </div>
        ))}
      </div>
    </ImpactStoryBoardCard>
  );
}
