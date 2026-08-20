import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/WorkspaceUI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import {
  useDecideOutcomeEvidencePairingProposalMutation,
  useOutcomeEvidencePairingQuery,
  useProjectActivitiesQuery,
  useRemoveOutcomeEvidenceLinkMutation,
} from "@/hooks/useWorkspaceQueries";
import {
  ApiError,
  apiClient,
  type ActivitySystemType,
  type OutcomeEvidencePairingActivityDiagnostic,
  type OutcomeEvidencePairingActivityUploadState,
  type OutcomeEvidencePairingDiagnosticReason,
  type OutcomeEvidenceLink,
  type OutcomeEvidencePairingOutcomeSection,
  type OutcomeEvidencePairingProposal,
  type ProjectOutcomeStatement,
  type UploadMetadataRecord,
} from "@/services/apiClient";

function humanizeIdentifier(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (character) => character.toUpperCase());
}

function describeSystemType(
  systemType: ActivitySystemType | null,
  locale: ReturnType<typeof useWorkspaceLocale>,
): string | null {
  if (systemType === "baseline") {
    return locale.outcomeEvidencePairing.baselineSystemLabel;
  }
  if (systemType === "impact_measurement") {
    return locale.outcomeEvidencePairing.impactMeasurementSystemLabel;
  }
  return null;
}

interface ActivityMeta {
  name: string;
  systemType: ActivitySystemType | null;
}

interface EvidenceColumnDisplayLine {
  systemLabel: string;
  uploadLabel: string;
  columnLabel: string;
}

interface ProposalDisplay {
  summary: string;
  lines: EvidenceColumnDisplayLine[];
}

type OutcomeAudience = "jugendliche" | "mentorinnen" | null;

function normalizeAudienceText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[:*_/.-]+/g, " ");
}

function inferAudienceFromText(value: string): OutcomeAudience {
  const normalized = normalizeAudienceText(value);
  if (normalized.includes("jugendliche") || normalized.includes("jugend")) {
    return "jugendliche";
  }
  if (normalized.includes("mentorinnen") || normalized.includes("mentor")) {
    return "mentorinnen";
  }
  return null;
}

function inferProposalAudience(
  proposal: OutcomeEvidencePairingProposal,
  uploadNameById: Map<string, string>,
): OutcomeAudience {
  const uploadLabels =
    proposal.shape === "paired_delta"
      ? [
          uploadNameById.get(proposal.beforeUploadMetadataId) ??
            proposal.beforeUploadMetadataId,
          uploadNameById.get(proposal.afterUploadMetadataId) ??
            proposal.afterUploadMetadataId,
        ]
      : [
          uploadNameById.get(proposal.uploadMetadataId) ??
            proposal.uploadMetadataId,
        ];

  const audiences = Array.from(
    new Set(
      uploadLabels
        .map((label) => inferAudienceFromText(label))
        .filter(
          (value): value is Exclude<OutcomeAudience, null> => value !== null,
        ),
    ),
  );
  return audiences.length === 1 ? (audiences[0] ?? null) : null;
}

function buildEvidenceLine(
  activityId: string,
  uploadMetadataId: string,
  columnName: string,
  activityMetaById: Map<string, ActivityMeta>,
  uploadNameById: Map<string, string>,
  locale: ReturnType<typeof useWorkspaceLocale>,
): EvidenceColumnDisplayLine {
  const activityMeta = activityMetaById.get(activityId);
  return {
    systemLabel:
      describeSystemType(activityMeta?.systemType ?? null, locale) ??
      activityMeta?.name ??
      activityId,
    uploadLabel: uploadNameById.get(uploadMetadataId) ?? uploadMetadataId,
    columnLabel: humanizeIdentifier(columnName),
  };
}

function formatEvidenceLine(line: EvidenceColumnDisplayLine): string {
  return `${line.systemLabel} · ${line.uploadLabel} · ${line.columnLabel}`;
}

function formatEvidenceOptionLabel(lines: EvidenceColumnDisplayLine[]): string {
  return lines.map((line) => line.columnLabel).join(" + ");
}

