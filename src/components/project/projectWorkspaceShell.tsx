import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ProjectTabs } from "@/components/project/projectTabs";
import { PageHeader, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy, useProjectWorkspacePage } from "@/contexts/projectWorkspaceContext";
import { resolveProjectSummaryText } from "@/lib/projectSummary";

export function ProjectWorkspaceShell({
  children,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
}) {
  const { projectId, project } = useProjectWorkspacePage();
  const hierarchy = useProjectHierarchy();
  const { t } = useTranslation();

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
        <PageHeader
          title={project.name}
          description={
            resolveProjectSummaryText(project) ??
            t("projectWorkspace.noDescription")
          }
          actions={actions}
        />

        <ProjectTabs projectId={projectId} className="mt-6" />

        <div className="mt-6">{children}</div>
      </div>
    </>
  );
}
