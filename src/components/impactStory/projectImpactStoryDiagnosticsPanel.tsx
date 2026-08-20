import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  ProjectChartOpportunityAuditEntry,
  ProjectChartSelectionAudit,
} from "@/services/apiClient";

// Read-only reviewer diagnostics for the deterministic chart-opportunity
// and chart-selection audits (see projectChartOpportunityAudit.ts /
// projectChartSelectionAudit.ts on the backend). Answers three questions a
// bare chart grid can't: what was available but not shown, what's blocked
// by a pipeline gap, and what's blocked by missing data — never an editing
// workflow, purely explanatory.

interface ProjectImpactStoryDiagnosticsPanelProps {
  chartOpportunityAudit?: ProjectChartOpportunityAuditEntry[];
  chartSelectionAudit?: ProjectChartSelectionAudit;
}

function DiagnosticsEntryRow({
  entry,
  detail,
}: {
  entry: ProjectChartOpportunityAuditEntry;
  detail?: string;
}) {
  return (
    <li className="rounded-xl border border-border/60 bg-background px-3 py-2">
      <p className="text-[0.76rem] font-medium text-foreground">
        {entry.title}
      </p>
      <p className="text-[0.66rem] text-muted-foreground">
        {entry.activityName}
      </p>
      {detail ? (
        <p className="mt-1 text-[0.64rem] leading-[1.4] text-muted-foreground">
          {detail}
        </p>
      ) : null}
    </li>
  );
}

function DiagnosticsSection({
  title,
  description,
  emptyLabel,
  entries,
  detailFor,
}: {
  title: string;
  description: string;
  emptyLabel: string;
  entries: ProjectChartOpportunityAuditEntry[];
  detailFor?: (entry: ProjectChartOpportunityAuditEntry) => string | undefined;
}) {
  return (
    <div>
      <h4 className="text-[0.78rem] font-semibold text-foreground">{title}</h4>
      <p className="mt-0.5 text-[0.66rem] leading-[1.4] text-muted-foreground">
        {description}
      </p>
      {entries.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {entries.map((entry) => (
            <DiagnosticsEntryRow
              key={entry.entryId}
              entry={entry}
              detail={detailFor?.(entry)}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[0.7rem] text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  );
}

export function ProjectImpactStoryDiagnosticsPanel({
  chartOpportunityAudit,
  chartSelectionAudit,
}: ProjectImpactStoryDiagnosticsPanelProps): ReactNode {
  const { t } = useTranslation();

  if (!chartOpportunityAudit || !chartSelectionAudit) {
    return (
      <div className="rounded-[1.85rem] border border-border bg-card px-4 py-3 text-[0.72rem] text-muted-foreground">
        {t("impactStory.diagnosticsUnavailable")}
      </div>
    );
  }

  const entryById = new Map(
    chartOpportunityAudit.map((entry) => [entry.entryId, entry]),
  );
  const readyCount = chartOpportunityAudit.filter(
    (entry) => entry.status === "ready_now",
  ).length;
  const extractionBlocked = chartOpportunityAudit.filter(
    (entry) => entry.status === "blocked_by_extraction",
  );
  const missingDataBlocked = chartOpportunityAudit.filter(
    (entry) => entry.status === "blocked_by_missing_data",
  );
  const unselectedReady = chartSelectionAudit.unselectedReadyEntryIds
    .map((entryId) => entryById.get(entryId))
    .filter((entry): entry is ProjectChartOpportunityAuditEntry =>
      Boolean(entry),
    );

  return (
    <div className="overflow-hidden rounded-[1.85rem] border border-border bg-card px-4 shadow-soft sm:px-[1.125rem]">
      <Accordion type="single" collapsible>
        <AccordionItem value="diagnostics" className="border-b-0">
          <AccordionTrigger>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[0.86rem] font-semibold text-foreground">
                {t("impactStory.diagnosticsPanelTitle")}
              </span>
              <span className="text-[0.68rem] font-normal text-muted-foreground">
                {t("impactStory.diagnosticsSummary", {
                  readyCount,
                  extractionCount: extractionBlocked.length,
                  missingDataCount: missingDataBlocked.length,
                })}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-1">
              <DiagnosticsSection
                title={t("impactStory.diagnosticsUnselectedTitle")}
                description={t("impactStory.diagnosticsUnselectedDescription")}
                emptyLabel={t("impactStory.diagnosticsUnselectedEmpty")}
                entries={unselectedReady}
              />
              <DiagnosticsSection
                title={t("impactStory.diagnosticsExtractionBlockedTitle")}
                description={t(
                  "impactStory.diagnosticsExtractionBlockedDescription",
                )}
                emptyLabel={t("impactStory.diagnosticsExtractionBlockedEmpty")}
                entries={extractionBlocked}
                detailFor={(entry) => entry.reasonDetail}
              />
              <DiagnosticsSection
                title={t("impactStory.diagnosticsMissingDataBlockedTitle")}
                description={t(
                  "impactStory.diagnosticsMissingDataBlockedDescription",
                )}
                emptyLabel={t("impactStory.diagnosticsMissingDataBlockedEmpty")}
                entries={missingDataBlocked}
                detailFor={(entry) => entry.reasonDetail}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
