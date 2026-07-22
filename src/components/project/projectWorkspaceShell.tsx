import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ProjectTabs } from "@/components/project/projectTabs";
import { StatusBadge } from "@/components/statusBadge";
import { PageContainer, PageHeader, TopBar } from "@/components/WorkspaceUI";
import {
  useCurrentWorkspaceProject,
  useProjectHierarchy,
  useProjectWorkspacePage,
} from "@/contexts/projectWorkspaceContext";
import { WorkspaceMobileNavigationButton } from "@/components/WorkspaceShell";
import { formatMonthRange, translateStatus } from "@/lib/translationUtils";

export function ProjectWorkspaceShell({
  children,
  actions,
  description,
}: {
  children: ReactNode;
  actions?: ReactNode;
  description?: ReactNode;
}) {
  const { projectId, project } = useProjectWorkspacePage();
  const workspaceProject = useCurrentWorkspaceProject();
  const hierarchy = useProjectHierarchy();
  const { t, i18n } = useTranslation();
  const primaryArea =
    project.areaOfOperation?.split(",")[0]?.trim() || project.areaOfOperation;
  const metadataItems = [
    project.fundingProgram,
    formatMonthRange(project.startMonth, project.endMonth, i18n.language),
    primaryArea ||
      (workspaceProject
        ? `${workspaceProject.activities.length} ${t("projectCard.activities")}`
        : null),
  ].filter(Boolean);

  return (
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          { label: project.name },
        ]}
        leading={<WorkspaceMobileNavigationButton />}
      />

      <PageContainer className="py-6 sm:py-7 lg:py-8">
        <PageHeader
          title={project.name}
          contentClassName="max-w-[64rem] lg:flex-1"
          metadata={
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {metadataItems.length > 0 ? (
                <span className="text-sm text-muted-foreground">
                  {metadataItems.join(" · ")}
                </span>
              ) : null}
              <StatusBadge
                status={project.status}
                label={translateStatus(t, project.status)}
              />
            </div>
          }
          description={
            typeof description === "string" ? description : undefined
          }
          actions={actions}
        />
        {typeof description !== "string" && description ? (
          <div className="mt-3 max-w-[46rem] text-[14px] leading-6 text-muted-foreground">
            {description}
          </div>
        ) : null}

        <ProjectTabs projectId={projectId} className="mt-5" />

        <div className="mt-6">{children}</div>
      </PageContainer>
    </>
  );
}
