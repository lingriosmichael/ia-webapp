import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectSettingsPanel } from "@/components/projectSettingsPanel";
import { Button } from "@/components/ui/button";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useProjectWorkspacePage } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectOverviewPage,
});

function ProjectOverviewPage() {
  const auth = useRequireAuth();
  const locale = useWorkspaceLocale();
  const { openProjectDeleteDialog } = useWorkspaceShell();
  const { project } = useProjectWorkspacePage();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [project.id, project.updatedAt]);

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
        project.permissions.canEdit ? (
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
        ) : undefined
      }
    >
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <ClipboardList className="h-4 w-4 text-primary" />
          {locale.projectWorkspace.overview.title}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {locale.projectWorkspace.overview.description}
        </p>

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
