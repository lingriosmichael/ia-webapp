import { useTranslation } from "react-i18next";
import { InterpretationQuestionCard } from "@/components/interpretationQuestionCard";
import { Card } from "@/components/WorkspaceUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  ActivityAnalysisRunV2Record,
  ApiError,
} from "@/services/apiClient";

function formatTimestamp(value: string, language: string): string {
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function badgeVariantForRunStatus(
  status: ActivityAnalysisRunV2Record["status"],
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") {
    return "default";
  }
  if (status === "failed") {
    return "destructive";
  }
  if (status === "running") {
    return "secondary";
  }
  return "outline";
}

function badgeVariantForValidationStatus(
  status: ActivityAnalysisRunV2Record["validation"]["status"],
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "passed") {
    return "default";
  }
  if (status === "failed") {
    return "destructive";
  }
  if (status === "not_run") {
    return "outline";
  }
  return "secondary";
}

function badgeVariantForGoalStatus(
  status: NonNullable<
    ActivityAnalysisRunV2Record["assessment"]
  >["goalAssessments"][number]["assessmentStatus"],
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "achieved") {
    return "default";
  }
  if (status === "not_achieved") {
    return "destructive";
  }
  if (status === "requires_clarification" || status === "requires_capability") {
    return "outline";
  }
  return "secondary";
}

function formatRunStatusLabel(
  status: ActivityAnalysisRunV2Record["status"],
  t: ReturnType<typeof useTranslation>["t"],
): string {
  return t(`activityAnalytics.v2.runStatus.${status}`);
}

function formatValidationStatusLabel(
  status: ActivityAnalysisRunV2Record["validation"]["status"],
  t: ReturnType<typeof useTranslation>["t"],
): string {
  return t(`activityAnalytics.v2.validationStatus.${status}`);
}

function formatGoalStatusLabel(
  status: NonNullable<
    ActivityAnalysisRunV2Record["assessment"]
  >["goalAssessments"][number]["assessmentStatus"],
  t: ReturnType<typeof useTranslation>["t"],
): string {
  return t(`activityAnalytics.v2.goalStatus.${status}`);
}

