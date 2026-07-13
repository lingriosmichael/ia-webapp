import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ProjectTabs } from "@/components/project/projectTabs";
import { PageHeader, TopBar } from "@/components/workspaceUI";
import {
  useProjectHierarchy,
  useProjectWorkspacePage,
} from "@/contexts/projectWorkspaceContext";

export function ProjectWorkspaceShell({
  children,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
}) {
  const { projectId, project } = useProjectWorkspacePage();
  const hierarchy = useProjectHierarchy();
  useTranslation();

  return (
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          { label: project.name },
        ]}
      />

      <div className="mx-auto w-full max-w-6xl px-8 py-8">
        <PageHeader title={project.name} actions={actions} />

        <ProjectTabs projectId={projectId} className="mt-6" />

        <div className="mt-6">{children}</div>
      </div>
    </>
  );
}
