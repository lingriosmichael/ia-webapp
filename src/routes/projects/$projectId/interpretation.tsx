import { useQueries, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PrivacyReviewDialog } from "@/components/privacyReviewDialog";
import { InterpretationQuestionCard } from "@/components/interpretationQuestionCard";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import {
  activityLinkageReviewQueryKey,
  activityJobsQueryKey,
  activityAnalysisV2LatestQueryKey,
  activityAnalysisV2RunsQueryKey,
  activityUploadsQueryKey,
  activityWorkflowStageQueryKey,
  jobQueryKey,
  projectInterpretationsQueryKey,
  useAnswerActivityAnalysisV2QuestionMutation,
  useAnswerInterpretationQuestionMutation,
  useActivityAnalysisV2RunsQuery,
  useActivityLinkageReviewQuery,
  useLatestActivityAnalysisV2Query,
  useReviewActivityLinkageProposalMutation,
  useRunActivityAnalysisV2Mutation,
  useStartActivityInterpretationMutation,
  useProjectInterpretationsQuery,
} from "@/hooks/useWorkspaceQueries";
import { useRequireAuth } from "@/hooks/useAuth";
import { getQuestionsByDomain } from "@/lib/interpretationWorkflow";
import {
  ApiError,
  apiClient,
  type ActivityEvidenceLinkageProposalRecord,
  type ActivityEvidenceLinkageResultRecord,
  type ActivityAnalysisRunV2Record,
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
const FIRST_LAYER_CLARIFICATION_QUESTION_CODES = new Set([
  "normalization_merge",
  "row_grain",
  "duplicate_identifier_resolution",
] as const);
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

function isFirstLayerClarificationQuestion(
  question: InterpretationQuestion,
): boolean {
  return (
    question.questionCode === null ||
    FIRST_LAYER_CLARIFICATION_QUESTION_CODES.has(question.questionCode)
  );
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

function formatAnalysisNumber(value: number, language: string): string {
  return new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function isAnalysisGoalAttentionStatus(
  status: NonNullable<ActivityAnalysisRunV2Record["assessment"]>["goalAssessments"][number]["assessmentStatus"],
): boolean {
  return (
    status === "not_achieved" ||
    status === "requires_clarification" ||
    status === "requires_capability"
  );
}

function isAnalysisGoalPositiveStatus(
  status: NonNullable<ActivityAnalysisRunV2Record["assessment"]>["goalAssessments"][number]["assessmentStatus"],
): boolean {
  return status === "achieved";
}

function AnalysisOpenDialog({
  activityName,
  run,
  open,
  onOpenChange,
}: {
  activityName: string;
  run: ActivityAnalysisRunV2Record | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t, i18n } = useTranslation();
  const goalAssessments = run?.assessment?.goalAssessments ?? [];
  const topMetricAssessments = goalAssessments.filter(
    (goalAssessment) =>
      goalAssessment.goalType === "output" &&
      goalAssessment.measuredValue !== null &&
      goalAssessment.targetValue !== null,
  );

  return (
    <Dialog open={open && Boolean(run)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto border-[#e5d7be] bg-[#faf5eb] px-8 py-8 sm:px-10">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {activityName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {topMetricAssessments.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {topMetricAssessments.map((goalAssessment) => {
                const achieved = goalAssessment.achieved === true;
                const percentOfTarget =
                  goalAssessment.measuredValue !== null &&
                  goalAssessment.targetValue &&
                  goalAssessment.targetValue !== 0
                    ? goalAssessment.measuredValue / goalAssessment.targetValue
                    : null;

                return (
                  <div
                    key={goalAssessment.goalId}
                    className={
                      achieved
                        ? "rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-4"
                        : "rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-4"
                    }
                  >
                    <div className="text-xs font-medium leading-5 text-foreground">
                      {goalAssessment.goalText}
                    </div>
                    <div
                      className={
                        achieved
                          ? "mt-3 text-2xl font-semibold tracking-tight text-emerald-700"
                          : "mt-3 text-2xl font-semibold tracking-tight text-rose-700"
                      }
                    >
                      {formatAnalysisNumber(
                        goalAssessment.measuredValue ?? 0,
                        i18n.language,
                      )}{" "}
                      <span className="text-lg font-medium">
                        /{" "}
                        {t("activityAnalytics.v2.goalTarget", {
                          target: formatAnalysisNumber(
                            goalAssessment.targetValue ?? 0,
                            i18n.language,
                          ),
                        })}
                      </span>
                    </div>
                    <div
                      className={
                        achieved
                          ? "mt-2 flex items-center gap-2 text-sm font-medium text-emerald-700"
                          : "mt-2 flex items-center gap-2 text-sm font-medium text-rose-700"
                      }
                    >
                      {achieved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {achieved
                        ? t("activityAnalytics.v2.goalMet")
                        : percentOfTarget !== null
                          ? t("activityAnalytics.v2.goalPercentOfTarget", {
                              percent: new Intl.NumberFormat(
                                i18n.language === "de" ? "de-DE" : "en-US",
                                {
                                  style: "percent",
                                  maximumFractionDigits: 0,
                                },
                              ).format(percentOfTarget),
                            })
                          : t(
                              `activityAnalytics.v2.goalStatus.${goalAssessment.assessmentStatus}`,
                            )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("activityAnalytics.v2.summaryMissing")}
            </p>
          )}

          {run?.renderedSummary ? (
            <section className="rounded-[16px] border border-border/80 bg-background/70 px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("activityAnalytics.v2.summaryTitle")}
              </div>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground">
                {run.renderedSummary}
              </div>
            </section>
          ) : null}

          {run?.recommendationText ? (
            <section className="rounded-[16px] border border-border/80 bg-background/70 px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("activityAnalytics.v2.recommendationSectionTitle")}
              </div>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground">
                {run.recommendationText}
              </div>
            </section>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LinkageReviewDialog({
  activityName,
  uploads,
  review,
  open,
  isLoading,
  isSubmitting,
  onOpenChange,
  onDecision,
}: {
  activityName: string;
  uploads: UploadMetadataRecord[];
  review: ActivityEvidenceLinkageResultRecord | null;
  open: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onDecision: (
    proposalId: string,
    decision: "accept" | "reject",
  ) => void;
}) {
  const { t, i18n } = useTranslation();
  const uploadNameById = new Map(
    uploads.map((upload) => [upload.id, upload.originalFileName] as const),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto border-[#e5d7be] bg-[#faf5eb] px-8 py-8 sm:px-10">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {activityName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <section className="rounded-[16px] border border-border/80 bg-background/70 px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t("projectWorkspace.interpretation.simplified.linkageReviewTitle")}
            </div>
            <p className="mt-3 text-sm leading-7 text-foreground">
              {t(
                "projectWorkspace.interpretation.simplified.linkageReviewDescription",
              )}
            </p>
          </section>

          {isLoading ? (
            <section className="rounded-[16px] border border-border/80 bg-background/70 px-4 py-4 text-sm leading-7 text-foreground">
              {t(
                "projectWorkspace.interpretation.simplified.linkageReviewLoading",
              )}
            </section>
          ) : review?.proposals.length ? (
            <div className="space-y-4">
              {review.proposals.map((proposal) => (
                <LinkageProposalCard
                  key={proposal.proposalId}
                  proposal={proposal}
                  uploadNameById={uploadNameById}
                  language={i18n.language}
                  isSubmitting={isSubmitting}
                  onDecision={onDecision}
                />
              ))}
            </div>
          ) : (
            <section className="rounded-[16px] border border-border/80 bg-background/70 px-4 py-4 text-sm leading-7 text-foreground">
              {t(
                "projectWorkspace.interpretation.simplified.linkageReviewResolved",
              )}
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LinkageProposalCard({
  proposal,
  uploadNameById,
  language,
  isSubmitting,
  onDecision,
}: {
  proposal: ActivityEvidenceLinkageProposalRecord;
  uploadNameById: Map<string, string>;
  language: string;
  isSubmitting: boolean;
  onDecision: (
    proposalId: string,
    decision: "accept" | "reject",
  ) => void;
}) {
  const { t } = useTranslation();
  const overlapText = new Intl.NumberFormat(
    language === "de" ? "de-DE" : "en-US",
    {
      style: "percent",
      maximumFractionDigits: 0,
    },
  ).format(proposal.overlapRatio);

  return (
    <section className="rounded-[16px] border border-border/80 bg-background/70 px-4 py-4">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {uploadNameById.get(proposal.uploadMetadataIdA) ??
          proposal.uploadMetadataIdA}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {proposal.tableNameA} · {proposal.columnNameA}
      </div>
      <div className="mt-3 text-sm font-semibold tracking-tight text-foreground">
        {uploadNameById.get(proposal.uploadMetadataIdB) ??
          proposal.uploadMetadataIdB}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {proposal.tableNameB} · {proposal.columnNameB}
      </div>
      <p className="mt-4 text-sm leading-6 text-foreground">
        {t(
          "projectWorkspace.interpretation.simplified.linkageProposalPrompt",
          {
            tableA: proposal.tableNameA,
            columnA: proposal.columnNameA,
            tableB: proposal.tableNameB,
            columnB: proposal.columnNameB,
            overlap: overlapText,
          },
        )}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onDecision(proposal.proposalId, "accept")}
        >
          {t("projectWorkspace.interpretation.simplified.linkageAcceptAction")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onDecision(proposal.proposalId, "reject")}
        >
          {t("projectWorkspace.interpretation.simplified.linkageRejectAction")}
        </Button>
      </div>
    </section>
  );
}

function ProjectInterpretationPage() {
  const { projectId } = Route.useParams();
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
          // goal_review has no long-running job to measure age from; keep a
          // short steady poll so the page notices when linkage review has
          // been resolved and the activity becomes analysis-ready.
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
    (entry) => entry.status === "ready" || entry.status === "reviewed",
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
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string | undefined;
  uploads: UploadMetadataRecord[];
  jobs: ProcessingJobRecord[];
  results: InterpretationResultRecord[];
  workflowStage: ActivityWorkflowStage | undefined;
  onOpenPrivacyReview: (jobId: string, activityName: string) => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [isLinkageDialogOpen, setIsLinkageDialogOpen] = useState(false);
  const startMutation = useStartActivityInterpretationMutation(
    activity.id,
    projectId,
  );
  const runAnalysisMutation = useRunActivityAnalysisV2Mutation(activity.id);
  const answerActivityAnalysisV2QuestionMutation =
    useAnswerActivityAnalysisV2QuestionMutation(activity.id);
  const linkageReviewQuery = useActivityLinkageReviewQuery(
    activity.id,
    workflowStage === "goal_review" || isLinkageDialogOpen,
  );
  const reviewLinkageProposalMutation =
    useReviewActivityLinkageProposalMutation(activity.id);
  const latestAnalysisV2Query = useLatestActivityAnalysisV2Query(
    activity.id,
    uploads.length > 0,
  );
  const activityAnalysisRunsQuery = useActivityAnalysisV2RunsQuery(
    activity.id,
    uploads.length > 0,
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
    void queryClient.invalidateQueries({
      queryKey: activityLinkageReviewQueryKey(activity.id),
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
    ]
      .filter(isFirstLayerClarificationQuestion)
      .map((question) => ({ result, question })),
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
  const canGenerateAnalysis =
    (status === "ready" || status === "reviewed") &&
    !hasUnresolvedActionableQuestion;
  const interpretationActionLabel = hasExistingInterpretations
    ? t(
        "projectWorkspace.interpretation.simplified.actionInterpretMissingEvidence",
      )
    : t("projectWorkspace.interpretation.simplified.actionRunKnowledge");
  const latestAnalysisRun = latestAnalysisV2Query.data ?? null;
  const latestOpenableAnalysisRun =
    activityAnalysisRunsQuery.data?.find(
      (run) => run.status === "completed" && Boolean(run.renderedSummary),
    ) ?? null;
  const hasOpenableAnalysis = Boolean(latestOpenableAnalysisRun);
  const pendingAnalysisClarificationCount =
    latestAnalysisRun?.clarificationQuestions.filter(
      (question) => question.status === "pending",
    ).length ?? 0;
  const latestAnalysisNeedsClarification =
    latestAnalysisRun?.status === "needs_clarification" &&
    pendingAnalysisClarificationCount > 0;
  const latestAnalysisFailed = latestAnalysisRun?.status === "failed";

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
                : hasOpenableAnalysis
                  ? t(
                      "projectWorkspace.interpretation.simplified.activitySummary.v2Completed",
                    )
                  : latestAnalysisNeedsClarification
                    ? t(
                        "projectWorkspace.interpretation.simplified.activitySummary.v2NeedsClarification",
                        {
                          count: pendingAnalysisClarificationCount,
                        },
                      )
                    : latestAnalysisFailed
                      ? t(
                          "projectWorkspace.interpretation.simplified.activitySummary.v2Failed",
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
    <>
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

            {canGenerateAnalysis && hasOpenableAnalysis ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAnalysisDialogOpen(true)}
              >
                {t("activityAnalytics.v2.openAction")}
              </Button>
            ) : null}

            {canGenerateAnalysis ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  runAnalysisMutation.mutate(undefined, {
                    onSuccess: async (run) => {
                      await Promise.all([
                        queryClient.invalidateQueries({
                          queryKey: activityAnalysisV2LatestQueryKey(
                            activity.id,
                          ),
                        }),
                        queryClient.invalidateQueries({
                          queryKey: activityAnalysisV2RunsQueryKey(activity.id),
                        }),
                      ]);
                      toast.success(t("activityAnalytics.v2.runSuccess"));
                      if (run.status === "completed" && run.renderedSummary) {
                        setIsAnalysisDialogOpen(true);
                      }
                    },
                    onError: (error) => {
                      toast.error(
                        error instanceof ApiError
                          ? error.message
                          : t("activityAnalytics.v2.runFailed"),
                      );
                    },
                  })
                }
                disabled={runAnalysisMutation.isPending}
              >
                {runAnalysisMutation.isPending
                  ? t("activityAnalytics.v2.runPending")
                  : latestAnalysisRun
                    ? t("activityAnalytics.v2.refreshAction")
                    : t("activityAnalytics.v2.runAction")}
              </Button>
            ) : null}

            {status === "goal_review" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLinkageDialogOpen(true)}
              >
                {t(
                  "projectWorkspace.interpretation.simplified.reviewLinkageAction",
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

        {latestAnalysisNeedsClarification ? (
          <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              <CircleHelp className="h-4 w-4 text-primary" />
              {t("activityAnalytics.v2.clarificationTitle")}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("activityAnalytics.v2.clarificationDescription")}
            </p>
            {latestAnalysisRun?.clarificationQuestions
              .filter((question) => question.status === "pending")
              .map((question) => (
                <InterpretationQuestionCard
                  key={question.id}
                  activityName={activity.name}
                  question={question}
                  isSubmitting={
                    answerActivityAnalysisV2QuestionMutation.isPending
                  }
                  onSubmit={({ questionId, answeredValue }) =>
                    answerActivityAnalysisV2QuestionMutation.mutate(
                      {
                        questionId,
                        payload: { answeredValue },
                      },
                      {
                        onSuccess: (run) => {
                          if (run.status === "failed") {
                            toast.error(t("activityAnalytics.v2.runFailed"));
                            return;
                          }
                          toast.success(
                            t("activityAnalytics.v2.clarificationAnswered"),
                          );
                          if (run.status === "completed" && run.renderedSummary) {
                            setIsAnalysisDialogOpen(true);
                          }
                        },
                        onError: (error) => {
                          toast.error(
                            error instanceof ApiError
                              ? error.message
                              : t("activityAnalytics.v2.runFailed"),
                          );
                        },
                      },
                    )
                  }
                />
              ))}
          </div>
        ) : null}
      </Card>

      <AnalysisOpenDialog
        activityName={activity.name}
        run={latestOpenableAnalysisRun}
        open={isAnalysisDialogOpen && hasOpenableAnalysis}
        onOpenChange={setIsAnalysisDialogOpen}
      />
      <LinkageReviewDialog
        activityName={activity.name}
        uploads={uploads}
        review={linkageReviewQuery.data ?? null}
        open={isLinkageDialogOpen}
        isLoading={linkageReviewQuery.isLoading}
        isSubmitting={reviewLinkageProposalMutation.isPending}
        onOpenChange={setIsLinkageDialogOpen}
        onDecision={(proposalId, decision) =>
          reviewLinkageProposalMutation.mutate(
            { proposalId, decision },
            {
              onSuccess: (result) => {
                toast.success(
                  t(
                    decision === "accept"
                      ? "projectWorkspace.interpretation.simplified.linkageAccepted"
                      : "projectWorkspace.interpretation.simplified.linkageRejected",
                  ),
                );
                if (result.status === "resolved" && result.proposals.length === 0) {
                  setIsLinkageDialogOpen(false);
                }
              },
              onError: (error) => {
                toast.error(
                  error instanceof ApiError
                    ? error.message
                    : t(
                        "projectWorkspace.interpretation.simplified.linkageDecisionFailed",
                      ),
                );
              },
            },
          )
        }
      />
    </>
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
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-200 bg-amber-50 text-amber-800"
      >
        <CircleHelp className="h-3.5 w-3.5" />
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
