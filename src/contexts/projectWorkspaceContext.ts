import { createContext, useContext } from "react";
import type {
  useOrganizationWorkspaceQuery,
  useProjectQuery,
} from "@/hooks/useGrantready";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";

interface ProjectWorkspacePageContextValue {
  projectId: string;
  project: NonNullable<ReturnType<typeof useProjectQuery>["data"]>;
  workspace: NonNullable<
    ReturnType<typeof useOrganizationWorkspaceQuery>["data"]
  >;
}

export const ProjectWorkspacePageContext =
  createContext<ProjectWorkspacePageContextValue | null>(null);

export function useProjectWorkspacePage() {
  const context = useContext(ProjectWorkspacePageContext);

  if (!context) {
    throw new Error(
      "useProjectWorkspacePage must be used within the project layout.",
    );
  }

  return context;
}

export function useProjectHierarchy() {
  const locale = useWorkspaceLocale();
  const { projectId, project, workspace } = useProjectWorkspacePage();

  return {
    organizationCrumb: {
      label: workspace.organization.name,
      to: "/organizations/$organizationId" as const,
      params: { organizationId: workspace.organization.id },
    },
    projectsCrumb: {
      label: locale.sidebar.projects,
      to: "/organizations/$organizationId/projects" as const,
      params: { organizationId: workspace.organization.id },
    },
    projectCrumb: {
      label: project.name,
      to: "/projects/$projectId" as const,
      params: { projectId },
    },
    activitiesLabel: locale.sidebar.activities,
  };
}

export function useCurrentWorkspaceProject() {
  const { projectId, workspace } = useProjectWorkspacePage();

  return (
    workspace.projects.find((workspaceProject) => workspaceProject.id === projectId) ??
    null
  );
}
