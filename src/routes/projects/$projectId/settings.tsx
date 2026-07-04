import { createFileRoute } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PageHeader, TopBar } from "@/components/workspaceUI";
import { ProjectSettingsPanel } from "@/components/projectSettingsPanel";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useOrganizationWorkspaceQuery,
  useProjectQuery,
} from "@/hooks/useGrantready";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";

export const Route = createFileRoute("/projects/$projectId/settings")({
  component: ProjectSettingsPage,
});

function ProjectSettingsPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const locale = useWorkspaceLocale();
  const { t } = useTranslation();
  const { openProjectDeleteDialog } = useWorkspaceShell();
  const [isEditing, setIsEditing] = useState(false);
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const workspaceQuery = useOrganizationWorkspaceQuery(
    projectQuery.data?.organizationId ?? "",
    Boolean(auth.token && projectQuery.data?.organizationId),
  );

  useEffect(() => {
    setIsEditing(false);
  }, [projectQuery.data?.id, projectQuery.data?.updatedAt]);

  if (
    !auth.token ||
    auth.isLoading ||
    projectQuery.isLoading ||
    workspaceQuery.isLoading
  ) {
    return <CenteredState label={t("project.loading")} />;
  }

  if (!projectQuery.data || !workspaceQuery.data) {
    return <CenteredState label={t("project.loadFailed")} />;
  }

  const project = projectQuery.data;
  const workspace = workspaceQuery.data;

  return (
    <>
      <TopBar
        crumbs={[
          {
            label: workspace.organization.name,
            to: "/organizations/$organizationId",
            params: { organizationId: workspace.organization.id },
          },
          {
            label: project.name,
            to: "/projects/$projectId",
            params: { projectId },
          },
          { label: locale.sidebar.projectSettings },
        ]}
      />

      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader
          eyebrow={locale.projectSettings.eyebrow}
          title={locale.projectSettings.title}
          description={locale.projectSettings.description}
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
            ) : null
          }
        />

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
      </div>
    </>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      {label}
    </div>
  );
}
