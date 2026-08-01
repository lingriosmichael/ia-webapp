import { createFileRoute } from "@tanstack/react-router";
import { Pencil, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProjectSettingsPanel } from "@/components/ProjectSettingsPanel";
import { Button } from "@/components/ui/button";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useWorkspaceShell } from "@/components/WorkspaceShell";
import { useProjectWorkspacePage } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useUpdateProjectMutation } from "@/hooks/useWorkspaceQueries";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectOverviewPage,
});

function ProjectOverviewPage() {
  const auth = useRequireAuth();
  const locale = useWorkspaceLocale();
  const { openProjectDeleteDialog } = useWorkspaceShell();
  const { project } = useProjectWorkspacePage();
  const [isEditing, setIsEditing] = useState(false);
  const updateProjectMutation = useUpdateProjectMutation(
    project.id,
    project.organizationId,
  );
  const isArchivedProject = project.status === "completed";

  useEffect(() => {
    setIsEditing(false);
  }, [project.id, project.updatedAt]);

  async function handleReactivateProject() {
    if (!project.permissions.canManageLifecycle || !isArchivedProject) {
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({
        status: "active",
      });
      toast.success(locale.sidebar.reactivateProjectSuccess);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : locale.sidebar.reactivateProjectFailure;
      toast.error(message);
    }
  }

  if (!auth.token || auth.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <CenteredState label={locale.project.loading} />
      </ProjectWorkspaceShell>
    );
  }

  return (
    <ProjectWorkspaceShell
      actions={
        project.permissions.canEdit ||
        (project.permissions.canManageLifecycle && isArchivedProject) ? (
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {isArchivedProject ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleReactivateProject()}
                disabled={updateProjectMutation.isPending}
              >
                <PlayCircle className="h-4 w-4" />
                {locale.sidebar.reactivateProject}
              </Button>
            ) : null}
            {project.permissions.canEdit ? (
              isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  {locale.projectSettings.cancelEditAction}
                </Button>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4" />
                  {locale.projectSettings.editAction}
                </Button>
              )
            ) : null}
          </div>
        ) : undefined
      }
    >
      <section className="space-y-6">
        <ProjectSettingsPanel
          project={project}
          isEditing={isEditing}
          onCancelEditing={() => setIsEditing(false)}
          onDeleteProject={() =>
            openProjectDeleteDialog({
              id: project.id,
              name: project.name,
              organizationId: project.organizationId,
            })
          }
        />
      </section>
    </ProjectWorkspaceShell>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
