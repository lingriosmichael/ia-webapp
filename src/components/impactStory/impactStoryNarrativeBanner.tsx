import { useTranslation } from "react-i18next";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/WorkspaceUI";
import type { ProjectImpactStoryRecord } from "@/services/apiClient";

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
  isRegenerating,
}: {
  story: ProjectImpactStoryRecord;
  isStale: boolean;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const { t, i18n } = useTranslation();
  const hasUnanalyzedActivities =
    story.diagnostics.activitiesWithNoGroundedIndicators.length > 0;
  const paragraphs = story.narrativeSummary
    ? story.narrativeSummary
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
    : [];

  return (
    <Card className="overflow-hidden rounded-[2rem] border-border bg-card px-5 py-5 shadow-soft sm:px-6 sm:py-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-[family-name:var(--font-editorial)] text-[1.3rem] leading-[0.95] tracking-[-0.04em] text-foreground sm:text-[1.6rem] lg:text-[1.8rem]">
              {t("impactStory.narrativeTitle")}
            </h2>
            <p className="pt-0.5 text-[0.72rem] text-muted-foreground sm:pt-0 sm:text-[0.78rem]">
              {t("impactStory.generatedAt", {
                timestamp: formatTimestamp(story.updatedAt, i18n.language),
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="rounded-full px-3 py-1.5 text-[0.72rem]"
          >
            <RefreshCcw className="mr-1.5 h-3 w-3" />
            {isRegenerating
              ? t("impactStory.runPending")
              : t("impactStory.refreshAction")}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isStale && (
          <p className="rounded-2xl bg-[color:color-mix(in_srgb,#C2593F_12%,white)] px-3 py-1.5 text-[0.7rem] font-semibold text-[#C2593F]">
            {t("impactStory.staleNotice")}
          </p>
        )}
      </div>

      {story.status === "failed" ? (
        <p className="mt-4 text-[0.82rem] leading-6 text-muted-foreground">
          {t("impactStory.narrativeFailed")}
        </p>
      ) : paragraphs.length > 0 ? (
        <div className="mt-4 space-y-3">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${story.id}-paragraph-${index}`}
              className="max-w-[72rem] text-[0.72rem] leading-[1.55] text-foreground sm:text-[0.78rem]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {hasUnanalyzedActivities && (
        <p className="mt-4 text-[0.68rem] leading-5 text-muted-foreground">
          {t("impactStory.notYetAnalyzedFootnote", {
            names:
              story.diagnostics.activitiesWithNoGroundedIndicators.join(", "),
          })}
        </p>
      )}
    </Card>
  );
}
