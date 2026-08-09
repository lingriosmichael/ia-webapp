import { useQueries, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CircleHelp, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PrivacyReviewDialog } from "@/components/privacyReviewDialog";
import { InterpretationQuestionCard } from "@/components/interpretationQuestionCard";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import {
  activityJobsQueryKey,
  activityUploadsQueryKey,
  activityWorkflowStageQueryKey,
  jobQueryKey,
  projectInterpretationsQueryKey,
  useAnswerInterpretationQuestionMutation,
  useStartActivityInterpretationMutation,
  useProjectInterpretationsQuery,
} from "@/hooks/useWorkspaceQueries";
import { useRequireAuth } from "@/hooks/useAuth";
import { getQuestionsByDomain } from "@/lib/interpretationWorkflow";
import {
  ApiError,
  apiClient,
  type ActivityWorkflowStage,
  type EvidenceModality,
  type InterpretationQuestion,
  type InterpretationResultRecord,
  type ParsedRepresentationPreviewRecord,
  type ProcessingJobRecord,
  type UploadMetadataRecord,
  type WorkspaceActivity,
} from "@/services/apiClient";
import { Card } from "@/components/WorkspaceUI";

// Interpretation always takes at least this long, so polling sooner than
// the first step never finds anything new. Ramps down as the active job
// ages, then settles at the steady interval for the rest of the run.
const INTERPRETATION_POLL_INTERVAL_RAMP_MS = [30_000, 20_000] as const;
const INTERPRETATION_STEADY_POLL_INTERVAL_MS = 10_000;
const TERMINAL_JOB_STATUSES = ["completed", "failed", "cancelled"];
// Based on elapsed time since the job actually started (job.createdAt),
// not a poll counter — a counter would drift out of sync with reality on
// every remount or tab switch, while elapsed time doesn't.
function oldestActiveJobAgeMs(
  jobs: ProcessingJobRecord[] | undefined,
): number | null {
  const activeJobs = (jobs ?? []).filter(
    (job) => !TERMINAL_JOB_STATUSES.includes(job.status),
  );
  if (activeJobs.length === 0) {
    return null;
  }

  const oldestCreatedAtMs = Math.min(
    ...activeJobs.map((job) => new Date(job.createdAt).getTime()),
  );
  return Date.now() - oldestCreatedAtMs;
}

function rampedPollIntervalMs(activeJobAgeMs: number): number {
  let elapsedThreshold = 0;
  for (const step of INTERPRETATION_POLL_INTERVAL_RAMP_MS) {
    elapsedThreshold += step;
    if (activeJobAgeMs < elapsedThreshold) {
      return step;
    }
  }
  return INTERPRETATION_STEADY_POLL_INTERVAL_MS;
}

export const Route = createFileRoute("/projects/$projectId/interpretation")({
  component: ProjectInterpretationPage,
});

type ActivityWorkflowStatus =
  | "no_evidence"
  | "privacy_review"
  | "processing"
  | "questions"
  | "goal_review"
  | "partial"
  | "ready"
  | "reviewed"
  | "not_started";

function hasPendingBlockingQuestions(
  questions: InterpretationQuestion[],
): boolean {
  return questions.some(
    (question) => question.isBlocking && question.status === "pending",
  );
}

function getEvidenceSupportState(
  evidenceModality: EvidenceModality | null | undefined,
): "supported" | "insufficiently_extracted" | "not_ready" {
  if (!evidenceModality) {
    return "not_ready";
  }

  return evidenceModality === "insufficiently_extracted"
    ? "insufficiently_extracted"
    : "supported";
}

function isPrivacyPreviewAvailable(job: ProcessingJobRecord | undefined) {
  return Boolean(
    job &&
    ["awaiting_privacy_review", "transforming", "completed"].includes(
      job.status,
    ),
  );
}

function getLatestEvidenceJobCreatedTimestamp(job: ProcessingJobRecord) {
  const createdAt = Date.parse(job.createdAt);
  return Number.isNaN(createdAt) ? 0 : createdAt;
}