function EvidenceChipGroup({ lines }: { lines: EvidenceColumnDisplayLine[] }) {
  if (lines.length === 0) {
    return null;
  }

  const uniqueSystemLabels = Array.from(
    new Set(lines.map((line) => line.systemLabel)),
  );
  const heading =
    uniqueSystemLabels.length === 1 ? (uniqueSystemLabels[0] ?? null) : null;

  return (
    <div>
      {heading ? (
        <div className="text-sm font-medium text-foreground">{heading}</div>
      ) : null}
      <div
        className={
          heading
            ? "mt-2 flex flex-wrap items-center gap-2"
            : "flex flex-wrap items-center gap-2"
        }
      >
        {lines.map((line, index) => (
          <div key={formatEvidenceLine(line)} className="contents">
            {index > 0 ? (
              <span className="text-sm font-semibold text-muted-foreground">
                +
              </span>
            ) : null}
            <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground">
              {heading
                ? `${line.uploadLabel} · ${line.columnLabel}`
                : formatEvidenceLine(line)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function describeDiagnosticReason(
  reason: OutcomeEvidencePairingDiagnosticReason,
  locale: ReturnType<typeof useWorkspaceLocale>,
) {
  switch (reason.code) {
    case "jobs_started":
      return locale.outcomeEvidencePairing.diagnosticReasonJobsStarted;
    case "no_ready_tables":
      return locale.outcomeEvidencePairing.diagnosticReasonNoReadyTables;
    case "no_shared_identifier":
      return locale.outcomeEvidencePairing.diagnosticReasonNoSharedIdentifier;
    case "no_matching_scale_columns":
      return locale.outcomeEvidencePairing
        .diagnosticReasonNoMatchingScaleColumns;
    case "no_categorical_columns":
      return locale.outcomeEvidencePairing.diagnosticReasonNoCategoricalColumns;
    case "duplicate_identifier_values":
      return locale.outcomeEvidencePairing
        .diagnosticReasonDuplicateIdentifierValues;
    case "scale_bounds_mismatch":
      return locale.outcomeEvidencePairing.diagnosticReasonScaleBoundsMismatch;
    case "no_declared_pairing_groups":
      return locale.outcomeEvidencePairing
        .diagnosticReasonNoDeclaredPairingGroups;
    default:
      return reason.code;
  }
}

function describeUploadState(
  uploadState: OutcomeEvidencePairingActivityUploadState,
  locale: ReturnType<typeof useWorkspaceLocale>,
) {
  switch (uploadState.reason) {
    case "active_job":
      return locale.outcomeEvidencePairing.uploadStateActiveJob;
    case "already_interpreted":
      return locale.outcomeEvidencePairing.uploadStateAlreadyInterpreted;
    case "ready_to_interpret":
      return locale.outcomeEvidencePairing.uploadStateReadyToInterpret;
    case "privacy_safe_representation_missing":
      return locale.outcomeEvidencePairing.uploadStatePrivacyMissing;
    case "unsupported_modality":
      return locale.outcomeEvidencePairing.uploadStateUnsupportedModality;
    default:
      return uploadState.reason;
  }
}

function describeActivityStatus(
  activity: OutcomeEvidencePairingActivityDiagnostic,
  locale: ReturnType<typeof useWorkspaceLocale>,
) {
  switch (activity.status) {
    case "jobs_started":
      return locale.outcomeEvidencePairing.activityStatusJobsStarted;
    case "already_ready":
      return locale.outcomeEvidencePairing.activityStatusAlreadyReady;
    case "no_uploads":
      return locale.outcomeEvidencePairing.activityStatusNoUploads;
    case "blocked":
      return locale.outcomeEvidencePairing.activityStatusBlocked;
    default:
      return activity.status;
  }
}

function OutcomeEvidenceDiagnosticsCard({
  diagnostics,
}: {
  diagnostics: NonNullable<
    ReturnType<typeof useOutcomeEvidencePairingQuery>["data"]
  >["diagnostics"];
}) {
  const locale = useWorkspaceLocale();
  const activityDiagnostics = diagnostics.activityDiagnostics.filter(
    (activity) =>
      activity.status !== "already_ready" ||
      activity.startedCount > 0 ||
      activity.uploadStates.length > 0,
  );

  if (diagnostics.reasons.length === 0 && activityDiagnostics.length === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {locale.outcomeEvidencePairing.diagnosticsTitle}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {locale.outcomeEvidencePairing.diagnosticsSummary({
          activityCount: diagnostics.activityCount,
          candidateCount: diagnostics.candidateCount,
          readyTableCount: diagnostics.readyTableCount,
        })}
      </p>

      {diagnostics.reasons.length > 0 ? (
        <div className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
          {diagnostics.reasons.map((reason) => (
            <div key={reason.code}>
              {describeDiagnosticReason(reason, locale)}
            </div>
          ))}
        </div>
      ) : null}

      {activityDiagnostics.length > 0 ? (
        <div className="mt-5 space-y-3">
          {activityDiagnostics.map((activity) => (
            <div
              key={activity.activityId}
              className="rounded-2xl border border-border/70 bg-card px-4 py-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-medium text-foreground">
                  {activity.activityName}
                </div>
                <Badge variant="secondary">
                  {describeActivityStatus(activity, locale)}
                </Badge>
              </div>

              <div className="mt-2 text-sm leading-6 text-muted-foreground">
                {locale.outcomeEvidencePairing.activityDiagnosticSummary({
                  uploadCount: activity.uploadCount,
                  interpretedUploadCount: activity.interpretedUploadCount,
                  readyTableCount: activity.readyTableCount,
                })}
              </div>

              {activity.uploadStates.length > 0 ? (
                <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {activity.uploadStates.map((uploadState) => (
                    <div key={uploadState.uploadMetadataId}>
                      {uploadState.originalFileName}:{" "}
                      {describeUploadState(uploadState, locale)}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function describeProposal(
  proposal: OutcomeEvidencePairingProposal,
  activityMetaById: Map<string, ActivityMeta>,
  uploadNameById: Map<string, string>,
  locale: ReturnType<typeof useWorkspaceLocale>,
): ProposalDisplay {
  if (proposal.shape === "paired_delta") {
    const beforeLine = buildEvidenceLine(
      proposal.activityIdBefore,
      proposal.beforeUploadMetadataId,
      proposal.beforeColumnName,
      activityMetaById,
      uploadNameById,
      locale,
    );
    const afterLine = buildEvidenceLine(
      proposal.activityIdAfter,
      proposal.afterUploadMetadataId,
      proposal.afterColumnName,
      activityMetaById,
      uploadNameById,
      locale,
    );
    return {
      summary: `${formatEvidenceLine(beforeLine)} + ${formatEvidenceLine(afterLine)}`,
      lines: [beforeLine, afterLine],
    };
  }

  const line = buildEvidenceLine(
    proposal.activityId,
    proposal.uploadMetadataId,
    proposal.categoryColumnName,
    activityMetaById,
    uploadNameById,
    locale,
  );
  return {
    summary: formatEvidenceLine(line),
    lines: [line],
  };
}

function describeConfirmedLink(
  link: OutcomeEvidenceLink,
  activityMetaById: Map<string, ActivityMeta>,
  uploadNameById: Map<string, string>,
  locale: ReturnType<typeof useWorkspaceLocale>,
): ProposalDisplay {
  if (link.shape === "paired_delta") {
    const beforeLine = buildEvidenceLine(
      link.activityIdBefore,
      link.beforeUploadMetadataId,
      link.beforeColumnName,
      activityMetaById,
      uploadNameById,
      locale,
    );
    const afterLine = buildEvidenceLine(
      link.activityIdAfter,
      link.afterUploadMetadataId,
      link.afterColumnName,
      activityMetaById,
      uploadNameById,
      locale,
    );
    return {
      summary: `${formatEvidenceLine(beforeLine)} + ${formatEvidenceLine(afterLine)}`,
      lines: [beforeLine, afterLine],
    };
  }

  const line = buildEvidenceLine(
    link.activityId,
    link.uploadMetadataId,
    link.categoryColumnName,
    activityMetaById,
    uploadNameById,
    locale,
  );
  return {
    summary: formatEvidenceLine(line),
    lines: [line],
  };
}

function OutcomeEvidenceCandidateCard({
  proposal,
  activityMetaById,
  uploadNameById,
  onAssign,
  onReject,
  isSubmitting,
  fixedOutcomeId,
  outcomeOptions,
}: {
  proposal: OutcomeEvidencePairingProposal;
  activityMetaById: Map<string, ActivityMeta>;
  uploadNameById: Map<string, string>;
  onAssign: (proposalId: string, outcomeId: string) => void;
  onReject: (proposalId: string) => void;
  isSubmitting: boolean;
  fixedOutcomeId?: string;
  outcomeOptions?: ProjectOutcomeStatement[];
}) {
  const locale = useWorkspaceLocale();
  const description = describeProposal(
    proposal,
    activityMetaById,
    uploadNameById,
    locale,
  );
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>(
    fixedOutcomeId ?? proposal.suggestedOutcome?.outcomeId ?? "",
  );
  const effectiveOutcomeId = fixedOutcomeId ?? selectedOutcomeId;

  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-4">
      <EvidenceChipGroup lines={description.lines} />

      {proposal.suggestedOutcome ? (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {proposal.suggestedOutcome.outcomeId !== null ? (
            <>
              <span className="font-semibold">
                {locale.outcomeEvidencePairing.suggestedOutcomeLabel}
              </span>{" "}
              {proposal.suggestedOutcome.rationale}
            </>
          ) : (
            locale.outcomeEvidencePairing.suggestedOutcomeUncertain
          )}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!fixedOutcomeId && outcomeOptions ? (
          <Select
            value={selectedOutcomeId}
            onValueChange={setSelectedOutcomeId}
          >
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue
                placeholder={
                  locale.outcomeEvidencePairing.outcomeSelectPlaceholder
                }
              />
            </SelectTrigger>
            <SelectContent>
              {outcomeOptions.map((outcomeStatement) => (
                <SelectItem
                  key={outcomeStatement.id}
                  value={outcomeStatement.id}
                >
                  {outcomeStatement.statement}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Button
          type="button"
          size="sm"
          disabled={isSubmitting || effectiveOutcomeId === ""}
          onClick={() => onAssign(proposal.proposalId, effectiveOutcomeId)}
        >
          {locale.outcomeEvidencePairing.assignAction}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onReject(proposal.proposalId)}
        >
          {locale.outcomeEvidencePairing.rejectAction}
        </Button>
      </div>
    </div>
  );
}

function ConfirmedEvidenceCard({
  link,
  activityMetaById,
  uploadNameById,
  onRemove,
  isSubmitting,
}: {
  link: OutcomeEvidenceLink;
  activityMetaById: Map<string, ActivityMeta>;
  uploadNameById: Map<string, string>;
  onRemove: (linkId: string) => void;
  isSubmitting: boolean;
}) {
  const locale = useWorkspaceLocale();
  const description = describeConfirmedLink(
    link,
    activityMetaById,
    uploadNameById,
    locale,
  );

  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-4">
      <EvidenceChipGroup lines={description.lines} />

      <div className="mt-4">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onRemove(link.linkId)}
        >
          {locale.outcomeEvidencePairing.removeLinkAction}
        </Button>
      </div>
    </div>
  );
}

function OutcomeEvidenceOutcomeCard({
  outcomeSection,
  eligibleEvidenceOptions,
  activityMetaById,
  uploadNameById,
  isSubmitting,
  isRemoving,
  onAssign,
  onReject,
  onRemoveLink,
}: {
  outcomeSection: OutcomeEvidencePairingOutcomeSection;
  eligibleEvidenceOptions: OutcomeEvidencePairingProposal[];
  activityMetaById: Map<string, ActivityMeta>;
  uploadNameById: Map<string, string>;
  isSubmitting: boolean;
  isRemoving: boolean;
  onAssign: (proposalId: string, outcomeId: string) => void;
  onReject: (proposalId: string) => void;
  onRemoveLink: (linkId: string) => void;
}) {
  const locale = useWorkspaceLocale();
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");
  const recommendedProposalIds = new Set(
    outcomeSection.recommendedProposals.map((proposal) => proposal.proposalId),
  );
  const outcomeAudience = inferAudienceFromText(
    outcomeSection.outcomeStatement.statement,
  );
  const alternativeProposals = eligibleEvidenceOptions.filter((proposal) => {
    if (recommendedProposalIds.has(proposal.proposalId)) {
      return false;
    }
    if (!outcomeAudience) {
      return true;
    }
    const proposalAudience = inferProposalAudience(proposal, uploadNameById);
    return proposalAudience === null || proposalAudience === outcomeAudience;
  });
  const selectedProposal =
    alternativeProposals.find(
      (proposal) => proposal.proposalId === selectedProposalId,
    ) ?? null;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-7 text-foreground">
            {outcomeSection.outcomeStatement.statement}
          </h3>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-sm font-semibold text-foreground">
          {locale.outcomeEvidencePairing.confirmedEvidenceTitle}
        </div>
        {outcomeSection.confirmedLinks.length > 0 ? (
          <div className="mt-3 space-y-3">
            {outcomeSection.confirmedLinks.map((link) => (
              <ConfirmedEvidenceCard
                key={link.linkId}
                link={link}
                activityMetaById={activityMetaById}
                uploadNameById={uploadNameById}
                onRemove={onRemoveLink}
                isSubmitting={isRemoving}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {locale.outcomeEvidencePairing.noConfirmedEvidence}
          </p>
        )}
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold text-foreground">
          {locale.outcomeEvidencePairing.recommendedEvidenceTitle}
        </div>
        {outcomeSection.recommendedProposals.length > 0 ? (
          <div className="mt-3 space-y-3">
            {outcomeSection.recommendedProposals.map((proposal) => (
              <OutcomeEvidenceCandidateCard
                key={proposal.proposalId}
                proposal={proposal}
                activityMetaById={activityMetaById}
                uploadNameById={uploadNameById}
                fixedOutcomeId={outcomeSection.outcomeStatement.id}
                onAssign={onAssign}
                onReject={onReject}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {locale.outcomeEvidencePairing.noRecommendedEvidence}
          </p>
        )}
      </div>

      {alternativeProposals.length > 0 ? (
        <div className="mt-6">
          <div className="text-sm font-semibold text-foreground">
            {locale.outcomeEvidencePairing.otherEvidenceTitle}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Select
              value={selectedProposalId}
              onValueChange={setSelectedProposalId}
            >
              <SelectTrigger className="w-full sm:w-[32rem]">
                <SelectValue
                  placeholder={
                    locale.outcomeEvidencePairing.otherEvidencePlaceholder
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {alternativeProposals.map((proposal) => {
                  const description = describeProposal(
                    proposal,
                    activityMetaById,
                    uploadNameById,
                    locale,
                  );
                  return (
                    <SelectItem
                      key={proposal.proposalId}
                      value={proposal.proposalId}
                    >
                      {formatEvidenceOptionLabel(description.lines)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              disabled={isSubmitting || selectedProposalId === ""}
              onClick={() =>
                onAssign(selectedProposalId, outcomeSection.outcomeStatement.id)
              }
            >
              {locale.outcomeEvidencePairing.assignAction}
            </Button>
          </div>

          {selectedProposal ? (
            <div className="mt-3 rounded-2xl border border-border/70 bg-card px-4 py-4">
              <div className="text-sm font-medium text-foreground">
                {formatEvidenceOptionLabel(
                  describeProposal(
                    selectedProposal,
                    activityMetaById,
                    uploadNameById,
                    locale,
                  ).lines,
                )}
              </div>
              <div className="mt-2">
                <EvidenceChipGroup
                  lines={
                    describeProposal(
                      selectedProposal,
                      activityMetaById,
                      uploadNameById,
                      locale,
                    ).lines
                  }
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

export function OutcomeEvidencePairingReviewPanel({
  projectId,
  outcomeStatements,
}: {
  projectId: string;
  outcomeStatements: ProjectOutcomeStatement[];
}) {
  const locale = useWorkspaceLocale();
  const pairingQuery = useOutcomeEvidencePairingQuery(projectId);
  const activitiesQuery = useProjectActivitiesQuery(projectId);
  const decideMutation =
    useDecideOutcomeEvidencePairingProposalMutation(projectId);
  const removeLinkMutation = useRemoveOutcomeEvidenceLinkMutation(projectId);
  const activityUploadsQueries = useQueries({
    queries: (activitiesQuery.data ?? []).map((activity) => ({
      queryKey: ["activity-uploads", activity.id] as const,
      queryFn: () => apiClient.listActivityUploads(activity.id),
      enabled: Boolean(activitiesQuery.data),
    })),
  });

  const activityMetaById = new Map(
    (activitiesQuery.data ?? []).map((activity) => [
      activity.id,
      { name: activity.name, systemType: activity.systemType },
    ]),
  );
  const uploadNameById = new Map<string, string>();
  for (const query of activityUploadsQueries) {
    for (const upload of (query.data ?? []) as UploadMetadataRecord[]) {
      uploadNameById.set(upload.id, upload.originalFileName);
    }
  }
  const outcomeOptions =
    pairingQuery.data?.outcomeSections.map(
      (section) => section.outcomeStatement,
    ) ?? outcomeStatements;

  async function handleAssign(proposalId: string, outcomeId: string) {
    try {
      await decideMutation.mutateAsync({
        proposalId,
        decision: "assign",
        outcomeId,
      });
      toast.success(locale.outcomeEvidencePairing.assignSuccess);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : locale.outcomeEvidencePairing.assignFailure,
      );
    }
  }

  async function handleReject(proposalId: string) {
    try {
      await decideMutation.mutateAsync({ proposalId, decision: "reject" });
      toast.success(locale.outcomeEvidencePairing.rejectSuccess);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : locale.outcomeEvidencePairing.rejectFailure,
      );
    }
  }

  async function handleRemoveLink(linkId: string) {
    try {
      await removeLinkMutation.mutateAsync(linkId);
      toast.success(locale.outcomeEvidencePairing.removeLinkSuccess);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : locale.outcomeEvidencePairing.removeLinkFailure,
      );
    }
  }

  if (outcomeStatements.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {locale.outcomeEvidencePairing.noOutcomeStatementsTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {locale.outcomeEvidencePairing.noOutcomeStatementsDescription}
        </p>
      </Card>
    );
  }

  if (pairingQuery.isLoading) {
    return (
      <Card className="p-6 text-sm leading-6 text-muted-foreground">
        {locale.outcomeEvidencePairing.loading}
      </Card>
    );
  }

  if (pairingQuery.isError) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {locale.outcomeEvidencePairing.errorTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {locale.outcomeEvidencePairing.errorDescription}
        </p>
      </Card>
    );
  }

  const review = pairingQuery.data;
  const outcomeSections = review?.outcomeSections ?? [];
  const openProposals = review?.proposals ?? [];
  const eligibleEvidenceOptions = review?.eligibleEvidenceOptions ?? [];
  const unassignedProposals = review?.unassignedProposals ?? [];
  const hasConfirmedLinks = outcomeSections.some(
    (outcomeSection) => outcomeSection.confirmedLinks.length > 0,
  );
  const hasAnyCandidateContent =
    openProposals.length > 0 ||
    eligibleEvidenceOptions.length > 0 ||
    hasConfirmedLinks ||
    unassignedProposals.length > 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {locale.outcomeEvidencePairing.title}
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
          {locale.outcomeEvidencePairing.description}
        </p>
      </div>

      {review ? (
        <OutcomeEvidenceDiagnosticsCard diagnostics={review.diagnostics} />
      ) : null}

      <div className="space-y-4">
        {outcomeSections.map((outcomeSection) => (
          <OutcomeEvidenceOutcomeCard
            key={outcomeSection.outcomeStatement.id}
            outcomeSection={outcomeSection}
            eligibleEvidenceOptions={eligibleEvidenceOptions}
            activityMetaById={activityMetaById}
            uploadNameById={uploadNameById}
            isSubmitting={decideMutation.isPending}
            isRemoving={removeLinkMutation.isPending}
            onAssign={handleAssign}
            onReject={handleReject}
            onRemoveLink={handleRemoveLink}
          />
        ))}
      </div>

      {unassignedProposals.length > 0 ? (
        <Card className="p-5">
          <h3 className="text-base font-semibold text-foreground">
            {locale.outcomeEvidencePairing.unassignedCandidatesTitle}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {locale.outcomeEvidencePairing.unassignedCandidatesDescription}
          </p>
          <div className="mt-4 space-y-3">
            {unassignedProposals.map((proposal) => (
              <OutcomeEvidenceCandidateCard
                key={proposal.proposalId}
                proposal={proposal}
                activityMetaById={activityMetaById}
                uploadNameById={uploadNameById}
                onAssign={handleAssign}
                onReject={handleReject}
                isSubmitting={decideMutation.isPending}
                outcomeOptions={outcomeOptions}
              />
            ))}
          </div>
        </Card>
      ) : null}

      {!hasAnyCandidateContent ? (
        <Card className="p-6">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {locale.outcomeEvidencePairing.emptyStateTitle}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {locale.outcomeEvidencePairing.emptyStateDescription}
          </p>
        </Card>
      ) : null}
    </section>
  );
}
