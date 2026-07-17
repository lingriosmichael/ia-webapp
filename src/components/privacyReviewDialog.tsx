import { AlertTriangle, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DialogSection, EntityDialog } from "@/components/entityDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/workspaceUI";
import {
  useActivityUploadsQuery,
  useApprovePrivacyReviewMutation,
  useJobQuery,
  usePrivacyReviewQuery,
} from "@/hooks/useWorkspaceQueries";
import {
  ApiError,
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

function getActionOptions(
  finding: FindingSummaryItem,
): PrivacyReviewDecisionValue[] {
  if (finding.recommendedAction === "keep") {
    return ["keep", "tokenize"];
  }
  return ["tokenize", "keep"];
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
  const [fieldKeepAcknowledgementMap, setFieldKeepAcknowledgementMap] =
    useState<Record<string, boolean>>({});

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
    return !(
      decision === "keep" &&
      finding.recommendedAction !== "keep" &&
      fieldKeepAcknowledgementMap[key] !== true
    );
  });
  const canSubmit = canApproveReview && allDecisionsResolved;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!review) {
      setFieldDecisionMap({});
      setFieldKeepAcknowledgementMap({});
      return;
    }

    const nextFieldDecisionMap: Record<string, PrivacyReviewDecisionValue> = {};
    const nextFieldKeepAcknowledgementMap: Record<string, boolean> = {};
    for (const decision of review.decisions?.fieldDecisions ?? []) {
      const key = createDecisionKey(decision.field, decision.entityType);
      nextFieldDecisionMap[key] = decision.decision;
      if (decision.keepUnchangedAcknowledged === true) {
        nextFieldKeepAcknowledgementMap[key] = true;
      }
    }
    setFieldDecisionMap(nextFieldDecisionMap);
    setFieldKeepAcknowledgementMap(nextFieldKeepAcknowledgementMap);
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
              keepUnchangedAcknowledged:
                decision === "keep"
                  ? fieldKeepAcknowledgementMap[key] === true
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
                        keepUnchangedAcknowledged={
                          fieldKeepAcknowledgementMap[
                            createDecisionKey(finding.field, finding.entityType)
                          ] === true
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
                        onKeepUnchangedAcknowledgementChange={(acknowledged) =>
                          setFieldKeepAcknowledgementMap((current) => ({
                            ...current,
                            [createDecisionKey(
                              finding.field,
                              finding.entityType,
                            )]: acknowledged,
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
  keepUnchangedAcknowledged,
  disabled,
  onDecide,
  onKeepUnchangedAcknowledgementChange,
}: {
  finding: FindingSummaryItem;
  decision: PrivacyReviewDecisionValue | undefined;
  keepUnchangedAcknowledged: boolean;
  disabled: boolean;
  onDecide: (decision: PrivacyReviewDecisionValue) => void;
  onKeepUnchangedAcknowledgementChange: (acknowledged: boolean) => void;
}) {
  const { t } = useTranslation();
  const verb = getRecommendationVerb(finding.recommendedAction, t);
  const actionOptions = getActionOptions(finding);
  const isKeepOverride =
    decision === "keep" && finding.recommendedAction !== "keep";

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
              isKeepOverride
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

      {isKeepOverride ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm font-medium text-destructive">
            {t("projectWorkspace.evidence.keepOverrideWarning")}
          </p>
          <label
            htmlFor={`keep-acknowledgement-${finding.field}-${finding.entityType}`}
            className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm leading-6 text-foreground"
          >
            <Checkbox
              id={`keep-acknowledgement-${finding.field}-${finding.entityType}`}
              checked={keepUnchangedAcknowledged}
              disabled={disabled}
              onCheckedChange={(checked) =>
                onKeepUnchangedAcknowledgementChange(checked === true)
              }
            />
            <span>
              {t("projectWorkspace.evidence.keepUnchangedAcknowledgementLabel")}
            </span>
          </label>
          {!keepUnchangedAcknowledged ? (
            <p className="text-xs text-destructive">
              {t(
                "projectWorkspace.evidence.keepUnchangedAcknowledgementRequired",
              )}
            </p>
          ) : null}
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
