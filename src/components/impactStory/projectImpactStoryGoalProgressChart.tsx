import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  coerceImpactStoryText,
  DIALOG_CHART_MAX_HEIGHT_CLASS,
  formatImpactStoryValue,
  truncateChartLabel,
  wrapChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryVerticalAxisTick } from "./impactStoryAxisTick";
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

// IMPACT_STORY_CHART_IMPROVEMENT_PLAN.md §1: caps the chart so a
// large/messy project doesn't render one illegible wall of bars. Chosen
// from the plan's suggested 8–10 range — the lower end keeps the default
// view compact; a reader who wants the rest expands in place rather than
// losing anything (see showAll below), so there's no real cost to
// starting conservative.
const DEFAULT_VISIBLE_COUNT = 8;

// Worst-first: a goal needing attention should never require scrolling
// past a wall of already-achieved goals to find. requires_clarification/
// requires_capability goals never reach this chart at all (they have no
// resolvable measuredValue/target to plot — filtered out upstream in
// buildProjectImpactStoryGoalProgressEntries), so "good"/"warn"/"risk" is
// the complete set of statuses this ordering ever has to handle.
const STATUS_PRIORITY: Record<ProjectImpactStoryGoalStatus, number> = {
  risk: 0,
  warn: 1,
  good: 2,
};

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
  const [showAll, setShowAll] = useState(false);

  const sortedData = [...entries]
    .sort((a, b) => {
      const statusDelta = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      return statusDelta !== 0
        ? statusDelta
        : a.progressPercent - b.progressPercent;
    })
    .map((entry) => {
      const fullLabel = coerceImpactStoryText(entry.label, entry.activityName);
      const displayLabel = coerceImpactStoryText(entry.displayLabel, fullLabel);

      return {
        entryId: entry.entryId,
        // fullLabel is always the real, verbatim goal text — the tooltip
        // must show it regardless of whether a short displayLabel exists,
        // so a reader can never lose access to the exact original wording.
        fullLabel,
        displayLabel,
        label: truncateChartLabel(displayLabel, MAX_CATEGORY_LABEL_LENGTH),
        activityName: entry.activityName,
        value: entry.progressPercent / 100,
        status: entry.status,
      };
    });

  const hiddenCount = sortedData.length - DEFAULT_VISIBLE_COUNT;
  const data =
    showAll || hiddenCount <= 0
      ? sortedData
      : sortedData.slice(0, DEFAULT_VISIBLE_COUNT);
  const statusLabel = (status: ProjectImpactStoryGoalStatus) =>
    t(
      `impactStory.goalProgressStatus${status[0]!.toUpperCase()}${status.slice(1)}`,
    );
  const presentStatuses = STATUS_LEGEND_ORDER.filter((status) =>
    sortedData.some((entry) => entry.status === status),
  );

  function renderChart(mode: "card" | "dialog") {
    const isDialog = mode === "dialog";
    const visibleData = isDialog ? sortedData : data;
    const chartData = visibleData.map((entry) => ({
      ...entry,
      labelLines: wrapChartLabel(entry.displayLabel, isDialog ? 24 : 18, 2),
    }));
    const chartHeight = Math.max(
      isDialog ? 260 : 100,
      chartData.length * (isDialog ? 42 : 38),
    );

    return (
      <div
        className={isDialog ? DIALOG_CHART_MAX_HEIGHT_CLASS : undefined}
        style={{ height: chartHeight }}
        role="img"
        aria-label={t("impactStory.goalProgressAriaLabel", {
          summary: chartData
            .map(
              (entry) =>
                `${entry.fullLabel}: ${formatImpactStoryValue(entry.value, "percentage", i18n.language)}`,
            )
            .join(", "),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: 4,
              right: isDialog ? 44 : 36,
              top: isDialog ? 10 : 4,
              bottom: isDialog ? 10 : 4,
            }}
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
              width={isDialog ? 220 : 148}
              tick={
                <ImpactStoryVerticalAxisTick
                  data={chartData}
                  lineHeight={isDialog ? 12 : 11}
                />
              }
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
              maxBarSize={isDialog ? 22 : 18}
              background={{
                fill: IMPACT_STORY_COLORS.lineSoft,
                radius: 8,
              }}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.entryId}
                  fill={goalProgressStatusColor(entry.status)}
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={isDialog ? 12 : 10}
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
    );
  }

  return (
    <ImpactStoryBoardCard
      title={t("impactStory.goalProgressChartTitle")}
      subtitle={t("impactStory.goalProgressChartSubtitle")}
      expandedContent={renderChart("dialog")}
    >
      {renderChart("card")}
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
      {hiddenCount > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 h-auto px-0 py-0 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-signal"
          onClick={() => setShowAll((current) => !current)}
        >
          {showAll
            ? t("impactStory.goalProgressShowLess")
            : t("impactStory.goalProgressShowMore", { count: hiddenCount })}
        </Button>
      ) : null}
    </ImpactStoryBoardCard>
  );
}
