import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
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
import {
  projectAnalyticsQueryKey,
  useActiveProjectAnalyticsJobQuery,
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
import { DashboardColumn } from "./dashboardColumn";
import type { ColumnPair } from "./dashboardColumnDrag";
import { moveCardOverColumn, reorderWithinColumn } from "./dashboardColumnDrag";
import { ImpactStoryActivityTimeline } from "./impactStoryActivityTimeline";
import { ImpactStoryBacklogPanel } from "./impactStoryBacklogPanel";
import {
  ImpactStoryEmptyState,
  ImpactStoryErrorState,
  ImpactStoryRegeneratingState,
} from "./impactStoryEmptyState";
import { ImpactStoryHeadlineKpiRow } from "./impactStoryHeadlineKpiRow";
import { ImpactStoryNarrativeBanner } from "./impactStoryNarrativeBanner";
import { ProjectImpactStoryChart } from "./projectImpactStoryChart";
import { ProjectImpactStoryContextChart } from "./projectImpactStoryContextChart";
import { ProjectImpactStoryGoalProgressChart } from "./projectImpactStoryGoalProgressChart";
import { ProjectImpactStoryImpactChart } from "./projectImpactStoryImpactChart";
import { ProjectImpactStoryPairedDeltaGroupChart } from "./projectImpactStoryPairedDeltaGroupChart";

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

  // A regeneration run can take upwards of ten minutes of real LLM latency
  // — long enough that switching to another in-app tab and back is a
  // realistic thing to do mid-run. That remounts this component, and
  // activeJobId (plain component state) resets to undefined even though
  // the job is still running server-side: the button would silently look
  // idle again, inviting a second, wastefully concurrent run against the
  // same project. This one-shot check resumes tracking whatever's already
  // in flight instead. Runs once per mount, guarded so it never overrides
  // a job handleRegenerate itself already started (e.g. the user clicked
  // before this had a chance to resolve).
  const activeJobLookupQuery = useActiveProjectAnalyticsJobQuery(
    projectId,
    Boolean(auth.token),
  );
  const hasResumedActiveJobRef = useRef(false);
  useEffect(() => {
    if (
      hasResumedActiveJobRef.current ||
      activeJobLookupQuery.isLoading ||
      activeJobId
    ) {
      return;
    }
    hasResumedActiveJobRef.current = true;
    const job = activeJobLookupQuery.data?.job;
    if (job) {
      setActiveJobId(job.id);
    }
  }, [activeJobLookupQuery.isLoading, activeJobLookupQuery.data, activeJobId]);

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

  // Every chart card on the page is drawn from this one flat, ordered list
  // — useImpactStoryDashboardLayout splits it across the two independently
  // packed dashboard columns (see dashboardColumn.tsx) rather than each
  // source rendering into its own grid, which left a visible empty cell any
  // time a section (e.g. the always-on goal-progress or paired-delta
  // charts) contributed an odd number of cards on its own.
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

  // Live column state for the duration of a drag gesture only. dnd-kit's
  // cross-container pattern needs the moved-between preview to update as
  // the pointer hovers (onDragOver), not just snap into place on release —
  // see dashboardColumnDrag.ts. `null` means "not dragging," so the grid
  // renders straight from the persisted layout.
  const [dragColumns, setDragColumns] = useState<ColumnPair | null>(null);
  const displayColumns: ColumnPair = dragColumns ?? [
    dashboardLayout.leftColumnIds,
    dashboardLayout.rightColumnIds,
  ];

  function handleDragStart() {
    setDragColumns([
      dashboardLayout.leftColumnIds,
      dashboardLayout.rightColumnIds,
    ]);
  }

  function handleDragOver(event: DragOverEvent) {
    const overId = event.over?.id;
    if (!overId || typeof event.active.id !== "string") {
      return;
    }
    setDragColumns((current) =>
      current
        ? moveCardOverColumn(current, event.active.id as string, String(overId))
        : current,
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    const activeId = event.active.id;
    if (dragColumns && overId && typeof activeId === "string") {
      dashboardLayout.setColumns(
        reorderWithinColumn(dragColumns, activeId, String(overId)),
      );
    }
    setDragColumns(null);
  }

  function handleDragCancel() {
    setDragColumns(null);
  }

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

  // Replaces the entire dashboard — including any stale story already on
  // screen — for as long as a run is in flight, rather than leaving old
  // content up next to a merely-disabled button. Checked ahead of the
  // empty-state branch below so a first-ever run gets the same full-page
  // treatment as a regeneration of an existing story.
  if (isRegenerating) {
    return (
      <ProjectWorkspaceShell>
        <ImpactStoryRegeneratingState
          title={t("impactStory.regeneratingTitle")}
          description={t("impactStory.regeneratingDescription")}
        />
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
            <Button type="button" className="mt-5" onClick={handleRegenerate}>
              {t("impactStory.runAction")}
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

        {(displayColumns[0].length > 0 || displayColumns[1].length > 0) && (
          <DndContext
            sensors={dragSensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
              <DashboardColumn
                column={0}
                cardIds={displayColumns[0]}
                chartCardsById={chartCardsById}
                onHide={dashboardLayout.hideCard}
              />
              <DashboardColumn
                column={1}
                cardIds={displayColumns[1]}
                chartCardsById={chartCardsById}
                onHide={dashboardLayout.hideCard}
              />
            </div>
          </DndContext>
        )}

        {!hasOutcomeOverlay && (
          <ImpactStoryNarrativeBanner
            story={story}
            isStale={isStale}
            onRegenerate={handleRegenerate}
          />
        )}
      </div>
    </ProjectWorkspaceShell>
  );
}
