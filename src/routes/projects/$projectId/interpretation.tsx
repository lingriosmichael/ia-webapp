import { useQueries, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Sparkles,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PrivacyReviewDialog } from "@/components/privacyReviewDialog";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import {
  activityJobsQueryKey,
  activityUploadsQueryKey,
  projectInterpretationsQueryKey,
  useAcknowledgeInterpretationReviewMutation,
  useActivityJobsQuery,
  useActivityUploadsQuery,
  useAnswerInterpretationQuestionMutation,
  useJobQuery,
  useProjectInterpretationsQuery,
  useSetIndicatorStatusMutation,
  useStartInterpretationMutation,
} from "@/hooks/useWorkspaceQueries";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  getQuestionsByDomain,
} from "@/lib/interpretationWorkflow";
import {
  apiClient,
  type EvidenceModality,
  type InterpretationIndicator,
  type InterpretationQuestion,
  type InterpretationQuestionDomain,
  type InterpretationResultRecord,
  type ParsedRepresentationPreviewRecord,
  type ProcessingJobRecord,
  type UploadMetadataRecord,
  type WorkspaceActivity,
} from "@/services/apiClient";

const INTERPRETATION_POLL_INTERVAL_MS = 3000;
const TERMINAL_JOB_STATUSES = ["completed", "failed", "cancelled"];

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

function getQuestionDomainLabelKey(
  questionDomain: InterpretationQuestionDomain,
) {
  return questionDomain === "preparation"
    ? "projectWorkspace.interpretation.questionDomainPreparationLabel"
    : "projectWorkspace.interpretation.questionDomainInterpretationLabel";
}

function isPrivacyPreviewAvailable(job: ProcessingJobRecord | undefined) {
  return Boolean(
    job &&
    ["awaiting_privacy_review", "transforming", "completed"].includes(
      job.status,
    ),
  );
}

export const Route = createFileRoute("/projects/$projectId/interpretation")({
  component: ProjectInterpretationPage,
});

type ActivityWorkflowStatus =
  | "no_evidence"
  | "privacy_review"
  | "processing"
  | "questions"
  | "ready"
  | "reviewed"
  | "not_started";

function getPendingQuestionCount(
  result: InterpretationResultRecord,
  questionDomain?: InterpretationQuestionDomain,
) {
  return result.questions.filter((question) => {
    if (question.status !== "pending") {
      return false;
    }
    return questionDomain ? question.questionDomain === questionDomain : true;
  }).length;
}

