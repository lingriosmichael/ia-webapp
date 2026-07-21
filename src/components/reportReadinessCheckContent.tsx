import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  type AttentionLevel,
  getAttentionBadgeVariant,
} from "@/lib/attentionBadgeVariant";
import type {
  EvidenceStrength,
  ReportReadinessActionItem,
  ReportReadinessActionPriority,
  ReportReadinessCheckRecord,
  ReportReadinessDeviationFinding,
  ReportReadinessEvidenceSummaryRow,
  ReportReadinessFinding,
  ReportReadinessGapFinding,
  ReportReadinessLevel,
  ReportReadinessPriorityActionItem,
} from "@/services/apiClient";

const READINESS_ATTENTION_LEVEL: Record<ReportReadinessLevel, AttentionLevel> =
  {
    not_ready: "critical",
    partially_ready: "caution",
    ready_with_caveats: "positive",
    ready: "positive",
  };

const CONFIDENCE_ATTENTION_LEVEL: Record<EvidenceStrength, AttentionLevel> = {
  strong: "positive",
  moderate: "caution",
  weak: "critical",
};

const PRIORITY_ATTENTION_LEVEL: Record<
  ReportReadinessActionPriority,
  AttentionLevel
> = {
  critical_before_reporting: "critical",
  needed_this_cycle: "caution",
};

function Citation({ sourceLabels }: { sourceLabels: string[] | undefined }) {
  const { t } = useTranslation();
  // sourceLabels may be absent on a snapshot persisted before this field
  // existed — a stale stored record, not a contract violation from a
  // current generate call, so default rather than crash the whole page.
  if (!sourceLabels || sourceLabels.length === 0) {
    return null;
  }
  return (
    <span className="text-muted-foreground">
      {" "}
      ({t("reportReadinessCheck.sourceLabel")}: {sourceLabels.join(", ")})
    </span>
  );
}

