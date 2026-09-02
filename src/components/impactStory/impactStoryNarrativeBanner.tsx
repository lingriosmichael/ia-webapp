import { useTranslation } from "react-i18next";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/WorkspaceUI";
import type { ProjectImpactStoryRecord } from "@/services/apiClient";

function readArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function formatTimestamp(value: string, language: string): string {
  if (language === "de") {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ImpactStoryNarrativeBanner({
  story,
  isStale,
  onRegenerate,
}: {
  story: ProjectImpactStoryRecord;
  isStale: boolean;
  // No isRegenerating prop: ProjectImpactStoryPage replaces its entire
  // dashboard (this banner included) with a full-page loading state for as
  // long as a run is in flight, so this banner only ever renders while
  // idle — see ImpactStoryRegeneratingState.
  onRegenerate: () => void;
}) {
  const { t, i18n } = useTranslation();
  const activitiesWithNoGroundedIndicators = readArray(
    story.diagnostics?.activitiesWithNoGroundedIndicators,
  );
  const hasUnanalyzedActivities = activitiesWithNoGroundedIndicators.length > 0;
  const paragraphs = story.narrativeSummary
    ? story.narrativeSummary
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
    : [];

  return (
    <Card className="overflow-hidden rounded-[2rem] border-border bg-card px-3 py-3 shadow-soft sm:px-4 sm:py-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[0.85rem] leading-[0.95] tracking-[-0.04em] text-foreground sm:text-[0.95rem] lg:text-[1.05rem]">
              {t("impactStory.narrativeTitle")}
            </h2>
            <p className="pt-0.5 text-[0.56rem] text-muted-foreground sm:pt-0 sm:text-[0.6rem]">
              {t("impactStory.generatedAt", {
                timestamp: formatTimestamp(story.updatedAt, i18n.language),
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 lg:pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            className="rounded-full px-2.5 py-1 text-[0.58rem]"
          >
            <RefreshCcw className="mr-1 h-2.5 w-2.5" />
            {t("impactStory.refreshAction")}
          </Button>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {isStale && (
          <p className="rounded-2xl bg-[color:color-mix(in_srgb,#C2593F_12%,white)] px-2.5 py-1 text-[0.56rem] font-semibold text-[#C2593F]">
            {t("impactStory.staleNotice")}
          </p>
        )}
        {story.narrativeStatus === "generated_unverified" ? (
          <p className="rounded-2xl bg-secondary px-2.5 py-1 text-[0.56rem] font-semibold text-secondary-foreground">
            {t("impactStory.narrativeUnverifiedNotice")}
          </p>
        ) : story.narrativeStatus && story.narrativeStatus !== "generated" ? (
          <p className="rounded-2xl bg-secondary px-2.5 py-1 text-[0.56rem] font-semibold text-secondary-foreground">
            {t("impactStory.narrativeTemplatedNotice")}
          </p>
        ) : null}
      </div>

      {story.status === "failed" ? (
        <p className="mt-2.5 text-[0.64rem] leading-[1.45] text-muted-foreground">
          {t("impactStory.narrativeFailed")}
        </p>
      ) : paragraphs.length > 0 ? (
        <div className="mt-2.5 space-y-2">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${story.id}-paragraph-${index}`}
              className="max-w-[72rem] text-[0.78rem] leading-[1.45] text-foreground sm:text-[0.86rem]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {hasUnanalyzedActivities && (
        <p className="mt-2.5 text-[0.56rem] leading-[1.4] text-muted-foreground">
          {t("impactStory.notYetAnalyzedFootnote", {
            names: activitiesWithNoGroundedIndicators.join(", "),
          })}
        </p>
      )}
    </Card>
  );
}
