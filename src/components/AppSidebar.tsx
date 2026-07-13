import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Plus,
  Settings2,
  Trash2,
  Users2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { OrganizationAvatar } from "@/components/organizationAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { getOrganizationBranding } from "@/lib/organizationBranding";
import { cn } from "@/lib/utils";
import type {
  OrganizationPermissions,
  OrganizationRole,
  WorkspaceProject,
} from "@/services/apiClient";

function SidebarHeader({
  organizationName,
  organizationRole,
  organizationLogoUrl,
  compact = false,
}: {
  organizationName: string;
  organizationRole: OrganizationRole;
  organizationLogoUrl: string | null;
  compact?: boolean;
}) {
  const { i18n } = useTranslation();
  const branding = getOrganizationBranding({
    organizationName,
    organizationRole,
    logoUrl: organizationLogoUrl,
    language: i18n.resolvedLanguage ?? i18n.language,
  });

  return (
    <div className={cn("px-3 py-4", compact ? "pr-10" : "px-4 py-5")}>
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
        "group relative flex h-11 items-center gap-2.5 rounded-[10px] px-3.5 text-[13px] font-medium text-sidebar-foreground/85 transition-colors",
        "hover:bg-sidebar-hover hover:text-foreground",
        "data-[status=active]:border data-[status=active]:border-primary/12 data-[status=active]:bg-sidebar-active data-[status=active]:font-semibold data-[status=active]:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2",
      )}
      style={{
        paddingLeft: `${0.875 + depth * 0.8}rem`,
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
  organizationPermissions,
  organizationLogoUrl,
  organizationId,
  userName,
  projects,
  currentProject,
  onCreateProject,
  onDeleteProject,
  onLogout,
  mode = "desktop",
}: {
  organizationName: string;
  organizationRole: OrganizationRole;
  organizationPermissions: OrganizationPermissions;
  organizationLogoUrl: string | null;
  organizationId: string;
  userName: string;
  projects: WorkspaceProject[];
  currentProject: WorkspaceProject | null;
  onCreateProject: () => void;
  onDeleteProject: (
    project: Pick<WorkspaceProject, "id" | "name" | "organizationId">,
  ) => void;
  onLogout: () => void;
  mode?: "desktop" | "mobile";
}) {
  const { t, i18n } = useTranslation();
  const locale = useWorkspaceLocale();
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
  const isOrganizationAdmin = organizationRole === "ORGANIZATION_ADMIN";
  const accountMenuLabel = `${userName} ${locale.sidebar.projectActions}`;
  const primaryNavigation = isOrganizationAdmin
    ? [
        {
          to: "/organizations/$organizationId" as const,
          label: locale.sidebar.workspace,
          icon: <LayoutDashboard className="h-3.5 w-3.5" />,
        },
        {
          to: "/organizations/$organizationId/projects" as const,
          label: locale.sidebar.projects,
          icon: <FolderKanban className="h-3.5 w-3.5" />,
        },
        {
          to: "/organizations/$organizationId/members" as const,
          label: locale.sidebar.members,
          icon: <Users2 className="h-3.5 w-3.5" />,
        },
        {
          to: "/organizations/$organizationId/billing" as const,
          label: locale.sidebar.billing,
          icon: <CreditCard className="h-3.5 w-3.5" />,
        },
        {
          to: "/organizations/$organizationId/settings" as const,
          label: locale.sidebar.organizationSettings,
          icon: <Settings2 className="h-3.5 w-3.5" />,
        },
      ]
    : [
        {
          to: "/organizations/$organizationId" as const,
          label: locale.sidebar.workspace,
          icon: <LayoutDashboard className="h-3.5 w-3.5" />,
        },
        {
          to: "/organizations/$organizationId/projects" as const,
          label: locale.sidebar.projects,
          icon: <FolderKanban className="h-3.5 w-3.5" />,
        },
      ];

  const content = (
    <>
      <SidebarHeader
        organizationName={organizationName}
        organizationRole={organizationRole}
        organizationLogoUrl={organizationLogoUrl}
        compact={mode === "mobile"}
      />

      <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <div className="space-y-1">
          {primaryNavigation.map((item) => (
            <NavRow
              key={item.to}
              to={item.to}
              params={{ organizationId }}
              label={item.label}
              icon={item.icon}
              exact={item.to === "/organizations/$organizationId"}
            />
          ))}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <span>{locale.sidebar.sectionTitle}</span>
            {organizationPermissions.canCreateProject ? (
              <ActionButton
                onClick={onCreateProject}
                label={locale.sidebar.addProject}
              />
            ) : null}
          </div>

          {projects.length === 0 ? (
            <div className="rounded-[12px] border border-border/70 bg-card/80 px-4 py-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">
                {locale.sidebar.noProjects}
              </div>
              <p className="mt-1 leading-6">
                {locale.sidebar.createFirstProject}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-1">
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: project.id }}
                    className={cn(
                      "group relative flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[10px] px-3.5 text-[13px] font-medium text-sidebar-foreground/85 transition-colors",
                      "hover:bg-sidebar-hover hover:text-foreground",
                      "data-[status=active]:border data-[status=active]:border-primary/12 data-[status=active]:bg-sidebar-active data-[status=active]:font-semibold data-[status=active]:text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2",
                    )}
                    title={project.name}
                  >
                    <FolderKanban className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{project.name}</span>
                  </Link>
                  <ProjectActionsMenu
                    project={project}
                    onDeleteProject={onDeleteProject}
                    projectSettingsLabel={locale.sidebar.projectSettings}
                    deleteProjectLabel={locale.sidebar.deleteProject}
                    actionsLabel={locale.sidebar.projectActions}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-3 mb-3 mt-auto border-t border-sidebar-border pt-3">
        {currentProject && !currentProject.permissions.canEdit ? (
          <div className="mb-3 rounded-[10px] border border-primary/20 bg-primary-soft/65 px-3 py-2 text-xs leading-5 text-primary">
            {locale.sidebar.readOnlyProject}
          </div>
        ) : null}

        <div className="flex items-center gap-3 rounded-[12px] px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
            {userName
              .split(" ")
              .map((part) => part.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold tracking-tight text-foreground">
              {userName}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {branding.roleLabel} · {projects.length} {projectCountLabel}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground"
                aria-label={accountMenuLabel}
                title={accountMenuLabel}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {organizationPermissions.canManageSettings ? (
                <DropdownMenuItem asChild>
                  <Link
                    to="/organizations/$organizationId/settings"
                    params={{ organizationId }}
                  >
                    <Settings2 className="h-4 w-4" />
                    {locale.sidebar.organizationSettings}
                  </Link>
                </DropdownMenuItem>
              ) : null}
              {(organizationPermissions.canManageSettings ||
                mode === "mobile") && <DropdownMenuSeparator />}
              <DropdownMenuItem onSelect={onLogout}>
                <LogOut className="h-4 w-4" />
                {t("common.logOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );

  if (mode === "mobile") {
    return <div className="flex h-full flex-col bg-sidebar">{content}</div>;
  }

  return (
    <aside className="sticky top-0 hidden h-dvh w-[15.75rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex xl:w-[17rem]">
      {content}
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
  project: Pick<
    WorkspaceProject,
    "id" | "name" | "organizationId" | "permissions"
  >;
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
        {project.permissions.canDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => onDeleteProject(project)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {deleteProjectLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
