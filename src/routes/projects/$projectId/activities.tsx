import { Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import { ActivityCard } from "@/components/project/activities/activityCard";
import { Button } from "@/components/ui/button";
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
  const activitiesQuery = useProjectActivitiesQuery(
    projectId,
    Boolean(auth.token),
  );

  // This route's file lives alongside an `activities/` folder (every
  // per-activity detail page — overview, brief, upload, processing, etc.),
  // which makes this the technical parent of all of them in TanStack
  // Router's file-based tree. Without this check, navigating to any of
  // those pages would silently render this list instead, since a parent
  // route's own JSX is what has to contain the <Outlet /> for a matched
  // child to ever appear anywhere on screen.
  const matches = useMatches();
  const isExactMatch = matches[matches.length - 1]?.routeId === Route.id;
  if (!isExactMatch) {
    return <Outlet />;
  }

  if (!auth.token || activitiesQuery.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <CenteredState label={locale.project.loading} />
      </ProjectWorkspaceShell>
    );
  }

  const countsByActivityId = Object.fromEntries(
    (workspaceProject?.activities ?? []).map((activity) => [
      activity.id,
      activity,
    ]),
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
          <Button type="button" onClick={() => openActivityDialog(projectId)}>
            {locale.project.addActivity}
          </Button>
        ) : undefined
      }
    >
      <section>
        {activities.length === 0 ? (
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {locale.projectWorkspace.activities.emptyTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {locale.projectWorkspace.activities.emptyDescription}
            </p>
            {project.permissions.canCreateActivity ? (
              <Button
                type="button"
                onClick={() => openActivityDialog(projectId)}
                className="mt-5"
              >
                {locale.projectWorkspace.activities.emptyAction}
              </Button>
            ) : null}
          </Card>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
