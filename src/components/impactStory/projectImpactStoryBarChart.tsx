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
import { ImpactStoryExploratoryBadge } from "./impactStoryExploratoryBadge";
import {
  IMPACT_STORY_COLORS,
  verticalBarColor,
} from "./projectImpactStoryChartColors";
import { ProjectImpactStoryChartLegend } from "./projectImpactStoryChartLegend";

// Shorter than the distribution chart's cap: a vertical column has far less
// horizontal room per label than a horizontal row does, especially once
// several bars share the width — see truncateChartLabel's doc comment.
const MAX_CATEGORY_LABEL_LENGTH = 18;

// Vertical bars — used for "bar" (breakdown of a single measure) and
// "comparison" (the same measure across activities). All bars share one
// hue unless dataKind is "status" (a genuine per-bar identity), per
// "color follows the entity, never its rank."
export function ProjectImpactStoryBarChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();
  const isStatus = chart.dataKind === "status";

  const data = chart.data.map((datum) => {
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

  // Chart-type selection (bar vs. the horizontal "distribution" chart) is an
  // LLM judgment call and not a hard guarantee, so this rotates defensively
  // — 3 bars is exactly the count where the model is instructed to prefer
  // "distribution" instead, but a vertical bar chart with 3 categories can
  // still be selected, and text must never overlap regardless.
  const rotateLabels = data.length >= 3;

  return (
    <ImpactStoryBoardCard
      title={chart.title}
      subtitle={chart.subtitle}
      note={chart.narrativeReason}
      badge={chart.isExploratory ? <ImpactStoryExploratoryBadge /> : undefined}
    >
      <div
        className="h-[220px]"
        role="img"
        aria-label={t("impactStory.barChartAriaLabel", {
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
            margin={{
              left: 4,
              right: 8,
              top: 20,
              bottom: rotateLabels ? 24 : 0,
            }}
          >
            <CartesianGrid
              stroke={IMPACT_STORY_COLORS.lineSoft}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={rotateLabels ? -30 : 0}
              textAnchor={rotateLabels ? "end" : "middle"}
              height={rotateLabels ? 52 : 20}
              tick={{ fontSize: 10, fill: IMPACT_STORY_COLORS.inkSoft }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: IMPACT_STORY_COLORS.inkFaint }}
              tickFormatter={(value: number) =>
                formatImpactStoryValue(value, chart.valueFormat, i18n.language)
              }
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
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={34}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.rawLabel}
                  fill={verticalBarColor({
                    index,
                    rawLabel: entry.rawLabel,
                    dataKind: chart.dataKind,
                    chartType:
                      chart.chartType === "comparison" ? "comparison" : "bar",
                    chartId: chart.chartId,
                  })}
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
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
