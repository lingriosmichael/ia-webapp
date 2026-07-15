import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  CircleHelp,
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
  useSetQualitativeFindingStatusMutation,
  useStartInterpretationMutation,
} from "@/hooks/useWorkspaceQueries";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  canShowQuantitativeSynthesis,
  getQuestionsByDomain,
  isDeterministicAnalysisReady,
  isPreparationDrivenModality,
  isPreparationResolved,
  isQualitativeModality,
} from "@/lib/interpretationWorkflow";
import {
  apiClient,
  type DatasetPreparationRecord,
  type DatasetProfile,
  type DeterministicAnalysisRecord,
  type EvidenceModality,
  type InterpretationEntity,
  type InterpretationIndicator,
  type InterpretationQualitativeFinding,
  type InterpretationQualitativeFindingCategory,
  type InterpretationQualitativeFindingRelation,
  type InterpretationQualitativeOutcomeAnchorType,
  type InterpretationQualitativeStage,
  type InterpretationQuestion,
  type InterpretationQuestionDomain,
  type InterpretationResultRecord,
  type InterpretationSupportingQuote,
  type InterpretationWarning,
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

function getEvidenceModalityLabelKey(
  evidenceModality: EvidenceModality | null | undefined,
) {
  switch (evidenceModality) {
    case "structured_quantitative":
      return "projectWorkspace.interpretation.modalityStructuredQuantitativeLabel";
    case "structured_qualitative":
      return "projectWorkspace.interpretation.modalityStructuredQualitativeLabel";
    case "mixed_dual_track":
      return "projectWorkspace.interpretation.modalityMixedDualTrackLabel";
    case "narrative_qualitative":
      return "projectWorkspace.interpretation.modalityNarrativeQualitativeLabel";
    case "insufficiently_extracted":
      return "projectWorkspace.interpretation.modalityInsufficientLabel";
    default:
      return null;
  }
}

function getQuestionDomainLabelKey(
  questionDomain: InterpretationQuestionDomain,
) {
  return questionDomain === "preparation"
    ? "projectWorkspace.interpretation.questionDomainPreparationLabel"
    : "projectWorkspace.interpretation.questionDomainInterpretationLabel";
}

function getDatasetPreparationStatusLabelKey(
  status: DatasetPreparationRecord["status"],
) {
  return `projectWorkspace.interpretation.datasetPreparationStatus.${status}` as const;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function getQualitativeStageLabelKey(stage: InterpretationQualitativeStage) {
  return `projectWorkspace.interpretation.qualitativeStage.${stage}` as const;
}

function getQualitativeFindingRelationLabelKey(
  relationToEvidence: InterpretationQualitativeFindingRelation,
) {
  return `projectWorkspace.interpretation.qualitativeFindingRelation.${relationToEvidence}` as const;
}

function getQualitativeFindingCategoryLabelKey(
  category: InterpretationQualitativeFindingCategory,
) {
  return `projectWorkspace.interpretation.qualitativeFindingCategory.${category}` as const;
}

function getQualitativeOutcomeAnchorTypeLabelKey(
  anchorType: InterpretationQualitativeOutcomeAnchorType,
) {
  return `projectWorkspace.interpretation.qualitativeOutcomeAnchorType.${anchorType}` as const;
}

type AttentionLevel = "neutral" | "caution" | "critical";

function getAttentionBadgeVariant(
  level: AttentionLevel,
): "secondary" | "outline" | "destructive" {
  if (level === "critical") {
    return "destructive";
  }
  return level === "caution" ? "outline" : "secondary";
}

function getWarningAttentionLevel(
  severity: InterpretationWarning["severity"],
): AttentionLevel {
  return severity === "warning" ? "caution" : "neutral";
}

function getQualitativeFindingRelationAttentionLevel(
  relationToEvidence: InterpretationQualitativeFindingRelation,
): AttentionLevel {
  if (relationToEvidence === "contradicts") {
    return "critical";
  }
  return relationToEvidence === "complicates" ? "caution" : "neutral";
}

function getQualitativeFindingCategoryAttentionLevel(
  category: InterpretationQualitativeFindingCategory,
): AttentionLevel {
  if (category === "outcome_contradiction") {
    return "critical";
  }
  return category === "outcome_complication" ||
    category === "barrier" ||
    category === "unintended_effect"
    ? "caution"
    : "neutral";
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
  const totalReviewReadyResults = results.reduce(
    (total, result) =>
      total +
      (result.questions.every((question) => question.status === "answered")
        ? 1
        : 0),
    0,
  );
  const totalPreparationAwaitingResults = results.reduce(
    (total, result) =>
      total +
      (result.datasetPreparation &&
      result.datasetPreparation.status !== "not_applicable" &&
      !isPreparationResolved(result.datasetPreparation)
        ? 1
        : 0),
    0,
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

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="mt-6">
          <div className="space-y-4">
            {interpretedUploadCount === 0 ? (
              <Card className="border-primary/12 bg-primary-soft/30 p-6">
                <div className="max-w-[42rem]">
                  <div className="text-sm font-semibold tracking-tight text-foreground">
                    {t("projectWorkspace.interpretation.title")}
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    0%
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {t(
                      "projectWorkspace.interpretation.filesInterpretedStatus",
                      {
                        interpreted: interpretedUploadCount,
                        total: totalUploadCount,
                      },
                    )}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    0{" "}
                    {t(
                      "projectWorkspace.interpretation.metrics.entities",
                    ).toLowerCase()}{" "}
                    · 0{" "}
                    {t(
                      "projectWorkspace.interpretation.metrics.awaitingPreparation",
                    ).toLowerCase()}{" "}
                    · 0{" "}
                    {t(
                      "projectWorkspace.interpretation.metrics.readyForReview",
                    ).toLowerCase()}
                  </p>
                  <p className="mt-4 max-w-[40rem] text-sm leading-6 text-muted-foreground">
                    {t("projectWorkspace.interpretation.understoodEmpty")}
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-5">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <SummaryMetric
                    label={t(
                      "projectWorkspace.interpretation.metrics.understanding",
                    )}
                    value={`${overallConfidencePercent}%`}
                  />
                  <SummaryMetric
                    label={t(
                      "projectWorkspace.interpretation.metrics.entities",
                    )}
                    value={String(totalEntities)}
                  />
                  <SummaryMetric
                    label={t(
                      "projectWorkspace.interpretation.metrics.awaitingPreparation",
                    )}
                    value={String(totalPreparationAwaitingResults)}
                  />
                  <SummaryMetric
                    label={t(
                      "projectWorkspace.interpretation.metrics.readyForReview",
                    )}
                    value={String(totalReviewReadyResults)}
                  />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  {t("projectWorkspace.interpretation.filesInterpretedStatus", {
                    interpreted: interpretedUploadCount,
                    total: totalUploadCount,
                  })}
                </p>
              </Card>
            )}

            <div className="space-y-4">
              <SectionTitle
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                title={t("projectWorkspace.interpretation.reviewFlowTitle")}
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
                title={t(
                  "projectWorkspace.interpretation.preparationQuestionsTitle",
                )}
              />
              {pendingPreparationQuestions.length === 0 ? (
                <Card className="p-5 text-sm text-muted-foreground">
                  {t(
                    "projectWorkspace.interpretation.preparationQuestionsEmpty",
                  )}
                </Card>
              ) : (
                pendingPreparationQuestions.map(({ result, question }) => (
                  <QuestionCard
                    key={question.id}
                    activityName={
                      activities.find(
                        (activity) => activity.id === result.activityId,
                      )?.name ?? result.datasetType
                    }
                    interpretationResultId={result.id}
                    projectId={projectId}
                    organizationId={workspaceProject?.organizationId}
                    question={question}
                  />
                ))
              )}
            </div>

            <div className="space-y-4">
              <SectionTitle
                icon={<CircleHelp className="h-4 w-4 text-primary" />}
                title={t(
                  "projectWorkspace.interpretation.interpretationQuestionsTitle",
                )}
              />
              {pendingInterpretationQuestions.length === 0 ? (
                <Card className="p-5 text-sm text-muted-foreground">
                  {t(
                    "projectWorkspace.interpretation.interpretationQuestionsEmpty",
                  )}
                </Card>
              ) : (
                pendingInterpretationQuestions.map(({ result, question }) => (
                  <QuestionCard
                    key={question.id}
                    activityName={
                      activities.find(
                        (activity) => activity.id === result.activityId,
                      )?.name ?? result.datasetType
                    }
                    interpretationResultId={result.id}
                    projectId={projectId}
                    organizationId={workspaceProject?.organizationId}
                    question={question}
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

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
      {icon}
      {title}
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

function WarningsList({ warnings }: { warnings: InterpretationWarning[] }) {
  return (
    <ul className="space-y-1.5">
      {warnings.map((warning) => {
        const level = getWarningAttentionLevel(warning.severity);
        return (
          <li
            key={warning.id}
            className={
              level === "critical"
                ? "flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                : level === "caution"
                  ? "flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                  : "flex items-start gap-2 rounded-md border border-border bg-secondary/20 px-3 py-2 text-sm text-muted-foreground"
            }
          >
            {level !== "neutral" ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{warning.message}</span>
          </li>
        );
      })}
    </ul>
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

function WorkflowSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-secondary/10 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function formatDeterministicValue(
  value: number | null,
  unit: string | null,
): string {
  if (value === null) {
    return "—";
  }

  if (unit === "percent") {
    return formatPercent(value * 100);
  }

  return unit ? `${value} ${unit}` : String(value);
}

function DatasetProfileOverview({
  datasetProfile,
}: {
  datasetProfile: DatasetProfile | null;
}) {
  const { t } = useTranslation();

  if (!datasetProfile) {
    return null;
  }

  return (
    <WorkflowSection
      title={t("projectWorkspace.interpretation.datasetProfileTitle")}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <SummaryMetric
          label={t("projectWorkspace.interpretation.datasetProfileTablesLabel")}
          value={String(datasetProfile.tableCount)}
        />
        <SummaryMetric
          label={t(
            "projectWorkspace.interpretation.datasetProfileParagraphsLabel",
          )}
          value={String(datasetProfile.paragraphCount)}
        />
        <SummaryMetric
          label={t("projectWorkspace.interpretation.datasetProfileIssuesLabel")}
          value={String(datasetProfile.issues.length)}
        />
      </div>

      <div className="mt-4 space-y-2">
        {datasetProfile.tables.slice(0, 3).map((table) => (
          <div
            key={table.name}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
          >
            <div className="font-medium text-foreground">{table.name}</div>
            <div className="mt-1">
              {t("projectWorkspace.interpretation.datasetProfileTableSummary", {
                rows: table.rowCount,
                columns: table.columnCount,
                statusColumns: table.likelyStatusColumns.length,
                dateColumns: table.likelyDateColumns.length,
              })}
            </div>
          </div>
        ))}
      </div>

      {datasetProfile.issues.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {datasetProfile.issues.slice(0, 4).map((issue, index) => (
            <li
              key={`${issue.code}-${issue.tableName}-${issue.columnName ?? index}`}
              className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            >
              {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </WorkflowSection>
  );
}

function DatasetPreparationOverview({
  datasetPreparation,
}: {
  datasetPreparation: DatasetPreparationRecord | null;
}) {
  const { t } = useTranslation();

  if (!datasetPreparation) {
    return null;
  }

  const preparedDataset = datasetPreparation.preparedDataset;
  const decisionCount = datasetPreparation.decisions.length;

  return (
    <WorkflowSection
      title={t("projectWorkspace.interpretation.datasetPreparationTitle")}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {t(getDatasetPreparationStatusLabelKey(datasetPreparation.status))}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {t(
            "projectWorkspace.interpretation.datasetPreparationDecisionCount",
            {
              count: decisionCount,
            },
          )}
        </span>
      </div>

      {datasetPreparation.unansweredBlockingQuestionIds.length > 0 ? (
        <p className="mt-3 text-sm text-amber-900">
          {t(
            "projectWorkspace.interpretation.datasetPreparationPendingSummary",
            {
              count: datasetPreparation.unansweredBlockingQuestionIds.length,
            },
          )}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          {t("projectWorkspace.interpretation.datasetPreparationReadySummary")}
        </p>
      )}

      {preparedDataset ? (
        <div className="mt-4 space-y-2">
          {preparedDataset.tables.slice(0, 3).map((table) => (
            <div
              key={table.name}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
            >
              <div className="font-medium text-foreground">{table.name}</div>
              <div className="mt-1">
                {t(
                  "projectWorkspace.interpretation.preparedDatasetTableSummary",
                  {
                    grain:
                      table.selectedRowGrain ??
                      t(
                        "projectWorkspace.interpretation.preparedDatasetUnknownValue",
                      ),
                    identifier:
                      table.identifierColumn ??
                      t(
                        "projectWorkspace.interpretation.preparedDatasetUnknownValue",
                      ),
                    status:
                      table.primaryStatusColumn ??
                      t(
                        "projectWorkspace.interpretation.preparedDatasetUnknownValue",
                      ),
                    date:
                      table.primaryDateColumn ??
                      t(
                        "projectWorkspace.interpretation.preparedDatasetUnknownValue",
                      ),
                  },
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </WorkflowSection>
  );
}

function DeterministicAnalysisOverview({
  deterministicAnalysis,
}: {
  deterministicAnalysis: DeterministicAnalysisRecord | null;
}) {
  const { t } = useTranslation();

  if (!deterministicAnalysis) {
    return null;
  }

  return (
    <WorkflowSection
      title={t("projectWorkspace.interpretation.deterministicAnalysisTitle")}
    >
      <div className="grid gap-3 md:grid-cols-4">
        <SummaryMetric
          label={t(
            "projectWorkspace.interpretation.deterministicAnalysisMetricsLabel",
          )}
          value={String(deterministicAnalysis.metrics.length)}
        />
        <SummaryMetric
          label={t(
            "projectWorkspace.interpretation.deterministicAnalysisDistributionsLabel",
          )}
          value={String(deterministicAnalysis.distributions.length)}
        />
        <SummaryMetric
          label={t(
            "projectWorkspace.interpretation.deterministicAnalysisTrendsLabel",
          )}
          value={String(deterministicAnalysis.trends.length)}
        />
        <SummaryMetric
          label={t(
            "projectWorkspace.interpretation.deterministicAnalysisCandidateIndicatorsLabel",
          )}
          value={String(deterministicAnalysis.candidateIndicators.length)}
        />
      </div>

      {deterministicAnalysis.metrics.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t(
                    "projectWorkspace.interpretation.deterministicMetricColumn",
                  )}
                </TableHead>
                <TableHead>
                  {t(
                    "projectWorkspace.interpretation.deterministicDescriptionColumn",
                  )}
                </TableHead>
                <TableHead className="text-right">
                  {t(
                    "projectWorkspace.interpretation.deterministicValueColumn",
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deterministicAnalysis.metrics.slice(0, 5).map((metric) => (
                <TableRow key={metric.metricKey}>
                  <TableCell className="font-medium text-foreground">
                    {metric.label}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {metric.description}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {formatDeterministicValue(metric.value, metric.unit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      {deterministicAnalysis.warnings.length > 0 ? (
        <div className="mt-4">
          <WarningsList
            warnings={deterministicAnalysis.warnings.map((warning, index) => ({
              id: `${warning.code}-${index}`,
              message: warning.message,
              severity: "warning",
            }))}
          />
        </div>
      ) : null}
    </WorkflowSection>
  );
}

function IndicatorsTable({
  interpretationResultId,
  projectId,
  organizationId,
  indicators,
}: {
  interpretationResultId: string;
  projectId: string;
  organizationId: string | undefined;
  indicators: InterpretationIndicator[];
}) {
  const { t } = useTranslation();
  const setStatusMutation = useSetIndicatorStatusMutation(
    interpretationResultId,
    projectId,
    organizationId,
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
                  {indicator.matchesStatedGoal ? (
                    <Badge variant="default" className="mb-1">
                      {t("projectWorkspace.interpretation.highlyRecommended")}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mb-1">
                      {t("projectWorkspace.interpretation.extraNotStatedGoal")}
                    </Badge>
                  )}
                  <div className="text-foreground">{indicator.description}</div>
                  <div className="mt-0.5 text-xs">{indicator.reason}</div>
                  {indicator.supportingParagraphKeys.length > 0 ? (
                    <div className="mt-0.5 text-xs italic">
                      {t(
                        "projectWorkspace.interpretation.indicatorNarrativeGrounding",
                        { count: indicator.supportingParagraphKeys.length },
                      )}
                    </div>
                  ) : null}
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

function ReviewableEvidenceCard({
  isRejected,
  title,
  meta,
  actionLabel,
  actionDisabled,
  onToggleStatus,
  children,
}: {
  isRejected: boolean;
  title: ReactNode;
  meta: ReactNode;
  actionLabel: string;
  actionDisabled: boolean;
  onToggleStatus: () => void;
  children?: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isRejected
          ? "border-border opacity-50"
          : "border-border bg-secondary/10"
      }`}
    >
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {meta}
      </div>
      {children}
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={actionDisabled}
          onClick={onToggleStatus}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

function QualitativeFindingsList({
  interpretationResultId,
  projectId,
  organizationId,
  qualitativeFindings,
  supportingQuotes,
}: {
  interpretationResultId: string;
  projectId: string;
  organizationId: string | undefined;
  qualitativeFindings: InterpretationQualitativeFinding[];
  supportingQuotes: InterpretationSupportingQuote[];
}) {
  const { t } = useTranslation();
  const setStatusMutation = useSetQualitativeFindingStatusMutation(
    interpretationResultId,
    projectId,
    organizationId,
  );
  const quoteById = new Map(supportingQuotes.map((quote) => [quote.id, quote]));

  return (
    <div className="space-y-3">
      {qualitativeFindings.map((finding) => {
        const isRejected = finding.status === "rejected";
        const isPending =
          setStatusMutation.isPending &&
          setStatusMutation.variables?.qualitativeFindingId === finding.id;
        const linkedQuotes = finding.supportingQuoteIds
          .map((quoteId) => quoteById.get(quoteId))
          .filter((quote): quote is InterpretationSupportingQuote =>
            Boolean(quote),
          );

        return (
          <ReviewableEvidenceCard
            key={finding.id}
            isRejected={isRejected}
            title={finding.summary}
            meta={
              <>
                <Badge variant="outline">
                  {t(getQualitativeStageLabelKey(finding.stage))}
                </Badge>
                <Badge
                  variant={getAttentionBadgeVariant(
                    getQualitativeFindingCategoryAttentionLevel(
                      finding.category,
                    ),
                  )}
                >
                  {t(getQualitativeFindingCategoryLabelKey(finding.category))}
                </Badge>
                {finding.relatedIndicatorIds.length > 0 ? (
                  <Badge
                    variant={getAttentionBadgeVariant(
                      getQualitativeFindingRelationAttentionLevel(
                        finding.relationToEvidence,
                      ),
                    )}
                  >
                    {t(
                      getQualitativeFindingRelationLabelKey(
                        finding.relationToEvidence,
                      ),
                    )}
                  </Badge>
                ) : null}
                <Badge variant="outline">
                  {t(
                    getQualitativeOutcomeAnchorTypeLabelKey(
                      finding.outcomeAnchorType,
                    ),
                  )}
                </Badge>
                <span>{Math.round(finding.confidence * 100)}%</span>
                {linkedQuotes.length > 0 ? (
                  <span>
                    {t(
                      "projectWorkspace.interpretation.qualitativeLinkedQuotes",
                      {
                        count: linkedQuotes.length,
                      },
                    )}
                  </span>
                ) : null}
              </>
            }
            actionLabel={
              isRejected
                ? t("projectWorkspace.interpretation.restoreFindingAction")
                : t("projectWorkspace.interpretation.rejectFindingAction")
            }
            actionDisabled={isPending}
            onToggleStatus={() =>
              setStatusMutation.mutate({
                qualitativeFindingId: finding.id,
                status: isRejected ? "kept" : "rejected",
              })
            }
          >
            <p className="mt-2 text-sm text-muted-foreground">
              {finding.reason}
            </p>
            {finding.outcomeReference ? (
              <div className="mt-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {t(
                    "projectWorkspace.interpretation.qualitativeOutcomeReferenceLabel",
                  )}
                  :{" "}
                </span>
                {finding.outcomeReference}
              </div>
            ) : null}
            {linkedQuotes.length > 0 ? (
              <div className="mt-3 space-y-2">
                {linkedQuotes.slice(0, 2).map((quote) => (
                  <div
                    key={quote.id}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
                  >
                    <div className="text-foreground">"{quote.excerptText}"</div>
                    <div className="mt-1 text-xs">{quote.sourceReference}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </ReviewableEvidenceCard>
        );
      })}
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
  const activityEntityCount = activityResults.reduce(
    (total, result) => total + result.entities.length,
    0,
  );
  const activityPreparationAwaitingCount = activityResults.reduce(
    (total, result) =>
      total +
      (result.datasetPreparation &&
      result.datasetPreparation.status !== "not_applicable" &&
      !isPreparationResolved(result.datasetPreparation)
        ? 1
        : 0),
    0,
  );
  const activityReviewReadyCount = activityResults.reduce(
    (total, result) =>
      total +
      (result.questions.every((question) => question.status === "answered")
        ? 1
        : 0),
    0,
  );
  // Mirrors the backend gate: acknowledgment is blocked only while
  // required clarification questions remain pending. Optional questions
  // stay visible here, but do not prevent final acknowledgment.
  const hasUnresolvedActionableQuestion = activityResults.some((result) =>
    hasPendingBlockingQuestions(result.questions),
  );
  const everyUploadOnSupportedReviewedPath =
    uploads.length > 0 &&
    uploads.every((upload) => {
      const latestEvidenceJob = latestEvidenceJobByUploadId.get(upload.id);
      const preview = previewByUploadId.get(upload.id);
      const interpretationSupportState = getEvidenceSupportState(
        preview?.evidenceModality,
      );
      return (
        latestEvidenceJob?.status === "completed" &&
        interpretationSupportState === "supported" &&
        Boolean(resultsByUploadId.get(upload.id))
      );
    });
  const canAcknowledge =
    everyUploadOnSupportedReviewedPath && !hasUnresolvedActionableQuestion;

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
        <LinkToActivity projectId={projectId} />
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
              preparation: activityPreparationAwaitingCount,
              ready: activityReviewReadyCount,
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
                organizationId={organizationId}
                parsedRepresentationPreview={previewByUploadId.get(upload.id)}
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
  organizationId,
  parsedRepresentationPreview,
  upload,
  jobs,
  result,
}: {
  activityId: string;
  projectId: string;
  organizationId: string | undefined;
  parsedRepresentationPreview:
    ParsedRepresentationPreviewRecord | null | undefined;
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
  const evidenceModality =
    parsedRepresentationPreview?.evidenceModality ?? null;
  const interpretationSupportState = getEvidenceSupportState(evidenceModality);
  const evidenceModalityLabelKey =
    getEvidenceModalityLabelKey(evidenceModality);
  const preparationDrivenPath = isPreparationDrivenModality(evidenceModality);
  const qualitativePath = isQualitativeModality(evidenceModality);

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
  const isInterpreting =
    startMutation.isPending || Boolean(activeInterpretationJob);
  const interpretErrorCode =
    startMutation.variables === upload.id ? startMutation.error?.code : null;

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
            <div className="flex flex-wrap items-center gap-2">
              {evidenceModalityLabelKey ? (
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {t(evidenceModalityLabelKey)}
                </Badge>
              ) : null}
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
          </div>

          {result.warnings.length > 0 ? (
            <WarningsList warnings={result.warnings} />
          ) : null}

          {preparationDrivenPath ? (
            <>
              <DatasetProfileOverview datasetProfile={result.datasetProfile} />
              <DatasetPreparationOverview
                datasetPreparation={result.datasetPreparation}
              />
              {result.deterministicAnalysis ? (
                <DeterministicAnalysisOverview
                  deterministicAnalysis={result.deterministicAnalysis}
                />
              ) : null}

              {!result.deterministicAnalysis ||
              !isDeterministicAnalysisReady(result.deterministicAnalysis) ? (
                <Card className="border-primary/15 bg-primary-soft/20 p-4 text-sm text-muted-foreground">
                  {t(
                    "projectWorkspace.interpretation.deterministicAnalysisPendingSummary",
                  )}
                </Card>
              ) : null}
            </>
          ) : null}

          {result.entities.length > 0 ? (
            <EntitiesTable entities={result.entities} />
          ) : null}

          {result.indicators.length > 0 &&
          canShowQuantitativeSynthesis(result, evidenceModality) ? (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {t("projectWorkspace.interpretation.indicatorsTitle")}
              </div>
              <IndicatorsTable
                interpretationResultId={result.id}
                projectId={projectId}
                organizationId={organizationId}
                indicators={result.indicators}
              />
            </div>
          ) : null}

          {preparationDrivenPath &&
          result.indicators.length > 0 &&
          !canShowQuantitativeSynthesis(result, evidenceModality) ? (
            <Card className="border-primary/15 bg-primary-soft/20 p-4 text-sm text-muted-foreground">
              {t(
                "projectWorkspace.interpretation.quantitativeSynthesisPendingSummary",
              )}
            </Card>
          ) : null}

          {qualitativePath && result.qualitativeFindings.length > 0 ? (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {t("projectWorkspace.interpretation.qualitativeFindingsTitle")}
              </div>
              <QualitativeFindingsList
                interpretationResultId={result.id}
                projectId={projectId}
                organizationId={organizationId}
                qualitativeFindings={result.qualitativeFindings}
                supportingQuotes={result.supportingQuotes}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {evidenceModalityLabelKey ? (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                {t(evidenceModalityLabelKey)}
              </Badge>
            ) : null}
            {interpretationSupportState === "supported" ? (
              <Button
                size="sm"
                onClick={handleInterpret}
                disabled={!canInterpret}
              >
                {isInterpreting
                  ? t("projectWorkspace.interpretation.interpretPending")
                  : t("projectWorkspace.interpretation.interpretAction")}
              </Button>
            ) : null}
          </div>
          {interpretationSupportState === "insufficiently_extracted" ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {t(
                "projectWorkspace.interpretation.interpretInsufficientExtraction",
              )}
            </p>
          ) : !canInterpret && !isInterpreting ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {interpretErrorCode ===
              "interpretation_data_type_insufficiently_extracted"
                ? t(
                    "projectWorkspace.interpretation.interpretInsufficientExtraction",
                  )
                : t("projectWorkspace.interpretation.interpretUnavailable")}
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
        <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
          {t(getQuestionDomainLabelKey(question.questionDomain))}
        </Badge>
        <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
          {question.isBlocking
            ? t("projectWorkspace.interpretation.questionRequiredLabel")
            : t("projectWorkspace.interpretation.questionOptionalLabel")}
        </Badge>
      </div>
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
  const [reviewProcessingJob, setReviewProcessingJob] = useState<
    { jobId: string; activityName: string } | undefined
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
              onClick={() =>
                setReviewProcessingJob({
                  jobId: pendingJob.id,
                  activityName: activity.name,
                })
              }
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("projectWorkspace.interpretation.reviewPrivacyAction")}
            </button>
          </div>
        </Card>
      ))}
      <PrivacyReviewDialog
        open={Boolean(reviewProcessingJob)}
        onOpenChange={(open) => {
          if (!open) {
            setReviewProcessingJob(undefined);
          }
        }}
        processingJobId={reviewProcessingJob?.jobId}
        projectId={projectId}
        organizationId={organizationId}
        activityName={reviewProcessingJob?.activityName}
      />
    </>
  );
}

function LinkToActivity({ projectId }: { projectId: string }) {
  const { t } = useTranslation();

  return (
    <Link
      to="/projects/$projectId/activities"
      params={{ projectId }}
      className="text-sm font-medium text-primary hover:underline"
    >
      {t("projectWorkspace.activities.openActivity")}
    </Link>
  );
}