function getActivityResultStatus(
  activity: WorkspaceActivity,
  uploads: UploadMetadataRecord[],
  jobs: ProcessingJobRecord[],
  results: InterpretationResultRecord[],
): ActivityWorkflowStatus {
  if (uploads.length === 0) {
    return "no_evidence";
  }

  if (activity.interpretationAcknowledgedAt) {
    return "reviewed";
  }

  const hasPendingPrivacyReview = jobs.some(
    (job) =>
      job.jobType === "evidence_processing" &&
      job.status === "awaiting_privacy_review",
  );
  if (hasPendingPrivacyReview) {
    return "privacy_review";
  }

  const hasActiveInterpretationJob = jobs.some(
    (job) =>
      job.jobType === "dataset_interpretation" &&
      !TERMINAL_JOB_STATUSES.includes(job.status),
  );
  if (hasActiveInterpretationJob) {
    return "processing";
  }

  const hasPendingQuestions = results.some(
    (result) => getPendingQuestionCount(result) > 0,
  );
  if (hasPendingQuestions) {
    return "questions";
  }

  if (results.length > 0 && results.length === uploads.length) {
    return "ready";
  }

  return "not_started";
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
  const resultsByUploadId = new Map(
    results.map((result) => [result.uploadMetadataId, result]),
  );
  const activityJobsQueries = useQueries({
    queries: activities.map((activity) => ({
      queryKey: activityJobsQueryKey(activity.id),
      queryFn: () => apiClient.listActivityJobs(activity.id),
      enabled: true,
    })),
  });
  const activityUploadsQueries = useQueries({
    queries: activities.map((activity) => ({
      queryKey: activityUploadsQueryKey(activity.id),
      queryFn: () => apiClient.listActivityUploads(activity.id),
      enabled: true,
    })),
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

  const pendingPreparationQuestions = results.flatMap((result) =>
    getQuestionsByDomain(result.questions, "preparation", "pending").map(
      (question) => ({ result, question }),
    ),
  );
  const pendingInterpretationQuestions = results.flatMap((result) =>
    getQuestionsByDomain(result.questions, "interpretation", "pending").map(
      (question) => ({ result, question }),
    ),
  );
  const answeredQuestions = results.flatMap((result) =>
    result.questions
      .filter((question) => question.status === "answered")
      .map((question) => ({ result, question })),
  );
  const totalUploadCount = activities.reduce(
    (total, activity) => total + activity.uploadMetadataCount,
    0,
  );
  const interpretedUploadCount = results.length;
  const reviewedActivityCount = activities.filter((activity) => {
    const uploads = uploadsByActivityId.get(activity.id) ?? [];
    const jobs = jobsByActivityId.get(activity.id) ?? [];
    const activityResults = results.filter(
      (result) => result.activityId === activity.id,
    );
    return (
      getActivityResultStatus(activity, uploads, jobs, activityResults) ===
      "reviewed"
    );
  }).length;
  const readyForReviewActivityCount = activities.filter((activity) => {
    const uploads = uploadsByActivityId.get(activity.id) ?? [];
    const jobs = jobsByActivityId.get(activity.id) ?? [];
    const activityResults = results.filter(
      (result) => result.activityId === activity.id,
    );
    return (
      getActivityResultStatus(activity, uploads, jobs, activityResults) ===
      "ready"
    );
  }).length;
  const pendingPrivacyItems = activities
    .map((activity) => {
      const uploads = uploadsByActivityId.get(activity.id) ?? [];
      const jobs = jobsByActivityId.get(activity.id) ?? [];
      const pendingJob = jobs.find(
        (job) =>
          job.jobType === "evidence_processing" &&
          job.status === "awaiting_privacy_review",
      );
      if (!pendingJob) {
        return null;
      }

      const upload = uploads.find((item) => item.id === pendingJob.uploadMetadataId);
      return {
        activityId: activity.id,
        activityName: activity.name,
        uploadName:
          upload?.originalFileName ??
          t("projectWorkspace.interpretation.privacyUnknownFile"),
        jobId: pendingJob.id,
      };
    })
    .filter(
      (
        item,
      ): item is {
        activityId: string;
        activityName: string;
        uploadName: string;
        jobId: string;
      } => Boolean(item),
    );
  const openTaskCount =
    pendingPrivacyItems.length +
    pendingPreparationQuestions.length +
    pendingInterpretationQuestions.length;

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="mt-6">
          <div className="space-y-4">
            <InterpretationStatusHero
              interpretedUploadCount={interpretedUploadCount}
              totalUploadCount={totalUploadCount}
              openTaskCount={openTaskCount}
              readyForReviewActivityCount={readyForReviewActivityCount}
              reviewedActivityCount={reviewedActivityCount}
            />

            <OpenTasksSection
              pendingPrivacyItems={pendingPrivacyItems}
              pendingPreparationQuestions={pendingPreparationQuestions}
              pendingInterpretationQuestions={pendingInterpretationQuestions}
              readyForReviewActivityCount={readyForReviewActivityCount}
              activities={activities}
              projectId={projectId}
              organizationId={workspaceProject?.organizationId}
              onOpenPrivacyReview={(jobId, activityName) =>
                setReviewProcessingJob({ jobId, activityName })
              }
            />

            <div className="space-y-4">
              <SectionTitle
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                title={t(
                  "projectWorkspace.interpretation.simplified.activitiesTitle",
                )}
              />
              {activities.length === 0 ? (
                <Card className="p-5 text-sm text-muted-foreground">
                  {t("projectWorkspace.interpretation.understoodEmpty")}
                </Card>
              ) : (
                activities.map((activity) => (
                  <InterpretationActivityGroup
                    key={activity.id}
                    activity={activity}
                    projectId={projectId}
                    organizationId={workspaceProject?.organizationId}
                    resultsByUploadId={resultsByUploadId}
                    onOpenPrivacyReview={(jobId, activityName) =>
                      setReviewProcessingJob({ jobId, activityName })
                    }
                  />
                ))
              )}
            </div>

            {answeredQuestions.length > 0 ? (
              <ReviewedQuestionsSection
                questions={answeredQuestions}
                activities={activities}
                projectId={projectId}
                organizationId={workspaceProject?.organizationId}
              />
            ) : null}
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

function InterpretationStatusHero({
  interpretedUploadCount,
  totalUploadCount,
  openTaskCount,
  readyForReviewActivityCount,
  reviewedActivityCount,
}: {
  interpretedUploadCount: number;
  totalUploadCount: number;
  openTaskCount: number;
  readyForReviewActivityCount: number;
  reviewedActivityCount: number;
}) {
  const { t } = useTranslation();
  const title =
    openTaskCount > 0
      ? t("projectWorkspace.interpretation.simplified.heroTitle", {
          count: openTaskCount,
        })
      : t("projectWorkspace.interpretation.simplified.heroClearTitle");

  return (
    <Card className="border-primary/12 bg-primary-soft/25 p-6">
      <div className="max-w-[48rem]">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {t("projectWorkspace.interpretation.title")}
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {t("projectWorkspace.interpretation.simplified.heroDescription")}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <SummaryMetric
            label={t("projectWorkspace.interpretation.simplified.statOpenTasks")}
            value={String(openTaskCount)}
          />
          <SummaryMetric
            label={t(
              "projectWorkspace.interpretation.simplified.statReadyForReview",
            )}
            value={String(readyForReviewActivityCount)}
          />
          <SummaryMetric
            label={t("projectWorkspace.interpretation.simplified.statReviewed")}
            value={String(reviewedActivityCount)}
          />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          {t("projectWorkspace.interpretation.filesInterpretedStatus", {
            interpreted: interpretedUploadCount,
            total: totalUploadCount,
          })}
        </p>
      </div>
    </Card>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
      {icon}
      {title}
    </div>
  );
}

function OpenTasksSection({
  pendingPrivacyItems,
  pendingPreparationQuestions,
  pendingInterpretationQuestions,
  readyForReviewActivityCount,
  activities,
  projectId,
  organizationId,
  onOpenPrivacyReview,
}: {
  pendingPrivacyItems: Array<{
    activityId: string;
    activityName: string;
    uploadName: string;
    jobId: string;
  }>;
  pendingPreparationQuestions: Array<{
    result: InterpretationResultRecord;
    question: InterpretationQuestion;
  }>;
  pendingInterpretationQuestions: Array<{
    result: InterpretationResultRecord;
    question: InterpretationQuestion;
  }>;
  readyForReviewActivityCount: number;
  activities: WorkspaceActivity[];
  projectId: string;
  organizationId: string | undefined;
  onOpenPrivacyReview: (jobId: string, activityName: string) => void;
}) {
  const { t } = useTranslation();
  const hasTasks =
    pendingPrivacyItems.length > 0 ||
    pendingPreparationQuestions.length > 0 ||
    pendingInterpretationQuestions.length > 0;

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={<AlertTriangle className="h-4 w-4 text-primary" />}
        title={t("projectWorkspace.interpretation.simplified.openTasksTitle")}
      />
      {!hasTasks ? (
        <Card className="p-5">
          <div className="text-sm font-semibold tracking-tight text-foreground">
            {t(
              "projectWorkspace.interpretation.simplified.openTasksEmptyTitle",
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {readyForReviewActivityCount > 0
              ? t(
                  "projectWorkspace.interpretation.simplified.openTasksEmptyReadyHint",
                  { count: readyForReviewActivityCount },
                )
              : t(
                  "projectWorkspace.interpretation.simplified.openTasksEmptyDescription",
                )}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {pendingPrivacyItems.map((item) => (
            <Card key={item.jobId} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold tracking-tight text-foreground">
                    {item.activityName}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t(
                      "projectWorkspace.interpretation.simplified.privacyTaskDescription",
                      { fileName: item.uploadName },
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    onOpenPrivacyReview(item.jobId, item.activityName)
                  }
                >
                  {t("projectWorkspace.interpretation.reviewPrivacyAction")}
                </Button>
              </div>
            </Card>
          ))}

          {pendingPreparationQuestions.map(({ result, question }) => (
            <QuestionCard
              key={question.id}
              activityName={
                activities.find((activity) => activity.id === result.activityId)
                  ?.name ?? result.datasetType
              }
              interpretationResultId={result.id}
              projectId={projectId}
              organizationId={organizationId}
              question={question}
            />
          ))}

          {pendingInterpretationQuestions.map(({ result, question }) => (
            <QuestionCard
              key={question.id}
              activityName={
                activities.find((activity) => activity.id === result.activityId)
                  ?.name ?? result.datasetType
              }
              interpretationResultId={result.id}
              projectId={projectId}
              organizationId={organizationId}
              question={question}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewedQuestionsSection({
  questions,
  activities,
  projectId,
  organizationId,
}: {
  questions: Array<{
    result: InterpretationResultRecord;
    question: InterpretationQuestion;
  }>;
  activities: WorkspaceActivity[];
  projectId: string;
  organizationId: string | undefined;
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={<CircleHelp className="h-4 w-4 text-primary" />}
        title={t("projectWorkspace.interpretation.reviewedQuestionsTitle")}
      />
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="flex w-full items-center justify-between rounded-[12px] border border-border/80 bg-background px-5 py-4 text-left transition-colors hover:bg-secondary/20"
        aria-expanded={isExpanded}
      >
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {t("projectWorkspace.interpretation.reviewedQuestionsSummary", {
              count: questions.length,
            })}
          </p>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <Badge variant="secondary">{questions.length}</Badge>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded ? (
        <Card className="divide-y divide-border/70 overflow-hidden">
          {questions.map(({ result, question }) => (
            <QuestionCard
              key={question.id}
              activityName={
                activities.find((activity) => activity.id === result.activityId)
                  ?.name ?? result.datasetType
              }
              interpretationResultId={result.id}
              projectId={projectId}
              organizationId={organizationId}
              question={question}
              embedded
            />
          ))}
        </Card>
      ) : null}
    </div>
  );
}

function InterpretationActivityGroup({
  activity,
  projectId,
  organizationId,
  resultsByUploadId,
  onOpenPrivacyReview,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string | undefined;
  resultsByUploadId: Map<string, InterpretationResultRecord>;
  onOpenPrivacyReview: (jobId: string, activityName: string) => void;
}) {
  const { t } = useTranslation();
  const uploadsQuery = useActivityUploadsQuery(activity.id, true);
  const jobsQuery = useActivityJobsQuery(
    activity.id,
    true,
    INTERPRETATION_POLL_INTERVAL_MS,
  );
  const acknowledgeMutation = useAcknowledgeInterpretationReviewMutation(
    activity.id,
    organizationId,
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const uploads = uploadsQuery.data ?? [];
  const jobs = jobsQuery.data ?? [];
  const latestEvidenceJobByUploadId = new Map(
    uploads.map((upload) => [
      upload.id,
      jobs.find(
        (job) =>
          job.jobType === "evidence_processing" &&
          job.uploadMetadataId === upload.id,
      ),
    ]),
  );
  const privacyReviewQueries = useQueries({
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
      privacyReviewQueries[index]?.data?.parsedRepresentationPreview ?? null,
    ]),
  );
  const activityResults = uploads
    .map((upload) => resultsByUploadId.get(upload.id))
    .filter((result): result is InterpretationResultRecord => Boolean(result));
  const pendingPrivacyReview = jobs.find(
    (job) =>
      job.jobType === "evidence_processing" &&
      job.status === "awaiting_privacy_review",
  );
  const pendingPrivacyReviewCount = jobs.filter(
    (job) =>
      job.jobType === "evidence_processing" &&
      job.status === "awaiting_privacy_review",
  ).length;
  const pendingPreparationQuestionCount = activityResults.reduce(
    (count, result) => count + getPendingQuestionCount(result, "preparation"),
    0,
  );
  const pendingInterpretationQuestionCount = activityResults.reduce(
    (count, result) =>
      count + getPendingQuestionCount(result, "interpretation"),
    0,
  );
  const totalPendingQuestionCount =
    pendingPreparationQuestionCount + pendingInterpretationQuestionCount;
  const hasUnresolvedActionableQuestion = activityResults.some((result) =>
    hasPendingBlockingQuestions(result.questions),
  );
  const canAcknowledge =
    uploads.length > 0 &&
    activityResults.length === uploads.length &&
    !pendingPrivacyReview &&
    !hasUnresolvedActionableQuestion;
  const status = getActivityResultStatus(activity, uploads, jobs, activityResults);
  const summary =
    status === "no_evidence"
      ? t("projectWorkspace.interpretation.noEvidenceYet")
      : status === "privacy_review"
        ? t(
            "projectWorkspace.interpretation.simplified.activitySummary.privacyReview",
            {
              count: pendingPrivacyReviewCount,
            },
          )
        : status === "processing"
          ? t(
              "projectWorkspace.interpretation.simplified.activitySummary.processing",
            )
          : status === "questions"
            ? t(
                "projectWorkspace.interpretation.simplified.activitySummary.questions",
                {
                  count: totalPendingQuestionCount,
                },
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
            <ActivityStatusBadge status={status} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>
          {uploads.length > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("projectWorkspace.interpretation.simplified.activityMeta", {
                uploads: uploads.length,
                interpreted: activityResults.length,
              })}
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("projectWorkspace.interpretation.simplified.activityNoFiles")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status === "privacy_review" && pendingPrivacyReview ? (
            <Button
              size="sm"
              onClick={() =>
                onOpenPrivacyReview(pendingPrivacyReview.id, activity.name)
              }
            >
              {t("projectWorkspace.interpretation.reviewPrivacyAction")}
            </Button>
          ) : null}
          {status === "ready" ? (
            <Button
              size="sm"
              variant="outline"
              disabled={!canAcknowledge || acknowledgeMutation.isPending}
              onClick={() => acknowledgeMutation.mutate()}
            >
              {acknowledgeMutation.isPending
                ? t("projectWorkspace.interpretation.acknowledgePending")
                : t("projectWorkspace.interpretation.acknowledgeAction")}
            </Button>
          ) : null}
          {uploads.length > 0 ? (
            <button
              type="button"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-label={
                isExpanded
                  ? t(
                      "projectWorkspace.interpretation.simplified.activityHideDetails",
                    )
                  : t(
                      "projectWorkspace.interpretation.simplified.activityShowDetails",
                    )
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              {isExpanded
                ? <ChevronDown className="h-5 w-5" />
                : <ChevronRight className="h-5 w-5" />}
            </button>
          ) : null}
        </div>
      </div>

      {uploads.length > 0 && isExpanded ? (
        <div className="mt-4 divide-y divide-border/70 border-t border-border/70 pt-4">
          {uploads.map((upload) => (
            <DatasetInterpretationCard
              key={upload.id}
              activityId={activity.id}
              activityName={activity.name}
              activityAcknowledged={activity.interpretationAcknowledgedAt !== null}
              projectId={projectId}
              organizationId={organizationId}
              parsedRepresentationPreview={previewByUploadId.get(upload.id)}
              upload={upload}
              jobs={jobs}
              result={resultsByUploadId.get(upload.id)}
              onOpenPrivacyReview={onOpenPrivacyReview}
            />
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function DatasetInterpretationCard({
  activityId,
  activityName,
  activityAcknowledged,
  projectId,
  organizationId,
  parsedRepresentationPreview,
  upload,
  jobs,
  result,
  onOpenPrivacyReview,
}: {
  activityId: string;
  activityName: string;
  activityAcknowledged: boolean;
  projectId: string;
  organizationId: string | undefined;
  parsedRepresentationPreview:
    ParsedRepresentationPreviewRecord | null | undefined;
  upload: UploadMetadataRecord;
  jobs: ProcessingJobRecord[];
  result: InterpretationResultRecord | undefined;
  onOpenPrivacyReview: (jobId: string, activityName: string) => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const startMutation = useStartInterpretationMutation(activityId, projectId);
  const setIndicatorStatusMutation = useSetIndicatorStatusMutation(
    result?.id ?? "",
    projectId,
    organizationId,
  );

  const latestEvidenceJob = jobs.find(
    (job) =>
      job.jobType === "evidence_processing" &&
      job.uploadMetadataId === upload.id,
  );
  const activeInterpretationJob = jobs.find(
    (job) =>
      job.jobType === "dataset_interpretation" &&
      job.uploadMetadataId === upload.id &&
      !TERMINAL_JOB_STATUSES.includes(job.status),
  );

  // Merely re-fetching the job list (above) only re-reads whatever is
  // already in the database — it never asks Python for the interpretation
  // job's real, current status. useJobQuery is what actually calls
  // POST /jobs/:id/sync (same mechanism the evidence/activity overview
  // pages use), so without this the job would sit at "processing" forever
  // once one exists, no matter how long the pipeline actually takes.
  const activeJobSyncQuery = useJobQuery(
    activeInterpretationJob?.id,
    Boolean(activeInterpretationJob?.id),
  );
  const isInterpreting =
    startMutation.isPending || Boolean(activeInterpretationJob);
  const evidenceModality =
    parsedRepresentationPreview?.evidenceModality ?? null;
  const interpretationSupportState = getEvidenceSupportState(evidenceModality);
  const pendingQuestionCount = result ? getPendingQuestionCount(result) : 0;
  const isAwaitingPrivacyReview =
    latestEvidenceJob?.status === "awaiting_privacy_review";
  const isReviewReady =
    Boolean(result) &&
    pendingQuestionCount === 0 &&
    interpretationSupportState === "supported";
  const datasetStatus: ActivityWorkflowStatus = isAwaitingPrivacyReview
    ? "privacy_review"
    : isInterpreting
      ? "processing"
      : result && pendingQuestionCount > 0
        ? "questions"
        : activityAcknowledged && result
          ? "reviewed"
          : isReviewReady
            ? "ready"
            : "not_started";

  useEffect(() => {
    const syncedStatus = activeJobSyncQuery.data?.status;
    if (syncedStatus && TERMINAL_JOB_STATUSES.includes(syncedStatus)) {
      void queryClient.invalidateQueries({
        queryKey: activityJobsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectInterpretationsQueryKey(projectId),
      });
    }
  }, [activeJobSyncQuery.data?.status, activityId, projectId, queryClient]);

  const canInterpret =
    latestEvidenceJob?.status === "completed" &&
    interpretationSupportState === "supported" &&
    !activeInterpretationJob &&
    !startMutation.isPending;
  const interpretErrorCode =
    startMutation.variables === upload.id ? startMutation.error?.code : null;

  function handleInterpret() {
    startMutation.mutate(upload.id);
  }

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold tracking-tight text-foreground">
              {upload.originalFileName}
            </div>
            {datasetStatus !== "reviewed" ? (
              <ActivityStatusBadge status={datasetStatus} />
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isAwaitingPrivacyReview
              ? t(
                  "projectWorkspace.interpretation.simplified.datasetSummary.privacyReview",
                )
              : isInterpreting
                ? t(
                    "projectWorkspace.interpretation.simplified.datasetSummary.processing",
                  )
                : result && pendingQuestionCount > 0
                  ? t(
                      "projectWorkspace.interpretation.simplified.datasetSummary.questions",
                      {
                        count: pendingQuestionCount,
                      },
                    )
                  : activityAcknowledged && result
                    ? t(
                        "projectWorkspace.interpretation.simplified.datasetSummary.reviewed",
                      )
                    : result
                      ? t(
                          "projectWorkspace.interpretation.simplified.datasetSummary.ready",
                        )
                      : interpretationSupportState === "insufficiently_extracted"
                        ? t(
                            "projectWorkspace.interpretation.interpretInsufficientExtraction",
                          )
                        : t(
                            "projectWorkspace.interpretation.simplified.datasetSummary.notStarted",
                          )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAwaitingPrivacyReview ? (
            <Button
              size="sm"
              onClick={() =>
                latestEvidenceJob
                  ? onOpenPrivacyReview(latestEvidenceJob.id, activityName)
                  : undefined
              }
            >
              {t("projectWorkspace.interpretation.reviewPrivacyAction")}
            </Button>
          ) : null}
          {!isAwaitingPrivacyReview && interpretationSupportState === "supported" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleInterpret}
              disabled={!canInterpret}
            >
              {isInterpreting
                ? t("projectWorkspace.interpretation.interpretPending")
                : result
                  ? t("projectWorkspace.interpretation.reinterpretAction")
                  : t("projectWorkspace.interpretation.interpretAction")}
            </Button>
          ) : null}
        </div>
      </div>

      {!result &&
      interpretationSupportState !== "supported" &&
      !isAwaitingPrivacyReview ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {interpretErrorCode ===
          "interpretation_data_type_insufficiently_extracted"
            ? t(
                "projectWorkspace.interpretation.interpretInsufficientExtraction",
              )
            : t("projectWorkspace.interpretation.interpretUnavailable")}
        </p>
      ) : null}
      {!result && isInterpreting ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("projectWorkspace.interpretation.interpretPending")}
        </p>
      ) : null}

      {result && result.indicators.length > 0 ? (
        <div className="mt-4 border-t border-border/70 pt-4">
          <IndicatorSelectionSection
            indicators={result.indicators}
            mutationState={setIndicatorStatusMutation}
          />
        </div>
      ) : null}
    </div>
  );
}

function IndicatorSelectionSection({
  indicators,
  mutationState,
}: {
  indicators: InterpretationIndicator[];
  mutationState: ReturnType<typeof useSetIndicatorStatusMutation>;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {t("projectWorkspace.interpretation.simplified.indicatorSelectionTitle")}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "projectWorkspace.interpretation.simplified.indicatorSelectionDescription",
          )}
        </p>
      </div>

      <div className="space-y-2">
        {indicators.map((indicator) => {
          const isKept = indicator.status === "kept";
          const isPending =
            mutationState.isPending &&
            mutationState.variables?.indicatorId === indicator.id;

          return (
            <div
              key={indicator.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border/80 bg-secondary/10 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-foreground">
                    {indicator.name}
                  </div>
                  <Badge variant={isKept ? "default" : "secondary"}>
                    {isKept
                      ? t(
                          "projectWorkspace.interpretation.simplified.indicatorIncludedBadge",
                        )
                      : t(
                          "projectWorkspace.interpretation.simplified.indicatorExcludedBadge",
                        )}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {indicator.description}
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  mutationState.mutate({
                    indicatorId: indicator.id,
                    status: isKept ? "rejected" : "kept",
                  })
                }
              >
                {isKept
                  ? t(
                      "projectWorkspace.interpretation.simplified.indicatorExcludeAction",
                    )
                  : t(
                      "projectWorkspace.interpretation.simplified.indicatorIncludeAction",
                    )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityStatusBadge({
  status,
}: {
  status: ActivityWorkflowStatus;
}) {
  const { t } = useTranslation();

  if (status === "ready" || status === "reviewed") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
      >
        {status === "ready" ? (
          <Clock3 className="h-3.5 w-3.5" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        {t(`projectWorkspace.interpretation.simplified.status.${status}`)}
      </Badge>
    );
  }

  if (status === "privacy_review" || status === "questions") {
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
  embedded = false,
}: {
  activityName: string;
  interpretationResultId: string;
  projectId: string;
  organizationId: string | undefined;
  question: InterpretationQuestion;
  embedded?: boolean;
}) {
  const { t } = useTranslation();
  const [freeTextValue, setFreeTextValue] = useState(
    question.answeredValue ?? "",
  );
  const [isEditing, setIsEditing] = useState(question.status === "pending");
  const answerMutation = useAnswerInterpretationQuestionMutation(
    interpretationResultId,
    projectId,
    organizationId,
  );

  useEffect(() => {
    setFreeTextValue(question.answeredValue ?? "");
    setIsEditing(question.status === "pending");
  }, [question.answeredValue, question.id, question.status]);

  function submitAnswer(answeredValue: string) {
    if (!answeredValue.trim()) {
      return;
    }
    answerMutation.mutate({
      questionId: question.id,
      payload: { answeredValue },
    });
  }

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {activityName}
        </div>
        <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
          {question.isBlocking
            ? t("projectWorkspace.interpretation.questionRequiredLabel")
            : t("projectWorkspace.interpretation.questionOptionalLabel")}
        </Badge>
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {t(getQuestionDomainLabelKey(question.questionDomain))}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {question.prompt}
      </p>
      {question.status === "answered" && !isEditing ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {t("projectWorkspace.interpretation.questionAnsweredLabel", {
              value: question.answeredValue ?? "",
            })}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            {t("projectWorkspace.interpretation.questionEdit")}
          </Button>
        </div>
      ) : question.kind === "free_text" || !question.options?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            value={freeTextValue}
            onChange={(event) => setFreeTextValue(event.target.value)}
            placeholder={t(
              "projectWorkspace.interpretation.questionFreeTextPlaceholder",
            )}
            className="max-w-sm"
          />
          <Button
            size="sm"
            onClick={() => submitAnswer(freeTextValue)}
            disabled={!freeTextValue.trim() || answerMutation.isPending}
          >
            {answerMutation.isPending
              ? t("projectWorkspace.interpretation.questionSubmitting")
              : question.status === "answered"
                ? t("projectWorkspace.interpretation.questionSave")
                : t("projectWorkspace.interpretation.questionSubmit")}
          </Button>
          {question.status === "answered" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFreeTextValue(question.answeredValue ?? "");
                setIsEditing(false);
              }}
              disabled={answerMutation.isPending}
            >
              {t("projectWorkspace.interpretation.questionCancel")}
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.options.map((option) => {
            const isSelected = question.answeredValue === option;
            return (
              <Button
                key={option}
                variant={isSelected ? "secondary" : "outline"}
                size="sm"
                onClick={() => submitAnswer(option)}
                disabled={answerMutation.isPending}
              >
                {option}
              </Button>
            );
          })}
          {question.status === "answered" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={answerMutation.isPending}
            >
              {t("projectWorkspace.interpretation.questionCancel")}
            </Button>
          ) : null}
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="px-5 py-4">{content}</div>;
  }

  return <Card className="p-5">{content}</Card>;
}
