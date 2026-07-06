import {
  CalendarDays,
  Database,
  FolderKanban,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useDeleteActivityMutation } from "@/hooks/useGrantready";
import { Card } from "@/components/workspaceUI";
import { formatDateTime, translateStatus } from "@/lib/translationUtils";
import { ApiError, type WorkspaceActivity } from "@/services/apiClient";

export function ActivityCard({
  activity,
  projectId,
  organizationId,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  organizationId: string;
}) {
  const { t, i18n } = useTranslation();
  const { openActivityDialog } = useWorkspaceShell();
  const deleteActivityMutation = useDeleteActivityMutation(
    activity.id,
    projectId,
    organizationId,
  );
  const dateLabel = activity.startDate
    ? formatDateTime(activity.startDate, i18n.language)
    : t("projectWorkspace.activities.noDate");

  async function handleDeleteActivity() {
    const confirmed = window.confirm(
      t("projectWorkspace.activities.deleteConfirmation", {
        name: activity.name,
      }),
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteActivityMutation.mutateAsync();
      toast.success(t("projectWorkspace.activities.deleteSuccess"));
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("projectWorkspace.activities.deleteFailure"),
      );
    }
  }

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <FolderKanban className="h-3.5 w-3.5" />
            {activity.activityType ??
              t("projectWorkspace.activities.defaultType")}
          </div>
          <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-foreground">
            {activity.name}
          </h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">
          {translateStatus(t, activity.status)}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {activity.description ?? t("projectWorkspace.activities.noDescription")}
      </p>

      <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          {dateLabel}
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          {t("projectWorkspace.activities.evidenceCount", {
            count: activity.uploadMetadataCount,
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border bg-background px-2.5 py-1">
            {t("projectWorkspace.activities.uploadCount", {
              count: activity.uploadMetadataCount,
            })}
          </span>
        </div>

        {activity.permissions.canEdit ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteActivity}
              disabled={deleteActivityMutation.isPending}
              className="inline-flex items-center gap-1 rounded-md border border-destructive/25 bg-background px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {t("projectWorkspace.activities.deleteActivity")}
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => openActivityDialog(projectId, activity)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
            >
              {t("projectWorkspace.activities.editActivity")}
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
