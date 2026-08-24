import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Button } from "@/components/ui/button";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useImpactStoryDashboardLayout } from "@/hooks/useImpactStoryDashboardLayout";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  projectAnalyticsQueryKey,
  useJobQuery,
  useProjectAnalyticsQuery,
  useRunProjectAnalyticsMutation,
} from "@/hooks/useWorkspaceQueries";
import {
  ApiError,
  type ImpactCatalogEntry,
  type OutcomeDistributionEntry,
  type ProjectImpactStoryReadResult,
  type UnmeasuredOutcomeEntry,
} from "@/services/apiClient";
import { ImpactStoryActivityTimeline } from "./impactStoryActivityTimeline";
import { ImpactStoryBacklogPanel } from "./impactStoryBacklogPanel";
import {
  ImpactStoryEmptyState,
  ImpactStoryErrorState,
} from "./impactStoryEmptyState";
import { ImpactStoryHeadlineKpiRow } from "./impactStoryHeadlineKpiRow";
import { ImpactStoryNarrativeBanner } from "./impactStoryNarrativeBanner";
import { ProjectImpactStoryChart } from "./projectImpactStoryChart";
import { ProjectImpactStoryContextChart } from "./projectImpactStoryContextChart";
import { ProjectImpactStoryGoalProgressChart } from "./projectImpactStoryGoalProgressChart";
import { ProjectImpactStoryImpactChart } from "./projectImpactStoryImpactChart";
import { ProjectImpactStoryPairedDeltaGroupChart } from "./projectImpactStoryPairedDeltaGroupChart";
import { SortableChartCard } from "./sortableChartCard";

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

  const story = storyQuery.data?.story ?? null;
  const isStale = storyQuery.data?.isStale ?? false;

  const pairedDeltaEntries: ImpactCatalogEntry[] =
    story?.impactCatalog.filter(
      (entry): entry is ImpactCatalogEntry => entry.shape === "paired_delta",
    ) ?? [];
  const otherCatalogEntries: Array<
    OutcomeDistributionEntry | UnmeasuredOutcomeEntry
  > =
    story?.impactCatalog.filter(
      (entry): entry is OutcomeDistributionEntry | UnmeasuredOutcomeEntry =>
        entry.shape !== "paired_delta",
    ) ?? [];

  // Every chart card on the page shares one grid so CSS auto-placement
  // fills rows contiguously — each source used to render into its own
  // separate 2-column grid, which left a visible empty cell any time a
  // section (e.g. the always-on goal-progress or paired-delta charts)
  // contributed an odd number of cards on its own.
  //
  // Default order is deliberate, not just "however each source happened to
  // load": the two evidence tiers that answer "did it work" —
  // target-vs-achieved (goalProgressEntries) and confirmed before/after
  // outcome measurement (impactCatalog, both pairedDeltaEntries and
  // otherCatalogEntries) — lead the page. The LLM-selected chartPlan
  // (reach/process/context — weaker evidentiary weight, see
  // CURRENT_ANALYSIS_PIPELINE.md's "Python plans" split) follows after,
  // telling the "how we got there" half of the story once the reader
  // already has the results. A viewer can drag any card to override this
  // default — see useImpactStoryDashboardLayout.
  const dashboardCards: Array<{ id: string; title: string; node: ReactNode }> =
    story
      ? [
          ...(story.goalProgressEntries.length > 0
            ? [
                {
                  id: "goal-progress",
                  title: t("impactStory.goalProgressChartTitle"),
                  node: (
                    <ProjectImpactStoryGoalProgressChart
                      entries={story.goalProgressEntries}
                    />
                  ),
                },
              ]
            : []),
          ...(pairedDeltaEntries.length > 0
            ? [
                {
                  id: "paired-delta-group",
                  title: t("impactStory.pairedDeltaGroupTitle"),
                  node: (
                    <ProjectImpactStoryPairedDeltaGroupChart
                      entries={pairedDeltaEntries}
                    />
                  ),
                },
              ]
            : []),
          ...otherCatalogEntries.map((entry) => ({
            id: entry.entryId,
            title:
              entry.shape === "unmeasured"
                ? entry.outcomeStatement
                : entry.questionLabelDe,
            node: <ProjectImpactStoryImpactChart entry={entry} />,
          })),
          ...story.chartPlan.map((chart) => ({
            id: chart.chartId,
            title: chart.title,
            node: <ProjectImpactStoryChart chart={chart} />,
          })),
          ...(story.chartPlan.length === 0
            ? story.contextCharts.map((entry) => ({
                id: entry.entryId,
                title: entry.labelDe,
                node: <ProjectImpactStoryContextChart entry={entry} />,
              }))
            : []),
        ]
      : [];
  // Deterministic, no-LLM charts for every ready catalog entry the chart
  // plan didn't select this run (see projectImpactStoryChartBacklog.ts) —
  // rendered with the same ProjectImpactStoryChart dispatcher as any other
  // chart-plan card, since they're already fully-built chart specs. These
  // start out of view by default (see useImpactStoryDashboardLayout's
  // defaultHiddenIds handling) and only appear on the dashboard once a
  // viewer clicks them in the backlog panel.
  const backlogCards: Array<{ id: string; title: string; node: ReactNode }> =
    story
      ? story.backlogChartPlan.map((chart) => ({
          id: chart.chartId,
          title: chart.title,
          node: <ProjectImpactStoryChart chart={chart} />,
        }))
      : [];
  const chartCardsById = new Map(
    [...dashboardCards, ...backlogCards].map(
      (card) => [card.id, card] as const,
    ),
  );

  const dashboardLayout = useImpactStoryDashboardLayout(
    projectId,
    dashboardCards.map((card) => card.id),
    backlogCards.map((card) => card.id),
  );

  const dragSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    if (!overId || typeof event.active.id !== "string") {
      return;
    }
    dashboardLayout.moveCard(event.active.id, String(overId));
  }

  // A plain 2-column CSS grid sizes each *row* to its tallest card, so a
  // short card next to a tall one leaves visible empty space below it —
  // real content, not a bug in a single card. Splitting into two
  // independently-stacking columns (by alternating index) lets each
  // column pack tight around its own cards' actual heights instead, the
  // standard dependency-free masonry technique. Only applied at the same
  // breakpoint the grid itself switches to 2 columns — below that there's
  // only one column, so there's no row-height mismatch to fix, and
  // splitting would just scramble the natural top-to-bottom reading order
  // for no benefit.
  const isTwoColumnLayout = useMediaQuery("(min-width: 1024px)");
  const leftColumnIds = isTwoColumnLayout
    ? dashboardLayout.visibleIds.filter((_, index) => index % 2 === 0)
    : dashboardLayout.visibleIds;
  const rightColumnIds = isTwoColumnLayout
    ? dashboardLayout.visibleIds.filter((_, index) => index % 2 === 1)
    : [];

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

  function renderChartColumn(ids: string[]) {
    return ids.map((id) => {
      const card = chartCardsById.get(id);
      if (!card) {
        return null;
      }
      return (
        <SortableChartCard
          key={id}
          id={id}
          onHide={() => dashboardLayout.hideCard(id)}
        >
          {card.node}
        </SortableChartCard>
      );
    });
  }

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

        <ImpactStoryBacklogPanel
          cards={dashboardLayout.backlogIds.map((id) => ({
            id,
            title: chartCardsById.get(id)?.title ?? id,
          }))}
          onAdd={dashboardLayout.showCard}
        />

        <ImpactStoryHeadlineKpiRow kpis={story.headlineKpis} />

        {dashboardLayout.visibleIds.length > 0 && (
          <DndContext
            sensors={dragSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={dashboardLayout.visibleIds}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex flex-1 flex-col gap-5">
                  {renderChartColumn(leftColumnIds)}
                </div>
                {rightColumnIds.length > 0 && (
                  <div className="flex flex-1 flex-col gap-5">
                    {renderChartColumn(rightColumnIds)}
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {!hasOutcomeOverlay && (
          <ImpactStoryNarrativeBanner
            story={story}
            isStale={isStale}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        )}
      </div>
    </ProjectWorkspaceShell>
  );
}
