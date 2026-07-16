import { AlertTriangle, FileText, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DialogSection, EntityDialog } from "@/components/entityDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/workspaceUI";
import {
  useActivityUploadsQuery,
  useApprovePrivacyReviewMutation,
  useJobQuery,
  usePrivacyReviewQuery,
} from "@/hooks/useWorkspaceQueries";
import {
  ApiError,
  type ParsedRepresentationPreviewRecord,
  type PrivacyReviewDecisionValue,
  type PrivacyReviewRecord,
} from "@/services/apiClient";

type FindingSummaryItem = {
  field: string;
  entityType: string;
  count: number;
  recommendedAction: string;
  requiresDecision: boolean;
  sampleValue: string | null;
};

const RECOMMENDATION_VERB_KEY_BY_ACTION: Record<string, string> = {
  keep: "projectWorkspace.evidence.recommendationVerbKeep",
  tokenize: "projectWorkspace.evidence.recommendationVerbTokenize",
  generalize: "projectWorkspace.evidence.recommendationVerbGeneralize",
  remove: "projectWorkspace.evidence.recommendationVerbRemove",
  restrict: "projectWorkspace.evidence.recommendationVerbRestrict",
};

function getRecommendationVerb(
  action: string,
  t: ReturnType<typeof useTranslation>["t"],
) {
  const verbKey = RECOMMENDATION_VERB_KEY_BY_ACTION[action];
  return verbKey ? t(verbKey) : action;
}

function createDecisionKey(field: string, entityType: string) {
  return `${field}::${entityType}`;
}

const MINIMUM_OVERRIDE_REASON_LENGTH = 10;

function hasValidOverrideReason(reason: string | undefined) {
  return (reason?.trim().length ?? 0) >= MINIMUM_OVERRIDE_REASON_LENGTH;
}

function getActionOptions(
  finding: FindingSummaryItem,
): PrivacyReviewDecisionValue[] {
  const optionsByRecommendedAction: Record<
    string,
    PrivacyReviewDecisionValue[]
  > = {
    tokenize: ["tokenize", "remove", "keep"],
    generalize: ["generalize", "remove", "keep"],
    remove: ["remove", "tokenize", "keep"],
    restrict: ["restrict", "remove", "keep"],
    keep: ["keep"],
  };

  return optionsByRecommendedAction[finding.recommendedAction] ?? ["keep"];
}

function getActionLabel(
  action: PrivacyReviewDecisionValue,
  t: ReturnType<typeof useTranslation>["t"],
) {
  return t(`projectWorkspace.evidence.transformation.${action}`);
}