export function ActivityAnalysisV2Panel({
  activityName,
  latestRun,
  latestError,
  isLoading,
  onRun,
  isRunning,
  onAnswerQuestion,
  isAnsweringQuestion,
  previousRuns,
}: {
  activityName: string;
  latestRun: ActivityAnalysisRunV2Record | null;
  latestError: ApiError | null;
  isLoading: boolean;
  onRun: () => void;
  isRunning: boolean;
  onAnswerQuestion: (input: {
    questionId: string;
    answeredValue: string;
  }) => void;
  isAnsweringQuestion: boolean;
  previousRuns?: ActivityAnalysisRunV2Record[] | null;
}) {
  const { t, i18n } = useTranslation();
  // Running an analysis and answering a clarification question both trigger
  // the same backend pipeline for this activity and write the same "latest
  // run" cache entry, so they must never be in flight at the same time —
  // otherwise whichever response lands last silently overwrites the other.
  const isBusy = isRunning || isAnsweringQuestion;
  const isMissing =
    latestError?.code === "activity_analysis_v2_not_found" && !latestRun;
  const outputAssessments =
    latestRun?.assessment?.goalAssessments.filter(
      (goalAssessment) => goalAssessment.goalType === "output",
    ) ?? [];
  const outcomeAssessments =
    latestRun?.assessment?.goalAssessments.filter(
      (goalAssessment) => goalAssessment.goalType === "outcome",
    ) ?? [];

  return (
    <Card className="border-border/70 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b border-border/70 pb-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            {t("activityAnalytics.v2.eyebrow")}
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("activityAnalytics.v2.title")}
              </h2>
              <p className="mt-2 max-w-[48rem] text-sm leading-6 text-muted-foreground">
                {t("activityAnalytics.v2.description")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRun}
              disabled={isBusy}
            >
              {isRunning
                ? t("activityAnalytics.v2.runPending")
                : latestRun
                  ? t("activityAnalytics.v2.refreshAction")
                  : t("activityAnalytics.v2.runAction")}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            {t("activityAnalytics.v2.loading")}
          </p>
        ) : latestError && !isMissing && !latestRun ? (
          <p className="rounded-[12px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {t("activityAnalytics.v2.loadFailed")}
          </p>
        ) : !latestRun ? (
          <div className="rounded-[12px] border border-border/70 bg-secondary/20 px-4 py-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t("activityAnalytics.v2.noRunTitle")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("activityAnalytics.v2.noRunDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {latestError && !isMissing ? (
              // A run is already cached and rendered below, but the most
              // recent background refetch failed — without this, the panel
              // would keep showing that cached run with no indication it
              // might no longer reflect the activity's current state.
              <p className="rounded-[12px] border border-amber-300/40 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
                {t("activityAnalytics.v2.staleDataWarning")}
              </p>
            ) : null}
            {latestRun.clarificationQuestions.some(
              (question) => question.status === "pending",
            ) ? (
              <div className="rounded-[12px] border border-amber-200 bg-amber-50/80 px-4 py-4">
                <div className="text-sm font-semibold text-foreground">
                  {t("activityAnalytics.v2.clarificationTitle")}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("activityAnalytics.v2.clarificationDescription")}
                </p>
                <div className="mt-4 space-y-3">
                  {latestRun.clarificationQuestions
                    .filter((question) => question.status === "pending")
                    .map((question) => (
                      <InterpretationQuestionCard
                        key={question.id}
                        activityName={activityName}
                        question={question}
                        isSubmitting={isBusy}
                        onSubmit={onAnswerQuestion}
                      />
                    ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-[12px] border border-border/70 bg-background px-4 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t("activityAnalytics.v2.latestRunTitle")}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("activityAnalytics.v2.latestRunMeta", {
                      createdAt: formatTimestamp(
                        latestRun.createdAt,
                        i18n.language,
                      ),
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={badgeVariantForRunStatus(latestRun.status)}>
                    {formatRunStatusLabel(latestRun.status, t)}
                  </Badge>
                  <Badge
                    variant={badgeVariantForValidationStatus(
                      latestRun.validation.status,
                    )}
                  >
                    {formatValidationStatusLabel(
                      latestRun.validation.status,
                      t,
                    )}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[10px] border border-border/70 bg-secondary/10 px-3 py-3">
                  <div className="text-lg font-semibold text-foreground">
                    {latestRun.diagnostics.goalCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("activityAnalytics.v2.metrics.goals")}
                  </div>
                </div>
                <div className="rounded-[10px] border border-border/70 bg-secondary/10 px-3 py-3">
                  <div className="text-lg font-semibold text-foreground">
                    {latestRun.diagnostics.evidenceCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("activityAnalytics.v2.metrics.evidence")}
                  </div>
                </div>
                <div className="rounded-[10px] border border-border/70 bg-secondary/10 px-3 py-3">
                  <div className="text-lg font-semibold text-foreground">
                    {latestRun.diagnostics.executedToolCallCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("activityAnalytics.v2.metrics.tools")}
                  </div>
                </div>
                <div className="rounded-[10px] border border-border/70 bg-secondary/10 px-3 py-3">
                  <div className="text-lg font-semibold text-foreground">
                    {latestRun.diagnostics.calculationCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("activityAnalytics.v2.metrics.calculations")}
                  </div>
                </div>
              </div>
            </div>

            {latestRun.errorMessage ? (
              <div className="rounded-[12px] border border-destructive/20 bg-destructive/5 px-4 py-4">
                <h3 className="text-sm font-semibold text-destructive">
                  {t("activityAnalytics.v2.errorTitle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-destructive">
                  {latestRun.errorMessage}
                </p>
              </div>
            ) : null}

            {latestRun.validation.issues.length > 0 ? (
              <div className="rounded-[12px] border border-amber-300/40 bg-amber-50/80 px-4 py-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("activityAnalytics.v2.issuesTitle")}
                </h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {latestRun.validation.issues.map((issue, index) => (
                    <p key={`${latestRun.analysisRunId}-issue-${index}`}>
                      {issue}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-[12px] border border-border/70 bg-background px-4 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                {t("activityAnalytics.v2.summaryTitle")}
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {latestRun.renderedSummary ??
                  t("activityAnalytics.v2.summaryMissing")}
              </p>
            </div>

            <div className="rounded-[12px] border border-border/70 bg-background px-4 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                {t("activityAnalytics.v2.outputsTitle")}
              </h3>
              <div className="mt-3 space-y-3">
                {outputAssessments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("activityAnalytics.v2.noOutputs")}
                  </p>
                ) : (
                  outputAssessments.map((goalAssessment) => (
                    <div
                      key={goalAssessment.goalId}
                      className="rounded-[10px] border border-border/70 px-4 py-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="text-sm font-semibold text-foreground">
                          {goalAssessment.goalText}
                        </div>
                        <Badge
                          variant={badgeVariantForGoalStatus(
                            goalAssessment.assessmentStatus,
                          )}
                        >
                          {formatGoalStatusLabel(
                            goalAssessment.assessmentStatus,
                            t,
                          )}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {goalAssessment.findingText}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[12px] border border-border/70 bg-background px-4 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                {t("activityAnalytics.v2.outcomesTitle")}
              </h3>
              <div className="mt-3 space-y-3">
                {outcomeAssessments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("activityAnalytics.v2.noOutcomes")}
                  </p>
                ) : (
                  outcomeAssessments.map((goalAssessment) => (
                    <div
                      key={goalAssessment.goalId}
                      className="rounded-[10px] border border-border/70 px-4 py-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="text-sm font-semibold text-foreground">
                          {goalAssessment.goalText}
                        </div>
                        <Badge
                          variant={badgeVariantForGoalStatus(
                            goalAssessment.assessmentStatus,
                          )}
                        >
                          {formatGoalStatusLabel(
                            goalAssessment.assessmentStatus,
                            t,
                          )}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {goalAssessment.findingText}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {latestRun.assessment?.limitations.length ? (
              <div className="rounded-[12px] border border-border/70 bg-background px-4 py-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("activityAnalytics.v2.limitationsTitle")}
                </h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {latestRun.assessment.limitations.map((limitation, index) => (
                    <p key={`${latestRun.analysisRunId}-limitation-${index}`}>
                      {limitation}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {previousRuns && previousRuns.length > 1 ? (
              <div className="rounded-[12px] border border-border/70 bg-background px-4 py-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("activityAnalytics.v2.runHistoryTitle")}
                </h3>
                <div className="mt-3 space-y-2">
                  {previousRuns
                    .filter(
                      (run) => run.analysisRunId !== latestRun.analysisRunId,
                    )
                    .map((run) => (
                      <div
                        key={run.analysisRunId}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-border/70 px-3 py-2 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {formatTimestamp(run.createdAt, i18n.language)}
                        </span>
                        <Badge variant={badgeVariantForRunStatus(run.status)}>
                          {formatRunStatusLabel(run.status, t)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}
