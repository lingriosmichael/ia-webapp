import type {
  OutcomeDistributionEntry,
  ProjectImpactStoryChartSpec,
  UnmeasuredOutcomeEntry,
} from "@/services/apiClient";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { ProjectImpactStoryChart } from "./projectImpactStoryChart";

// Impact-catalog entries are outcome-linked — built only from confirmed
// OutcomeEvidenceLink records (see ImpactCatalogItem in apiClient.ts) — and
// are rendered here the same way ProjectImpactStoryContextChart renders
// ContextCatalogEntry: a deterministic, fixed conversion into a
// ProjectImpactStoryChartSpec reusing the existing chart-rendering
// components, never a new chart-rendering mechanism and never an LLM
// selection. paired_delta entries don't reach this component — the page
// groups every confirmed paired_delta entry into one clustered chart via
// ProjectImpactStoryPairedDeltaGroupChart instead, so this only ever
// handles the remaining two catalog shapes.
const DONUT_SHARE_MAX_CATEGORIES = 6;

function toImpactChartSpec(
  entry: OutcomeDistributionEntry,
): ProjectImpactStoryChartSpec {
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

export function ProjectImpactStoryImpactChart({
  entry,
}: {
  entry: OutcomeDistributionEntry | UnmeasuredOutcomeEntry;
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

  return <ProjectImpactStoryChart chart={toImpactChartSpec(entry)} />;
}