export function PrivacyReviewDialog({
  open,
  onOpenChange,
  processingJobId,
  projectId,
  organizationId,
  activityName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processingJobId: string | undefined;
  projectId: string;
  organizationId: string;
  activityName?: string;
}) {
  const { t } = useTranslation();
  const [fieldDecisionMap, setFieldDecisionMap] = useState<
    Record<string, PrivacyReviewDecisionValue>
  >({});
  const [fieldReasonMap, setFieldReasonMap] = useState<Record<string, string>>(
    {},
  );

  const jobQuery = useJobQuery(processingJobId, open);
  const job = jobQuery.data;
  const privacyReviewQuery = usePrivacyReviewQuery(
    processingJobId,
    open && Boolean(job),
  );
  const review = privacyReviewQuery.data;
  const findings = readFindingSummary(review);
  const decisionFindings = findings.filter(
    (finding) => finding.requiresDecision,
  );
  const uploadsQuery = useActivityUploadsQuery(
    job?.activityId ?? "",
    Boolean(open && job?.activityId),
  );
  const currentUpload = uploadsQuery.data?.find(
    (upload) => upload.id === job?.uploadMetadataId,
  );
  const isJobLoading =
    jobQuery.isLoading || (open && !job && !jobQuery.isError);
  const isReviewLoading = privacyReviewQuery.isLoading;
  const hasError = jobQuery.isError || privacyReviewQuery.isError;

  const approvePrivacyReviewMutation = useApprovePrivacyReviewMutation(
    job?.activityId ?? "",
    projectId,
    organizationId,
  );

  const canApproveReview = Boolean(
    job &&
    review &&
    job.status === "awaiting_privacy_review" &&
    review.status === "pending",
  );
  const allDecisionsResolved = decisionFindings.every((finding) => {
    const key = createDecisionKey(finding.field, finding.entityType);
    const decision = fieldDecisionMap[key];
    if (!decision) {
      return false;
    }
    return (
      decision === finding.recommendedAction ||
      hasValidOverrideReason(fieldReasonMap[key])
    );
  });
  const canSubmit = canApproveReview && allDecisionsResolved;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!review) {
      setFieldDecisionMap({});
      setFieldReasonMap({});
      return;
    }

    const nextFieldDecisionMap: Record<string, PrivacyReviewDecisionValue> = {};
    const nextFieldReasonMap: Record<string, string> = {};
    for (const decision of review.decisions?.fieldDecisions ?? []) {
      const key = createDecisionKey(decision.field, decision.entityType);
      nextFieldDecisionMap[key] = decision.decision;
      if (decision.reason) {
        nextFieldReasonMap[key] = decision.reason;
      }
    }
    setFieldDecisionMap(nextFieldDecisionMap);
    setFieldReasonMap(nextFieldReasonMap);
  }, [review, open]);

  async function handleApprovePrivacyReview() {
    if (!job) {
      return;
    }

    try {
      await approvePrivacyReviewMutation.mutateAsync({
        processingJobId: job.id,
        decisions: {
          fieldDecisions: decisionFindings.map((finding) => {
            const key = createDecisionKey(finding.field, finding.entityType);
            const decision = fieldDecisionMap[key]!;
            return {
              field: finding.field,
              entityType: finding.entityType,
              decision,
              reason:
                decision !== finding.recommendedAction
                  ? fieldReasonMap[key]
                  : undefined,
            };
          }),
        },
      });
      toast.success(t("projectWorkspace.evidence.privacyApprovalSuccess"));
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("projectWorkspace.evidence.privacyApprovalFailed"),
      );
    }
  }

  return (
    <EntityDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("projectWorkspace.evidence.privacyReviewTitle")}
      description={t("projectWorkspace.evidence.privacyReviewDescription")}
      submitLabel={
        approvePrivacyReviewMutation.isPending
          ? t("projectWorkspace.evidence.approvingPrivacy")
          : t("projectWorkspace.evidence.approvePrivacy")
      }
      cancelLabel={t("common.close")}
      isSubmitting={approvePrivacyReviewMutation.isPending}
      submitDisabled={!canSubmit}
      onSubmit={(event) => {
        event.preventDefault();
        void handleApprovePrivacyReview();
      }}
    >
      {hasError ? (
        <Card className="p-5">
          <div className="text-sm font-semibold text-foreground">
            {t("projectWorkspace.evidence.reviewUnavailableTitle")}
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {t("projectWorkspace.evidence.reviewUnavailableDescription")}
          </p>
        </Card>
      ) : isJobLoading || !job ? (
        <p className="text-sm text-muted-foreground">
          {t("projectWorkspace.evidence.loadingPrivacyReview")}
        </p>
      ) : (
        <>
          <DialogSection title={t("projectWorkspace.evidence.reviewFile")}>
            <div className="grid gap-3 md:grid-cols-2">
              <MetaCard
                label={t("projectWorkspace.evidence.reviewFile")}
                value={
                  currentUpload?.originalFileName ??
                  t("projectWorkspace.evidence.reviewUnknownFile")
                }
              />
              <MetaCard
                label={t("projectWorkspace.evidence.reviewStatus")}
                value={t(
                  `projectWorkspace.evidence.reviewStates.${review?.status ?? "pending"}`,
                )}
              />
            </div>
            <div className="mt-3 rounded-xl border border-border bg-secondary/20 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {t("projectWorkspace.evidence.reviewActivity")}:
              </span>
              {activityName ??
                t("projectWorkspace.evidence.reviewUnknownActivity")}
              {" · "}
              <span className="font-medium text-foreground">
                {t("projectWorkspace.evidence.reviewStatus")}:
              </span>
              {t(`projectWorkspace.evidence.analysisStates.${job.status}`)}
            </div>
          </DialogSection>

          {job.status === "completed" ? (
            <Card className="border-primary/20 bg-primary-soft/40 p-5 shadow-none">
              <div className="text-sm font-semibold text-primary">
                {t("projectWorkspace.evidence.reviewCompletedTitle")}
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {t("projectWorkspace.evidence.reviewCompletedDescription")}
              </p>
            </Card>
          ) : job.status === "transforming" ? (
            <Card className="border-primary/20 bg-primary-soft/40 p-5 shadow-none">
              <div className="text-sm font-semibold text-primary">
                {t("projectWorkspace.evidence.reviewTransformingTitle")}
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {t("projectWorkspace.evidence.reviewTransformingDescription")}
              </p>
            </Card>
          ) : null}

          <DialogSection
            title={t("projectWorkspace.evidence.detectedFindingsTitle")}
            description={t(
              "projectWorkspace.evidence.detectedFindingsDescription",
              { count: findings.length, decisions: decisionFindings.length },
            )}
          >
            {isReviewLoading ? (
              <p className="text-sm text-muted-foreground">
                {t("projectWorkspace.evidence.loadingPrivacyReview")}
              </p>
            ) : findings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("projectWorkspace.evidence.noPrivacyFindings")}
              </p>
            ) : (
              <div className="space-y-4">
                {decisionFindings.length > 0 ? (
                  <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm leading-6 text-foreground">
                      {t("projectWorkspace.evidence.gdprNoticeIntro")}
                    </p>
                  </div>
                ) : null}

                <div className="space-y-3">
                  {findings.map((finding) =>
                    finding.requiresDecision ? (
                      <DecisionFindingCard
                        key={`${finding.field}-${finding.entityType}`}
                        finding={finding}
                        decision={
                          fieldDecisionMap[
                            createDecisionKey(finding.field, finding.entityType)
                          ]
                        }
                        reason={
                          fieldReasonMap[
                            createDecisionKey(finding.field, finding.entityType)
                          ]
                        }
                        disabled={!canApproveReview}
                        onDecide={(decision) =>
                          setFieldDecisionMap((current) => ({
                            ...current,
                            [createDecisionKey(
                              finding.field,
                              finding.entityType,
                            )]: decision,
                          }))
                        }
                        onReasonChange={(reason) =>
                          setFieldReasonMap((current) => ({
                            ...current,
                            [createDecisionKey(
                              finding.field,
                              finding.entityType,
                            )]: reason,
                          }))
                        }
                      />
                    ) : (
                      <FindingCard
                        key={`${finding.field}-${finding.entityType}`}
                        finding={finding}
                      />
                    ),
                  )}
                </div>
              </div>
            )}

            {!canApproveReview ? (
              <p className="mt-4 text-sm text-muted-foreground">
                {t("projectWorkspace.evidence.reviewApprovalLocked")}
              </p>
            ) : !allDecisionsResolved && decisionFindings.length > 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                {t("projectWorkspace.evidence.reviewDecisionsIncomplete")}
              </p>
            ) : null}
          </DialogSection>

          <DialogSection
            title={t("projectWorkspace.evidence.parsedRepresentationTitle")}
            description={t(
              "projectWorkspace.evidence.parsedRepresentationDescription",
            )}
          >
            <ParsedRepresentationPreviewPanel
              preview={review?.parsedRepresentationPreview ?? null}
            />
          </DialogSection>
        </>
      )}
    </EntityDialog>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function FindingCard({ finding }: { finding: FindingSummaryItem }) {
  const { t } = useTranslation();
  const verb = getRecommendationVerb(finding.recommendedAction, t);

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4">
      <div className="text-sm font-semibold text-foreground">
        {finding.field}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {finding.entityType} · {finding.count}
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        {t("projectWorkspace.evidence.privacyFindingSummary", {
          entityType: finding.entityType,
          count: finding.count,
          action: verb,
        })}
      </div>
    </div>
  );
}

