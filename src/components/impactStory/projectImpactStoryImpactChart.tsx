import type {
  ImpactCatalogItem,
  ProjectImpactStoryChartSpec,
} from "@/services/apiClient";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { ProjectImpactStoryChart } from "./projectImpactStoryChart";

// Impact-catalog entries are outcome-linked — built only from confirmed
// OutcomeEvidenceLink records (see ImpactCatalogItem in apiClient.ts) — and
// are rendered here the same way ProjectImpactStoryContextChart renders
// ContextCatalogEntry: a deterministic, fixed conversion into a
// ProjectImpactStoryChartSpec reusing the existing chart-rendering
// components, never a new chart-rendering mechanism and never an LLM
// selection. See IMPACT_STORY_OUTCOME_EXTENSION_PLAN.md §4.5.
const DONUT_SHARE_MAX_CATEGORIES = 6;

function toImpactChartSpec(
  entry: ImpactCatalogItem,
  beforeLabel: string,
  afterLabel: string,
): ProjectImpactStoryChartSpec | null {
  if (entry.shape === "paired_delta") {
    return {
      chartId: entry.entryId,
      chartType: "comparison",
      dataKind: "category",
      valueFormat: "number",
      title: entry.pairLabelDe,
      subtitle: entry.outcomeStatement,
      narrativeReason: entry.sourceDe,
      data: [
        { label: beforeLabel, value: entry.beforeValue },
        { label: afterLabel, value: entry.afterValue },
      ],
    };
  }

  if (entry.shape === "single_distribution") {
    return {
      chartId: entry.entryId,
      chartType:
        entry.shares.length <= DONUT_SHARE_MAX_CATEGORIES
          ? "pie"
          : "distribution",
      dataKind: "category",
      valueFormat: "number",
      title: entry.questionLabelDe,
      subtitle: entry.outcomeStatement,
      narrativeReason: entry.sourceDe,
      data: entry.shares.map((share) => ({
        label: share.labelDe,
        value: share.count,
      })),
    };
  }

  return null;
}

export function ProjectImpactStoryImpactChart({
  entry,
}: {
  entry: ImpactCatalogItem;
}) {
  const locale = useWorkspaceLocale();

  if (entry.shape === "unmeasured") {
    return (
      <div className="rounded-2xl border border-border/70 bg-secondary/20 px-5 py-4 text-sm leading-6 text-muted-foreground">
        <div className="font-medium text-foreground">
          {entry.outcomeStatement}
        </div>
        <p className="mt-1">{locale.impactStory.outcomeNotYetMeasurable}</p>
      </div>
    );
  }

  const chart = toImpactChartSpec(
    entry,
    locale.impactStory.beforeLabel,
    locale.impactStory.afterLabel,
  );
  if (!chart) {
    return null;
  }

  return <ProjectImpactStoryChart chart={chart} />;
}