function EvidenceSummaryTable({
  rows,
}: {
  rows: ReportReadinessEvidenceSummaryRow[];
}) {
  const { t } = useTranslation();
  if (rows.length === 0) {
    return null;
  }
  return (
    <div className="overflow-x-auto rounded-[12px] border border-border/70">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/70 text-xs tracking-[0.06em] text-muted-foreground uppercase">
            <th className="px-4 py-3 font-semibold">
              {t("reportReadinessCheck.evidenceSummaryColumns.area")}
            </th>
            <th className="px-4 py-3 font-semibold">
              {t("reportReadinessCheck.evidenceSummaryColumns.whatWeKnow")}
            </th>
            <th className="px-4 py-3 font-semibold">
              {t("reportReadinessCheck.evidenceSummaryColumns.confidence")}
            </th>
            <th className="px-4 py-3 font-semibold">
              {t("reportReadinessCheck.evidenceSummaryColumns.mainGap")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b border-border/40 last:border-b-0"
            >
              <td className="px-4 py-3 align-top font-medium text-foreground">
                {row.area}
              </td>
              <td className="px-4 py-3 align-top text-foreground">
                {row.whatWeKnow}
                <Citation sourceLabels={row.sourceLabels} />
              </td>
              <td className="px-4 py-3 align-top">
                {row.confidence ? (
                  <Badge
                    variant={getAttentionBadgeVariant(
                      CONFIDENCE_ATTENTION_LEVEL[row.confidence],
                    )}
                  >
                    {t(
                      `reportReadinessCheck.evidenceStrength.${row.confidence}`,
                    )}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">
                    {t("reportReadinessCheck.evidenceStrength.unrated")}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-top text-foreground">
                {row.mainGap}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FindingText({ finding }: { finding: ReportReadinessFinding }) {
  const { t } = useTranslation();
  return (
    <li className="text-sm leading-7 text-foreground">
      {finding.statement}
      {finding.caveat ? ` ${finding.caveat}` : ""}
      {finding.kind === "interpretation" ? (
        <span className="text-muted-foreground">
          {" "}
          ({t("reportReadinessCheck.kind.interpretation")})
        </span>
      ) : null}
      {finding.evidenceStrength === "weak" ? (
        <span className="text-muted-foreground">
          {" "}
          ({t("reportReadinessCheck.evidenceStrength.weak")})
        </span>
      ) : null}
      <Citation sourceLabels={finding.sourceLabels} />
    </li>
  );
}

function GapText({ gap }: { gap: ReportReadinessGapFinding }) {
  return (
    <li className="text-sm leading-7 text-foreground">
      {gap.gap} {gap.whyItMattersForReporting}
    </li>
  );
}

function DeviationText({
  deviation,
}: {
  deviation: ReportReadinessDeviationFinding;
}) {
  return (
    <li className="text-sm leading-7 text-foreground">
      {deviation.observation} {deviation.suggestedQuestionForTeam}
      <Citation sourceLabels={deviation.sourceLabels} />
    </li>
  );
}

function ActionText({ item }: { item: ReportReadinessActionItem }) {
  return (
    <li className="text-sm leading-7 text-foreground">
      {item.action} {item.reason}
    </li>
  );
}

function PriorityActionText({
  item,
}: {
  item: ReportReadinessPriorityActionItem;
}) {
  const { t } = useTranslation();
  return (
    <li className="text-sm leading-7 text-foreground">
      <Badge
        variant={getAttentionBadgeVariant(
          PRIORITY_ATTENTION_LEVEL[item.priority],
        )}
        className="mr-2"
      >
        {t(`reportReadinessCheck.priority.${item.priority}`)}
      </Badge>
      {item.action} {item.reason}
    </li>
  );
}

function Section({
  title,
  emptyLabel,
  count,
  children,
}: {
  title: string;
  emptyLabel: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border/70 pt-5">
      <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
        {title}
      </h3>
      {count > 0 ? (
        <ul className="mt-3 list-disc space-y-3 pl-5">{children}</ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </section>
  );
}

export function ReportReadinessCheckContent({
  result,
}: {
  result: ReportReadinessCheckRecord;
}) {
  const { t } = useTranslation();

  return (
    <article className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={getAttentionBadgeVariant(
              READINESS_ATTENTION_LEVEL[result.overallReadiness.level],
            )}
          >
            {t(`reportReadinessCheck.level.${result.overallReadiness.level}`)}
          </Badge>
          {result.groundingStatus === "FAILED" ? (
            <Badge variant="destructive">
              {t("reportReadinessCheck.groundingFailed")}
            </Badge>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-7 text-foreground">
          {result.overallReadiness.rationale}
        </p>
      </div>

      {result.evidenceSummary.length > 0 ? (
        <div className="border-t border-border/70 pt-5">
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {t("reportReadinessCheck.sections.evidenceSummary")}
          </h3>
          <div className="mt-3">
            <EvidenceSummaryTable rows={result.evidenceSummary} />
          </div>
        </div>
      ) : null}

      <Section
        title={t("reportReadinessCheck.sections.confidentlyReportable")}
        emptyLabel={t("reportReadinessCheck.empty.confidentlyReportable")}
        count={result.confidentlyReportable.length}
      >
        {result.confidentlyReportable.map((finding, index) => (
          <FindingText key={index} finding={finding} />
        ))}
      </Section>

      <Section
        title={t("reportReadinessCheck.sections.reportableWithCaveats")}
        emptyLabel={t("reportReadinessCheck.empty.reportableWithCaveats")}
        count={result.reportableWithCaveats.length}
      >
        {result.reportableWithCaveats.map((finding, index) => (
          <FindingText key={index} finding={finding} />
        ))}
      </Section>

      <Section
        title={t("reportReadinessCheck.sections.missingOrWeakEvidence")}
        emptyLabel={t("reportReadinessCheck.empty.missingOrWeakEvidence")}
        count={result.missingOrWeakEvidence.length}
      >
        {result.missingOrWeakEvidence.map((gap, index) => (
          <GapText key={index} gap={gap} />
        ))}
      </Section>

      <Section
        title={t(
          "reportReadinessCheck.sections.deviationsRequiringExplanation",
        )}
        emptyLabel={t(
          "reportReadinessCheck.empty.deviationsRequiringExplanation",
        )}
        count={result.deviationsRequiringExplanation.length}
      >
        {result.deviationsRequiringExplanation.map((deviation, index) => (
          <DeviationText key={index} deviation={deviation} />
        ))}
      </Section>

      <section className="border-t border-border/70 pt-5">
        <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {t("reportReadinessCheck.sections.honestEmergingStory")}
        </h3>
        <p className="mt-3 text-sm leading-7 text-foreground">
          {result.honestEmergingStory.narrative}
          <Citation sourceLabels={result.honestEmergingStory.sourceLabels} />
        </p>
      </section>

      <Section
        title={t("reportReadinessCheck.sections.actionsBeforeReporting")}
        emptyLabel={t("reportReadinessCheck.empty.actionsBeforeReporting")}
        count={result.actionsBeforeReporting.length}
      >
        {result.actionsBeforeReporting.map((item, index) => (
          <PriorityActionText key={index} item={item} />
        ))}
      </Section>

      <Section
        title={t("reportReadinessCheck.sections.improvementsForNextPeriod")}
        emptyLabel={t("reportReadinessCheck.empty.improvementsForNextPeriod")}
        count={result.improvementsForNextPeriod.length}
      >
        {result.improvementsForNextPeriod.map((item, index) => (
          <ActionText key={index} item={item} />
        ))}
      </Section>
    </article>
  );
}
