import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/WorkspaceUI";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import {
  useApproveOutcomeEvidenceRecommendationMutation,
  useOutcomeEvidenceCandidatesQuery,
  useOutcomeEvidenceConfirmedLinksQuery,
  useProjectOutcomeStatementsQuery,
  useRemoveAllOutcomeEvidenceConfirmedLinksMutation,
} from "@/hooks/useWorkspaceQueries";
import { recommendationKey } from "@/lib/outcomeEvidenceRecommendation";
import {
  ApiError,
  type OutcomeEvidenceCandidate,
  type OutcomeEvidenceConfirmedLink,
  type OutcomeEvidenceRecommendation,
  type OutcomeEvidenceRecommendationColumnReference,
  type ProjectOutcomeStatement,
} from "@/services/apiClient";

// New joint pairing+outcome recommendation review surface
// (OUTCOME_EVIDENCE_MERGE_PLAN.md §4.5), scoped to one merged "Ausgangslage
// & Wirkungsdaten" activity — rendered by ActivityKnowledgeCard only when
// that activity's systemType is "outcome_evidence". Deliberately does not
// carry over the old outcomeEvidencePairingReviewPanel.tsx's cross-activity
// assumptions (no baseline/impact_measurement split to reconcile) or its
// client-side-only inferAudienceFromText cohort guessing — every
// recommendation already carries its real, declared cohortTag.
//
// The "get recommendations" fetch state (the query itself, and
// dismissedKeys) is owned one level up, in ActivityKnowledgeCard — this
// panel only renders the *results* of that call, plus the trigger button
// itself once there's already a confirmed-links table to put it next to.
// recommendations/dismissedKeys/onDismiss are passed down from there
// rather than owned here, since the button and the results need to share
// state. There is no server-side cache of recommendations (§8), so
// recommendations stays `null` (nothing fetched yet) until the query
// resolves.
//
// Before any link is confirmed, the trigger button instead lives in
// ActivityKnowledgeCard's own header action row (next to the activity
// title, the same spot other activities show their primary action
// button) — there's no "Alle entfernen" row yet for it to sit beside.
// Once the first link is confirmed, ActivityKnowledgeCard swaps that
// header slot for a collapse toggle and this panel takes over rendering
// the button (see OutcomeEvidenceConfirmedLinksSection below) — the same
// onGetRecommendations/isGettingRecommendations props cover both cases,
// only the render location moves.
//
// The panel has three sections: a persistent "confirmed links" summary (a
// real GET read — this is what survives a tab switch or a refresh), the
// recommendation results (only rendered once a fetch has actually
// happened), and a manual-add form for pairings the model missed.
export function OutcomeEvidenceRecommendationPanel({
  projectId,
  activityId,
  recommendations,
  dismissedKeys,
  onDismiss,
  onGetRecommendations,
  isGettingRecommendations,
}: {
  projectId: string;
  activityId: string;
  recommendations: OutcomeEvidenceRecommendation[] | null;
  dismissedKeys: Set<string>;
  onDismiss: (recommendation: OutcomeEvidenceRecommendation) => void;
  onGetRecommendations: () => void;
  isGettingRecommendations: boolean;
}) {
  const locale = useWorkspaceLocale();
  const outcomeStatementsQuery = useProjectOutcomeStatementsQuery(projectId);
  const confirmedLinksQuery = useOutcomeEvidenceConfirmedLinksQuery(
    projectId,
    activityId,
  );
  const candidatesQuery = useOutcomeEvidenceCandidatesQuery(
    projectId,
    activityId,
  );
  const approveMutation = useApproveOutcomeEvidenceRecommendationMutation(
    projectId,
    activityId,
  );
  const removeAllConfirmedLinksMutation =
    useRemoveAllOutcomeEvidenceConfirmedLinksMutation(projectId, activityId);

  const [isManualAddOpen, setIsManualAddOpen] = useState(false);

  const outcomeStatements = outcomeStatementsQuery.data ?? [];
  const outcomeStatementById = new Map(
    outcomeStatements.map((outcomeStatement) => [
      outcomeStatement.id,
      outcomeStatement,
    ]),
  );

  const confirmedLinks = confirmedLinksQuery.data?.links ?? [];

  function handleApprove(recommendation: OutcomeEvidenceRecommendation) {
    approveMutation.mutate(recommendation, {
      onSuccess: () => {
        toast.success(locale.outcomeEvidenceRecommendation.assignSuccess);
        onDismiss(recommendation);
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError
            ? error.message
            : locale.outcomeEvidenceRecommendation.assignFailure,
        );
      },
    });
  }

  function handleApproveRecommendationCard(
    recommendation: OutcomeEvidenceRecommendation,
    outcomeId: string | null,
  ) {
    handleApprove({ ...recommendation, outcomeId });
  }

  function handleRemoveAllConfirmedLinks() {
    removeAllConfirmedLinksMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(locale.outcomeEvidenceRecommendation.removeAllSuccess);
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError
            ? error.message
            : locale.outcomeEvidenceRecommendation.removeAllFailure,
        );
      },
    });
  }

  function handleToggleManualAdd() {
    setIsManualAddOpen((current) => {
      const next = !current;
      if (next && candidatesQuery.data === undefined) {
        void candidatesQuery.refetch();
      }
      return next;
    });
  }

  // A recommendation that has since become a real confirmed link must stay
  // hidden even if dismissedKeys has forgotten it — dismissedKeys is plain
  // component state on ActivityKnowledgeCard, which resets on remount (e.g.
  // switching to another project tab and back), but confirmedLinksQuery is
  // a real server read that doesn't. Without this, an already-approved
  // recommendation reappears as an actionable "Bestätigen" card the next
  // time this component mounts, even though it's already been confirmed.
  const confirmedRecommendationKeys = new Set(
    confirmedLinks.map((link) => recommendationKey(link)),
  );
  const visibleRecommendations = (recommendations ?? []).filter(
    (recommendation) =>
      !dismissedKeys.has(recommendationKey(recommendation)) &&
      !confirmedRecommendationKeys.has(recommendationKey(recommendation)),
  );
  const recommendationGroups = groupRecommendationsByOutcome(
    visibleRecommendations,
  );
  const confirmedGroups = groupConfirmedLinksByOutcome(confirmedLinks);

  return (
    <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
      <OutcomeEvidenceConfirmedLinksSection
        groups={confirmedGroups}
        outcomeStatementById={outcomeStatementById}
        isLoading={confirmedLinksQuery.isLoading}
        isRemoving={removeAllConfirmedLinksMutation.isPending}
        onRemoveAll={handleRemoveAllConfirmedLinks}
        onGetRecommendations={onGetRecommendations}
        isGettingRecommendations={isGettingRecommendations}
        locale={locale}
      />

      {recommendations !== null ? (
        <div className="space-y-3 border-t border-border/70 pt-4">
          {visibleRecommendations.length === 0 ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {locale.outcomeEvidenceRecommendation.noRecommendations}
            </p>
          ) : (
            <div className="space-y-4">
              {recommendationGroups.map((group) => (
                <div
                  key={group.outcomeId ?? "unassigned"}
                  className="space-y-3"
                >
                  <h4 className="text-sm font-semibold text-foreground">
                    {group.outcomeId
                      ? (outcomeStatementById.get(group.outcomeId)?.statement ??
                        group.outcomeId)
                      : locale.outcomeEvidenceRecommendation
                          .unassignedSectionTitle}
                  </h4>
                  {groupRecommendationsByShapeAndCohort(group.items).map(
                    (subGroup) => (
                      <div
                        key={`${subGroup.shape}|${subGroup.cohortTags.join(",")}`}
                        className="space-y-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            {subGroup.shape === "paired_delta"
                              ? locale.outcomeEvidenceRecommendation
                                  .pairedDeltaLabel
                              : subGroup.shape === "paired_categorical_shift"
                                ? locale.outcomeEvidenceRecommendation
                                    .pairedCategoricalShiftLabel
                                : locale.outcomeEvidenceRecommendation
                                    .singleDistributionLabel}
                          </Badge>
                          {subGroup.cohortTags.map((cohortTag) => (
                            <Badge key={cohortTag} variant="outline">
                              {locale.outcomeEvidenceRecommendation.cohortLabel}
                              : {cohortTag}
                            </Badge>
                          ))}
                        </div>
                        {subGroup.items.map((recommendation) => (
                          <OutcomeEvidenceRecommendationCard
                            key={recommendationKey(recommendation)}
                            recommendation={recommendation}
                            outcomeStatements={outcomeStatements}
                            fixedOutcomeId={group.outcomeId}
                            isSubmitting={approveMutation.isPending}
                            onApprove={(outcomeId) =>
                              handleApproveRecommendationCard(
                                recommendation,
                                outcomeId,
                              )
                            }
                            onDismiss={() => onDismiss(recommendation)}
                          />
                        ))}
                      </div>
                    ),
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <OutcomeEvidenceManualAddSection
        isOpen={isManualAddOpen}
        onToggle={handleToggleManualAdd}
        candidates={candidatesQuery.data?.candidates ?? []}
        isLoadingCandidates={candidatesQuery.isFetching}
        outcomeStatements={outcomeStatements}
        isSubmitting={approveMutation.isPending}
        onSubmit={handleApprove}
        locale={locale}
      />
    </div>
  );
}

function groupRecommendationsByOutcome(
  recommendations: OutcomeEvidenceRecommendation[],
): Array<{ outcomeId: string | null; items: OutcomeEvidenceRecommendation[] }> {
  const order: Array<string | null> = [];
  const byOutcome = new Map<string | null, OutcomeEvidenceRecommendation[]>();

  for (const recommendation of recommendations) {
    const key = recommendation.outcomeId;
    if (!byOutcome.has(key)) {
      order.push(key);
      byOutcome.set(key, []);
    }
    byOutcome.get(key)?.push(recommendation);
  }

  // The "no clear outcome match" group always sorts last, regardless of
  // where its first item happened to appear in the response.
  const orderedKeys = [...order.filter((key) => key !== null), null].filter(
    (key) => byOutcome.has(key),
  );

  return orderedKeys.map((outcomeId) => ({
    outcomeId,
    items: byOutcome.get(outcomeId) ?? [],
  }));
}

// Confirmed links always carry a real outcomeId (see
// OutcomeEvidenceConfirmedLink) — no "unassigned" bucket to sort last here,
// unlike groupRecommendationsByOutcome above.
function groupConfirmedLinksByOutcome(
  links: OutcomeEvidenceConfirmedLink[],
): Array<{ outcomeId: string; items: OutcomeEvidenceConfirmedLink[] }> {
  const order: string[] = [];
  const byOutcome = new Map<string, OutcomeEvidenceConfirmedLink[]>();

  for (const link of links) {
    if (!byOutcome.has(link.outcomeId)) {
      order.push(link.outcomeId);
      byOutcome.set(link.outcomeId, []);
    }
    byOutcome.get(link.outcomeId)?.push(link);
  }

  return order.map((outcomeId) => ({
    outcomeId,
    items: byOutcome.get(outcomeId) ?? [],
  }));
}

function getRecommendationCohortTags(
  recommendation: OutcomeEvidenceRecommendation,
): string[] {
  const cohortTags =
    recommendation.shape === "paired_delta" ||
    recommendation.shape === "paired_categorical_shift"
      ? [recommendation.before.cohortTag, recommendation.after.cohortTag]
      : [recommendation.column.cohortTag];
  return [...new Set(cohortTags.filter((tag): tag is string => tag !== null))];
}

// Every recommendation used to carry its own shape/cohort badges, repeated
// on every single card — noisy once there are more than a couple of
// recommendations for the same outcome, since they usually share the same
// shape and cohort. Sub-grouping by that combination lets the badges render
// once per group instead of once per card.
function groupRecommendationsByShapeAndCohort(
  recommendations: OutcomeEvidenceRecommendation[],
): Array<{
  shape: OutcomeEvidenceRecommendation["shape"];
  cohortTags: string[];
  items: OutcomeEvidenceRecommendation[];
}> {
  const order: string[] = [];
  const bySubGroup = new Map<string, OutcomeEvidenceRecommendation[]>();

  for (const recommendation of recommendations) {
    const key = [
      recommendation.shape,
      ...getRecommendationCohortTags(recommendation),
    ].join("|");
    if (!bySubGroup.has(key)) {
      order.push(key);
      bySubGroup.set(key, []);
    }
    bySubGroup.get(key)?.push(recommendation);
  }

  return order.map((key) => {
    const items = bySubGroup.get(key) ?? [];
    const first = items[0];
    return {
      shape: first?.shape ?? "single_distribution",
      cohortTags: first ? getRecommendationCohortTags(first) : [],
      items,
    };
  });
}

function OutcomeEvidenceRecommendationCard({
  recommendation,
  outcomeStatements,
  fixedOutcomeId,
  isSubmitting,
  onApprove,
  onDismiss,
}: {
  recommendation: OutcomeEvidenceRecommendation;
  outcomeStatements: ProjectOutcomeStatement[];
  // Set when this card renders inside a real outcome's group — the outcome
  // is already implied by that grouping, so there's nothing left to pick:
  // approve just confirms against it directly. Null only for the
  // "unassigned"/no-clear-match group, where a human still has to choose
  // one explicitly.
  fixedOutcomeId: string | null;
  isSubmitting: boolean;
  onApprove: (outcomeId: string | null) => void;
  onDismiss: () => void;
}) {
  const locale = useWorkspaceLocale();
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>(
    recommendation.outcomeId ?? "",
  );

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        {recommendation.shape === "paired_delta" ||
        recommendation.shape === "paired_categorical_shift" ? (
          <>
            <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground">
              {locale.outcomeEvidenceRecommendation.beforeLabel}:{" "}
              {recommendation.before.label}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              →
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground">
              {locale.outcomeEvidenceRecommendation.afterLabel}:{" "}
              {recommendation.after.label}
            </span>
          </>
        ) : (
          <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground">
            {recommendation.column.label}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {recommendation.rationale}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {fixedOutcomeId === null ? (
          <Select
            value={selectedOutcomeId}
            onValueChange={setSelectedOutcomeId}
          >
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue
                placeholder={
                  locale.outcomeEvidenceRecommendation.outcomeSelectPlaceholder
                }
              />
            </SelectTrigger>
            <SelectContent>
              {outcomeStatements.map((outcomeStatement) => (
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
          disabled={
            isSubmitting ||
            (fixedOutcomeId === null && selectedOutcomeId === "")
          }
          onClick={() =>
            onApprove(
              fixedOutcomeId === null ? selectedOutcomeId : fixedOutcomeId,
            )
          }
        >
          {locale.outcomeEvidenceRecommendation.assignAction}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={onDismiss}
          title={locale.outcomeEvidenceRecommendation.dismissHint}
        >
          {locale.outcomeEvidenceRecommendation.dismissAction}
        </Button>
      </div>
    </Card>
  );
}

type WorkspaceLocale = ReturnType<typeof useWorkspaceLocale>;

// Persistent, server-backed summary of what's already confirmed for this
// activity, grouped by outcome and laid out as real before/after columns
// (a <Table>, ui/table.tsx's first real usage in this app) rather than the
// old confirmedJustNow session-only card stack — this is what survives a
// tab switch or a page refresh.
function OutcomeEvidenceConfirmedLinksSection({
  groups,
  outcomeStatementById,
  isLoading,
  isRemoving,
  onRemoveAll,
  onGetRecommendations,
  isGettingRecommendations,
  locale,
}: {
  groups: Array<{ outcomeId: string; items: OutcomeEvidenceConfirmedLink[] }>;
  outcomeStatementById: Map<string, ProjectOutcomeStatement>;
  isLoading: boolean;
  isRemoving: boolean;
  onRemoveAll: () => void;
  onGetRecommendations: () => void;
  isGettingRecommendations: boolean;
  locale: WorkspaceLocale;
}) {
  const [isRemoveAllDialogOpen, setIsRemoveAllDialogOpen] = useState(false);

  function handleConfirmRemoveAll() {
    onRemoveAll();
    setIsRemoveAllDialogOpen(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground">
          {locale.outcomeEvidenceRecommendation.confirmedLinksTitle}
        </h4>
        {groups.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isGettingRecommendations}
              onClick={onGetRecommendations}
            >
              {isGettingRecommendations ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : null}
              {isGettingRecommendations
                ? locale.outcomeEvidenceRecommendation
                    .gettingRecommendationsAction
                : locale.outcomeEvidenceRecommendation.getRecommendationsAction}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsRemoveAllDialogOpen(true)}
            >
              {locale.outcomeEvidenceRecommendation.removeAllToggleAction}
            </Button>
          </div>
        ) : null}
      </div>

      <Dialog
        open={isRemoveAllDialogOpen}
        onOpenChange={setIsRemoveAllDialogOpen}
      >
        <DialogContent className="max-w-2xl rounded-[28px] border border-border/80 bg-card/98 p-0 shadow-[var(--shadow-elevated)]">
          <DialogHeader className="border-b border-border/70 px-8 py-6 text-left">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {locale.outcomeEvidenceRecommendation.removeAllTitle}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              {locale.outcomeEvidenceRecommendation.removeAllDescription}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="border-t border-border/70 px-8 py-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRemoveAllDialogOpen(false)}
              disabled={isRemoving}
            >
              {locale.dialogs.cancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRemoveAll}
              disabled={isRemoving}
            >
              {isRemoving
                ? locale.outcomeEvidenceRecommendation.removeAllRemoving
                : locale.outcomeEvidenceRecommendation.removeAllConfirmAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : groups.length === 0 ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {locale.outcomeEvidenceRecommendation.confirmedLinksEmpty}
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const pairedLinks = group.items.filter(
              (
                link,
              ): link is Extract<
                OutcomeEvidenceConfirmedLink,
                { shape: "paired_delta" | "paired_categorical_shift" }
              > =>
                link.shape === "paired_delta" ||
                link.shape === "paired_categorical_shift",
            );
            const singleDistributionLinks = group.items.filter(
              (
                link,
              ): link is Extract<
                OutcomeEvidenceConfirmedLink,
                { shape: "single_distribution" }
              > => link.shape === "single_distribution",
            );

            return (
              <div key={group.outcomeId} className="space-y-2">
                <h5 className="text-sm font-semibold text-foreground">
                  {outcomeStatementById.get(group.outcomeId)?.statement ??
                    group.outcomeId}
                </h5>
                {pairedLinks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {
                            locale.outcomeEvidenceRecommendation
                              .confirmedLinksBeforeColumnHeader
                          }
                        </TableHead>
                        <TableHead>
                          {
                            locale.outcomeEvidenceRecommendation
                              .confirmedLinksAfterColumnHeader
                          }
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pairedLinks.map((link) => (
                        <TableRow key={link.linkId}>
                          <TableCell>{link.before.label}</TableCell>
                          <TableCell>{link.after.label}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : null}
                {singleDistributionLinks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {
                            locale.outcomeEvidenceRecommendation
                              .confirmedLinksSingleColumnHeader
                          }
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {singleDistributionLinks.map((link) => (
                        <TableRow key={link.linkId}>
                          <TableCell>{link.column.label}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function candidateToColumnReference(
  candidate: OutcomeEvidenceCandidate,
): OutcomeEvidenceRecommendationColumnReference {
  return {
    uploadMetadataId: candidate.uploadMetadataId,
    tableName: candidate.tableName,
    columnName: candidate.columnName,
    label: candidate.label,
    cohortTag: candidate.cohortTag,
    datasetRole: candidate.datasetRole,
  };
}

// Surfaces which file a candidate actually came from directly in the picker
// — without this, two same-schema candidates render as identical-looking
// labels and a human has no way to tell them apart before submitting (see
// OUTCOME_EVIDENCE_MERGE_PLAN.md's pre/post inversion fix: this manual path
// is the one place that never runs the LLM's own grounding, so getting it
// right the first time matters more here, not less).
function formatCandidateOptionLabel(
  candidate: OutcomeEvidenceCandidate,
  locale: WorkspaceLocale,
): string {
  const roleSuffix =
    candidate.datasetRole === "baseline"
      ? locale.outcomeEvidenceRecommendation.beforeLabel
      : candidate.datasetRole === "followup"
        ? locale.outcomeEvidenceRecommendation.afterLabel
        : null;
  return roleSuffix ? `${candidate.label} (${roleSuffix})` : candidate.label;
}

// Lets a human add a pairing brindl's recommend call missed — reuses the
// exact same approve mutation/endpoint a recommendation card uses, just
// with hand-picked columns instead of an LLM-proposed pair. The approval
// service independently re-validates every column/outcome against live
// evidence regardless of where the submission came from (see
// outcomeEvidenceRecommendationApprovalService.ts), so this isn't a new
// trust boundary — it's exercising a path that was already open.
function OutcomeEvidenceManualAddSection({
  isOpen,
  onToggle,
  candidates,
  isLoadingCandidates,
  outcomeStatements,
  isSubmitting,
  onSubmit,
  locale,
}: {
  isOpen: boolean;
  onToggle: () => void;
  candidates: OutcomeEvidenceCandidate[];
  isLoadingCandidates: boolean;
  outcomeStatements: ProjectOutcomeStatement[];
  isSubmitting: boolean;
  onSubmit: (recommendation: OutcomeEvidenceRecommendation) => void;
  locale: WorkspaceLocale;
}) {
  // Only paired_delta (before/after) is offered here for now —
  // single_distribution (a single column with no before/after counterpart,
  // "Verteilung") was removed from this manual picker at the owner's
  // request: it's weaker evidence (a snapshot, not a measured change) and
  // wasn't seen as worth the extra picker complexity. The LLM recommend
  // flow can still surface a single_distribution suggestion on its own —
  // this only affects what a human can add by hand.
  const [beforeColumnId, setBeforeColumnId] = useState("");
  const [afterColumnId, setAfterColumnId] = useState("");
  const [outcomeId, setOutcomeId] = useState("");

  const manualPairCandidates = candidates.filter(
    (candidate) =>
      candidate.inferredType === "numeric" ||
      candidate.epistemicRole === "validated_scale",
  );
  const candidateById = new Map(
    manualPairCandidates.map((candidate) => [candidate.columnId, candidate]),
  );

  function resetSelections() {
    setBeforeColumnId("");
    setAfterColumnId("");
    setOutcomeId("");
  }

  const isSameColumnSelected =
    beforeColumnId !== "" && beforeColumnId === afterColumnId;

  // The approval safety check will 409 a role mismatch regardless (this
  // manual path never runs the LLM's own grounding), but catching it here
  // gives an immediate, specific hint instead of a submit-and-fail round
  // trip — see OUTCOME_EVIDENCE_MERGE_PLAN.md's pre/post inversion fix.
  const hasDatasetRoleMismatch =
    beforeColumnId !== "" &&
    afterColumnId !== "" &&
    !isSameColumnSelected &&
    (candidateById.get(beforeColumnId)?.datasetRole !== "baseline" ||
      candidateById.get(afterColumnId)?.datasetRole !== "followup");

  const canSubmit =
    outcomeId !== "" &&
    !isSameColumnSelected &&
    !hasDatasetRoleMismatch &&
    beforeColumnId !== "" &&
    afterColumnId !== "";

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    const before = candidateById.get(beforeColumnId);
    const after = candidateById.get(afterColumnId);
    if (!before || !after) {
      return;
    }
    onSubmit({
      shape: "paired_delta",
      before: candidateToColumnReference(before),
      after: candidateToColumnReference(after),
      outcomeId,
      rationale: locale.outcomeEvidenceRecommendation.manualAddRationale,
    });

    resetSelections();
  }

  return (
    <div className="space-y-3 border-t border-border/70 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {locale.outcomeEvidenceRecommendation.manualAddTitle}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-foreground/25 bg-card text-foreground hover:border-foreground/40 hover:bg-accent/35 hover:text-foreground"
          onClick={onToggle}
        >
          {locale.outcomeEvidenceRecommendation.manualAddToggleAction}
        </Button>
      </div>

      {isOpen ? (
        <div className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">
            {locale.outcomeEvidenceRecommendation.manualAddDescription}
          </p>

          {outcomeStatements.length === 0 ? (
            <p className="text-xs leading-5 text-muted-foreground">
              {locale.outcomeEvidenceRecommendation.noOutcomeStatementsHint}
            </p>
          ) : null}

          {isLoadingCandidates ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <>
              {manualPairCandidates.length === 0 ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  {
                    locale.outcomeEvidenceRecommendation
                      .manualAddNumericOnlyHint
                  }
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={beforeColumnId}
                  onValueChange={setBeforeColumnId}
                >
                  <SelectTrigger className="min-w-0 flex-1">
                    <SelectValue
                      placeholder={
                        locale.outcomeEvidenceRecommendation
                          .manualAddBeforeColumnPlaceholder
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {manualPairCandidates.map((candidate) => (
                      <SelectItem
                        key={candidate.columnId}
                        value={candidate.columnId}
                      >
                        {formatCandidateOptionLabel(candidate, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm font-semibold text-muted-foreground">
                  →
                </span>
                <Select value={afterColumnId} onValueChange={setAfterColumnId}>
                  <SelectTrigger className="min-w-0 flex-1">
                    <SelectValue
                      placeholder={
                        locale.outcomeEvidenceRecommendation
                          .manualAddAfterColumnPlaceholder
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {manualPairCandidates.map((candidate) => (
                      <SelectItem
                        key={candidate.columnId}
                        value={candidate.columnId}
                      >
                        {formatCandidateOptionLabel(candidate, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isSameColumnSelected ? (
                <p className="text-xs text-destructive">
                  {
                    locale.outcomeEvidenceRecommendation
                      .manualAddSameColumnError
                  }
                </p>
              ) : null}

              {!isSameColumnSelected && hasDatasetRoleMismatch ? (
                <p className="text-xs text-destructive">
                  {
                    locale.outcomeEvidenceRecommendation
                      .manualAddDatasetRoleMismatchError
                  }
                </p>
              ) : null}

              <Select value={outcomeId} onValueChange={setOutcomeId}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      locale.outcomeEvidenceRecommendation
                        .outcomeSelectPlaceholder
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {outcomeStatements.map((outcomeStatement) => (
                    <SelectItem
                      key={outcomeStatement.id}
                      value={outcomeStatement.id}
                    >
                      {outcomeStatement.statement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                size="sm"
                disabled={!canSubmit || isSubmitting}
                onClick={handleSubmit}
              >
                {locale.outcomeEvidenceRecommendation.manualAddSubmitAction}
              </Button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
