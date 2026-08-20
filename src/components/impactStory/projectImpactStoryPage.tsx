import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Button } from "@/components/ui/button";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  projectAnalyticsQueryKey,
  useJobQuery,
  useProjectAnalyticsQuery,
  useRunProjectAnalyticsMutation,
} from "@/hooks/useWorkspaceQueries";
import {
  ApiError,
  type ProjectImpactStoryReadResult,
} from "@/services/apiClient";
import { ImpactStoryActivityTimeline } from "./impactStoryActivityTimeline";
import {
  ImpactStoryEmptyState,
  ImpactStoryErrorState,
} from "./impactStoryEmptyState";
import { ImpactStoryHeadlineKpiRow } from "./impactStoryHeadlineKpiRow";
import { ImpactStoryNarrativeBanner } from "./impactStoryNarrativeBanner";
import { ProjectImpactStoryChart } from "./projectImpactStoryChart";
import { ProjectImpactStoryContextChart } from "./projectImpactStoryContextChart";
import { ProjectImpactStoryDiagnosticsPanel } from "./projectImpactStoryDiagnosticsPanel";
import { ProjectImpactStoryImpactChart } from "./projectImpactStoryImpactChart";

const TERMINAL_JOB_STATUSES = ["completed", "failed", "cancelled"];

export function ProjectImpactStoryPage() {
  const { projectId } = useParams({ from: "/projects/$projectId/analytics" });
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const workspaceProject = useCurrentWorkspaceProject();

  const storyQuery = useProjectAnalyticsQuery(projectId, Boolean(auth.token));
  const runMutation = useRunProjectAnalyticsMutation(projectId);

  const [activeJobId, setActiveJobId] = useState<string | undefined>(undefined);
  const handledTerminalJobIdsRef = useRef(new Set<string>());
  const activeJobQuery = useJobQuery(activeJobId, Boolean(activeJobId));

  useEffect(() => {
    const job = activeJobQuery.data;
    if (
      !activeJobId ||
      !job ||
      !TERMINAL_JOB_STATUSES.includes(job.status) ||
      handledTerminalJobIdsRef.current.has(job.id)
    ) {
      return;
    }

    handledTerminalJobIdsRef.current.add(job.id);
    setActiveJobId(undefined);

    void (async () => {
      await queryClient.invalidateQueries({
        queryKey: projectAnalyticsQueryKey(projectId),
      });

      if (job.status !== "completed") {
        toast.error(job.errorMessage ?? t("impactStory.runFailed"));
        return;
      }

      // The job's own status only means "did the worker finish attempting
      // this" — the story it produced can still be status: "failed" (e.g.
      // the narrative call failing), so the toast reads the
      // freshly-invalidated story's own status, not the job's.
      const read = queryClient.getQueryData<ProjectImpactStoryReadResult>(
        projectAnalyticsQueryKey(projectId),
      );

      if (read?.story?.status === "failed") {
        toast.error(t("impactStory.runFailed"));
        return;
      }

      toast.success(t("impactStory.runSuccess"));
    })();
  }, [activeJobQuery.data, activeJobId, projectId, queryClient, t]);

  async function handleRegenerate() {
    try {
      const job = await runMutation.mutateAsync();
      setActiveJobId(job.id);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : t("impactStory.runFailed"),
      );
    }
  }

  const isRegenerating = runMutation.isPending || Boolean(activeJobId);

  if (!auth.token || storyQuery.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("impactStory.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  if (storyQuery.isError) {
    return (
      <ProjectWorkspaceShell>
        <ImpactStoryErrorState label={t("impactStory.loadFailed")} />
      </ProjectWorkspaceShell>
    );
  }

  const story = storyQuery.data?.story ?? null;
  const isStale = storyQuery.data?.isStale ?? false;

  if (!story) {
    return (
      <ProjectWorkspaceShell>
        <ImpactStoryEmptyState
          title={t("impactStory.emptyTitle")}
          description={t("impactStory.emptyDescription")}
          cta={
            <Button
              type="button"
              className="mt-5"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating
                ? t("impactStory.runPending")
                : t("impactStory.runAction")}
            </Button>
          }
        />
      </ProjectWorkspaceShell>
    );
  }

  const hasOutcomeOverlay = story.impactCatalog.length > 0;

  return (
    <ProjectWorkspaceShell>
      <div className="space-y-5">
        <ImpactStoryActivityTimeline
          activities={workspaceProject?.activities ?? []}
        />

        {hasOutcomeOverlay && (
          <ImpactStoryNarrativeBanner
            story={story}
            isStale={isStale}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        )}

        <ImpactStoryHeadlineKpiRow kpis={story.headlineKpis} />

        {story.chartPlan.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {story.chartPlan.map((chart) => (
              <ProjectImpactStoryChart key={chart.chartId} chart={chart} />
            ))}
          </div>
        )}

        {story.impactCatalog.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {story.impactCatalog.map((entry) => (
              <ProjectImpactStoryImpactChart
                key={entry.entryId}
                entry={entry}
              />
            ))}
          </div>
        )}

        {story.chartPlan.length === 0 && story.contextCharts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {story.contextCharts.map((entry) => (
              <ProjectImpactStoryContextChart
                key={entry.entryId}
                entry={entry}
              />
            ))}
          </div>
        )}

        {!hasOutcomeOverlay && (
          <ImpactStoryNarrativeBanner
            story={story}
            isStale={isStale}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        )}

        <ProjectImpactStoryDiagnosticsPanel
          chartOpportunityAudit={story.diagnostics.chartOpportunityAudit}
          chartSelectionAudit={story.diagnostics.chartSelectionAudit}
        />
      </div>
    </ProjectWorkspaceShell>
  );
}
