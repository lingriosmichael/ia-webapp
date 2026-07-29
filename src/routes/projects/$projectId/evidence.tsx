import { Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AnalysisProgressDialog } from "@/components/analysisProgressDialog";
import { PrivacyReviewDialog } from "@/components/privacyReviewDialog";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { StatusBadge } from "@/components/statusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/WorkspaceUI";
import {
  useCurrentWorkspaceProject,
  useProjectWorkspacePage,
} from "@/contexts/projectWorkspaceContext";
import {
  useActivityJobsQuery,
  useActivityUploadsQuery,
  useDeleteEvidenceMutation,
  useJobQuery,
  useStartEvidenceAnalysisMutation,
  useUploadActivityFileMutation,
} from "@/hooks/useWorkspaceQueries";
import {
  isSupportedEvidenceFileType,
  SUPPORTED_EVIDENCE_FILE_ACCEPT,
  validateEvidenceFileName,
} from "@/lib/evidenceFileTypes";
import { translateStatus } from "@/lib/translationUtils";
import {
  ApiError,
  type ProcessingJobRecord,
  type UploadMetadataRecord,
  type WorkspaceActivity,
} from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/evidence")({
  component: ProjectEvidencePage,
});

function getLatestEvidenceJobCreatedTimestamp(job: ProcessingJobRecord) {
  const createdAt = Date.parse(job.createdAt);
  return Number.isNaN(createdAt) ? 0 : createdAt;
}

function getLatestEvidenceJob(
  jobs: ProcessingJobRecord[],
  uploadMetadataId: string,
) {
  return jobs
    .filter(
      (job) =>
        job.uploadMetadataId === uploadMetadataId &&
        job.jobType === "evidence_processing",
    )
    .sort((left, right) => {
      return (
        getLatestEvidenceJobCreatedTimestamp(right) -
        getLatestEvidenceJobCreatedTimestamp(left)
      );
    })[0];
}

function isEvidenceReviewed(
  activity: Pick<WorkspaceActivity, "interpretationAcknowledgedAt">,
  uploadCount: number,
) {
  return activity.interpretationAcknowledgedAt !== null && uploadCount > 0;
}

function isPrivacyReviewCompleted(latestJob: ProcessingJobRecord | undefined) {
  return Boolean(
    latestJob && ["transforming", "completed"].includes(latestJob.status),
  );
}

