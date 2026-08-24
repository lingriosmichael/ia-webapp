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
import { translateGoalAssessmentStatus } from "@/lib/translationUtils";
import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import {
  formatImpactStoryValue,
  truncateChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import {
  IMPACT_STORY_COLORS,
  rankedBarColor,
  statusColor,
} from "./projectImpactStoryChartColors";
import { ProjectImpactStoryChartLegend } from "./projectImpactStoryChartLegend";

// Horizontal bars, ranked by size — generalizes impactStoryRankedBars.tsx
// to flat {label, value} chart-plan data. Kept as its own chart type
// ("distribution") distinct from the vertical "bar" chart: horizontal bars
// keep long category/activity labels legible without rotation, which
// matters more here since this chart's categories are LLM-selected and can
// be longer than a fixed indicator's own bucket labels.
// Sized for a 150px YAxis column at 12px font: long enough to stay
// meaningful, short enough that even the widest German compound words in
// practice (activity/survey names) render as one line, never wrapping into
// the next category's row.
const MAX_CATEGORY_LABEL_LENGTH = 24;

export function ProjectImpactStoryDistributionChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();
  const isStatus = chart.dataKind === "status";

  const data = [...chart.data]
    .sort((a, b) => b.value - a.value)
    .map((datum) => {
      const fullLabel = isStatus
        ? translateGoalAssessmentStatus(t, datum.label)
        : datum.label;
      return {
        rawLabel: datum.label,
        fullLabel,
        label: truncateChartLabel(fullLabel, MAX_CATEGORY_LABEL_LENGTH),
        value: datum.value,
      };
    });

  const chartHeight = Math.max(100, data.length * 32);

  return (
    <ImpactStoryBoardCard
      title={chart.title}
      subtitle={chart.subtitle}
      note={chart.narrativeReason}
    >
      <div
        className=""
        style={{ height: chartHeight }}
        role="img"
        aria-label={t("impactStory.distributionChartAriaLabel", {
          label: chart.title,
          summary: data
            .map(
              (entry) =>
                `${entry.fullLabel}: ${formatImpactStoryValue(entry.value, chart.valueFormat, i18n.language)}`,
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
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: IMPACT_STORY_COLORS.inkFaint }}
              tickFormatter={(value: number) =>
                formatImpactStoryValue(value, chart.valueFormat, i18n.language)
              }
            />
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
                (payload?.[0]?.payload as { fullLabel?: string } | undefined)
                  ?.fullLabel ?? ""
              }
              formatter={(value: ValueType | undefined) =>
                typeof value === "number"
                  ? [
                      formatImpactStoryValue(
                        value,
                        chart.valueFormat,
                        i18n.language,
                      ),
                      chart.title,
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
              {data.map((entry, index) => (
                <Cell
                  key={entry.rawLabel}
                  fill={
                    chart.dataKind === "status"
                      ? statusColor(entry.rawLabel)
                      : rankedBarColor(index, chart.dataKind, chart.chartId)
                  }
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={11}
                fontWeight={600}
                formatter={(value: unknown) =>
                  typeof value === "number"
                    ? formatImpactStoryValue(
                        value,
                        chart.valueFormat,
                        i18n.language,
                      )
                    : ""
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ProjectImpactStoryChartLegend
        labels={data.map((entry) => entry.rawLabel)}
        dataKind={chart.dataKind}
      />
    </ImpactStoryBoardCard>
  );
}
