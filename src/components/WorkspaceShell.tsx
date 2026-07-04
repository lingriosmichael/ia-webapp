import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  useCreateActivityMutation,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from "@/hooks/useGrantready";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { rememberActiveOrganizationId } from "@/lib/organizationSelection";
import { ActivityDialog } from "@/components/activityDialog";
import { AppSidebar } from "@/components/appSidebar";
import { ProjectDeleteDialog } from "@/components/projectDeleteDialog";
import { ProjectDialog } from "@/components/projectDialog";
import {
  ApiError,
  type CreateActivityPayload,
  type CreateProjectPayload,
  type OrganizationPermissions,
  type OrganizationRole,
  type WorkspaceProject,
} from "@/services/apiClient";

interface WorkspaceShellContextValue {
  openProjectDialog: () => void;
  openActivityDialog: (projectId: string) => void;
  openProjectDeleteDialog: (project: {
    id: string;
    name: string;
    organizationId: string;
  }) => void;
}

const WorkspaceShellContext = createContext<WorkspaceShellContextValue | null>(
  null,
);

export function useWorkspaceShell() {
  const context = useContext(WorkspaceShellContext);

  if (!context) {
    throw new Error("useWorkspaceShell must be used within WorkspaceShell.");
  }

  return context;
}

export function WorkspaceShell({
  organizationId,
  organizationName,
  organizationRole,
  organizationPermissions,
  organizationLogoUrl,
  userName,
  projects,
  currentProjectId,
  onLogout,
  children,
}: {
  organizationId: string;
  organizationName: string;
  organizationRole: OrganizationRole;
  organizationPermissions: OrganizationPermissions;
  organizationLogoUrl: string | null;
  userName: string;
  projects: WorkspaceProject[];
  currentProjectId?: string;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const locale = useWorkspaceLocale();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [activityDialogProjectId, setActivityDialogProjectId] = useState<
    string | null
  >(null);
  const [projectDeleteTarget, setProjectDeleteTarget] = useState<{
    id: string;
    name: string;
    organizationId: string;
  } | null>(null);

  const createProjectMutation = useCreateProjectMutation(organizationId);
  const deleteProjectMutation = useDeleteProjectMutation(organizationId);
  const activeActivityProjectId = useMemo(
    () => activityDialogProjectId ?? currentProjectId ?? "",
    [activityDialogProjectId, currentProjectId],
  );
  const currentProject = useMemo(
    () => projects.find((project) => project.id === currentProjectId) ?? null,
    [currentProjectId, projects],
  );
  const createActivityMutation = useCreateActivityMutation(
    activeActivityProjectId,
    organizationId,
  );

  useEffect(() => {
    rememberActiveOrganizationId(organizationId);
  }, [organizationId]);

  const workspaceShellActions = useMemo<WorkspaceShellContextValue>(
    () => ({
      openProjectDialog: () => setProjectDialogOpen(true),
      openActivityDialog: (projectId: string) =>
        setActivityDialogProjectId(projectId),
      openProjectDeleteDialog: (project) => setProjectDeleteTarget(project),
    }),
    [],
  );

  async function handleCreateProject(payload: CreateProjectPayload) {
    try {
      const project = await createProjectMutation.mutateAsync(payload);
      toast.success(locale.dialogs.project.success);
      void navigate({
        to: "/projects/$projectId",
        params: { projectId: project.id },
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : locale.dialogs.project.failure;
      toast.error(message);
      throw error;
    }
  }

  async function handleCreateActivity(payload: CreateActivityPayload) {
    if (!activeActivityProjectId) {
      toast.error(locale.dialogs.activity.failure);
      throw new Error("No project selected for activity creation.");
    }

    try {
      const activity = await createActivityMutation.mutateAsync(payload);
      toast.success(locale.dialogs.activity.success);
      setActivityDialogProjectId(null);
      void navigate({
        to: "/projects/$projectId/activities/$activityId/overview",
        params: {
          projectId: activeActivityProjectId,
          activityId: activity.id,
        },
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : locale.dialogs.activity.failure;
      toast.error(message);
      throw error;
    }
  }

  async function handleDeleteProject(projectName: string) {
    if (!projectDeleteTarget) {
      return;
    }

    const deletedProjectId = projectDeleteTarget.id;
    const shouldRedirectToOrganization = currentProjectId === deletedProjectId;

    try {
      await deleteProjectMutation.mutateAsync({
        projectId: deletedProjectId,
        payload: {
          projectName,
        },
      });
      setProjectDeleteTarget(null);
      toast.success(locale.projectDelete.success);

      if (shouldRedirectToOrganization) {
        void navigate({
          to: "/organizations/$organizationId",
          params: { organizationId },
        });
      }
    } catch (error) {
      toast.error(locale.projectDelete.failure);
      throw error;
    }
  }

  return (
    <WorkspaceShellContext.Provider value={workspaceShellActions}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar
          organizationName={organizationName}
          organizationRole={organizationRole}
          organizationPermissions={organizationPermissions}
          organizationLogoUrl={organizationLogoUrl}
          organizationId={organizationId}
          userName={userName}
          projects={projects}
          currentProjectId={currentProjectId}
          currentProject={currentProject}
          onCreateProject={workspaceShellActions.openProjectDialog}
          onCreateActivity={workspaceShellActions.openActivityDialog}
          onDeleteProject={workspaceShellActions.openProjectDeleteDialog}
          onLogout={onLogout}
        />

        <main className="flex min-w-0 flex-1 flex-col">{children}</main>

        <ProjectDialog
          open={projectDialogOpen}
          onOpenChange={setProjectDialogOpen}
          isSubmitting={createProjectMutation.isPending}
          onSubmit={handleCreateProject}
        />

        <ActivityDialog
          open={Boolean(activityDialogProjectId)}
          onOpenChange={(open) => {
            if (!open) {
              setActivityDialogProjectId(null);
            }
          }}
          isSubmitting={createActivityMutation.isPending}
          onSubmit={handleCreateActivity}
        />

        <ProjectDeleteDialog
          open={Boolean(projectDeleteTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setProjectDeleteTarget(null);
            }
          }}
          project={projectDeleteTarget}
          isDeleting={deleteProjectMutation.isPending}
          onConfirm={handleDeleteProject}
        />
      </div>
    </WorkspaceShellContext.Provider>
  );
}