function getLatestEvidenceProcessingJob(
  jobs: ProcessingJobRecord[],
  uploadMetadataId: string,
) {
  return jobs
    .filter(
      (job) =>
        job.uploadMetadataId === uploadMetadataId &&
        (job.jobType === "evidence_processing" ||
          job.jobType === "workbook_split"),
    )
    .sort((left, right) => {
      return (
        getLatestEvidenceJobCreatedTimestamp(right) -
        getLatestEvidenceJobCreatedTimestamp(left)
      );
    })[0];
}

// Maps the backend's authoritative ActivityWorkflowStage
// (GET /activities/:activityId/workflow-stage — cross-evidence-linkage-design.md
// §11) onto this page's own display vocabulary. The backend derivation is
// the single source of truth for the parts that matter for correctness
// (privacy review, active interpretation, blocking questions, evidence
// linkage completion); "partial" vs. "not_started" is a purely cosmetic
// split this page still makes locally from data it already has, since the
// backend has no reason to care about that distinction.
//
// `stage` is `undefined` while the workflow-stage query hasn't resolved
// yet; "not_started" is a reasonable, self-correcting default for that
// brief window, consistent with how uploads/jobs already default to `[]`
// while loading elsewhere on this page.
function mapWorkflowStageToActivityStatus(
  stage: ActivityWorkflowStage | undefined,
  hasInterpretedResults: boolean,
): ActivityWorkflowStatus {
  switch (stage) {
    case "no_evidence":
      return "no_evidence";
    case "privacy_review":
      return "privacy_review";
    case "analysis_running":
      return "processing";
    case "needs_clarification":
      return "questions";
    case "goal_review":
      return "goal_review";
    case "assessment_ready":
      return "ready";
    case "reviewed":
      return "reviewed";
    case "analysis_pending":
      return hasInterpretedResults ? "partial" : "not_started";
    case undefined:
      return "not_started";
    default:
      return "not_started";
  }
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-border/80 bg-secondary/30 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-[1.75rem] font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

function ProjectInterpretationPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const workspaceProject = useCurrentWorkspaceProject();
  const [reviewProcessingJob, setReviewProcessingJob] = useState<
    { jobId: string; activityName: string } | undefined
  >(undefined);
  const interpretationsQuery = useProjectInterpretationsQuery(
    projectId,
    Boolean(auth.token),
  );

  const activities = workspaceProject?.activities ?? [];
  const results = interpretationsQuery.data?.results ?? [];
  // Polling is scoped to each activity's own fetched data, not the whole
  // list at once — an activity with no active job / no longer mid-linkage
  // stops refetching entirely instead of being re-queried forever just
  // because it happens to be on this page.
  const activityJobsQueries = useQueries({
    queries: activities.map((activity) => ({
      queryKey: activityJobsQueryKey(activity.id),
      queryFn: () => apiClient.listActivityJobs(activity.id),
      enabled: true,
      refetchInterval: (query: { state: { data?: ProcessingJobRecord[] } }) => {
        const activeJobAgeMs = oldestActiveJobAgeMs(query.state.data);
        return activeJobAgeMs === null
          ? false
          : rampedPollIntervalMs(activeJobAgeMs);
      },
    })),
  });
  const activityUploadsQueries = useQueries({
    queries: activities.map((activity) => ({
      queryKey: activityUploadsQueryKey(activity.id),
      queryFn: () => apiClient.listActivityUploads(activity.id),
      enabled: true,
    })),
  });
  const activityWorkflowStageQueries = useQueries({
    queries: activities.map((activity, index) => {
      const activeJobAgeMs = oldestActiveJobAgeMs(
        activityJobsQueries[index]?.data,
      );

      return {
        queryKey: activityWorkflowStageQueryKey(activity.id),
        queryFn: () => apiClient.getActivityWorkflowStage(activity.id),
        enabled: true,
        refetchInterval: (query: {
          state: { data?: { stage: ActivityWorkflowStage } };
        }) => {
          const stage = query.state.data?.stage;
          if (stage === "analysis_running") {
            return activeJobAgeMs === null
              ? INTERPRETATION_STEADY_POLL_INTERVAL_MS
              : rampedPollIntervalMs(activeJobAgeMs);
          }
          // goal_review has no associated job to measure age from — it's a
          // short-lived automatic linkage-reconciliation step, not the
          // "please wait a while" case the ramp above is for.
          return stage === "goal_review"
            ? INTERPRETATION_STEADY_POLL_INTERVAL_MS
            : false;
        },
      };
    }),
  });

  const uploadsByActivityId = new Map(
    activities.map((activity, index) => [
      activity.id,
      activityUploadsQueries[index]?.data ?? [],
    ]),
  );
  const jobsByActivityId = new Map(
    activities.map((activity, index) => [
      activity.id,
      activityJobsQueries[index]?.data ?? [],
    ]),
  );
  const workflowStageByActivityId = new Map(
    activities.map((activity, index) => [
      activity.id,
      activityWorkflowStageQueries[index]?.data?.stage,
    ]),
  );

  const activityStatuses = activities.map((activity) => {
    const activityResults = results.filter(
      (result) => result.activityId === activity.id,
    );
    return {
      activityId: activity.id,
      status: mapWorkflowStageToActivityStatus(
        workflowStageByActivityId.get(activity.id),
        activityResults.length > 0,
      ),
    };
  });

  const readyActivityCount = activityStatuses.filter(
    (entry) => entry.status === "reviewed",
  ).length;
  const inProgressActivityCount = activityStatuses.filter(
    (entry) => entry.status === "processing" || entry.status === "goal_review",
  ).length;
  const needsAttentionActivityCount = activityStatuses.filter(
    (entry) =>
      entry.status === "privacy_review" ||
      entry.status === "questions" ||
      entry.status === "partial",
  ).length;

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="mt-6 space-y-4">
          <Card className="border-primary/12 bg-primary-soft/25 p-6">
            <div className="max-w-[50rem]">
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {t("projectWorkspace.interpretation.simplified.pageTitle")}
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                {t("projectWorkspace.interpretation.simplified.heroTitle")}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t(
                  "projectWorkspace.interpretation.simplified.heroDescription",
                )}
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <SummaryMetric
                  label={t(
                    "projectWorkspace.interpretation.simplified.statActivities",
                  )}
                  value={String(activities.length)}
                />
                <SummaryMetric
                  label={t(
                    "projectWorkspace.interpretation.simplified.statReady",
                  )}
                  value={String(readyActivityCount)}
                />
                <SummaryMetric
                  label={t(
                    "projectWorkspace.interpretation.simplified.statAttention",
                  )}
                  value={String(
                    needsAttentionActivityCount + inProgressActivityCount,
                  )}
                />
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("projectWorkspace.interpretation.simplified.activitiesTitle")}
            </div>
            {activities.length === 0 ? (
              <Card className="p-5 text-sm text-muted-foreground">
                {t("projectWorkspace.interpretation.understoodEmpty")}
              </Card>
            ) : (
              activities.map((activity) => (
                <ActivityKnowledgeCard
                  key={activity.id}
                  activity={activity}
                  projectId={projectId}
                  organizationId={workspaceProject?.organizationId}
                  uploads={uploadsByActivityId.get(activity.id) ?? []}
                  jobs={jobsByActivityId.get(activity.id) ?? []}
                  results={results.filter(
                    (result) => result.activityId === activity.id,
                  )}
                  workflowStage={workflowStageByActivityId.get(activity.id)}
                  onOpenPrivacyReview={(jobId, activityName) =>
                    setReviewProcessingJob({ jobId, activityName })
                  }
                  onOpenAnalysis={(activityId) =>
                    void navigate({
                      to: "/projects/$projectId/activities/$activityId/analysis",
                      params: { projectId, activityId },
                    })
                  }
                />
              ))
            )}
          </div>
        </div>

        <PrivacyReviewDialog
          open={Boolean(reviewProcessingJob)}
          onOpenChange={(open) => {
            if (!open) {
              setReviewProcessingJob(undefined);
            }
          }}
          processingJobId={reviewProcessingJob?.jobId}
          projectId={projectId}
          organizationId={workspaceProject?.organizationId ?? ""}
          activityName={reviewProcessingJob?.activityName}
        />
      </section>
    </ProjectWorkspaceShell>
  );
}

