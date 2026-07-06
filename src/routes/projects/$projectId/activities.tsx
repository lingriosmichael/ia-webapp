import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban } from "lucide-react";
import { ActivityCard } from "@/components/project/activities/activityCard";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import {
  useCurrentWorkspaceProject,
  useProjectWorkspacePage,
} from "@/contexts/projectWorkspaceContext";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { useProjectActivitiesQuery } from "@/hooks/useGrantready";
import { useRequireAuth } from "@/hooks/useAuth";
import type { WorkspaceActivity } from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/activities")({
  component: ProjectActivitiesPage,
});

function ProjectActivitiesPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const locale = useWorkspaceLocale();
  const { openActivityDialog } = useWorkspaceShell();
  const { project, workspace } = useProjectWorkspacePage();
  const workspaceProject = useCurrentWorkspaceProject();
  const activitiesQuery = useProjectActivitiesQuery(projectId, Boolean(auth.token));

  if (!auth.token || activitiesQuery.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <CenteredState label={locale.project.loading} />
      </ProjectWorkspaceShell>
    );
  }

  const countsByActivityId = Object.fromEntries(
    (workspaceProject?.activities ?? []).map((activity) => [activity.id, activity]),
  );
  const activities: WorkspaceActivity[] = (activitiesQuery.data ?? []).map(
    (activity) => {
      const workspaceActivity = countsByActivityId[activity.id];

      return {
        ...activity,
        uploadMetadataCount: workspaceActivity?.uploadMetadataCount ?? 0,
        processingJobCount: workspaceActivity?.processingJobCount ?? 0,
        resultCount: workspaceActivity?.resultCount ?? 0,
      };
    },
  );

  return (
    <ProjectWorkspaceShell
      actions={
        project.permissions.canCreateActivity ? (
          <button
            type="button"
            onClick={() => openActivityDialog(projectId)}
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            {locale.project.addActivity}
          </button>
        ) : undefined
      }
    >
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <FolderKanban className="h-4 w-4 text-primary" />
          {locale.projectWorkspace.activities.title}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {locale.projectWorkspace.activities.description}
        </p>

        {activities.length === 0 ? (
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {locale.projectWorkspace.activities.emptyTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {locale.projectWorkspace.activities.emptyDescription}
            </p>
            {project.permissions.canCreateActivity ? (
              <button
                type="button"
                onClick={() => openActivityDialog(projectId)}
                className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {locale.projectWorkspace.activities.emptyAction}
              </button>
            ) : null}
          </Card>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard
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

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
