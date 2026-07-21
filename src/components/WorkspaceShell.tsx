import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PanelLeft } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateActivityMutation,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateActivityMutation,
} from "@/hooks/useWorkspaceQueries";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { rememberActiveOrganizationId } from "@/lib/organizationSelection";
import { ActivityDialog } from "@/components/activityDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectDeleteDialog } from "@/components/projectDeleteDialog";
import { ProjectDialog } from "@/components/projectDialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ApiError,
  type CreateActivityPayload,
  type CreateProjectPayload,
  type OrganizationPermissions,
  type OrganizationRole,
  type UpdateActivityPayload,
  type ActivitySummary,
  type WorkspaceProject,
  type WorkspaceActivity,
} from "@/services/apiClient";

interface WorkspaceShellContextValue {
  openProjectDialog: () => void;
  openActivityDialog: (
    projectId: string,
    activity?: ActivitySummary | WorkspaceActivity | null,
  ) => void;
  openProjectDeleteDialog: (project: {
    id: string;
    name: string;
    organizationId: string;
  }) => void;
  openMobileSidebar: () => void;
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activityDialogTarget, setActivityDialogTarget] = useState<{
    projectId: string;
    activity: ActivitySummary | WorkspaceActivity | null;
  } | null>(null);
  const [projectDeleteTarget, setProjectDeleteTarget] = useState<{
    id: string;
    name: string;
    organizationId: string;
  } | null>(null);

  const createProjectMutation = useCreateProjectMutation(organizationId);
  const deleteProjectMutation = useDeleteProjectMutation(organizationId);
  const activeActivityProjectId = useMemo(
    () => activityDialogTarget?.projectId ?? currentProjectId ?? "",
    [activityDialogTarget?.projectId, currentProjectId],
  );
  const editingActivity = useMemo(
    () => activityDialogTarget?.activity ?? null,
    [activityDialogTarget],
  );
  const currentProject = useMemo(
    () => projects.find((project) => project.id === currentProjectId) ?? null,
    [currentProjectId, projects],
  );
  const createActivityMutation = useCreateActivityMutation(
    activeActivityProjectId,
    organizationId,
  );
  const updateActivityMutation = useUpdateActivityMutation(
    editingActivity?.id ?? "",
    activeActivityProjectId,
    organizationId,
  );

  useEffect(() => {
    rememberActiveOrganizationId(organizationId);
  }, [organizationId]);

  const workspaceShellActions = useMemo<WorkspaceShellContextValue>(
    () => ({
      openProjectDialog: () => setProjectDialogOpen(true),
      openActivityDialog: (projectId: string, activity = null) =>
        setActivityDialogTarget({ projectId, activity }),
      openProjectDeleteDialog: (project) => setProjectDeleteTarget(project),
      openMobileSidebar: () => setMobileSidebarOpen(true),
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

    if (editingActivity) {
      const updatePayload: UpdateActivityPayload = {
        name: payload.name,
        description: payload.description ?? null,
        activityType: payload.activityType ?? null,
        owner: payload.owner ?? null,
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        objectives: payload.objectives ?? null,
        successIndicators: payload.successIndicators ?? null,
        targetAudience: payload.targetAudience ?? null,
        status: payload.status,
      };

      try {
        await updateActivityMutation.mutateAsync(updatePayload);
        toast.success(locale.dialogs.activity.updateSuccess);
        setActivityDialogTarget(null);
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : locale.dialogs.activity.updateFailure;
        toast.error(message);
        throw error;
      }

      return;
    }

    try {
      await createActivityMutation.mutateAsync(payload);
      toast.success(locale.dialogs.activity.success);
      setActivityDialogTarget(null);
      void navigate({
        to: "/projects/$projectId/activities",
        params: {
          projectId: activeActivityProjectId,
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
          currentProject={currentProject}
          onCreateProject={workspaceShellActions.openProjectDialog}
          onDeleteProject={workspaceShellActions.openProjectDeleteDialog}
          onLogout={onLogout}
        />

        <main className="flex min-w-0 flex-1 flex-col">{children}</main>

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-[18rem] p-0 sm:max-w-none">
            <SheetHeader className="sr-only">
              <SheetTitle>{locale.sidebar.mobileNavigationTitle}</SheetTitle>
              <SheetDescription>
                {locale.sidebar.mobileNavigationDescription}
              </SheetDescription>
            </SheetHeader>
            <AppSidebar
              organizationName={organizationName}
              organizationRole={organizationRole}
              organizationPermissions={organizationPermissions}
              organizationLogoUrl={organizationLogoUrl}
              organizationId={organizationId}
              userName={userName}
              projects={projects}
              currentProject={currentProject}
              onCreateProject={workspaceShellActions.openProjectDialog}
              onDeleteProject={workspaceShellActions.openProjectDeleteDialog}
              onLogout={() => {
                setMobileSidebarOpen(false);
                onLogout();
              }}
              mode="mobile"
            />
          </SheetContent>
        </Sheet>

        <ProjectDialog
          open={projectDialogOpen}
          onOpenChange={setProjectDialogOpen}
          isSubmitting={createProjectMutation.isPending}
          onSubmit={handleCreateProject}
        />

        <ActivityDialog
          open={Boolean(activityDialogTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setActivityDialogTarget(null);
            }
          }}
          isSubmitting={
            editingActivity
              ? updateActivityMutation.isPending
              : createActivityMutation.isPending
          }
          mode={editingActivity ? "edit" : "create"}
          initialActivity={editingActivity}
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

export function WorkspaceMobileNavigationButton() {
  const { openMobileSidebar } = useWorkspaceShell();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="lg:hidden"
      onClick={openMobileSidebar}
      aria-label="Open workspace navigation"
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
}