function ProjectEvidencePage() {
  const { projectId } = Route.useParams();
  const { workspace } = useProjectWorkspacePage();
  const workspaceProject = useCurrentWorkspaceProject();
  const activities = workspaceProject?.activities ?? [];
  const { t } = useTranslation();
  const orderedActivities = [...activities].sort((left, right) => {
    const leftReviewed = isEvidenceReviewed(left, left.uploadMetadataCount);
    const rightReviewed = isEvidenceReviewed(right, right.uploadMetadataCount);

    if (leftReviewed === rightReviewed) {
      return 0;
    }

    return leftReviewed ? 1 : -1;
  });

  // This route's file lives alongside an `evidence/` folder (the privacy
  // review page below), which makes this the technical parent of that
  // nested route in TanStack Router's file-based tree — without this
  // check, navigating to the review page would silently render nothing,
  // since a parent route's own JSX is what has to contain the <Outlet />
  // for a matched child to ever appear anywhere on screen.
  const matches = useMatches();
  const isExactMatch = matches[matches.length - 1]?.routeId === Route.id;
  if (!isExactMatch) {
    return <Outlet />;
  }

  return (
    <ProjectWorkspaceShell>
      <section>
        {activities.length === 0 ? (
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t("projectWorkspace.evidence.emptyTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t("projectWorkspace.evidence.emptyDescription")}
            </p>
          </Card>
        ) : (
          <div className="mt-6 space-y-3">
            {orderedActivities.map((activity) => (
              <EvidenceActivityGroup
                key={activity.id}
                activity={activity}
                projectId={projectId}
                organizationId={workspace.organization.id}
              />
            ))}
          </div>
        )}
      </section>
    </ProjectWorkspaceShell>
  );
}

type UploadQueueItemStatus = "queued" | "uploading" | "uploaded" | "failed";

interface UploadQueueItem {
  id: string;
  fileName: string;
  status: UploadQueueItemStatus;
  message?: string;
}

function EvidenceActivityGroup({
  activity,
  projectId,
  organizationId,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string;
}) {
  const { t, i18n } = useTranslation();
  const uploadsQuery = useActivityUploadsQuery(activity.id, true);
  const jobsQuery = useActivityJobsQuery(activity.id, true);
  const uploadMutation = useUploadActivityFileMutation(
    activity.id,
    projectId,
    organizationId,
  );
  const deleteEvidenceMutation = useDeleteEvidenceMutation(
    activity.id,
    projectId,
    organizationId,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const completedQueueTimeoutRef = useRef<number | null>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const uploads = uploadsQuery.data ?? [];
  const evidenceCount = uploadsQuery.data
    ? uploads.length
    : activity.uploadMetadataCount;
  const jobs = jobsQuery.data ?? [];
  const latestEvidenceJobs = uploads
    .map((upload) => getLatestEvidenceJob(jobs, upload.id))
    .filter((job): job is ProcessingJobRecord => Boolean(job));
  const latestUpload = uploads[0];
  const pendingPrivacyReviewCount = latestEvidenceJobs.filter(
    (job) => job.status === "awaiting_privacy_review",
  ).length;
  const isReviewedActivity = isEvidenceReviewed(activity, evidenceCount);
  const isPrivacyReviewSettled =
    evidenceCount > 0 &&
    uploads.length === evidenceCount &&
    uploads.every((upload) =>
      isPrivacyReviewCompleted(getLatestEvidenceJob(jobs, upload.id)),
    );
  const [isExpanded, setIsExpanded] = useState(!isPrivacyReviewSettled);

  useEffect(() => {
    setIsExpanded(!isPrivacyReviewSettled);
  }, [isPrivacyReviewSettled]);

  useEffect(() => {
    if (completedQueueTimeoutRef.current !== null) {
      window.clearTimeout(completedQueueTimeoutRef.current);
      completedQueueTimeoutRef.current = null;
    }

    if (uploadQueue.length === 0) {
      return;
    }

    const hasActiveUpload = uploadQueue.some(
      (item) => item.status === "queued" || item.status === "uploading",
    );
    const hasFailedUpload = uploadQueue.some(
      (item) => item.status === "failed",
    );

    if (hasActiveUpload || hasFailedUpload) {
      return;
    }

    completedQueueTimeoutRef.current = window.setTimeout(() => {
      setUploadQueue([]);
      completedQueueTimeoutRef.current = null;
    }, 1200);

    return () => {
      if (completedQueueTimeoutRef.current !== null) {
        window.clearTimeout(completedQueueTimeoutRef.current);
        completedQueueTimeoutRef.current = null;
      }
    };
  }, [uploadQueue]);

  function updateUploadQueueItem(
    queueItemId: string,
    nextStatus: UploadQueueItemStatus,
    message?: string,
  ) {
    setUploadQueue((current) =>
      current.map((item) =>
        item.id === queueItemId
          ? {
              ...item,
              status: nextStatus,
              message,
            }
          : item,
      ),
    );
  }

  function getFileValidationMessage(file: File) {
    const fileNameValidationError = validateEvidenceFileName(file.name);

    if (fileNameValidationError === "empty") {
      return t("upload.invalidFileNameToast");
    }

    if (fileNameValidationError === "too_long") {
      return t("upload.fileNameTooLongToast");
    }

    if (fileNameValidationError === "invalid_characters") {
      return t("upload.invalidFileNameToast");
    }

    if (!isSupportedEvidenceFileType(file.name)) {
      return t("upload.unsupportedFileTypeToast");
    }

    return null;
  }

  async function onPickFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    if (!activity.permissions.canUploadEvidence) {
      toast.error(t("activityBrief.readOnlyUpload"));
      return;
    }

    const nextQueue = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      fileName: file.name,
      status: "queued" as const,
    }));

    setUploadQueue(nextQueue);
    setIsExpanded(true);

    let uploadedCount = 0;
    let failedCount = 0;

    for (const [index, file] of selectedFiles.entries()) {
      const queueItem = nextQueue[index];
      if (!queueItem) {
        continue;
      }

      const validationMessage = getFileValidationMessage(file);
      if (validationMessage) {
        updateUploadQueueItem(queueItem.id, "failed", validationMessage);
        failedCount += 1;
        continue;
      }

      try {
        updateUploadQueueItem(queueItem.id, "uploading");
        await uploadMutation.mutateAsync(file);
        updateUploadQueueItem(queueItem.id, "uploaded");
        uploadedCount += 1;
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : t("upload.failedToast");
        updateUploadQueueItem(queueItem.id, "failed", message);
        failedCount += 1;
      }
    }

    if (uploadedCount > 0 && failedCount === 0) {
      toast.success(
        uploadedCount === 1
          ? t("upload.successToast")
          : t("upload.multiSuccessToast", { count: uploadedCount }),
      );
      return;
    }

    if (uploadedCount > 0 && failedCount > 0) {
      toast.error(
        t("upload.multiResultToast", {
          uploaded: uploadedCount,
          failed: failedCount,
        }),
      );
      return;
    }

    if (failedCount > 0) {
      toast.error(
        failedCount === 1
          ? t("upload.failedToast")
          : t("upload.multiFailedToast", { count: failedCount }),
      );
    }
  }

  async function removeFile(uploadMetadataId: string) {
    try {
      await deleteEvidenceMutation.mutateAsync(uploadMetadataId);
      toast.success(t("projectWorkspace.evidence.removeSuccess"));
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("projectWorkspace.evidence.removeFailed"),
      );
    }
  }

  function formatFileSize(sizeBytes: number | null) {
    if (sizeBytes === null) {
      return t("projectWorkspace.evidence.unknownSize");
    }

    if (sizeBytes < 1024) {
      return `${sizeBytes} B`;
    }

    if (sizeBytes < 1024 * 1024) {
      return `${(sizeBytes / 1024).toFixed(1)} KB`;
    }

    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatEvidenceType(
    contentType: string | null,
    originalFileName: string,
  ) {
    if (contentType) {
      return contentType;
    }

    const extension = originalFileName.split(".").pop()?.toUpperCase();
    return extension ?? t("projectWorkspace.evidence.unknownType");
  }

  function formatUploadedAt(createdAt: string) {
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(createdAt));
  }

  const hasActiveUploadQueue = uploadQueue.some(
    (item) => item.status === "queued" || item.status === "uploading",
  );
  const showExpandedDetails =
    !isPrivacyReviewSettled || isExpanded || hasActiveUploadQueue;
  const canToggleDetails = isPrivacyReviewSettled && evidenceCount > 0;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
            {activity.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {evidenceCount > 0 ? (
              <span>
                {t("projectWorkspace.activities.evidenceCount", {
                  count: evidenceCount,
                })}
              </span>
            ) : (
              <span>{t("projectWorkspace.evidence.noFiles")}</span>
            )}
          </div>
          {evidenceCount > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {latestUpload ? (
                <span className="rounded-full border border-border/80 bg-background px-2.5 py-1">
                  {t("projectWorkspace.evidence.metadataUploadedAt")}:{" "}
                  {formatUploadedAt(latestUpload.createdAt)}
                </span>
              ) : null}
              {pendingPrivacyReviewCount > 0 ? (
                <StatusBadge
                  status="awaiting_privacy_review"
                  label={t("projectWorkspace.evidence.reviewPrivacy")}
                />
              ) : null}
              {isReviewedActivity ? (
                <StatusBadge
                  status="available"
                  label={t("projectWorkspace.evidence.reviewedStatus")}
                />
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {activity.permissions.canUploadEvidence && showExpandedDetails ? (
            <>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={SUPPORTED_EVIDENCE_FILE_ACCEPT}
                className="hidden"
                onChange={onPickFile}
              />
              <Button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={hasActiveUploadQueue}
              >
                <UploadCloud className="h-4 w-4" />
                {hasActiveUploadQueue
                  ? t("projectWorkspace.evidence.uploading")
                  : t("projectWorkspace.evidence.uploadAction")}
              </Button>
            </>
          ) : null}
          {canToggleDetails ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? t("common.close") : t("common.open")}
              title={isExpanded ? t("common.close") : t("common.open")}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {uploadQueue.length > 0 && showExpandedDetails ? (
        <div className="border-t border-border/70 px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t("upload.queueTitle")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("upload.queueProgress", {
                uploaded: uploadQueue.filter(
                  (item) => item.status === "uploaded",
                ).length,
                total: uploadQueue.length,
              })}
            </p>
          </div>
          <div className="mt-3 space-y-2">
            {uploadQueue.map((item) => (
              <UploadQueueRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : null}

      {!showExpandedDetails ? null : uploadsQuery.isLoading ? (
        <p className="border-t border-border/70 px-5 py-3 text-sm text-muted-foreground">
          {t("projectWorkspace.evidence.loading")}
        </p>
      ) : uploads.length === 0 ? (
        <p className="border-t border-border/70 px-5 py-3 text-sm text-muted-foreground">
          {t("projectWorkspace.evidence.noFiles")}
        </p>
      ) : (
        <div className="divide-y divide-border/70 border-t border-border/70">
          {uploads.map((upload) => (
            <EvidenceFileRow
              key={upload.id}
              activity={activity}
              upload={upload}
              latestJob={getLatestEvidenceJob(jobs, upload.id)}
              projectId={projectId}
              organizationId={organizationId}
              onRemove={removeFile}
              removePending={deleteEvidenceMutation.isPending}
              formatEvidenceType={formatEvidenceType}
              formatFileSize={formatFileSize}
              formatUploadedAt={formatUploadedAt}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function UploadQueueRow({ item }: { item: UploadQueueItem }) {
  const { t } = useTranslation();

  const icon =
    item.status === "uploaded" ? (
      <CircleCheck className="h-4 w-4 text-emerald-600" />
    ) : item.status === "failed" ? (
      <CircleAlert className="h-4 w-4 text-destructive" />
    ) : item.status === "uploading" ? (
      <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
    ) : (
      <UploadCloud className="h-4 w-4 text-muted-foreground" />
    );

  const label =
    item.status === "queued"
      ? t("upload.queueQueued")
      : item.status === "uploading"
        ? t("upload.queueUploading")
        : item.status === "uploaded"
          ? t("upload.queueUploaded")
          : t("upload.queueFailed");

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background px-3 py-2">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {item.fileName}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
        {item.message ? (
          <div className="mt-1 text-xs text-destructive">{item.message}</div>
        ) : null}
      </div>
    </div>
  );
}

function EvidenceFileRow({
  activity,
  upload,
  latestJob,
  projectId,
  organizationId,
  onRemove,
  removePending,
  formatEvidenceType,
  formatFileSize,
  formatUploadedAt,
}: {
  activity: WorkspaceActivity;
  upload: UploadMetadataRecord;
  latestJob: ProcessingJobRecord | undefined;
  projectId: string;
  organizationId: string;
  onRemove: (uploadMetadataId: string) => Promise<void>;
  removePending: boolean;
  formatEvidenceType: (
    contentType: string | null,
    originalFileName: string,
  ) => string;
  formatFileSize: (sizeBytes: number | null) => string;
  formatUploadedAt: (createdAt: string) => string;
}) {
  const { t } = useTranslation();
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const startAnalysisMutation = useStartEvidenceAnalysisMutation(
    activity.id,
    projectId,
    organizationId,
  );
  const liveJobQuery = useJobQuery(latestJob?.id, Boolean(latestJob?.id));
  const job = liveJobQuery.data ?? latestJob;
  const hasActiveJob =
    job &&
    [
      "queued",
      "processing",
      "awaiting_privacy_review",
      "transforming",
    ].includes(job.status);
  const canReviewPrivacy = Boolean(
    job &&
    ["awaiting_privacy_review", "transforming", "completed"].includes(
      job.status,
    ),
  );
  const shouldAutoOpenPrivacyReview = Boolean(
    progressDialogOpen &&
    job &&
    ["awaiting_privacy_review", "transforming", "completed"].includes(
      job.status,
    ),
  );
  const canAnalyse =
    activity.permissions.canUploadEvidence &&
    upload.status === "uploaded" &&
    !upload.originalFileDeletedAt &&
    (!job || job.status === "failed" || job.status === "cancelled");

  const analyzeButtonLabel = !job
    ? t("projectWorkspace.evidence.analyzeFile")
    : job.status === "failed"
      ? t("projectWorkspace.evidence.retryAnalysis")
      : t(`projectWorkspace.evidence.analysisStates.${job.status}`);
  const privacyReviewButtonLabel =
    job?.status === "awaiting_privacy_review"
      ? t("projectWorkspace.evidence.reviewPrivacy")
      : t("projectWorkspace.evidence.viewPrivacyReview");

  async function handleAnalyzeAction() {
    if (!canAnalyse) {
      return;
    }

    // Opened immediately, before the mutation resolves, so clicking the
    // button gives instant feedback rather than only changing an inline
    // label the user has to notice on their own.
    setProgressDialogOpen(true);

    try {
      await startAnalysisMutation.mutateAsync(upload.id);
      toast.success(t("projectWorkspace.evidence.analysisStarted"));
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("projectWorkspace.evidence.analysisStartFailed"),
      );
    }
  }

  useEffect(() => {
    if (!shouldAutoOpenPrivacyReview) {
      return;
    }

    setProgressDialogOpen(false);
    setReviewDialogOpen(true);
  }, [shouldAutoOpenPrivacyReview]);

  function openPrivacyReview() {
    if (!job) {
      return;
    }

    setReviewDialogOpen(true);
  }

  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {upload.originalFileName}
          </div>
          <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
            <div>
              {t("projectWorkspace.evidence.metadataType")}:{" "}
              {formatEvidenceType(upload.contentType, upload.originalFileName)}
            </div>
            <div>
              {t("projectWorkspace.evidence.metadataSize")}:{" "}
              {formatFileSize(upload.sizeBytes)}
            </div>
            <div>
              {t("projectWorkspace.evidence.metadataUploadedAt")}:{" "}
              {formatUploadedAt(upload.createdAt)}
            </div>
            <div>
              {t("projectWorkspace.evidence.metadataUploadedBy")}:{" "}
              {upload.uploadedByName ??
                t("projectWorkspace.evidence.unknownUploader")}
            </div>
            <div>
              {t("projectWorkspace.evidence.metadataStatus")}:{" "}
              {translateStatus(t, upload.status)}
            </div>
            <div>
              {t("projectWorkspace.evidence.analysisStatus")}:{" "}
              {job
                ? t(`projectWorkspace.evidence.analysisStates.${job.status}`)
                : t("projectWorkspace.evidence.notStarted")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleAnalyzeAction}
            disabled={
              startAnalysisMutation.isPending ||
              Boolean(
                job &&
                job.status !== "failed" &&
                job.status !== "cancelled" &&
                !canAnalyse,
              )
            }
            variant="outline"
            size="sm"
          >
            <Sparkles className="h-4 w-4" />
            {analyzeButtonLabel}
          </Button>
          {canReviewPrivacy ? (
            <Button
              type="button"
              onClick={openPrivacyReview}
              variant="outline"
              size="sm"
            >
              {privacyReviewButtonLabel}
            </Button>
          ) : null}
          {activity.permissions.canUploadEvidence ? (
            <Button
              type="button"
              onClick={() => void onRemove(upload.id)}
              disabled={removePending || hasActiveJob}
              variant="outline"
              size="sm"
              className="border-destructive/25 text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t("projectWorkspace.evidence.removeFile")}
            </Button>
          ) : null}
        </div>
      </div>
      <AnalysisProgressDialog
        open={progressDialogOpen}
        onOpenChange={setProgressDialogOpen}
        job={job}
      />
      <PrivacyReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        processingJobId={job?.id}
        projectId={projectId}
        organizationId={organizationId}
        activityName={activity.name}
      />
    </div>
  );
}
