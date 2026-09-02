import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import {
  formatImpactStoryValue,
  truncateChartLabel,
  wrapChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryHorizontalAxisTick } from "./impactStoryAxisTick";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import { IMPACT_STORY_COLORS } from "./projectImpactStoryChartColors";

// Single-series line over ordered periods — a line is always one series
// (points on a line can't carry independent identity the way bars/wedges
// can), so this stays single-hue regardless of dataKind; per the dataviz
// skill, a single series needs no legend — the chart title already names it.
export function ProjectImpactStoryLineChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();

  if (chart.data.length === 0) {
    return null;
  }

  function renderChart(mode: "card" | "dialog") {
    const isDialog = mode === "dialog";
    const data = chart.data.map((entry) => ({
      ...entry,
      fullLabel: entry.label,
      labelLines: isDialog
        ? wrapChartLabel(entry.label, 14, 2)
        : [truncateChartLabel(entry.label, 16)],
    }));
    const rotateLabels = isDialog ? data.length >= 10 : data.length >= 6;
    const labelAngle = rotateLabels ? (isDialog ? -18 : -24) : 0;

    return (
      <div
        className={isDialog ? "h-[360px]" : "h-[205px]"}
        role="img"
        aria-label={t("impactStory.trendChartAriaLabel", {
          label: chart.title,
          summary: chart.data
            .map(
              (entry) =>
                `${entry.label}: ${formatImpactStoryValue(entry.value, chart.valueFormat, i18n.language)}`,
            )
            .join(", "),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              left: 4,
              right: isDialog ? 24 : 8,
              bottom: rotateLabels ? 16 : 4,
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
              height={rotateLabels ? (isDialog ? 72 : 56) : isDialog ? 44 : 24}
              tick={
                <ImpactStoryHorizontalAxisTick
                  data={data}
                  angle={labelAngle}
                  lineHeight={11}
                />
              }
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
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={IMPACT_STORY_COLORS.blue}
              strokeWidth={2.5}
              dot={{ fill: IMPACT_STORY_COLORS.blue, r: isDialog ? 4 : 3.5 }}
              activeDot={{ r: isDialog ? 6 : 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <ImpactStoryBoardCard
      title={chart.title}
      subtitle={chart.subtitle}
      note={chart.narrativeReason}
      expandedContent={renderChart("dialog")}
    >
      {renderChart("card")}
    </ImpactStoryBoardCard>
  );
}
