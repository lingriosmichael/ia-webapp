import {
  CalendarDays,
  Database,
  FolderKanban,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "@/components/statusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
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
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/35 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <FolderKanban className="h-3.5 w-3.5" />
            {activity.activityType ??
              t("projectWorkspace.activities.defaultType")}
          </div>
          <h3 className="mt-3 text-[17px] font-semibold tracking-tight text-foreground">
            {activity.name}
          </h3>
        </div>
        {activity.permissions.canEdit ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={t("projectWorkspace.activities.editActivity")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={() => openActivityDialog(projectId, activity)}
              >
                {t("projectWorkspace.activities.editActivity")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => void handleDeleteActivity()}
                disabled={deleteActivityMutation.isPending}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {t("projectWorkspace.activities.deleteActivity")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {activity.description ?? t("projectWorkspace.activities.noDescription")}
      </p>

      <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          {dateLabel}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            {t("projectWorkspace.activities.evidenceCount", {
              count: activity.uploadMetadataCount,
            })}
          </div>
          <StatusBadge
            status={activity.status}
            label={translateStatus(t, activity.status)}
          />
        </div>
      </div>
    </Card>
  );
}
