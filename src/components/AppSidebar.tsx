import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity as ActivityIcon,
  BarChart3,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { OrganizationAvatar } from "@/components/OrganizationAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceLocale } from "@/hooks/use-workspace-locale";
import { getOrganizationBranding } from "@/lib/organization-branding";
import { cn } from "@/lib/utils";
import type { OrganizationRole, WorkspaceProject } from "@/services/api-client";

function SidebarHeader({
  organizationName,
  organizationRole,
  organizationLogoUrl,
}: {
  organizationName: string;
  organizationRole: OrganizationRole;
  organizationLogoUrl: string | null;
}) {
  const { i18n } = useTranslation();
  const branding = getOrganizationBranding({
    organizationName,
    organizationRole,
    logoUrl: organizationLogoUrl,
    language: i18n.resolvedLanguage ?? i18n.language,
  });

  return (
    <div className="px-4 py-5">
      <div className="flex items-center gap-3">
        <OrganizationAvatar
          name={branding.displayName}
          initials={branding.initials}
          logoUrl={branding.logoUrl}
        />
        <div className="min-w-0">
          <div className="truncate text-[17px] font-semibold tracking-tight text-foreground">
            {branding.displayName}
          </div>
          <div className="truncate text-[13px] text-muted-foreground">
            {branding.roleLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({
  label,
  actions,
  defaultOpen = true,
  children,
}: {
  label: ReactNode;
  actions?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left text-[13px] font-medium text-sidebar-foreground/85 hover:bg-sidebar-hover hover:text-foreground"
        >
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-90",
            )}
          />
          <span className="truncate">{label}</span>
        </button>
        {actions}
      </div>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 pl-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function NavRow({
  to,
  params,
  icon,
  label,
  depth = 0,
  exact = false,
}: {
  to: string;
  params?: Record<string, string>;
  icon?: ReactNode;
  label: string;
  depth?: number;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      params={params}
      activeOptions={{ exact }}
      className={cn(
        "group relative flex items-center gap-2 rounded-xl py-2 text-[13px] font-medium text-sidebar-foreground/85 transition-colors",
        "hover:bg-sidebar-hover hover:text-foreground",
        "data-[status=active]:bg-sidebar-active data-[status=active]:text-primary data-[status=active]:font-semibold",
      )}
      style={{
        paddingLeft: `${0.75 + depth * 0.8}rem`,
        paddingRight: "0.75rem",
      }}
    >
      {icon ?? <ChevronRight className="h-3 w-3 opacity-50" />}
      <span className="truncate">{label}</span>
    </Link>
  );
}

function ActionButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
      aria-label={label}
      title={label}
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  );
}

export function AppSidebar({
  organizationName,
  organizationRole,
  organizationLogoUrl,
  organizationId,
  userName,
  projects,
  currentProjectId,
  onCreateProject,
  onCreateActivity,
  onDeleteProject,
  onLogout,
}: {
  organizationName: string;
  organizationRole: OrganizationRole;
  organizationLogoUrl: string | null;
  organizationId: string;
  userName: string;
  projects: WorkspaceProject[];
  currentProjectId?: string;
  onCreateProject: () => void;
  onCreateActivity: (projectId: string) => void;
  onDeleteProject: (
    project: Pick<WorkspaceProject, "id" | "name" | "organizationId">,
  ) => void;
  onLogout: () => void;
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { t, i18n } = useTranslation();
  const locale = useWorkspaceLocale();
  const currentActivityId = pathname.match(/\/activities\/([^/]+)/)?.[1];
  const branding = getOrganizationBranding({
    organizationName,
    organizationRole,
    logoUrl: organizationLogoUrl,
    language: i18n.resolvedLanguage ?? i18n.language,
  });
  const projectCountLabel =
    projects.length === 1
      ? locale.sidebar.projectSingular
      : locale.sidebar.projectPlural;

  return (
    <aside className="sticky top-0 flex h-dvh w-[21rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <SidebarHeader
        organizationName={organizationName}
        organizationRole={organizationRole}
        organizationLogoUrl={organizationLogoUrl}
      />

      <div className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        <div>
          <div className="mb-2 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <span>{locale.sidebar.sectionTitle}</span>
            <ActionButton
              onClick={onCreateProject}
              label={locale.sidebar.addProject}
            />
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-card/60 px-4 py-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">
                {locale.sidebar.noProjects}
              </div>
              <p className="mt-1 leading-6">
                {locale.sidebar.createFirstProject}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {projects.map((project) => {
                const isCurrentProject = project.id === currentProjectId;

                return (
                  <Group
                    key={project.id}
                    label={
                      <span className="flex items-center gap-2">
                        <FolderKanban className="h-3.5 w-3.5 text-primary" />
                        {project.name}
                      </span>
                    }
                    defaultOpen={isCurrentProject}
                    actions={
                      <ProjectActionsMenu
                        project={project}
                        onDeleteProject={onDeleteProject}
                        projectSettingsLabel={locale.sidebar.projectSettings}
                        deleteProjectLabel={locale.sidebar.deleteProject}
                        actionsLabel={locale.sidebar.projectActions}
                      />
                    }
                  >
                    <NavRow
                      to="/projects/$projectId"
                      params={{ projectId: project.id }}
                      label={locale.sidebar.overview}
                      icon={<LayoutDashboard className="h-3.5 w-3.5" />}
                      depth={1}
                      exact
                    />
                    <NavRow
                      to="/projects/$projectId/analytics"
                      params={{ projectId: project.id }}
                      label={locale.sidebar.analytics}
                      icon={<BarChart3 className="h-3.5 w-3.5" />}
                      depth={1}
                    />
                    <NavRow
                      to="/projects/$projectId/insights"
                      params={{ projectId: project.id }}
                      label={locale.sidebar.insights}
                      icon={<Sparkles className="h-3.5 w-3.5" />}
                      depth={1}
                    />
                    <NavRow
                      to="/projects/$projectId/settings"
                      params={{ projectId: project.id }}
                      label={locale.sidebar.projectSettings}
                      icon={<Settings2 className="h-3.5 w-3.5" />}
                      depth={1}
                    />
                    <Group
                      label={
                        <span className="flex items-center gap-2">
                          <ActivityIcon className="h-3.5 w-3.5" />
                          {locale.sidebar.activities}
                        </span>
                      }
                      defaultOpen={isCurrentProject}
                      actions={
                        <ActionButton
                          onClick={() => onCreateActivity(project.id)}
                          label={locale.sidebar.addActivity}
                        />
                      }
                    >
                      {project.activities.map((activity) => {
                        const isActiveActivity =
                          currentActivityId === activity.id;
                        return (
                          <NavRow
                            key={activity.id}
                            to="/projects/$projectId/activities/$activityId/overview"
                            params={{
                              projectId: project.id,
                              activityId: activity.id,
                            }}
                            label={activity.name}
                            icon={
                              <ActivityIcon
                                className={cn(
                                  "h-3.5 w-3.5",
                                  isActiveActivity && "text-primary",
                                )}
                              />
                            }
                            depth={1}
                          />
                        );
                      })}
                    </Group>
                  </Group>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="m-3 rounded-2xl border border-sidebar-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {userName}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {branding.roleLabel}
        </div>
        <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {projects.length} {projectCountLabel}
        </div>
        <div className="mt-4 grid gap-2">
          <Link
            to="/organizations/$organizationId"
            params={{ organizationId }}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            {locale.sidebar.organizationSettings}
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> {t("common.logOut")}
          </button>
        </div>
      </div>
    </aside>
  );
}

function ProjectActionsMenu({
  project,
  onDeleteProject,
  projectSettingsLabel,
  deleteProjectLabel,
  actionsLabel,
}: {
  project: Pick<WorkspaceProject, "id" | "name" | "organizationId">;
  onDeleteProject: (
    project: Pick<WorkspaceProject, "id" | "name" | "organizationId">,
  ) => void;
  projectSettingsLabel: string;
  deleteProjectLabel: string;
  actionsLabel: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
          aria-label={`${project.name} ${actionsLabel}`}
          title={actionsLabel}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link
            to="/projects/$projectId/settings"
            params={{ projectId: project.id }}
          >
            <Settings2 className="h-4 w-4" />
            {projectSettingsLabel}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onDeleteProject(project)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {deleteProjectLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
