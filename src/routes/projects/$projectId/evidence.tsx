import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Sparkles, Trash2, UploadCloud } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import {
  useCurrentWorkspaceProject,
  useProjectWorkspacePage,
} from "@/contexts/projectWorkspaceContext";
import {
  useActivityUploadsQuery,
  useArchiveUploadMetadataMutation,
  useUploadActivityFileMutation,
} from "@/hooks/useGrantready";
import { translateStatus } from "@/lib/translationUtils";
import { ApiError, type WorkspaceActivity } from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/evidence")({
  component: ProjectEvidencePage,
});

function ProjectEvidencePage() {
  const { projectId } = Route.useParams();
  const { project, workspace } = useProjectWorkspacePage();
  const workspaceProject = useCurrentWorkspaceProject();
  const activities = workspaceProject?.activities ?? [];
  const { t } = useTranslation();

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <Database className="h-4 w-4 text-primary" />
          {t("projectWorkspace.evidence.title")}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("projectWorkspace.evidence.description")}
        </p>

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
          <div className="mt-6 space-y-4">
            {activities.map((activity) => (
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

function EvidenceActivityGroup({
  activity,
  projectId,
  organizationId,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string;
}) {
  const { t } = useTranslation();
  const uploadsQuery = useActivityUploadsQuery(activity.id, true);
  const uploadMutation = useUploadActivityFileMutation(activity.id, projectId);
  const archiveMutation = useArchiveUploadMetadataMutation(
    activity.id,
    projectId,
    organizationId,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingName, setUploadingName] = useState<string | null>(null);

  const uploads = (uploadsQuery.data ?? []).filter(
    (upload) => upload.status !== "archived",
  );

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
      await archiveMutation.mutateAsync(uploadMetadataId);
      toast.success(t("projectWorkspace.evidence.removeSuccess"));
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("projectWorkspace.evidence.removeFailed"),
      );
    }
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
            {activity.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activity.activityType ??
              t("projectWorkspace.activities.defaultType")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activity.permissions.canUploadEvidence ? (
            <>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={onPickFile}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <UploadCloud className="h-4 w-4" />
                {uploadMutation.isPending
                  ? t("projectWorkspace.evidence.uploading")
                  : t("projectWorkspace.evidence.uploadAction")}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {uploadMutation.isPending && uploadingName ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("projectWorkspace.evidence.uploading")} {uploadingName}
        </p>
      ) : null}

      {uploadsQuery.isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("projectWorkspace.evidence.loading")}
        </p>
      ) : uploads.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("projectWorkspace.evidence.noFiles")}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/20 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">
                  {upload.originalFileName}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {translateStatus(t, upload.status)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/projects/$projectId/activities/$activityId/analysis"
                  params={{ projectId, activityId: activity.id }}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("projectWorkspace.evidence.analyzeFile")}
                </Link>
                {activity.permissions.canUploadEvidence ? (
                  <button
                    type="button"
                    onClick={() => removeFile(upload.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-destructive/25 bg-background px-3 text-sm font-medium text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("projectWorkspace.evidence.removeFile")}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
