import { createFileRoute } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectOverviewSectionCard } from "@/components/project/projectOverviewSectionCard";
import { ProjectSettingsPanel } from "@/components/projectSettingsPanel";
import { Button } from "@/components/ui/button";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useProjectWorkspacePage } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
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
  const projectDescription =
    resolveProjectSummaryText({
      impactModel: project.impactModel,
      successIndicators: project.successIndicators,
    }) ?? locale.projectSettings.noProjectDescription;

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
      <section className="space-y-6">
        {!isEditing ? (
          <ProjectOverviewSectionCard
            title={locale.projectSettings.sections.description}
          >
            <p className="max-w-[62rem] whitespace-pre-wrap text-[15px] leading-7 text-foreground">
              {projectDescription}
            </p>
          </ProjectOverviewSectionCard>
        ) : null}

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