function ActivityKnowledgeCard({
  activity,
  projectId,
  organizationId,
  uploads,
  jobs,
  results,
  workflowStage,
  onOpenPrivacyReview,
  onOpenAnalysis,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string | undefined;
  uploads: UploadMetadataRecord[];
  jobs: ProcessingJobRecord[];
  results: InterpretationResultRecord[];
  workflowStage: ActivityWorkflowStage | undefined;
  onOpenPrivacyReview: (jobId: string, activityName: string) => void;
  onOpenAnalysis: (activityId: string) => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const startMutation = useStartActivityInterpretationMutation(
    activity.id,
    projectId,
  );

  const latestEvidenceJobByUploadId = new Map(
    uploads.map((upload) => [
      upload.id,
      getLatestEvidenceProcessingJob(jobs, upload.id),
    ]),
  );
  const latestEvidenceJobs = uploads
    .map((upload) => latestEvidenceJobByUploadId.get(upload.id))
    .filter((job): job is ProcessingJobRecord => Boolean(job));
  const previewQueries = useQueries({
    queries: uploads.map((upload) => {
      const latestEvidenceJob = latestEvidenceJobByUploadId.get(upload.id);
      return {
        queryKey: [
          "privacy-review",
          latestEvidenceJob?.id ?? `missing-${upload.id}`,
        ],
        queryFn: () => apiClient.getPrivacyReview(latestEvidenceJob!.id),
        enabled: isPrivacyPreviewAvailable(latestEvidenceJob),
      };
    }),
  });
  const previewByUploadId = new Map<
    string,
    ParsedRepresentationPreviewRecord | null
  >(
    uploads.map((upload, index) => [
      upload.id,
      previewQueries[index]?.data?.parsedRepresentationPreview ?? null,
    ]),
  );

  const activeInterpretationJobs = jobs.filter(
    (job) =>
      job.jobType === "dataset_interpretation" &&
      !TERMINAL_JOB_STATUSES.includes(job.status),
  );
  const activeJobSyncQueries = useQueries({
    queries: activeInterpretationJobs.map((job) => ({
      queryKey: jobQueryKey(job.id),
      queryFn: () => apiClient.syncJob(job.id),
      enabled: true,
      refetchInterval: (query: { state: { data?: ProcessingJobRecord } }) => {
        const syncedStatus = query.state.data?.status;
        return syncedStatus && TERMINAL_JOB_STATUSES.includes(syncedStatus)
          ? false
          : 1000;
      },
    })),
  });

  useEffect(() => {
    const hasFreshTerminalUpdate = activeJobSyncQueries.some((query) => {
      const status = query.data?.status;
      return Boolean(status && TERMINAL_JOB_STATUSES.includes(status));
    });

    if (!hasFreshTerminalUpdate) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: activityJobsQueryKey(activity.id),
    });
    void queryClient.invalidateQueries({
      queryKey: projectInterpretationsQueryKey(projectId),
    });
    void queryClient.invalidateQueries({
      queryKey: activityWorkflowStageQueryKey(activity.id),
    });
  }, [activeJobSyncQueries, activity.id, projectId, queryClient]);

  const currentPendingPrivacyReview = latestEvidenceJobs.find(
    (job) => job.status === "awaiting_privacy_review",
  );
  const pendingPrivacyReviewCount = latestEvidenceJobs.filter(
    (job) => job.status === "awaiting_privacy_review",
  ).length;
  const pendingQuestions = results.flatMap((result) =>
    [
      ...getQuestionsByDomain(result.questions, "preparation", "pending"),
      ...getQuestionsByDomain(result.questions, "interpretation", "pending"),
    ].map((question) => ({ result, question })),
  );
  const resultByUploadId = new Map(
    results.map((result) => [result.uploadMetadataId, result] as const),
  );
  const totalPendingQuestionCount = pendingQuestions.length;
  const hasUnresolvedActionableQuestion = results.some((result) =>
    hasPendingBlockingQuestions(result.questions),
  );
  const status = mapWorkflowStageToActivityStatus(
    workflowStage,
    results.length > 0,
  );
  const hasExistingInterpretations = results.length > 0;

  const readyToInterpretUploadCount = uploads.filter((upload) => {
    if (resultByUploadId.has(upload.id)) {
      return false;
    }

    const latestEvidenceJob = latestEvidenceJobByUploadId.get(upload.id);
    const preview = previewByUploadId.get(upload.id);
    const supportState = getEvidenceSupportState(preview?.evidenceModality);
    const hasActiveInterpretationJob = jobs.some(
      (job) =>
        job.jobType === "dataset_interpretation" &&
        job.uploadMetadataId === upload.id &&
        !TERMINAL_JOB_STATUSES.includes(job.status),
    );

    return (
      latestEvidenceJob?.status === "completed" &&
      supportState === "supported" &&
      !hasActiveInterpretationJob
    );
  }).length;

  const hasQueuedInterpretationStart =
    startMutation.isSuccess &&
    startMutation.data.startedCount > 0 &&
    activeInterpretationJobs.length === 0;
  const isInterpretationProcessing =
    status === "processing" || hasQueuedInterpretationStart;
  const canStartInterpretation =
    uploads.length > 0 &&
    readyToInterpretUploadCount > 0 &&
    activeInterpretationJobs.length === 0 &&
    !currentPendingPrivacyReview &&
    !startMutation.isPending &&
    !hasQueuedInterpretationStart;
  const canOpenAnalysis =
    (status === "ready" || status === "reviewed") &&
    !hasUnresolvedActionableQuestion;
  const interpretationActionLabel = hasExistingInterpretations
    ? t(
        "projectWorkspace.interpretation.simplified.actionInterpretMissingEvidence",
      )
    : t("projectWorkspace.interpretation.simplified.actionRunKnowledge");

  const summary =
    status === "no_evidence"
      ? t("projectWorkspace.interpretation.noEvidenceYet")
      : isInterpretationProcessing
        ? t(
            "projectWorkspace.interpretation.simplified.activitySummary.processing",
          )
        : status === "privacy_review"
          ? t(
              "projectWorkspace.interpretation.simplified.activitySummary.privacyReview",
              {
                count: pendingPrivacyReviewCount,
              },
            )
          : status === "questions"
            ? t(
                "projectWorkspace.interpretation.simplified.activitySummary.questions",
                {
                  count: totalPendingQuestionCount,
                },
              )
            : status === "partial"
              ? t(
                  "projectWorkspace.interpretation.simplified.activitySummary.partial",
                  {
                    interpreted: results.length,
                    remaining: Math.max(uploads.length - results.length, 0),
                  },
                )
              : status === "goal_review"
                ? t(
                    "projectWorkspace.interpretation.simplified.activitySummary.goalReview",
                  )
                : status === "ready"
                  ? t(
                      "projectWorkspace.interpretation.simplified.activitySummary.ready",
                    )
                  : status === "reviewed"
                    ? t(
                        "projectWorkspace.interpretation.simplified.activitySummary.reviewed",
                      )
                    : t(
                        "projectWorkspace.interpretation.simplified.activitySummary.notStarted",
                      );

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
              {activity.name}
            </h3>
            <ActivityStatusBadge
              status={status}
              isInterpretationProcessing={isInterpretationProcessing}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {uploads.length > 0
              ? t("projectWorkspace.interpretation.simplified.activityMeta", {
                  uploads: uploads.length,
                  interpreted: results.length,
                })
              : t("projectWorkspace.interpretation.simplified.activityNoFiles")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status === "privacy_review" && currentPendingPrivacyReview ? (
            <Button
              size="sm"
              onClick={() =>
                onOpenPrivacyReview(
                  currentPendingPrivacyReview.id,
                  activity.name,
                )
              }
            >
              {t("projectWorkspace.interpretation.reviewPrivacyAction")}
            </Button>
          ) : null}

          {!isInterpretationProcessing && canStartInterpretation ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                startMutation.mutate(undefined, {
                  onSuccess: ({ skippedCount }) => {
                    const message =
                      skippedCount > 0
                        ? t(
                            "projectWorkspace.interpretation.simplified.interpretationResumed",
                          )
                        : t(
                            "projectWorkspace.interpretation.simplified.interpretationStarted",
                          );

                    toast.success(message);
                  },
                  onError: (error) => {
                    const message =
                      error instanceof ApiError &&
                      error.code === "activity_interpretation_not_ready"
                        ? t(
                            "projectWorkspace.interpretation.simplified.activityNotReadyToast",
                          )
                        : error.message;

                    toast.error(message);
                  },
                })
              }
            >
              {interpretationActionLabel}
            </Button>
          ) : null}

          {canOpenAnalysis ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenAnalysis(activity.id)}
            >
              {t(
                "projectWorkspace.interpretation.simplified.actionOpenAnalysis",
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {pendingQuestions.length > 0 ? (
        <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
            <CircleHelp className="h-4 w-4 text-primary" />
            {t("projectWorkspace.interpretation.simplified.questionsTitle")}
          </div>
          {pendingQuestions.map(({ result, question }) => (
            <QuestionCard
              key={question.id}
              activityName={activity.name}
              interpretationResultId={result.id}
              projectId={projectId}
              organizationId={organizationId}
              question={question}
            />
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function ActivityStatusBadge({
  status,
  isInterpretationProcessing = false,
}: {
  status: ActivityWorkflowStatus;
  isInterpretationProcessing?: boolean;
}) {
  const { t } = useTranslation();

  if (isInterpretationProcessing) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {t("projectWorkspace.interpretation.simplified.status.processing")}
      </Badge>
    );
  }

  if (status === "ready" || status === "reviewed") {
    return null;
  }

  if (status === "goal_review") {
    // Not user-actionable — evidence linkage is an automatic backend step,
    // not a job the user can restart or a question they need to answer.
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {t("projectWorkspace.interpretation.simplified.status.goal_review")}
      </Badge>
    );
  }

  if (
    status === "privacy_review" ||
    status === "questions" ||
    status === "partial"
  ) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-200 bg-amber-50 text-amber-800"
      >
        <AlertTriangle className="h-3.5 w-3.5" />
        {t(`projectWorkspace.interpretation.simplified.status.${status}`)}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <CircleHelp className="h-3.5 w-3.5" />
      {t(`projectWorkspace.interpretation.simplified.status.${status}`)}
    </Badge>
  );
}

function QuestionCard({
  activityName,
  interpretationResultId,
  projectId,
  organizationId,
  question,
}: {
  activityName: string;
  interpretationResultId: string;
  projectId: string;
  organizationId: string | undefined;
  question: InterpretationQuestion;
}) {
  const answerMutation = useAnswerInterpretationQuestionMutation(
    interpretationResultId,
    projectId,
    organizationId,
  );

  return (
    <InterpretationQuestionCard
      activityName={activityName}
      question={question}
      isSubmitting={answerMutation.isPending}
      onSubmit={({ questionId, answeredValue }) =>
        answerMutation.mutate({
          questionId,
          payload: { answeredValue },
        })
      }
    />
  );
}
