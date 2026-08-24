import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { ImpactCatalogEntry } from "@/services/apiClient";
import {
  formatImpactStoryValue,
  truncateChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import { IMPACT_STORY_COLORS } from "./projectImpactStoryChartColors";

// One card per pair keeps every pair's own subtitle and source visible, but
// doesn't scale: five confirmed before/after outcomes means five cards of
// grid space before any other chart type gets a slot. This groups every
// confirmed paired_delta entry into one clustered bar chart instead —
// Vorher/Nachher becomes a two-series legend shared across all pairs, and
// each pair's own outcomeStatement/source move into that pair's tooltip
// rather than a per-card footer. Confirmed impactCatalog entries only (see
// projectImpactStoryPage.tsx) — an LLM-selected, possibly-exploratory
// chartPlan "comparison" chart still renders as its own card via
// ProjectImpactStoryChart, since it carries different evidentiary weight
// and must stay visually distinct.
// Shares a half-width grid column with every other chart card (see
// projectImpactStoryPage.tsx) — shorter than a plain single-series bar
// chart's own cap (18) since each category here is a two-bar cluster, not
// one bar, so there's less horizontal room per label.
const MAX_CATEGORY_LABEL_LENGTH = 16;

export function ProjectImpactStoryPairedDeltaGroupChart({
  entries,
}: {
  entries: ImpactCatalogEntry[];
}) {
  const { t, i18n } = useTranslation();
  const beforeLabel = t("impactStory.beforeLabel");
  const afterLabel = t("impactStory.afterLabel");

  const data = entries.map((entry) => ({
    entryId: entry.entryId,
    fullLabel: entry.pairLabelDe,
    label: truncateChartLabel(entry.pairLabelDe, MAX_CATEGORY_LABEL_LENGTH),
    outcomeStatement: entry.outcomeStatement,
    before: entry.beforeValue,
    after: entry.afterValue,
  }));

  const uniqueSources = [...new Set(entries.map((entry) => entry.sourceDe))];
  const rotateLabels = data.length >= 3;

  const formatValue = (value: number) =>
    formatImpactStoryValue(value, "number", i18n.language);

  return (
    <ImpactStoryBoardCard
      title={t("impactStory.pairedDeltaGroupTitle")}
      subtitle={t("impactStory.pairedDeltaGroupSubtitle")}
      note={
        uniqueSources.length > 0 ? (
          <div className="space-y-1">
            {uniqueSources.map((source) => (
              <div key={source}>{source}</div>
            ))}
          </div>
        ) : undefined
      }
    >
      <div
        className="h-[220px]"
        role="img"
        aria-label={t("impactStory.pairedDeltaGroupAriaLabel", {
          summary: data
            .map(
              (entry) =>
                `${entry.fullLabel} — ${beforeLabel}: ${formatValue(entry.before)}, ${afterLabel}: ${formatValue(entry.after)}`,
            )
            .join("; "),
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
            barGap={4}
            barCategoryGap="20%"
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
              tickFormatter={(value: number) => formatValue(value)}
            />
            <Tooltip
              labelFormatter={(_, payload) =>
                (
                  payload?.[0]?.payload as
                    | { fullLabel?: string; outcomeStatement?: string }
                    | undefined
                )?.fullLabel ?? ""
              }
              formatter={(
                value: ValueType | undefined,
                name: NameType | undefined,
              ) =>
                typeof value === "number" ? [formatValue(value), name] : ""
              }
              cursor={{ fill: IMPACT_STORY_COLORS.lineSoft }}
            />
            <Bar
              dataKey="before"
              name={beforeLabel}
              fill={IMPACT_STORY_COLORS.grey}
              radius={[8, 8, 0, 0]}
              maxBarSize={28}
            >
              <LabelList
                dataKey="before"
                position="top"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={11}
                fontWeight={600}
                formatter={(value: unknown) =>
                  typeof value === "number" ? formatValue(value) : ""
                }
              />
            </Bar>
            <Bar
              dataKey="after"
              name={afterLabel}
              fill={IMPACT_STORY_COLORS.blue}
              radius={[8, 8, 0, 0]}
              maxBarSize={28}
            >
              <LabelList
                dataKey="after"
                position="top"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={11}
                fontWeight={600}
                formatter={(value: unknown) =>
                  typeof value === "number" ? formatValue(value) : ""
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {[
          { label: beforeLabel, color: IMPACT_STORY_COLORS.grey },
          { label: afterLabel, color: IMPACT_STORY_COLORS.blue },
        ].map((series) => (
          <div key={series.label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: series.color }}
              aria-hidden="true"
            />
            <span className="text-[0.72rem] leading-[1.4] text-muted-foreground">
              {series.label}
            </span>
          </div>
        ))}
      </div>
    </ImpactStoryBoardCard>
  );
}
