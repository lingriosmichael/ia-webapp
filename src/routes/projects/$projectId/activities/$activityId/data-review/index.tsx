import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  FileSpreadsheet,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useActivityJobsQuery,
  useActivityQuery,
  useActivityUploadsQuery,
  useProjectQuery,
} from "@/hooks/useGrantready";
import { formatDateTime } from "@/lib/translationUtils";
import {
  datasetOverview,
  getSchema,
  type PrivacyCategory,
  type SchemaColumn,
  type Transformation,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/data-review/",
)({
  component: SchemaReview,
});

const privacyTone: Record<PrivacyCategory, string> = {
  "Direct Identifier": "bg-[oklch(0.96_0.05_25)] text-[oklch(0.45_0.18_25)]",
  "Quasi Identifier": "bg-[oklch(0.96_0.05_75)] text-[oklch(0.45_0.16_75)]",
  "High Risk": "bg-[oklch(0.94_0.08_25)] text-[oklch(0.4_0.2_25)]",
  Operational: "bg-secondary text-foreground",
  Outcome: "bg-primary-soft text-primary",
};

const transformationTone: Record<Transformation, string> = {
  Hashed: "bg-primary-soft text-primary",
  Removed: "bg-[oklch(0.94_0.08_25)] text-[oklch(0.4_0.2_25)]",
  Generalised: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.45_0.16_75)]",
  Kept: "bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.12_155)]",
};

type ColumnStatus = "confirmed" | "review" | "high" | "unsure";

