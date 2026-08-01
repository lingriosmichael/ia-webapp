import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { ProjectCard } from "@/components/projectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationWorkspacePage } from "@/contexts/organizationWorkspaceContext";
import {
  Card,
  PageContainer,
  PageHeader,
  TopBar,
} from "@/components/WorkspaceUI";
import {
  useWorkspaceShell,
  WorkspaceMobileNavigationButton,
} from "@/components/WorkspaceShell";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { cn } from "@/lib/utils";
import type { WorkspaceProject } from "@/services/apiClient";

export const Route = createFileRoute("/organizations/$organizationId/projects")(
  {
    component: OrganizationProjectsPage,
  },
);

type ProjectTab = "active" | "archived";
type SortOption = "updated_desc" | "name_asc" | "start_desc";

const ACTIVE_PROJECT_STATUSES = new Set(["planning", "active"]);

function OrganizationProjectsPage() {
  const { workspace, organizationId } = useOrganizationWorkspacePage();
  const { openProjectDialog } = useWorkspaceShell();
  const locale = useWorkspaceLocale();
  const canCreateProject =
    workspace.organization.permissions?.canCreateProject ?? false;

  const [activeTab, setActiveTab] = useState<ProjectTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("updated_desc");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const activeProjects = useMemo(
    () =>
      workspace.projects.filter((project) =>
        ACTIVE_PROJECT_STATUSES.has(project.status),
      ),
    [workspace.projects],
  );
  const archivedProjects = useMemo(
    () =>
      workspace.projects.filter((project) => project.status === "completed"),
    [workspace.projects],
  );

  const visibleProjects =
    activeTab === "active" ? activeProjects : archivedProjects;
  const normalizedSearchQuery = deferredSearchQuery.trim().toLocaleLowerCase();

  const filteredProjects = useMemo(() => {
    const matches = visibleProjects.filter((project) =>
      buildProjectSearchText(project).includes(normalizedSearchQuery),
    );

    return sortProjects(matches, sortOption);
  }, [normalizedSearchQuery, sortOption, visibleProjects]);

  const showBaseEmptyState = workspace.projects.length === 0;
  const showFilteredEmptyState =
    !showBaseEmptyState && filteredProjects.length === 0;

  return (
    <>
      <TopBar
        crumbs={[
          {
            label: workspace.organization.name,
            to: "/organizations/$organizationId",
            params: { organizationId },
          },
          { label: locale.sidebar.projects },
        ]}
        leading={<WorkspaceMobileNavigationButton />}
      />
      <PageContainer className="py-6 sm:py-7 lg:py-8">
        <PageHeader
          eyebrow={locale.organizationProjects.eyebrow}
          title={locale.organizationProjects.title}
          description={locale.organizationProjects.description}
          actions={
            canCreateProject ? (
              <Button
                type="button"
                onClick={openProjectDialog}
                className="h-12 rounded-[16px] px-6 text-[15px]"
              >
                {locale.organizationProjects.primaryAction}
              </Button>
            ) : undefined
          }
        />

        {showBaseEmptyState ? (
          <Card className="mt-8 p-8 sm:p-10">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {locale.organizationProjects.emptyTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {locale.organizationProjects.emptyDescription}
              </p>
              {canCreateProject ? (
                <Button
                  type="button"
                  onClick={openProjectDialog}
                  className="mt-6"
                >
                  {locale.organizationProjects.primaryAction}
                </Button>
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="inline-flex w-full max-w-[34rem] rounded-[20px] border border-border bg-card p-1.5 shadow-[var(--shadow-soft)]">
                <ProjectTabButton
                  isActive={activeTab === "active"}
                  onClick={() => setActiveTab("active")}
                  label={locale.organizationProjects.activeTabLabel.replace(
                    "{{count}}",
                    String(activeProjects.length),
                  )}
                />
                <ProjectTabButton
                  isActive={activeTab === "archived"}
                  onClick={() => setActiveTab("archived")}
                  label={locale.organizationProjects.archivedTabLabel.replace(
                    "{{count}}",
                    String(archivedProjects.length),
                  )}
                />
              </div>

              <div className="text-[11px] text-muted-foreground">
                {activeTab === "active"
                  ? locale.organizationProjects.activeTabHint
                  : locale.organizationProjects.archivedTabHint}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={locale.organizationProjects.searchPlaceholder}
                  aria-label={locale.organizationProjects.searchPlaceholder}
                  className="h-12 rounded-[18px] border-border bg-card pl-12 pr-4 text-[12px] shadow-[var(--shadow-soft)]"
                />
              </div>

              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <SelectTrigger className="h-12 w-full rounded-[18px] border-border bg-card px-4 text-[12px] shadow-[var(--shadow-soft)] lg:max-w-[24rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_desc">
                    {locale.organizationProjects.sortUpdated}
                  </SelectItem>
                  <SelectItem value="name_asc">
                    {locale.organizationProjects.sortName}
                  </SelectItem>
                  <SelectItem value="start_desc">
                    {locale.organizationProjects.sortStart}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showFilteredEmptyState ? (
              <Card className="p-8 sm:p-10">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {locale.organizationProjects.noResultsTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {locale.organizationProjects.noResultsDescription}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    activityCount={project.activities.length}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
}

function ProjectTabButton({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-[16px] px-4 py-2.5 text-left text-[12px] font-medium transition-colors",
        isActive
          ? "bg-primary-soft text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function buildProjectSearchText(project: WorkspaceProject) {
  return [
    project.name,
    project.initialSituation,
    project.fundingProgram,
    project.fundingOrganization,
    project.overarchingTargetGroup,
    project.areaOfOperation,
    project.partnerships,
    project.successIndicators,
    project.impactModel.impact,
    project.impactModel.outcomes,
    project.targetGroups.join(" "),
    project.intendedChanges.join(" "),
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLocaleLowerCase();
}

function sortProjects(projects: WorkspaceProject[], sortOption: SortOption) {
  const sortedProjects = [...projects];

  sortedProjects.sort((left, right) => {
    if (sortOption === "name_asc") {
      return left.name.localeCompare(right.name, "de");
    }

    if (sortOption === "start_desc") {
      return (right.startMonth ?? "").localeCompare(left.startMonth ?? "");
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });

  return sortedProjects;
}
