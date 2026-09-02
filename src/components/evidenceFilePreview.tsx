import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ApiError } from "@/services/apiClient";
import type { UploadMetadataRecord } from "@/services/apiClient";
import { useEvidencePreviewQuery } from "@/hooks/useWorkspaceQueries";

function stringifyCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function EvidenceFilePreviewTable({
  columns,
  rows,
  highlightColumnName,
}: {
  columns: string[];
  rows: Record<string, unknown>[];
  highlightColumnName: string | null;
}) {
  // A table's columns array is the authored column order; fall back to the
  // keys of the first row only for a malformed/empty columns list, so the
  // header still shows something rather than an empty table shell.
  const headerColumns =
    columns.length > 0 ? columns : Object.keys(rows[0] ?? {});

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headerColumns.map((column) => (
            <TableHead
              key={column}
              className={cn(
                "whitespace-nowrap",
                column === highlightColumnName &&
                  "bg-primary-soft text-primary",
              )}
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          // Preview rows have no stable identifier of their own — this is a
          // static, non-reorderable sample, so the row's position is a safe
          // key.
          <TableRow key={rowIndex}>
            {headerColumns.map((column) => (
              <TableCell
                key={column}
                className={cn(
                  "whitespace-nowrap",
                  column === highlightColumnName && "bg-primary-soft/40",
                )}
              >
                {stringifyCellValue(row[column])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EvidenceFilePreviewTabContent({
  evidenceId,
  highlightTableName,
  highlightColumnName,
}: {
  evidenceId: string;
  highlightTableName: string | null;
  highlightColumnName: string | null;
}) {
  const { t } = useTranslation();
  const previewQuery = useEvidencePreviewQuery(evidenceId, true);

  if (previewQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("projectWorkspace.interpretation.simplified.evidencePreviewLoading")}
      </div>
    );
  }

  if (previewQuery.isError) {
    const message =
      previewQuery.error instanceof ApiError &&
      previewQuery.error.code === "evidence_preview_not_available"
        ? t(
            "projectWorkspace.interpretation.simplified.evidencePreviewNotAvailable",
          )
        : t("projectWorkspace.interpretation.simplified.evidencePreviewError");

    return <p className="py-6 text-sm text-muted-foreground">{message}</p>;
  }

  const tables = previewQuery.data?.tables ?? [];

  if (tables.length === 0) {
    return (
      <p className="py-6 text-sm text-muted-foreground">
        {t("projectWorkspace.interpretation.simplified.evidencePreviewEmpty")}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {tables.map((table) => (
        <div key={table.name} className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <h4
              className={cn(
                "text-sm font-semibold text-foreground",
                table.name === highlightTableName && "text-primary",
              )}
            >
              {table.name}
            </h4>
            <span className="text-xs text-muted-foreground">
              {t(
                "projectWorkspace.interpretation.simplified.evidencePreviewRowCount",
                { shown: table.rows.length, total: table.totalRowCount },
              )}
            </span>
          </div>
          <div className="overflow-x-auto rounded-[10px] border border-border/70">
            <EvidenceFilePreviewTable
              columns={table.columns}
              rows={table.rows}
              highlightColumnName={
                table.name === highlightTableName ? highlightColumnName : null
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Inline evidence-preview panel for the interpretation workspace: lets a
// reviewer see the first 10 rows of each uploaded file's tables without
// leaving the clarification-question workflow, so a question naming a
// specific table/column can be answered by looking, not by memory. Reads
// exclusively from GET /evidence/:evidenceId/preview, which is sourced from
// the current privacy-safe representation — never the raw upload — so this
// can never show a value a privacy decision already removed or tokenized.
export function EvidenceFilePreviewPanel({
  uploads,
  initialSelectedUploadId,
  highlightTableName,
  highlightColumnName,
}: {
  uploads: UploadMetadataRecord[];
  initialSelectedUploadId?: string | null;
  highlightTableName?: string | null;
  highlightColumnName?: string | null;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeUploadId, setActiveUploadId] = useState(
    initialSelectedUploadId ?? uploads[0]?.id ?? "",
  );

  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[10px] border border-border/70 bg-card/60">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/30"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        {isOpen
          ? t(
              "projectWorkspace.interpretation.simplified.evidencePreviewToggleHide",
            )
          : t(
              "projectWorkspace.interpretation.simplified.evidencePreviewToggleShow",
            )}
      </button>

      {isOpen ? (
        <div className="space-y-3 border-t border-border/70 px-3 pb-3 pt-3">
          <p className="text-xs text-muted-foreground">
            {t(
              "projectWorkspace.interpretation.simplified.evidencePreviewNote",
            )}
          </p>
          <Tabs value={activeUploadId} onValueChange={setActiveUploadId}>
            <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              {uploads.map((upload) => (
                <TabsTrigger
                  key={upload.id}
                  value={upload.id}
                  className="rounded-[8px] border border-border/70 bg-card px-2.5 py-1 text-xs data-[state=active]:border-primary/40 data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  {upload.originalFileName}
                </TabsTrigger>
              ))}
            </TabsList>
            {uploads.map((upload) => (
              <TabsContent key={upload.id} value={upload.id}>
                <EvidenceFilePreviewTabContent
                  evidenceId={upload.id}
                  highlightTableName={highlightTableName ?? null}
                  highlightColumnName={highlightColumnName ?? null}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
