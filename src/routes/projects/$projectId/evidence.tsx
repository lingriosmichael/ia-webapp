import { Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
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

function getLatestEvidenceJob(
  jobs: ProcessingJobRecord[],
  uploadMetadataId: string,
) {
  return jobs.find(
    (job) =>
      job.uploadMetadataId === uploadMetadataId &&
      job.jobType === "evidence_processing",
  );
}

function isEvidenceReviewed(
  activity: Pick<WorkspaceActivity, "interpretationAcknowledgedAt">,
  uploadCount: number,
) {
  return activity.interpretationAcknowledgedAt !== null && uploadCount > 0;
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

function shouldCollapseActivity(activity: WorkspaceActivity) {
  return isEvidenceReviewed(activity, activity.uploadMetadataCount);
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
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(
    !shouldCollapseActivity(activity),
  );
  const uploads = uploadsQuery.data ?? [];
  const evidenceCount = uploadsQuery.data
    ? uploads.length
    : activity.uploadMetadataCount;
  const jobs = jobsQuery.data ?? [];
  const latestUpload = uploads[0];
  const pendingPrivacyReviewCount = jobs.filter(
    (job) =>
      job.jobType === "evidence_processing" &&
      job.status === "awaiting_privacy_review",
  ).length;
  const isReviewedActivity = isEvidenceReviewed(activity, evidenceCount);

  useEffect(() => {
    setIsExpanded(!isReviewedActivity);
  }, [isReviewedActivity]);

  async function onPickFile(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    event.target.value = "";

    if (!nextFile) {
      return;
    }

    if (!activity.permissions.canUploadEvidence) {
      toast.error(t("activityBrief.readOnlyUpload"));
      return;
    }

    if (!isSupportedEvidenceFileType(nextFile.name)) {
      toast.error(t("upload.unsupportedFileTypeToast"));
      return;
    }

    try {
      setUploadingName(nextFile.name);
      await uploadMutation.mutateAsync(nextFile);
      toast.success(t("upload.successToast"));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : t("upload.failedToast"),
      );
    } finally {
      setUploadingName(null);
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

  const showExpandedDetails =
    !isReviewedActivity || isExpanded || uploadMutation.isPending;
  const canToggleDetails = isReviewedActivity && evidenceCount > 0;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
            {activity.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>
              {activity.activityType ??
                t("projectWorkspace.activities.defaultType")}
            </span>
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
                accept={SUPPORTED_EVIDENCE_FILE_ACCEPT}
                className="hidden"
                onChange={onPickFile}
              />
              <Button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                <UploadCloud className="h-4 w-4" />
                {uploadMutation.isPending
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

      {uploadMutation.isPending && uploadingName && showExpandedDetails ? (
        <p className="border-t border-border/70 px-5 py-3 text-sm text-muted-foreground">
          {t("projectWorkspace.evidence.uploading")} {uploadingName}
        </p>
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
              {t("projectWorkspace.evidence.reviewPrivacy")}
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
