import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/workspaceUI";
import {
  useCurrentWorkspaceProject,
  useProjectWorkspacePage,
} from "@/contexts/projectWorkspaceContext";
import {
  useActivityUploadsQuery,
  useApprovePrivacyReviewMutation,
  useJobQuery,
  usePrivacyReviewQuery,
} from "@/hooks/useGrantready";
import { cn } from "@/lib/utils";
import {
  ApiError,
  type ParsedRepresentationPreviewRecord,
  type PrivacyReviewDecisionValue,
  type PrivacyReviewRecord,
} from "@/services/apiClient";

export const Route = createFileRoute(
  "/projects/$projectId/evidence/$processingJobId/review",
)({
  component: EvidencePrivacyReviewPage,
});

type DecisionEntityType = "FREE_TEXT_RISK" | "SPECIAL_CATEGORY_DATA";
type FindingSummaryItem = {
  field: string;
  entityType: string;
  count: number;
  recommendedAction: string;
  requiresDecision: boolean;
};

type DecisionDefaultsState = {
  freeTextRisk: PrivacyReviewDecisionValue;
  specialCategoryData: PrivacyReviewDecisionValue;
};

function EvidencePrivacyReviewPage() {
  const { projectId, processingJobId } = Route.useParams();
  const navigate = useNavigate();
  const { workspace } = useProjectWorkspacePage();
  const workspaceProject = useCurrentWorkspaceProject();
  const { t } = useTranslation();
  const [defaultDecisions, setDefaultDecisions] = useState<DecisionDefaultsState>({
    freeTextRisk: "exclude",
    specialCategoryData: "exclude",
  });
  const [fieldDecisionMap, setFieldDecisionMap] = useState<
    Record<string, PrivacyReviewDecisionValue>
  >({});

  const jobQuery = useJobQuery(processingJobId, true);
  const job = jobQuery.data;
  const privacyReviewQuery = usePrivacyReviewQuery(processingJobId, Boolean(job));
  const review = privacyReviewQuery.data;
  const findings = readFindingSummary(review);
  const decisionFindings = findings.filter(isDecisionFinding);
  const currentActivity = workspaceProject?.activities.find(
    (activity) => activity.id === job?.activityId,
  );
  const uploadsQuery = useActivityUploadsQuery(job?.activityId ?? "", Boolean(job?.activityId));
  const currentUpload = uploadsQuery.data?.find(
    (upload) => upload.id === job?.uploadMetadataId,
  );

  const approvePrivacyReviewMutation = useApprovePrivacyReviewMutation(
    job?.activityId ?? "",
    projectId,
    workspace.organization.id,
  );

  const canApprove = Boolean(
    job &&
      review &&
      job.status === "awaiting_privacy_review" &&
      review.status === "pending",
  );
  const decisionRequiredCount = decisionFindings.length;
  const hasFreeTextDecision = decisionFindings.some(
    (finding) => finding.entityType === "FREE_TEXT_RISK",
  );
  const hasSpecialCategoryDecision = decisionFindings.some(
    (finding) => finding.entityType === "SPECIAL_CATEGORY_DATA",
  );

  useEffect(() => {
    if (!review) {
      return;
    }

    setDefaultDecisions({
      freeTextRisk: review.decisions?.defaults?.freeTextRisk ?? "exclude",
      specialCategoryData: review.decisions?.defaults?.specialCategoryData ?? "exclude",
    });

    const nextFieldDecisionMap: Record<string, PrivacyReviewDecisionValue> = {};
    for (const decision of review.decisions?.fieldDecisions ?? []) {
      nextFieldDecisionMap[createDecisionKey(decision.field, decision.entityType)] =
        decision.decision;
    }
    setFieldDecisionMap(nextFieldDecisionMap);
  }, [review]);

  async function handleApprovePrivacyReview() {
    if (!job) {
      return;
    }

    try {
      await approvePrivacyReviewMutation.mutateAsync({
        processingJobId: job.id,
        decisions: {
          defaults: {
            ...(hasFreeTextDecision
              ? { freeTextRisk: defaultDecisions.freeTextRisk }
              : {}),
            ...(hasSpecialCategoryDecision
              ? { specialCategoryData: defaultDecisions.specialCategoryData }
              : {}),
          },
          fieldDecisions: decisionFindings.map((finding) => ({
            field: finding.field,
            entityType: finding.entityType,
            decision:
              fieldDecisionMap[createDecisionKey(finding.field, finding.entityType)] ??
              getDefaultDecisionForEntity(finding.entityType, defaultDecisions),
          })),
        },
      });
      toast.success(t("projectWorkspace.evidence.privacyApprovalSuccess"));
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("projectWorkspace.evidence.privacyApprovalFailed"),
      );
    }
  }

  return (
    <ProjectWorkspaceShell
      actions={
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void navigate({
              to: "/projects/$projectId/evidence",
              params: { projectId },
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
          {t("projectWorkspace.evidence.backToEvidence")}
        </Button>
      }
    >
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          {t("projectWorkspace.evidence.privacyReviewTitle")}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("projectWorkspace.evidence.privacyReviewPageDescription")}
        </p>

        {jobQuery.isLoading ? (
          <Card className="mt-6 p-6 text-sm text-muted-foreground">
            {t("projectWorkspace.evidence.loadingPrivacyReview")}
          </Card>
        ) : !job ? (
          <UnavailableState />
        ) : (
          <div className="mt-6 space-y-4">
            <Card className="p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetaCard
                  label={t("projectWorkspace.evidence.reviewFile")}
                  value={
                    currentUpload?.originalFileName ??
                    t("projectWorkspace.evidence.reviewUnknownFile")
                  }
                />
                <MetaCard
                  label={t("projectWorkspace.evidence.reviewActivity")}
                  value={
                    currentActivity?.name ??
                    t("projectWorkspace.evidence.reviewUnknownActivity")
                  }
                />
                <MetaCard
                  label={t("projectWorkspace.evidence.analysisStatus")}
                  value={t(`projectWorkspace.evidence.analysisStates.${job.status}`)}
                />
                <MetaCard
                  label={t("projectWorkspace.evidence.reviewStatus")}
                  value={t(`projectWorkspace.evidence.reviewStates.${review?.status ?? "pending"}`)}
                />
              </div>
            </Card>

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

            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                {t("projectWorkspace.evidence.detectedFindingsTitle")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("projectWorkspace.evidence.detectedFindingsDescription", {
                  count: findings.length,
                  decisions: decisionRequiredCount,
                })}
              </p>

              {privacyReviewQuery.isLoading ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("projectWorkspace.evidence.loadingPrivacyReview")}
                </p>
              ) : findings.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("projectWorkspace.evidence.noPrivacyFindings")}
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {findings.map((finding) => (
                    <FindingCard key={`${finding.field}-${finding.entityType}`} finding={finding} />
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                {t("projectWorkspace.evidence.parsedRepresentationTitle")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("projectWorkspace.evidence.parsedRepresentationDescription")}
              </p>
              <div className="mt-4">
                <ParsedRepresentationPreviewPanel
                  preview={review?.parsedRepresentationPreview ?? null}
                />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                <AlertTriangle className="h-4 w-4 text-primary" />
                {t("projectWorkspace.evidence.reviewDecisionTitle")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("projectWorkspace.evidence.reviewDecisionDescription")}
              </p>

              {decisionFindings.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("projectWorkspace.evidence.noDecisionRequired")}
                </p>
              ) : (
                <div className="mt-4 space-y-5">
                  {(hasFreeTextDecision || hasSpecialCategoryDecision) && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-foreground">
                        {t("projectWorkspace.evidence.decisionDefaultsTitle")}
                      </div>
                      {hasFreeTextDecision ? (
                        <DecisionSelector
                          label={t("projectWorkspace.evidence.freeTextRiskLabel")}
                          description={t(
                            "projectWorkspace.evidence.freeTextRiskDescription",
                          )}
                          value={defaultDecisions.freeTextRisk}
                          disabled={!canApprove}
                          onChange={(nextValue) =>
                            setDefaultDecisions((current) => ({
                              ...current,
                              freeTextRisk: nextValue,
                            }))
                          }
                        />
                      ) : null}
                      {hasSpecialCategoryDecision ? (
                        <DecisionSelector
                          label={t("projectWorkspace.evidence.specialCategoryDataLabel")}
                          description={t(
                            "projectWorkspace.evidence.specialCategoryDataDescription",
                          )}
                          value={defaultDecisions.specialCategoryData}
                          disabled={!canApprove}
                          onChange={(nextValue) =>
                            setDefaultDecisions((current) => ({
                              ...current,
                              specialCategoryData: nextValue,
                            }))
                          }
                        />
                      ) : null}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-foreground">
                      {t("projectWorkspace.evidence.decisionOverridesTitle")}
                    </div>
                    {decisionFindings.map((finding) => {
                      const decisionKey = createDecisionKey(
                        finding.field,
                        finding.entityType,
                      );
                      return (
                        <DecisionFindingCard
                          key={decisionKey}
                          finding={finding}
                          value={
                            fieldDecisionMap[decisionKey] ??
                            getDefaultDecisionForEntity(
                              finding.entityType,
                              defaultDecisions,
                            )
                          }
                          disabled={!canApprove}
                          onChange={(nextValue) =>
                            setFieldDecisionMap((current) => ({
                              ...current,
                              [decisionKey]: nextValue,
                            }))
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => void handleApprovePrivacyReview()}
                  disabled={!canApprove || approvePrivacyReviewMutation.isPending}
                >
                  {approvePrivacyReviewMutation.isPending
                    ? t("projectWorkspace.evidence.approvingPrivacy")
                    : t("projectWorkspace.evidence.approvePrivacy")}
                </Button>
                {!canApprove ? (
                  <span className="text-sm text-muted-foreground">
                    {t("projectWorkspace.evidence.reviewApprovalLocked")}
                  </span>
                ) : null}
              </div>
            </Card>
          </div>
        )}
      </section>
    </ProjectWorkspaceShell>
  );
}

function UnavailableState() {
  const { t } = useTranslation();

  return (
    <Card className="mt-6 p-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {t("projectWorkspace.evidence.reviewUnavailableTitle")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {t("projectWorkspace.evidence.reviewUnavailableDescription")}
      </p>
    </Card>
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

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{finding.field}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {finding.entityType} · {finding.count}
          </div>
        </div>
        {finding.requiresDecision ? (
          <span className="rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            {t("projectWorkspace.evidence.decisionRequired")}
          </span>
        ) : null}
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        {t("projectWorkspace.evidence.privacyFindingSummary", {
          entityType: finding.entityType,
          count: finding.count,
          action: finding.recommendedAction,
        })}
      </div>
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
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetaCard
          label={t("projectWorkspace.evidence.parsedFileType")}
          value={preview.fileType}
        />
        <MetaCard
          label={t("projectWorkspace.evidence.parsedTableCount")}
          value={String(preview.tableCount)}
        />
        <MetaCard
          label={t("projectWorkspace.evidence.parsedParagraphCount")}
          value={String(preview.paragraphCount)}
        />
        <MetaCard
          label={t("projectWorkspace.evidence.parsedSourceType")}
          value={preview.extension ?? t("projectWorkspace.evidence.parsedNone")}
        />
      </div>

      {preview.tables.length > 0 ? (
        <div className="space-y-3">
          {preview.tables.map((table, index) => (
            <div
              key={`table-${index}`}
              className="rounded-xl border border-border bg-secondary/20 p-4"
            >
              <div className="text-sm font-semibold text-foreground">
                {table.name ??
                  t("projectWorkspace.evidence.parsedTableFallback", {
                    index: index + 1,
                  })}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  {t("projectWorkspace.evidence.parsedRowCount")}: {table.rowCount}
                </span>
                <span>
                  {t("projectWorkspace.evidence.parsedColumnCount")}: {table.columnCount}
                </span>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                {t("projectWorkspace.evidence.parsedColumnsLabel")}:{" "}
                {table.columns.join(", ") || t("projectWorkspace.evidence.parsedNone")}
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
                      {t("projectWorkspace.evidence.parsedPageLabel")}: {paragraph.page}
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

function DecisionFindingCard({
  finding,
  value,
  disabled,
  onChange,
}: {
  finding: FindingSummaryItem & { entityType: DecisionEntityType };
  value: PrivacyReviewDecisionValue;
  disabled: boolean;
  onChange: (value: PrivacyReviewDecisionValue) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{finding.field}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t("projectWorkspace.evidence.privacyFindingSummary", {
              entityType: finding.entityType,
              count: finding.count,
              action: finding.recommendedAction,
            })}
          </div>
        </div>
        <span className="rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          {t("projectWorkspace.evidence.decisionRequired")}
        </span>
      </div>
      <div className="mt-4">
        <DecisionSelector
          label={t("projectWorkspace.evidence.fieldDecisionLabel", {
            entityType: formatDecisionEntityType(t, finding.entityType),
          })}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function DecisionSelector({
  label,
  description,
  value,
  disabled,
  onChange,
}: {
  label: string;
  description?: string;
  value: PrivacyReviewDecisionValue;
  disabled: boolean;
  onChange: (value: PrivacyReviewDecisionValue) => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-3 inline-flex flex-wrap gap-2">
        <DecisionOptionButton
          label={t("projectWorkspace.evidence.decisionExclude")}
          selected={value === "exclude"}
          disabled={disabled}
          onClick={() => onChange("exclude")}
        />
        <DecisionOptionButton
          label={t("projectWorkspace.evidence.decisionRestrict")}
          selected={value === "continue_with_restriction"}
          disabled={disabled}
          onClick={() => onChange("continue_with_restriction")}
        />
      </div>
    </div>
  );
}

function DecisionOptionButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-background text-foreground hover:bg-secondary/40",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      {label}
    </button>
  );
}

function createDecisionKey(field: string, entityType: DecisionEntityType) {
  return `${field}::${entityType}`;
}

function isDecisionFinding(
  finding: FindingSummaryItem,
): finding is FindingSummaryItem & { entityType: DecisionEntityType } {
  return (
    finding.requiresDecision &&
    (finding.entityType === "FREE_TEXT_RISK" ||
      finding.entityType === "SPECIAL_CATEGORY_DATA")
  );
}

function getDefaultDecisionForEntity(
  entityType: DecisionEntityType,
  defaults: DecisionDefaultsState,
) {
  return entityType === "FREE_TEXT_RISK"
    ? defaults.freeTextRisk
    : defaults.specialCategoryData;
}

function formatDecisionEntityType(
  t: ReturnType<typeof useTranslation>["t"],
  entityType: DecisionEntityType,
) {
  return entityType === "FREE_TEXT_RISK"
    ? t("projectWorkspace.evidence.freeTextRiskLabel")
    : t("projectWorkspace.evidence.specialCategoryDataLabel");
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
    }));
}
