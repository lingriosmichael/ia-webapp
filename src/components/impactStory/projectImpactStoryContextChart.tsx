import type {
  ContextCatalogEntry,
  ProjectImpactStoryChartSpec,
} from "@/services/apiClient";
import { ProjectImpactStoryDistributionChart } from "./projectImpactStoryDistributionChart";
import { ProjectImpactStoryPieChart } from "./projectImpactStoryPieChart";

// Context-catalog entries are pure descriptive distributions with no goal or
// outcome link (see ContextCatalogEntry in apiClient.ts) — rendered here by
// reusing the exact same chart components the LLM-planned chartPlan uses,
// just fed a synthesized ProjectImpactStoryChartSpec instead of a
// Python-selected one. No new chart-rendering logic, deliberately: this
// section must look and behave identically to the LLM-planned charts, the
// only difference is how the data got selected.
//
// Picking donut vs. ranked-bar is a fixed rule (few categories -> donut,
// more -> horizontal bar, matching standard dataviz legibility limits for
// pie/donut slices), never an LLM call — consistent with the rest of the
// context catalog staying outside LLM territory. See
// IMPACT_STORY_OUTCOME_EXTENSION_PLAN.md §3.4.
const DONUT_SHARE_MAX_CATEGORIES = 6;

function toChartSpec(entry: ContextCatalogEntry): ProjectImpactStoryChartSpec {
  const chartType =
    entry.shares.length <= DONUT_SHARE_MAX_CATEGORIES &&
    entry.eligibleChartTypes.includes("donut_share")
      ? "pie"
      : "distribution";

  return {
    chartId: entry.entryId,
    chartType,
    dataKind: "category",
    valueFormat: "number",
    title: entry.labelDe,
    subtitle: entry.dimensionLabelDe,
    narrativeReason: entry.sourceDe,
    data: entry.shares.map((share) => ({
      label: share.labelDe,
      value: share.count,
    })),
  };
}

export function ProjectImpactStoryContextChart({
  entry,
}: {
  entry: ContextCatalogEntry;
}) {
  const chart = toChartSpec(entry);

  return chart.chartType === "pie" ? (
    <ProjectImpactStoryPieChart chart={chart} />
  ) : (
    <ProjectImpactStoryDistributionChart chart={chart} />
  );
}
