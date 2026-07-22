import { useQueries, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CircleHelp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PrivacyReviewDialog } from "@/components/privacyReviewDialog";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { ActivityAiKnowledgeContent } from "@/components/activityAiKnowledgeContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import {
  activityAiKnowledgeQueryKey,
  activityJobsQueryKey,
  activityUploadsQueryKey,
  jobQueryKey,
  projectInterpretationsQueryKey,
  useActivityAiKnowledgeQuery,
  useAnswerInterpretationQuestionMutation,
  useGenerateActivityAiKnowledgeMutation,
  useStartActivityInterpretationMutation,
  useProjectInterpretationsQuery,
} from "@/hooks/useWorkspaceQueries";
import { useRequireAuth } from "@/hooks/useAuth";
import { getQuestionsByDomain } from "@/lib/interpretationWorkflow";
import {
  apiClient,
  type EvidenceModality,
  type InterpretationQuestion,
  type InterpretationQuestionDomain,
  type InterpretationResultRecord,
  type ParsedRepresentationPreviewRecord,
  type ProcessingJobRecord,
  type UploadMetadataRecord,
  type WorkspaceActivity,
} from "@/services/apiClient";
import { Card } from "@/components/WorkspaceUI";

const INTERPRETATION_POLL_INTERVAL_MS = 3000;
const TERMINAL_JOB_STATUSES = ["completed", "failed", "cancelled"];

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
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const workspaceProject = useCurrentWorkspaceProject();
  const [reviewProcessingJob, setReviewProcessingJob] = useState<
    { jobId: string; activityName: string } | undefined
  >(undefined);
  const [knowledgeTarget, setKnowledgeTarget] = useState<
    { activityId: string; activityName: string } | undefined
  >(undefined);
  const interpretationsQuery = useProjectInterpretationsQuery(
    projectId,
    Boolean(auth.token),
  );

  const activities = workspaceProject?.activities ?? [];
  const results = interpretationsQuery.data?.results ?? [];
  const activityJobsQueries = useQueries({
    queries: activities.map((activity) => ({
      queryKey: activityJobsQueryKey(activity.id),
      queryFn: () => apiClient.listActivityJobs(activity.id),
      enabled: true,
      refetchInterval: INTERPRETATION_POLL_INTERVAL_MS,
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

  const activityStatuses = activities.map((activity) => {
    const uploads = uploadsByActivityId.get(activity.id) ?? [];
    const jobs = jobsByActivityId.get(activity.id) ?? [];
    const activityResults = results.filter(
      (result) => result.activityId === activity.id,
    );
    return {
      activityId: activity.id,
      status: getActivityResultStatus(activity, uploads, jobs, activityResults),
    };
  });

  const readyActivityCount = activityStatuses.filter(
    (entry) => entry.status === "ready" || entry.status === "reviewed",
  ).length;
  const inProgressActivityCount = activityStatuses.filter(
    (entry) => entry.status === "processing",
  ).length;
  const needsAttentionActivityCount = activityStatuses.filter(
    (entry) =>
      entry.status === "privacy_review" || entry.status === "questions",
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
                  onOpenPrivacyReview={(jobId, activityName) =>
                    setReviewProcessingJob({ jobId, activityName })
                  }
                  onOpenKnowledge={(activityId, activityName) =>
                    setKnowledgeTarget({ activityId, activityName })
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

        <ActivityAiKnowledgeDialog
          open={Boolean(knowledgeTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setKnowledgeTarget(undefined);
            }
          }}
          activityId={knowledgeTarget?.activityId}
          activityName={knowledgeTarget?.activityName}
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
  onOpenPrivacyReview,
  onOpenKnowledge,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string | undefined;
  uploads: UploadMetadataRecord[];
  jobs: ProcessingJobRecord[];
  results: InterpretationResultRecord[];
  onOpenPrivacyReview: (jobId: string, activityName: string) => void;
  onOpenKnowledge: (activityId: string, activityName: string) => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const startMutation = useStartActivityInterpretationMutation(
    activity.id,
    projectId,
  );
  const generateKnowledgeMutation = useGenerateActivityAiKnowledgeMutation(
    activity.id,
    projectId,
    organizationId,
  );

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
      queryKey: activityAiKnowledgeQueryKey(activity.id),
    });
  }, [activeJobSyncQueries, activity.id, projectId, queryClient]);

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
  const status = getActivityResultStatus(activity, uploads, jobs, results);
  const hasPersistedKnowledge = Boolean(activity.aiKnowledgeGeneratedAt);

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

  const canStartInterpretation =
    uploads.length > 0 &&
    readyToInterpretUploadCount > 0 &&
    activeInterpretationJobs.length === 0 &&
    !pendingPrivacyReview &&
    !startMutation.isPending;
  const canGenerateKnowledge =
    !hasPersistedKnowledge &&
    (status === "ready" || status === "reviewed") &&
    !hasUnresolvedActionableQuestion &&
    !generateKnowledgeMutation.isPending;
  const canRefreshKnowledge =
    hasPersistedKnowledge &&
    (status === "ready" || status === "reviewed") &&
    !hasUnresolvedActionableQuestion &&
    !generateKnowledgeMutation.isPending;
  const canOpenKnowledge = hasPersistedKnowledge;

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

  function handleOpenKnowledge() {
    onOpenKnowledge(activity.id, activity.name);
  }

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

          {status === "processing" ? (
            <Button size="sm" variant="outline" disabled>
              {t("projectWorkspace.interpretation.simplified.actionRunning")}
            </Button>
          ) : null}

          {!canOpenKnowledge && canStartInterpretation ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => startMutation.mutate()}
            >
              {t(
                "projectWorkspace.interpretation.simplified.actionRunKnowledge",
              )}
            </Button>
          ) : null}

          {canGenerateKnowledge ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateKnowledgeMutation.mutate()}
            >
              {t(
                "projectWorkspace.interpretation.simplified.actionRunKnowledge",
              )}
            </Button>
          ) : null}

          {canRefreshKnowledge ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateKnowledgeMutation.mutate()}
            >
              {t(
                "projectWorkspace.interpretation.simplified.actionRefreshKnowledge",
              )}
            </Button>
          ) : null}

          {canOpenKnowledge ? (
            <Button size="sm" onClick={handleOpenKnowledge}>
              {t(
                "projectWorkspace.interpretation.simplified.actionOpenKnowledge",
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

function ActivityStatusBadge({ status }: { status: ActivityWorkflowStatus }) {
  const { t } = useTranslation();

  if (status === "ready" || status === "reviewed") {
    return null;
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

function ActivityAiKnowledgeDialog({
  open,
  onOpenChange,
  activityId,
  activityName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId?: string;
  activityName?: string;
}) {
  const { t } = useTranslation();
  const knowledgeQuery = useActivityAiKnowledgeQuery(
    activityId ?? "",
    open && Boolean(activityId),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {activityName ??
              t(
                "projectWorkspace.interpretation.simplified.knowledgeDialogTitle",
              )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "projectWorkspace.interpretation.simplified.knowledgeDialogDescription",
            )}
          </DialogDescription>
        </DialogHeader>

        {!activityId || knowledgeQuery.isLoading ? (
          <div className="py-6 text-sm text-muted-foreground">
            {t(
              "projectWorkspace.interpretation.simplified.knowledgeDialogLoading",
            )}
          </div>
        ) : knowledgeQuery.isError || !knowledgeQuery.data ? (
          <div className="py-6 text-sm text-muted-foreground">
            {t(
              "projectWorkspace.interpretation.simplified.knowledgeDialogError",
            )}
          </div>
        ) : (
          <ActivityAiKnowledgeContent knowledge={knowledgeQuery.data} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function getQuestionDomainLabelKey(
  questionDomain: InterpretationQuestionDomain,
) {
  return questionDomain === "preparation"
    ? "projectWorkspace.interpretation.questionDomainPreparationLabel"
    : "projectWorkspace.interpretation.questionDomainInterpretationLabel";
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

  return (
    <Card className="p-5">
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
    </Card>
  );
}