function SchemaReview() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
  const jobsQuery = useActivityJobsQuery(activityId, Boolean(auth.token));
  const { t, i18n } = useTranslation();
  const hierarchy = useProjectHierarchy();

  const [selectedColumnKey, setSelectedColumnKey] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSelections, setPendingSelections] = useState<
    Record<string, string>
  >({});
  const [confirmedSelections, setConfirmedSelections] = useState<
    Record<string, string>
  >({});

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    uploadsQuery.isLoading ||
    jobsQuery.isLoading
  ) {
    return <CenteredState label={t("schemaReview.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("schemaReview.loadFailed")} />;
  }

  const project = projectQuery.data;
  const uploads = uploadsQuery.data ?? [];
  const schema = getSchema(t);
  const hasDataset = uploads.length > 0;
  const latestUpload = uploads[0] ?? null;
  const reviewColumns = schema.filter(
    (column) => Boolean(column.clarifyingQuestion) || column.confidence < 0.8,
  );
  const unresolvedColumns = reviewColumns.filter(
    (column) => !confirmedSelections[column.original],
  );
  const unresolvedCount = unresolvedColumns.length;
  const autoClassifiedCount = schema.length - reviewColumns.length;
  const reviewedCount = reviewColumns.length - unresolvedCount;
  const filteredSchema = schema.filter((column) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      column.original.toLowerCase().includes(term) ||
      column.semantic.toLowerCase().includes(term) ||
      translateSchemaPrivacyLabel(t, column.privacy)
        .toLowerCase()
        .includes(term)
    );
  });

  const selectedColumn =
    schema.find((column) => column.original === selectedColumnKey) ??
    unresolvedColumns[0] ??
    schema[0];

  const pageAction = !hasDataset ? (
    <Link
      to="/projects/$projectId/activities/$activityId/overview"
      params={{ projectId, activityId }}
      className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
    >
      <UploadCloud className="h-4 w-4" />
      {t("schemaReview.cta.uploadDataset")}
    </Link>
  ) : unresolvedCount > 0 ? (
    <div className="inline-flex h-10 items-center gap-2 rounded-md border border-warning/25 bg-[oklch(0.98_0.03_75)] px-4 text-sm font-medium text-[oklch(0.42_0.14_75)]">
      <AlertTriangle className="h-4 w-4" />
      {t("schemaReview.cta.reviewRequired", { count: unresolvedCount })}
    </div>
  ) : (
    <Link
      to="/projects/$projectId/activities/$activityId/analysis"
      params={{ projectId, activityId }}
      className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
    >
      {t("schemaReview.cta.continueToAnalysis")}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );

  function confirmSelectedMeaning() {
    const nextValue = pendingSelections[selectedColumn.original];
    if (!nextValue) {
      return;
    }

    const nextConfirmedSelections = {
      ...confirmedSelections,
      [selectedColumn.original]: nextValue,
    };
    setConfirmedSelections(nextConfirmedSelections);

    const nextUnresolvedColumn = reviewColumns.find(
      (column) =>
        column.original !== selectedColumn.original &&
        !nextConfirmedSelections[column.original],
    );

    if (nextUnresolvedColumn) {
      setSelectedColumnKey(nextUnresolvedColumn.original);
    }
  }

  return (
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          hierarchy.projectCrumb,
          { label: hierarchy.activitiesLabel },
          {
            label: activityQuery.data.name,
            to: "/projects/$projectId/activities/$activityId/overview",
            params: { projectId, activityId },
          },
          { label: t("schemaReview.crumb") },
        ]}
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8">
        <PageHeader
          eyebrow={t("schemaReview.eyebrow")}
          title={t("schemaReview.title")}
          description={t("schemaReview.description")}
          actions={pageAction}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        {!hasDataset ? (
          <EmptyDatasetState projectId={projectId} activityId={activityId} />
        ) : (
          <>
            <DatasetStatusCard
              title={
                unresolvedCount > 0
                  ? t("schemaReview.datasetStatus.reviewTitle")
                  : t("schemaReview.datasetStatus.readyTitle")
              }
              description={
                unresolvedCount > 0
                  ? t("schemaReview.datasetStatus.reviewDescription", {
                      count: unresolvedCount,
                    })
                  : t("schemaReview.datasetStatus.readyDescription", {
                      count: schema.length,
                    })
              }
              meta={
                latestUpload
                  ? t("schemaReview.datasetStatus.lastUpload", {
                      date: formatDateTime(
                        latestUpload.createdAt,
                        i18n.language,
                      ),
                    })
                  : undefined
              }
              tone={unresolvedCount > 0 ? "review" : "ready"}
            />

            <WorkflowProgress
              steps={[
                { label: t("schemaReview.workflow.upload"), state: "complete" },
                {
                  label: t("schemaReview.workflow.understanding"),
                  state: "complete",
                },
                {
                  label: t("schemaReview.workflow.review"),
                  state: unresolvedCount > 0 ? "current" : "complete",
                },
                {
                  label: t("schemaReview.workflow.analysis"),
                  state: unresolvedCount > 0 ? "upcoming" : "current",
                },
              ]}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryMetric
                icon={<FileSpreadsheet className="h-4 w-4 text-primary" />}
                label={t("schemaReview.summary.columnsDetected")}
                value={String(schema.length)}
              />
              <SummaryMetric
                icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
                label={t("schemaReview.summary.autoClassified")}
                value={String(autoClassifiedCount)}
              />
              <SummaryMetric
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                label={t("schemaReview.summary.reviewedByYou")}
                value={String(reviewedCount)}
              />
              <SummaryMetric
                icon={<AlertTriangle className="h-4 w-4 text-primary" />}
                label={t("schemaReview.summary.needsReview")}
                value={String(unresolvedCount)}
              />
            </div>

            <Card className="mt-6 p-6">
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {t("schemaReview.quality.title")}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <InfoTile
                  label={t("schemaReview.quality.missingValues")}
                  value={String(datasetOverview.missingValues)}
                />
                <InfoTile
                  label={t("schemaReview.quality.duplicateRows")}
                  value={String(datasetOverview.duplicateRows)}
                />
                <InfoTile
                  label={t("schemaReview.quality.sensitiveText")}
                  value={t("schemaReview.quality.sensitiveTextValue")}
                />
              </div>
            </Card>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
              <div className="min-w-0">
                <Card className="overflow-hidden">
                  <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold tracking-tight text-foreground">
                        {t("schemaReview.mapping.title")}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("schemaReview.mapping.description", {
                          count: filteredSchema.length,
                        })}
                      </p>
                    </div>

                    <label className="relative block w-full sm:w-72">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={t("schemaReview.searchPlaceholder")}
                        className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                      />
                    </label>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-[760px]">
                      <div className="grid grid-cols-[1.5fr_1.8fr_1.4fr_1.1fr_1.1fr] gap-4 border-b border-border bg-secondary/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <div>{t("schemaReview.headers.originalName")}</div>
                        <div>{t("schemaReview.headers.semanticMeaning")}</div>
                        <div>{t("schemaReview.headers.privacyCategory")}</div>
                        <div>{t("schemaReview.headers.transformation")}</div>
                        <div>{t("schemaReview.headers.confidence")}</div>
                      </div>
                      <ul>
                        {filteredSchema.map((column) => {
                          const isSelected =
                            selectedColumn.original === column.original;
                          const isConfirmed = Boolean(
                            confirmedSelections[column.original],
                          );
                          const columnStatus = getColumnStatus(
                            column,
                            isConfirmed,
                          );

                          return (
                            <li
                              key={column.original}
                              className="border-b border-border/70 last:border-0"
                            >
                              <button
                                onClick={() =>
                                  setSelectedColumnKey(column.original)
                                }
                                className={cn(
                                  "grid w-full grid-cols-[1.5fr_1.8fr_1.4fr_1.1fr_1.1fr] items-center gap-4 px-5 py-4 text-left text-[13px] transition-colors",
                                  isSelected
                                    ? "bg-primary-soft/35"
                                    : "hover:bg-secondary/30",
                                )}
                              >
                                <div>
                                  <div className="font-mono text-[12.5px] font-medium text-foreground">
                                    {column.original}
                                  </div>
                                  {confirmedSelections[column.original] ? (
                                    <div className="mt-1 text-xs text-primary">
                                      {t("schemaReview.row.confirmedAs", {
                                        value:
                                          confirmedSelections[column.original],
                                      })}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="text-foreground">
                                  {column.semantic}
                                </div>
                                <div>
                                  <span
                                    className={cn(
                                      "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                                      privacyTone[column.privacy],
                                    )}
                                  >
                                    {translateSchemaPrivacyLabel(
                                      t,
                                      column.privacy,
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <TransformationBadge
                                    label={translateSchemaTransformationLabel(
                                      t,
                                      column.transformation,
                                    )}
                                    transformation={column.transformation}
                                  />
                                </div>
                                <div className="flex justify-start">
                                  <ConfidenceBadge
                                    status={columnStatus}
                                    value={column.confidence}
                                  />
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              <ColumnDetailPanel
                column={selectedColumn}
                draftSelection={
                  pendingSelections[selectedColumn.original] ?? null
                }
                confirmedSelection={
                  confirmedSelections[selectedColumn.original] ?? null
                }
                unresolvedCount={unresolvedCount}
                onDraftSelect={(value) =>
                  setPendingSelections((current) => ({
                    ...current,
                    [selectedColumn.original]: value,
                  }))
                }
                onConfirm={confirmSelectedMeaning}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

function EmptyDatasetState({
  projectId,
  activityId,
}: {
  projectId: string;
  activityId: string;
}) {
  const { t } = useTranslation();
  const benefitsValue = t("schemaReview.empty.benefits", {
    returnObjects: true,
  });
  const benefits = Array.isArray(benefitsValue) ? benefitsValue : [];

  return (
    <Card className="mt-6 overflow-hidden border-primary/15 bg-primary-soft/25 p-8 sm:p-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {t("schemaReview.empty.eyebrow")}
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          {t("schemaReview.empty.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/85">
          {t("schemaReview.empty.description")}
        </p>
        <ul className="mt-6 grid gap-3">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 rounded-xl border border-primary/10 bg-card/70 px-4 py-3 text-sm text-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link
            to="/projects/$projectId/activities/$activityId/overview"
            params={{ projectId, activityId }}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            <UploadCloud className="h-4 w-4" />
            {t("schemaReview.empty.cta")}
          </Link>
        </div>
      </div>
    </Card>
  );
}

function DatasetStatusCard({
  title,
  description,
  meta,
  tone,
}: {
  title: string;
  description: string;
  meta?: string;
  tone: "ready" | "review";
}) {
  return (
    <Card
      className={cn(
        "mt-6 flex items-start gap-3 p-4",
        tone === "ready"
          ? "border-primary/15 bg-primary-soft/35"
          : "border-warning/25 bg-[oklch(0.98_0.03_75)]",
      )}
    >
      {tone === "ready" ? (
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.45_0.16_75)]" />
      )}
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {meta ? (
          <p className="mt-2 text-xs text-muted-foreground">{meta}</p>
        ) : null}
      </div>
    </Card>
  );
}

function WorkflowProgress({
  steps,
}: {
  steps: Array<{ label: string; state: "complete" | "current" | "upcoming" }>;
}) {
  return (
    <Card className="mt-6 p-5">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={cn(
              "rounded-xl border px-4 py-3",
              step.state === "complete" &&
                "border-primary/20 bg-primary-soft/25",
              step.state === "current" &&
                "border-warning/25 bg-[oklch(0.98_0.03_75)]",
              step.state === "upcoming" && "border-border bg-card",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-xs font-semibold",
                  step.state === "complete" &&
                    "bg-primary text-primary-foreground",
                  step.state === "current" &&
                    "bg-warning/15 text-[oklch(0.45_0.16_75)]",
                  step.state === "upcoming" &&
                    "bg-secondary text-muted-foreground",
                )}
              >
                {step.state === "complete" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="text-sm font-medium text-foreground">
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-[28px] font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </Card>
  );
}

function ConfidenceBadge({
  status,
  value,
}: {
  status: ColumnStatus;
  value: number;
}) {
  const { t } = useTranslation();
  const tone =
    status === "confirmed"
      ? "bg-primary-soft text-primary"
      : status === "high"
        ? "bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.12_155)]"
        : status === "review"
          ? "bg-[oklch(0.98_0.03_75)] text-[oklch(0.45_0.16_75)]"
          : "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.18_25)]";

  const icon =
    status === "confirmed" ? (
      <Check className="h-3.5 w-3.5" />
    ) : status === "high" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : status === "review" ? (
      <CircleHelp className="h-3.5 w-3.5" />
    ) : (
      <AlertTriangle className="h-3.5 w-3.5" />
    );

  return (
    <span
      title={`${Math.round(value * 100)}%`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone,
      )}
    >
      {icon}
      {t(`schemaReview.statusLabels.${status}`)}
    </span>
  );
}

function TransformationBadge({
  transformation,
  label,
}: {
  transformation: Transformation;
  label: string;
}) {
  const icon =
    transformation === "Hashed" ? (
      <ShieldCheck className="h-3.5 w-3.5" />
    ) : transformation === "Generalised" ? (
      <MapPinned className="h-3.5 w-3.5" />
    ) : transformation === "Removed" ? (
      <X className="h-3.5 w-3.5" />
    ) : (
      <Check className="h-3.5 w-3.5" />
    );

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        transformationTone[transformation],
      )}
    >
      {icon}
      {label}
    </span>
  );
}

function ColumnDetailPanel({
  column,
  draftSelection,
  confirmedSelection,
  unresolvedCount,
  onDraftSelect,
  onConfirm,
}: {
  column: SchemaColumn;
  draftSelection: string | null;
  confirmedSelection: string | null;
  unresolvedCount: number;
  onDraftSelect: (value: string) => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const reasoning =
    Array.isArray(column.reasoning) && column.reasoning.length > 0
      ? column.reasoning
      : buildFallbackReasoning(t, column);
  const sampleValues = Array.isArray(column.sampleValues)
    ? column.sampleValues
    : [];
  const columnStatus = getColumnStatus(column, Boolean(confirmedSelection));
  const canConfirm = Boolean(draftSelection) && !confirmedSelection;

  return (
    <div className="min-w-0">
      <Card className="sticky top-20 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            {t("schemaReview.detail.eyebrow")}
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {column.semantic}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("schemaReview.detail.originalColumn", {
              column: column.original,
            })}
          </p>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="flex flex-wrap gap-2">
            <ConfidenceBadge status={columnStatus} value={column.confidence} />
            <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {t("schemaReview.detail.confidenceScore", {
                value: Math.round(column.confidence * 100),
              })}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <InfoTile
              label={t("schemaReview.detail.privacy")}
              value={translateSchemaPrivacyLabel(t, column.privacy)}
            />
            <InfoTile
              label={t("schemaReview.detail.transformation")}
              value={translateSchemaTransformationLabel(
                t,
                column.transformation,
              )}
            />
          </div>

          {sampleValues.length > 0 ? (
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {t("schemaReview.detail.sampleValues")}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sampleValues.map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("schemaReview.detail.reasoningTitle")}
            </div>
            <ul className="mt-3 grid gap-2">
              {reasoning.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border bg-secondary/20 px-4 py-3 text-sm leading-6 text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {column.clarifyingQuestion ? (
            <div className="rounded-2xl border border-warning/25 bg-[oklch(0.98_0.03_75)] p-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-[11px] font-medium text-[oklch(0.45_0.16_75)]">
                <Sparkles className="h-3.5 w-3.5" />
                {t("schemaReview.reviewCard.badge")}
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {column.clarifyingQuestion}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(column.clarifyingOptions)
                  ? column.clarifyingOptions
                  : []
                ).map((option) => (
                  <button
                    key={option}
                    onClick={() => onDraftSelect(option)}
                    className={cn(
                      "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                      draftSelection === option &&
                        "border-primary bg-primary-soft text-primary",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  {confirmedSelection
                    ? t("schemaReview.reviewCard.confirmedSelection", {
                        value: confirmedSelection,
                      })
                    : t("schemaReview.reviewCard.remainingQuestions", {
                        count: unresolvedCount,
                      })}
                </div>
                <button
                  onClick={onConfirm}
                  disabled={!canConfirm}
                  className={cn(
                    "inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors",
                    canConfirm
                      ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                      : "cursor-not-allowed bg-card text-muted-foreground",
                  )}
                >
                  {confirmedSelection
                    ? t("schemaReview.reviewCard.confirmed")
                    : t("schemaReview.reviewCard.confirm")}
                </button>
              </div>
            </div>
          ) : (
            <Card className="border-primary/10 bg-primary-soft/20 p-4 shadow-none">
              <div className="text-sm font-semibold text-foreground">
                {t("schemaReview.detail.noReviewNeededTitle")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("schemaReview.detail.noReviewNeededDescription")}
              </p>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function getColumnStatus(
  column: SchemaColumn,
  isConfirmed: boolean,
): ColumnStatus {
  if (isConfirmed) {
    return "confirmed";
  }

  if (column.clarifyingQuestion) {
    return "review";
  }

  if (column.confidence < 0.8) {
    return "unsure";
  }

  return "high";
}

function buildFallbackReasoning(
  t: ReturnType<typeof useTranslation>["t"],
  column: SchemaColumn,
) {
  return [
    t("schemaReview.detail.defaultReasoning.pattern"),
    t("schemaReview.detail.defaultReasoning.privacy", {
      privacy: translateSchemaPrivacyLabel(t, column.privacy),
    }),
    t("schemaReview.detail.defaultReasoning.transformation", {
      transformation: translateSchemaTransformationLabel(
        t,
        column.transformation,
      ),
    }),
  ];
}

function translateSchemaPrivacyLabel(
  t: ReturnType<typeof useTranslation>["t"],
  category: PrivacyCategory,
) {
  const keyMap = {
    "Direct Identifier": "directIdentifier",
    "Quasi Identifier": "quasiIdentifier",
    "High Risk": "highRisk",
    Operational: "operational",
    Outcome: "outcome",
  } as const;

  return t(`schemaReview.privacyLabels.${keyMap[category]}`);
}

function translateSchemaTransformationLabel(
  t: ReturnType<typeof useTranslation>["t"],
  transformation: Transformation,
) {
  const keyMap = {
    Hashed: "hashed",
    Removed: "removed",
    Generalised: "generalised",
    Kept: "kept",
  } as const;

  return t(`schemaReview.transformationLabels.${keyMap[transformation]}`);
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
