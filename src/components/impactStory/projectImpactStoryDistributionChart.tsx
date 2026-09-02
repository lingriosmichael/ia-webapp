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
  coerceImpactStoryText,
  DIALOG_CHART_MAX_HEIGHT_CLASS,
  formatImpactStoryValue,
  truncateChartLabel,
  wrapChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryVerticalAxisTick } from "./impactStoryAxisTick";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import { ImpactStoryConfirmedEvidenceBadge } from "./impactStoryConfirmedEvidenceBadge";
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
const CARD_MAX_CATEGORY_LABEL_LENGTH = 24;
const DIALOG_MAX_CATEGORY_LABEL_LENGTH = 40;

export function ProjectImpactStoryDistributionChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();
  const isStatus = chart.dataKind === "status";

  const baseData = [...chart.data]
    .sort((a, b) => b.value - a.value)
    .map((datum) => {
      const rawLabel = coerceImpactStoryText(datum.label);
      // What should actually render — status text gets translated; every
      // other kind renders `label` as-is (already shortened by
      // DisplayLabelService when applicable).
      const displayLabel = isStatus
        ? translateGoalAssessmentStatus(t, rawLabel)
        : rawLabel;
      // The true, never-shortened value for tooltip/accessibility use —
      // see ProjectImpactStoryChartDatum.rawLabel's own doc comment.
      // Status data never goes through DisplayLabelService, so it's always
      // just the (translated) display text.
      const fullLabel = isStatus
        ? displayLabel
        : coerceImpactStoryText(datum.rawLabel ?? datum.label);
      return {
        rawLabel,
        displayLabel,
        fullLabel,
        value: datum.value,
      };
    });

  function renderChart(mode: "card" | "dialog") {
    const isDialog = mode === "dialog";
    const data = baseData.map((entry) => ({
      ...entry,
      label: truncateChartLabel(
        entry.displayLabel,
        isDialog
          ? DIALOG_MAX_CATEGORY_LABEL_LENGTH
          : CARD_MAX_CATEGORY_LABEL_LENGTH,
      ),
      labelLines: wrapChartLabel(entry.displayLabel, isDialog ? 26 : 18, 3),
    }));
    const rowHeight = isDialog ? 46 : 38;
    const chartHeight = Math.max(isDialog ? 280 : 100, data.length * rowHeight);

    return (
      <div
        className={isDialog ? DIALOG_CHART_MAX_HEIGHT_CLASS : undefined}
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
              width={isDialog ? 250 : 148}
              tick={
                <ImpactStoryVerticalAxisTick
                  data={data}
                  lineHeight={isDialog ? 12 : 11}
                />
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
            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              maxBarSize={isDialog ? 22 : 18}
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
                fontSize={isDialog ? 12 : 11}
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
    );
  }

  return (
    <ImpactStoryBoardCard
      title={chart.title}
      subtitle={chart.subtitle}
      note={chart.narrativeReason}
      badge={
        chart.isConfirmedEvidence ? (
          <ImpactStoryConfirmedEvidenceBadge />
        ) : undefined
      }
      expandedContent={renderChart("dialog")}
    >
      {renderChart("card")}
      <ProjectImpactStoryChartLegend
        labels={baseData.map((entry) => entry.rawLabel)}
        dataKind={chart.dataKind}
      />
    </ImpactStoryBoardCard>
  );
}
