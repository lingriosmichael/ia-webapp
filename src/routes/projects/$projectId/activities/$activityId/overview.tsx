import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CloudUpload,
  FileSpreadsheet,
  FolderKanban,
  Sparkles,
  UploadCloud,
  Workflow,
} from "lucide-react";
import type { ChangeEvent, DragEvent, ReactNode, RefObject } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ActivityTabs } from "@/components/activityTabs";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useActivityJobsQuery,
  useActivityQuery,
  useActivityResultsQuery,
  useActivityUploadsQuery,
  useJobQuery,
  useProjectQuery,
  useUploadActivityFileMutation,
} from "@/hooks/useGrantready";
import {
  isSupportedEvidenceFileType,
  SUPPORTED_EVIDENCE_FILE_ACCEPT,
} from "@/lib/evidenceFileTypes";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
import { cn } from "@/lib/utils";
import { formatDateTime, translateStatus } from "@/lib/translationUtils";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/overview",
)({
  component: ActivityBriefPage,
});

type WorkflowStateKey =
  "empty" | "uploading" | "processing" | "ready" | "attention";

function ActivityBriefPage() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
  const jobsQuery = useActivityJobsQuery(activityId, Boolean(auth.token));
  const resultsQuery = useActivityResultsQuery(activityId, Boolean(auth.token));
  const latestJobId = jobsQuery.data?.[0]?.id;
  const latestJobQuery = useJobQuery(
    latestJobId,
    Boolean(auth.token) && Boolean(latestJobId),
  );
  const { t, i18n } = useTranslation();
  const hierarchy = useProjectHierarchy();
  const uploadMutation = useUploadActivityFileMutation(
    activityId,
    projectId,
    hierarchy.organizationCrumb.params.organizationId,
  );

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [activeUploadName, setActiveUploadName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    uploadsQuery.isLoading ||
    jobsQuery.isLoading ||
    resultsQuery.isLoading ||
    (Boolean(latestJobId) && latestJobQuery.isLoading)
  ) {
    return <CenteredState label={t("activityBrief.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("activityBrief.loadFailed")} />;
  }

  const project = projectQuery.data;
  const activity = activityQuery.data;
  const uploads = uploadsQuery.data ?? [];
  const jobs = jobsQuery.data ?? [];
  const results = resultsQuery.data ?? [];
  const lastUpload = uploads[0] ?? null;
  const latestJobStatus =
    latestJobQuery.data?.status ?? jobs[0]?.status ?? null;
  const availableInsights = results.filter(
    (result) => result.status === "available",
  ).length;
  // Column-level data-quality detection doesn't exist yet (Phase 3+); there
  // is no real signal to report here, so this never routes to the data-review
  // "needs review" path below.
  const unresolvedIssues = 0;
  const canUploadEvidence = activity.permissions.canUploadEvidence;

  const workflowState = deriveWorkflowState({
    uploadPending: uploadMutation.isPending,
    hasDataset: uploads.length > 0,
    latestJobStatus,
  });
  const pipelineStagesValue = t("activityBrief.pipeline.stages", {
    returnObjects: true,
  });
  const pipelineStages = Array.isArray(pipelineStagesValue)
    ? pipelineStagesValue
    : [];
  const nextStepItemsValue = t(
    `activityBrief.nextStep.items.${workflowState.key}`,
    {
      returnObjects: true,
    },
  );
  const nextStepItems = Array.isArray(nextStepItemsValue)
    ? nextStepItemsValue
    : [];

  const shouldShowUploader =
    workflowState.key === "empty" || uploadMutation.isPending || showUploader;

  const primaryNextAction =
    workflowState.key === "ready"
      ? unresolvedIssues > 0
        ? {
            to: "/projects/$projectId/activities/$activityId/data-review" as const,
            label: t("activityBrief.nextStep.reviewData"),
          }
        : {
            to: "/projects/$projectId/activities/$activityId/analysis" as const,
            label: t("activityBrief.nextStep.continueToAnalysis"),
          }
      : null;

  function pickFile(nextFile: File) {
    if (!isSupportedEvidenceFileType(nextFile.name)) {
      toast.error(t("upload.unsupportedFileTypeToast"));
      return;
    }

    setFile(nextFile);
    setShowUploader(true);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const nextFile = event.dataTransfer.files?.[0];
    if (nextFile) {
      pickFile(nextFile);
    }
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (nextFile) {
      pickFile(nextFile);
    }
  }

  async function uploadSelectedFile() {
    if (!file) {
      return;
    }

    if (!canUploadEvidence) {
      toast.error(t("activityBrief.readOnlyUpload"));
      return;
    }

    try {
      setActiveUploadName(file.name);
      await uploadMutation.mutateAsync(file);
      setFile(null);
      setShowUploader(false);
      toast.success(t("upload.successToast"));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t("upload.failedToast");
      toast.error(message);
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
          { label: activity.name },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-8">
        <PageHeader
          eyebrow={t("activityBrief.eyebrow")}
          title={activity.name}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        <OverviewHero
          state={workflowState.key}
          projectId={projectId}
          activityId={activityId}
          unresolvedIssues={unresolvedIssues}
          lastUploadName={lastUpload?.originalFileName ?? activeUploadName}
          latestJobStatus={latestJobStatus}
          onOpenUploader={() => {
            if (canUploadEvidence) {
              setShowUploader(true);
            }
          }}
          canUploadEvidence={canUploadEvidence}
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ActivityMetricCard
            icon={<Workflow className="h-4 w-4 text-primary" />}
            label={t("activityBrief.metrics.activityStatus")}
            value={translateStatus(t, activity.status)}
            description={t(
              `activityBrief.metrics.stateDescriptions.${workflowState.key}`,
            )}
          />
          <ActivityMetricCard
            icon={<FolderKanban className="h-4 w-4 text-primary" />}
            label={t("activityBrief.metrics.project")}
            value={project.name}
            description={
              resolveProjectSummaryText(project) ??
              t("activityBrief.detail.noProjectGoal")
            }
          />
          <ActivityMetricCard
            icon={<UploadCloud className="h-4 w-4 text-primary" />}
            label={t("activityBrief.metrics.lastUpload")}
            value={
              lastUpload
                ? formatDateTime(lastUpload.createdAt, i18n.language)
                : t("activityBrief.metrics.noUpload")
            }
            description={
              lastUpload?.originalFileName ??
              t("activityBrief.metrics.noUploadDescription")
            }
          />
          <ActivityMetricCard
            icon={<Sparkles className="h-4 w-4 text-primary" />}
            label={t("activityBrief.metrics.aiStatus")}
            value={t(
              `activityBrief.metrics.aiStatusValues.${workflowState.key}`,
            )}
            description={t("activityBrief.metrics.aiStatusDescription", {
              reviewCount: unresolvedIssues,
              insights: availableInsights,
            })}
          />
        </div>

        {workflowState.key === "processing" && (
          <PipelineCard
            status={latestJobStatus}
            title={t("activityBrief.pipeline.title")}
            description={t("activityBrief.pipeline.description")}
            stages={pipelineStages}
          />
        )}

        {canUploadEvidence &&
          shouldShowUploader &&
          !uploadMutation.isPending && (
            <UploadComposer
              file={file}
              dragActive={dragActive}
              inputRef={inputRef}
              onDragActiveChange={setDragActive}
              onDrop={onDrop}
              onChange={onChange}
              onOpenFilePicker={() => inputRef.current?.click()}
              onRemoveFile={() => setFile(null)}
              onUpload={uploadSelectedFile}
              isUploading={uploadMutation.isPending}
            />
          )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("activityBrief.nextStep.title")}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {t(`activityBrief.nextStep.descriptions.${workflowState.key}`)}
            </p>
            <ul className="mt-5 grid gap-3">
              {nextStepItems.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
            {primaryNextAction ? (
              <Link
                to={primaryNextAction.to}
                params={{ projectId, activityId }}
                className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {primaryNextAction.label}
              </Link>
            ) : workflowState.key !== "empty" && canUploadEvidence ? (
              <button
                type="button"
                onClick={() => setShowUploader(true)}
                className="mt-5 inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium hover:bg-secondary"
              >
                {t("activityBrief.nextStep.addAnotherDataset")}
              </button>
            ) : null}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              {t("activityBrief.evidence.title")}
            </div>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailRow
                label={t("activityBrief.evidence.datasets")}
                value={String(uploads.length)}
              />
              <DetailRow
                label={t("activityBrief.evidence.dataReview")}
                value={t("activityBrief.evidence.reviewValue", {
                  count: unresolvedIssues,
                })}
              />
              <DetailRow
                label={t("activityBrief.evidence.analysis")}
                value={t("activityBrief.evidence.analysisValue", {
                  status: t(
                    `activityBrief.metrics.aiStatusValues.${workflowState.key}`,
                  ),
                })}
              />
              <DetailRow
                label={t("activityBrief.evidence.insights")}
                value={t("activityBrief.evidence.insightsValue", {
                  count: availableInsights,
                })}
              />
              <DetailRow
                label={t("activityBrief.evidence.qualityIssues")}
                value={t("activityBrief.evidence.notYetAvailable")}
              />
              <DetailRow
                label={t("activityBrief.evidence.latestFile")}
                value={
                  lastUpload?.originalFileName ??
                  t("activityBrief.evidence.noFile")
                }
              />
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}

function OverviewHero({
  state,
  projectId,
  activityId,
  unresolvedIssues,
  lastUploadName,
  latestJobStatus,
  onOpenUploader,
  canUploadEvidence,
}: {
  state: WorkflowStateKey;
  projectId: string;
  activityId: string;
  unresolvedIssues: number;
  lastUploadName: string | null;
  latestJobStatus: string | null;
  onOpenUploader: () => void;
  canUploadEvidence: boolean;
}) {
  const { t } = useTranslation();
  const icon =
    state === "ready" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : state === "uploading" || state === "processing" ? (
      <Clock3 className="h-3.5 w-3.5" />
    ) : state === "attention" ? (
      <AlertTriangle className="h-3.5 w-3.5" />
    ) : (
      <Workflow className="h-3.5 w-3.5" />
    );

  return (
    <Card className="mt-6 overflow-hidden border-primary/15 bg-primary-soft/30 p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-medium text-primary">
            {icon}
            {t(`activityBrief.hero.badges.${state}`)}
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {t(`activityBrief.hero.titles.${state}`)}
          </h2>
          <p className="mt-3 text-base leading-7 text-foreground/85">
            {t(`activityBrief.hero.descriptions.${state}`, {
              count: unresolvedIssues,
              fileName: lastUploadName ?? t("activityBrief.evidence.noFile"),
            })}
          </p>
          {state === "processing" ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t("activityBrief.hero.processingMeta", {
                status: latestJobStatus ?? t("common.loading"),
              })}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t("activityBrief.hero.supporting")}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          {state === "ready" && canUploadEvidence ? (
            <>
              <Link
                to={
                  unresolvedIssues > 0
                    ? "/projects/$projectId/activities/$activityId/data-review"
                    : "/projects/$projectId/activities/$activityId/analysis"
                }
                params={{ projectId, activityId }}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {unresolvedIssues > 0
                  ? t("activityBrief.hero.reviewData")
                  : t("activityBrief.hero.continueToAnalysis")}
              </Link>
              <button
                type="button"
                onClick={onOpenUploader}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium hover:bg-secondary"
              >
                <UploadCloud className="h-4 w-4" />
                {t("activityBrief.hero.uploadAnother")}
              </button>
            </>
          ) : (state === "empty" || state === "attention") &&
            canUploadEvidence ? (
            <button
              type="button"
              onClick={onOpenUploader}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              <UploadCloud className="h-4 w-4" />
              {t("activityBrief.hero.uploadFirstDataset")}
            </button>
          ) : null}
        </div>
      </div>

      {state === "uploading" ? (
        <div className="mt-8 rounded-2xl border border-primary/15 bg-card/80 p-5">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>{t("activityBrief.uploading.title")}</span>
            <span>{t("activityBrief.uploading.inProgress")}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-primary to-[oklch(0.65_0.22_310)]" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("activityBrief.uploading.description")}
          </p>
        </div>
      ) : null}
    </Card>
  );
}

function UploadComposer({
  file,
  dragActive,
  inputRef,
  onDragActiveChange,
  onDrop,
  onChange,
  onOpenFilePicker,
  onRemoveFile,
  onUpload,
  isUploading,
}: {
  file: File | null;
  dragActive: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onDragActiveChange: (value: boolean) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenFilePicker: () => void;
  onRemoveFile: () => void;
  onUpload: () => void;
  isUploading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Card className="mt-6 p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
        {t("activityBrief.uploader.eyebrow")}
      </div>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {t("activityBrief.uploader.title")}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {t("activityBrief.uploader.description")}
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          onDragActiveChange(true);
        }}
        onDragLeave={() => onDragActiveChange(false)}
        onDrop={onDrop}
        onClick={onOpenFilePicker}
        className={cn(
          "mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary-soft"
            : "border-border bg-secondary/40 hover:border-primary/40 hover:bg-primary-soft/40",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={SUPPORTED_EVIDENCE_FILE_ACCEPT}
          className="hidden"
          onChange={onChange}
        />
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-card text-primary shadow-[var(--shadow-soft)]">
          <CloudUpload className="h-6 w-6" />
        </div>
        <div className="mt-4 text-[15px] font-semibold tracking-tight">
          {t("upload.dropzoneTitle")}
        </div>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {t("upload.dropzoneBrowsePrefix")}{" "}
          <span className="text-primary underline-offset-2 hover:underline">
            {t("upload.dropzoneBrowseAction")}
          </span>
        </p>
        <div className="mt-3 text-[11px] text-muted-foreground">
          {t("upload.accepts")}
        </div>
      </div>

      {file ? (
        <Card className="mt-5 flex items-center gap-4 p-4 shadow-none">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-semibold">
              {file.name}
            </div>
            <div className="text-[12px] text-muted-foreground">
              {formatSize(file.size)} · {t("upload.readyToUpload")}
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveFile}
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {t("activityBrief.uploader.remove")}
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={onUpload}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            {isUploading
              ? t("upload.uploading")
              : t("activityBrief.uploader.cta")}
          </button>
        </Card>
      ) : null}
    </Card>
  );
}

function PipelineCard({
  status,
  title,
  description,
  stages,
}: {
  status: string | null;
  title: string;
  description: string;
  stages: string[];
}) {
  const activeIndex =
    status === "completed"
      ? stages.length
      : status === "processing"
        ? 3
        : status === "queued"
          ? 1
          : 0;

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Workflow className="h-4 w-4 text-primary" />
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <ul className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {stages.map((stage, index) => {
          const state =
            index < activeIndex
              ? "complete"
              : index === activeIndex
                ? "current"
                : "upcoming";

          return (
            <li
              key={stage}
              className={cn(
                "rounded-xl border px-4 py-4 text-sm",
                state === "complete" && "border-primary/20 bg-primary-soft/30",
                state === "current" &&
                  "border-warning/25 bg-[oklch(0.98_0.03_75)]",
                state === "upcoming" && "border-border bg-card",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full text-xs font-semibold",
                    state === "complete" &&
                      "bg-primary text-primary-foreground",
                    state === "current" &&
                      "bg-warning/15 text-[oklch(0.45_0.16_75)]",
                    state === "upcoming" &&
                      "bg-secondary text-muted-foreground",
                  )}
                >
                  {state === "complete" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="font-medium text-foreground">{stage}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function ActivityMetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold tracking-tight">{value}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
    </div>
  );
}

function deriveWorkflowState({
  uploadPending,
  hasDataset,
  latestJobStatus,
}: {
  uploadPending: boolean;
  hasDataset: boolean;
  latestJobStatus: string | null;
}) {
  if (uploadPending) {
    return { key: "uploading" as const };
  }

  if (!hasDataset) {
    return { key: "empty" as const };
  }

  if (latestJobStatus === "failed") {
    return { key: "attention" as const };
  }

  if (latestJobStatus === "queued" || latestJobStatus === "processing") {
    return { key: "processing" as const };
  }

  return { key: "ready" as const };
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
