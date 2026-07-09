import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PrivacyReviewDialog } from "@/components/privacyReviewDialog";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/hooks/useGrantready";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  apiClient,
  type InterpretationEntity,
  type InterpretationIndicator,
  type InterpretationQuestion,
  type InterpretationResultRecord,
  type ProcessingJobRecord,
  type UploadMetadataRecord,
  type WorkspaceActivity,
} from "@/services/apiClient";

const INTERPRETATION_POLL_INTERVAL_MS = 3000;
const TERMINAL_JOB_STATUSES = ["completed", "failed", "cancelled"];

export const Route = createFileRoute("/projects/$projectId/interpretation")({
  component: ProjectInterpretationPage,
});

function average(values: number[]): number {
  return values.length === 0
    ? 0
    : values.reduce((total, value) => total + value, 0) / values.length;
}

function ProjectInterpretationPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const workspaceProject = useCurrentWorkspaceProject();
  const interpretationsQuery = useProjectInterpretationsQuery(
    projectId,
    Boolean(auth.token),
  );

  const activities = workspaceProject?.activities ?? [];
  const results = interpretationsQuery.data?.results ?? [];
  const resultsByUploadId = new Map(
    results.map((result) => [result.uploadMetadataId, result]),
  );

  const overallConfidencePercent = Math.round(
    average(results.map((result) => result.overallConfidence)) * 100,
  );
  const totalEntities = results.reduce(
    (total, result) => total + result.entities.length,
    0,
  );
  const totalIndicators = results.reduce(
    (total, result) =>
      total +
      result.indicators.filter((indicator) => indicator.status !== "rejected")
        .length,
    0,
  );
  const pendingQuestions = results.flatMap((result) =>
    result.questions
      .filter((question) => question.status === "pending")
      .map((question) => ({ result, question })),
  );
  const totalUploadCount = activities.reduce(
    (total, activity) => total + activity.uploadMetadataCount,
    0,
  );
  const interpretedUploadCount = results.length;

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <WandSparkles className="h-4 w-4 text-primary" />
          {t("projectWorkspace.interpretation.title")}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("projectWorkspace.interpretation.description")}
        </p>

        <div className="mt-6">
          <div className="space-y-4">
            <Card className="p-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryMetric
                  label={t(
                    "projectWorkspace.interpretation.metrics.understanding",
                  )}
                  value={`${overallConfidencePercent}%`}
                />
                <SummaryMetric
                  label={t("projectWorkspace.interpretation.metrics.entities")}
                  value={String(totalEntities)}
                />
                <SummaryMetric
                  label={t(
                    "projectWorkspace.interpretation.metrics.indicators",
                  )}
                  value={String(totalIndicators)}
                />
                <SummaryMetric
                  label={t("projectWorkspace.interpretation.metrics.questions")}
                  value={String(pendingQuestions.length)}
                />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">
                {t("projectWorkspace.interpretation.filesInterpretedStatus", {
                  interpreted: interpretedUploadCount,
                  total: totalUploadCount,
                })}
              </p>
            </Card>

            <div className="space-y-4">
              <SectionTitle
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                title={t("projectWorkspace.interpretation.understoodTitle")}
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
                  />
                ))
              )}
            </div>

            <div className="space-y-4">
              <SectionTitle
                icon={<AlertTriangle className="h-4 w-4 text-primary" />}
                title={t("projectWorkspace.interpretation.privacyTitle")}
              />
              <PrivacyReviewSection
                activities={activities}
                projectId={projectId}
                organizationId={workspaceProject?.organizationId ?? ""}
              />
            </div>

            <div className="space-y-4">
              <SectionTitle
                icon={<CircleHelp className="h-4 w-4 text-primary" />}
                title={t("projectWorkspace.interpretation.needHelpTitle")}
              />
              {pendingQuestions.length === 0 ? (
                <Card className="p-5 text-sm text-muted-foreground">
                  {t("projectWorkspace.interpretation.needHelpEmpty")}
                </Card>
              ) : (
                pendingQuestions.map(({ result, question }) => (
                  <QuestionCard
                    key={question.id}
                    activityName={
                      activities.find(
                        (activity) => activity.id === result.activityId,
                      )?.name ?? result.datasetType
                    }
                    interpretationResultId={result.id}
                    projectId={projectId}
                    question={question}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </ProjectWorkspaceShell>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
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

function EntitiesTable({ entities }: { entities: InterpretationEntity[] }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t("projectWorkspace.interpretation.entityFieldColumn")}
            </TableHead>
            <TableHead>
              {t("projectWorkspace.interpretation.entityInterpretationColumn")}
            </TableHead>
            <TableHead>
              {t("projectWorkspace.interpretation.entitySampleValuesLabel")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell className="font-medium text-foreground">
                {entity.originalField}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <div className="text-foreground">{entity.aiMeaning}</div>
                <div className="mt-0.5 text-xs">{entity.reason}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entity.sampleValues.length > 0
                  ? entity.sampleValues.join(", ")
                  : t(
                      "projectWorkspace.interpretation.entitySampleValuesEmpty",
                    )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function IndicatorsTable({
  interpretationResultId,
  projectId,
  indicators,
}: {
  interpretationResultId: string;
  projectId: string;
  indicators: InterpretationIndicator[];
}) {
  const { t } = useTranslation();
  const setStatusMutation = useSetIndicatorStatusMutation(
    interpretationResultId,
    projectId,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t("projectWorkspace.interpretation.indicatorNameColumn")}
            </TableHead>
            <TableHead>
              {t("projectWorkspace.interpretation.entityInterpretationColumn")}
            </TableHead>
            <TableHead className="text-right">
              {t("projectWorkspace.interpretation.indicatorRelevanceLabel")}
            </TableHead>
            <TableHead className="text-right">
              {t("projectWorkspace.interpretation.indicatorActionColumn")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indicators.map((indicator) => {
            const isRejected = indicator.status === "rejected";
            const isPending =
              setStatusMutation.isPending &&
              setStatusMutation.variables?.indicatorId === indicator.id;

            return (
              <TableRow
                key={indicator.id}
                className={isRejected ? "opacity-50" : undefined}
              >
                <TableCell className="font-medium text-foreground">
                  {indicator.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="text-foreground">{indicator.description}</div>
                  <div className="mt-0.5 text-xs">{indicator.reason}</div>
                </TableCell>
                <TableCell className="text-right">
                  {indicator.relevanceStage ? (
                    <Badge variant="outline">
                      {t(
                        `projectWorkspace.interpretation.indicatorRelevanceStage.${indicator.relevanceStage}`,
                      )}
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      setStatusMutation.mutate({
                        indicatorId: indicator.id,
                        status: isRejected ? "kept" : "rejected",
                      })
                    }
                  >
                    {isRejected
                      ? t(
                          "projectWorkspace.interpretation.restoreIndicatorAction",
                        )
                      : t(
                          "projectWorkspace.interpretation.rejectIndicatorAction",
                        )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function InterpretationActivityGroup({
  activity,
  projectId,
  organizationId,
  resultsByUploadId,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string | undefined;
  resultsByUploadId: Map<string, InterpretationResultRecord>;
}) {
  const { t, i18n } = useTranslation();
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
  const [isExpanded, setIsExpanded] = useState(
    !activity.interpretationAcknowledgedAt,
  );

  // Whenever acknowledgment actually transitions (newly acknowledged, or
  // cleared by new evidence), reset to the sensible default for that state.
  // Manual expand/collapse clicks in between are left alone since this only
  // re-runs when the underlying value itself changes.
  useEffect(() => {
    setIsExpanded(!activity.interpretationAcknowledgedAt);
  }, [activity.interpretationAcknowledgedAt]);

  const uploads = uploadsQuery.data ?? [];
  const jobs = jobsQuery.data ?? [];
  const activityResults = uploads
    .map((upload) => resultsByUploadId.get(upload.id))
    .filter((result): result is InterpretationResultRecord => Boolean(result));
  const activityEntityCount = activityResults.reduce(
    (total, result) => total + result.entities.length,
    0,
  );
  const activityIndicatorCount = activityResults.reduce(
    (total, result) =>
      total +
      result.indicators.filter((indicator) => indicator.status !== "rejected")
        .length,
    0,
  );
  // The generic "additional context" question (kind "free_text") is
  // deliberately optional and never blocks review — only normalization
  // merge-confirmation questions are actionable. Mirrors the same gate the
  // backend independently enforces (never trust the disabled button alone).
  const hasUnresolvedActionableQuestion = activityResults.some((result) =>
    result.questions.some(
      (question) =>
        question.kind !== "free_text" && question.status === "pending",
    ),
  );
  const canAcknowledge =
    activityResults.length > 0 && !hasUnresolvedActionableQuestion;

  function formatAcknowledgedAt(acknowledgedAt: string) {
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(acknowledgedAt));
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
          {activity.name}
        </h3>
        <LinkToActivity projectId={projectId} activityId={activity.id} />
      </div>

      {uploads.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {t("projectWorkspace.interpretation.activitySummaryLine", {
              files: uploads.length,
              entities: activityEntityCount,
              indicators: activityIndicatorCount,
            })}
          </button>
          {activity.interpretationAcknowledgedAt ? (
            <Badge variant="outline" className="text-emerald-700">
              {t("projectWorkspace.interpretation.acknowledgedBadge", {
                date: formatAcknowledgedAt(
                  activity.interpretationAcknowledgedAt,
                ),
                name:
                  activity.interpretationAcknowledgedByName ??
                  t("projectWorkspace.interpretation.acknowledgedByUnknown"),
              })}
            </Badge>
          ) : (
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
          )}
        </div>
      ) : null}

      {uploads.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("projectWorkspace.interpretation.noEvidenceYet")}
        </p>
      ) : isExpanded ? (
        <Tabs defaultValue={uploads[0]!.id} className="mt-4">
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            {uploads.map((upload) => (
              <TabsTrigger
                key={upload.id}
                value={upload.id}
                className="rounded-md border border-border bg-secondary/20 data-[state=active]:border-primary/40 data-[state=active]:bg-background"
              >
                {upload.originalFileName}
              </TabsTrigger>
            ))}
          </TabsList>
          {uploads.map((upload) => (
            <TabsContent key={upload.id} value={upload.id} className="mt-4">
              <DatasetInterpretationCard
                activityId={activity.id}
                projectId={projectId}
                upload={upload}
                jobs={jobs}
                result={resultsByUploadId.get(upload.id)}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : null}
    </Card>
  );
}

// One instance per uploaded file — each file is interpreted, re-run, and
// displayed independently, since an activity can have several evidence
// files that each need their own job status, result, and action button.
// Rendered as one Tabs panel per upload in InterpretationActivityGroup, so
// only the selected dataset's data is fetched/shown at a time.
function DatasetInterpretationCard({
  activityId,
  projectId,
  upload,
  jobs,
  result,
}: {
  activityId: string;
  projectId: string;
  upload: UploadMetadataRecord;
  jobs: ProcessingJobRecord[];
  result: InterpretationResultRecord | undefined;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const startMutation = useStartInterpretationMutation(activityId, projectId);

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
    latestEvidenceJob?.status === "completed" && !activeInterpretationJob;
  const isInterpreting =
    startMutation.isPending || Boolean(activeInterpretationJob);

  function handleInterpret() {
    startMutation.mutate(upload.id);
  }

  return (
    <div>
      {result ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {t("projectWorkspace.interpretation.versionLabel", {
                number: result.versionNumber,
              })}{" "}
              · {result.datasetType} ·{" "}
              {Math.round(result.overallConfidence * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleInterpret}
              disabled={!canInterpret}
            >
              {isInterpreting
                ? t("projectWorkspace.interpretation.interpretPending")
                : t("projectWorkspace.interpretation.reinterpretAction")}
            </Button>
          </div>

          {result.entities.length > 0 ? (
            <EntitiesTable entities={result.entities} />
          ) : null}

          {result.indicators.length > 0 ? (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {t("projectWorkspace.interpretation.indicatorsTitle")}
              </div>
              <IndicatorsTable
                interpretationResultId={result.id}
                projectId={projectId}
                indicators={result.indicators}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <Button size="sm" onClick={handleInterpret} disabled={!canInterpret}>
            {isInterpreting
              ? t("projectWorkspace.interpretation.interpretPending")
              : t("projectWorkspace.interpretation.interpretAction")}
          </Button>
          {!canInterpret && !isInterpreting ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("projectWorkspace.interpretation.interpretUnavailable")}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  activityName,
  interpretationResultId,
  projectId,
  question,
}: {
  activityName: string;
  interpretationResultId: string;
  projectId: string;
  question: InterpretationQuestion;
}) {
  const { t } = useTranslation();
  const [freeTextValue, setFreeTextValue] = useState("");
  const answerMutation = useAnswerInterpretationQuestionMutation(
    interpretationResultId,
    projectId,
  );

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
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {activityName}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {question.prompt}
      </p>

      {question.kind === "free_text" || !question.options?.length ? (
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
              : t("projectWorkspace.interpretation.questionSubmit")}
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="sm"
              onClick={() => submitAnswer(option)}
              disabled={answerMutation.isPending}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}

function PrivacyReviewSection({
  activities,
  projectId,
  organizationId,
}: {
  activities: WorkspaceActivity[];
  projectId: string;
  organizationId: string;
}) {
  const { t } = useTranslation();
  const [reviewProcessingJobId, setReviewProcessingJobId] = useState<
    string | undefined
  >(undefined);
  const jobQueries = useQueries({
    queries: activities.map((activity) => ({
      queryKey: activityJobsQueryKey(activity.id),
      queryFn: () => apiClient.listActivityJobs(activity.id),
      enabled: true,
    })),
  });
  const uploadQueries = useQueries({
    queries: activities.map((activity) => ({
      queryKey: activityUploadsQueryKey(activity.id),
      queryFn: () => apiClient.listActivityUploads(activity.id),
      enabled: true,
    })),
  });

  if (activities.length === 0) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        {t("projectWorkspace.interpretation.understoodEmpty")}
      </Card>
    );
  }

  const pendingItems = activities
    .map((activity, index) => {
      const pendingJob = jobQueries[index]?.data?.find(
        (job) =>
          job.jobType === "evidence_processing" &&
          job.status === "awaiting_privacy_review",
      );
      if (!pendingJob) {
        return null;
      }

      const upload = uploadQueries[index]?.data?.find(
        (item) => item.id === pendingJob.uploadMetadataId,
      );

      return {
        activity,
        upload,
        pendingJob,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const isLoading =
    jobQueries.some((query) => query.isLoading) ||
    uploadQueries.some((query) => query.isLoading);

  if (isLoading && pendingItems.length === 0) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        {t("projectWorkspace.evidence.loadingPrivacyReview")}
      </Card>
    );
  }

  if (pendingItems.length === 0) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        {t("projectWorkspace.interpretation.noPrivacyReviews")}
      </Card>
    );
  }

  return (
    <>
      {pendingItems.map(({ activity, pendingJob, upload }) => (
        <Card key={pendingJob.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {activity.name}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(
                  "projectWorkspace.interpretation.privacyPendingDescription",
                  {
                    fileName:
                      upload?.originalFileName ??
                      t("projectWorkspace.interpretation.privacyUnknownFile"),
                  },
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReviewProcessingJobId(pendingJob.id)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("projectWorkspace.interpretation.reviewPrivacyAction")}
            </button>
          </div>
        </Card>
      ))}
      <PrivacyReviewDialog
        open={Boolean(reviewProcessingJobId)}
        onOpenChange={(open) => {
          if (!open) {
            setReviewProcessingJobId(undefined);
          }
        }}
        processingJobId={reviewProcessingJobId}
        projectId={projectId}
        organizationId={organizationId}
      />
    </>
  );
}

function LinkToActivity({
  projectId,
  activityId,
}: {
  projectId: string;
  activityId: string;
}) {
  const { t } = useTranslation();

  return (
    <Link
      to="/projects/$projectId/activities/$activityId/overview"
      params={{ projectId, activityId }}
      className="text-sm font-medium text-primary hover:underline"
    >
      {t("projectWorkspace.activities.openActivity")}
    </Link>
  );
}