function DecisionFindingCard({
  finding,
  decision,
  reason,
  disabled,
  onDecide,
  onReasonChange,
}: {
  finding: FindingSummaryItem;
  decision: PrivacyReviewDecisionValue | undefined;
  reason: string | undefined;
  disabled: boolean;
  onDecide: (decision: PrivacyReviewDecisionValue) => void;
  onReasonChange: (reason: string) => void;
}) {
  const { t } = useTranslation();
  const verb = getRecommendationVerb(finding.recommendedAction, t);
  const actionOptions = getActionOptions(finding);
  const isOverride = Boolean(decision && decision !== finding.recommendedAction);

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">
            {finding.field}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {finding.entityType} · {finding.count}
          </div>
        </div>
        {decision ? (
          <span
            className={
              isOverride
                ? "rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
                : "rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-medium text-primary"
            }
          >
            {getActionLabel(decision, t)}
          </span>
        ) : (
          <span className="rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <AlertTriangle className="mr-1 inline h-3 w-3" />
            {t("projectWorkspace.evidence.decisionRequired")}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-foreground">
        {finding.sampleValue
          ? t("projectWorkspace.evidence.recommendationSentenceWithExample", {
              entityType: finding.entityType,
              verb,
              example: finding.sampleValue,
            })
          : t("projectWorkspace.evidence.recommendationSentence", {
              entityType: finding.entityType,
              verb,
            })}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {actionOptions.map((action) => {
          const isRecommended = action === finding.recommendedAction;
          const isSelected = action === decision;
          return (
            <Button
              key={action}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "outline"}
              disabled={disabled}
              onClick={() => onDecide(action)}
            >
              {getActionLabel(action, t)}
              {isRecommended ? (
                <span className="ml-2 text-[10px] uppercase tracking-[0.08em]">
                  {t("projectWorkspace.evidence.recommendedActionBadge")}
                </span>
              ) : null}
            </Button>
          );
        })}
      </div>

      {isOverride ? (
        <div className="mt-2 space-y-2">
          <p
            className={
              decision === "keep"
                ? "text-sm font-medium text-destructive"
                : "text-sm font-medium text-foreground"
            }
          >
            {t(
              decision === "keep"
                ? "projectWorkspace.evidence.keepOverrideWarning"
                : "projectWorkspace.evidence.overrideFindingWarning",
            )}
          </p>
          <div>
            <label
              htmlFor={`override-reason-${finding.field}-${finding.entityType}`}
              className="text-sm font-medium text-foreground"
            >
              {t("projectWorkspace.evidence.overrideReasonLabel")}
            </label>
            <Textarea
              id={`override-reason-${finding.field}-${finding.entityType}`}
              className="mt-1"
              disabled={disabled}
              value={reason ?? ""}
              placeholder={t(
                "projectWorkspace.evidence.overrideReasonPlaceholder",
              )}
              onChange={(event) => onReasonChange(event.target.value)}
            />
            {!hasValidOverrideReason(reason) ? (
              <p className="mt-1 text-xs text-destructive">
                {t("projectWorkspace.evidence.overrideReasonTooShort")}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ParsedRepresentationPreviewPanel({
  preview,
}: {
  preview: ParsedRepresentationPreviewRecord | null;
}) {
  const { t } = useTranslation();

  if (!preview) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("projectWorkspace.evidence.noParsedRepresentation")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <MetaCard
          label={t("projectWorkspace.evidence.parsedFileType")}
          value={preview.fileType}
        />
        <MetaCard
          label={t("projectWorkspace.evidence.parsedTableCount")}
          value={String(preview.tableCount)}
        />
      </div>

      {preview.tables.length > 0 ? (
        <div className="space-y-3">
          {preview.tables.map((table, index) => (
            <div
              key={`table-${index}`}
              className="rounded-xl border border-border bg-secondary/20 p-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                {table.name ??
                  t("projectWorkspace.evidence.parsedTableFallback", {
                    index: index + 1,
                  })}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  {t("projectWorkspace.evidence.parsedRowCount")}:{" "}
                  {table.rowCount}
                </span>
                <span>
                  {t("projectWorkspace.evidence.parsedColumnCount")}:{" "}
                  {table.columnCount}
                </span>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                {t("projectWorkspace.evidence.parsedColumnsLabel")}:{" "}
                {table.columns.join(", ") ||
                  t("projectWorkspace.evidence.parsedNone")}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {preview.paragraphs.length > 0 ? (
        <div className="rounded-xl border border-border bg-secondary/20 p-4">
          <div className="text-sm font-semibold text-foreground">
            {t("projectWorkspace.evidence.parsedParagraphSummaryTitle")}
          </div>
          <div className="mt-3 space-y-3">
            {preview.paragraphs.map((paragraph) => (
              <div
                key={`paragraph-${paragraph.index}`}
                className="rounded-lg border border-border bg-background px-3 py-3 text-sm text-muted-foreground"
              >
                <div className="font-medium text-foreground">
                  {t("projectWorkspace.evidence.parsedParagraphLabel", {
                    index: paragraph.index + 1,
                  })}
                </div>
                <div className="mt-1 flex flex-wrap gap-4">
                  <span>
                    {t("projectWorkspace.evidence.parsedCharacterCount")}:{" "}
                    {paragraph.characterCount}
                  </span>
                  {paragraph.page !== null ? (
                    <span>
                      {t("projectWorkspace.evidence.parsedPageLabel")}:{" "}
                      {paragraph.page}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readFindingSummary(review: PrivacyReviewRecord | undefined) {
  const summary = review?.findings?.summary;
  if (!Array.isArray(summary)) {
    return [] as FindingSummaryItem[];
  }

  return summary
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => ({
      field: typeof item.field === "string" ? item.field : "unknown",
      entityType:
        typeof item.entityType === "string" ? item.entityType : "unknown",
      count: typeof item.count === "number" ? item.count : 0,
      recommendedAction:
        typeof item.recommendedAction === "string"
          ? item.recommendedAction
          : "review",
      requiresDecision: Boolean(item.requiresDecision),
      sampleValue:
        typeof item.sampleValue === "string" ? item.sampleValue : null,
    }));
}
