import { Building2, FolderKanban, Users2 } from "lucide-react";
import type { ReactNode } from "react";
import { OrganizationAvatar } from "@/components/organizationAvatar";
import { Card } from "@/components/workspaceUI";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { getOrganizationBranding } from "@/lib/organizationBranding";
import type { OrganizationSummary } from "@/services/apiClient";
import { useTranslation } from "react-i18next";

export function OrganizationCard({
  organization,
  memberCount,
  projectCount,
  readOnly = false,
}: {
  organization: OrganizationSummary;
  memberCount: number | null;
  projectCount: number;
  readOnly?: boolean;
}) {
  const locale = useWorkspaceLocale();
  const { i18n } = useTranslation();
  const branding = getOrganizationBranding({
    organizationName: organization.settings.organizationName,
    organizationRole: organization.role,
    logoUrl: organization.logoUrl,
    language: i18n.resolvedLanguage ?? i18n.language,
  });

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <OrganizationAvatar
            name={branding.displayName}
            initials={branding.initials}
            logoUrl={branding.logoUrl}
            className="h-16 w-16 rounded-3xl text-lg"
          />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              {locale.organizationCard.eyebrow}
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {organization.settings.organizationName}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {organization.settings.mission ||
                locale.organizationCard.noMission}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            {branding.roleLabel}
          </span>
          {readOnly ? (
            <span className="rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              {locale.organizationCard.readOnly}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricTile
          icon={<Users2 className="h-4 w-4 text-primary" />}
          label={locale.organizationCard.members}
          value={memberCount === null ? "—" : String(memberCount)}
        />
        <MetricTile
          icon={<FolderKanban className="h-4 w-4 text-primary" />}
          label={locale.organizationCard.projects}
          value={String(projectCount)}
        />
        <MetricTile
          icon={<Building2 className="h-4 w-4 text-primary" />}
          label={locale.organizationCard.workspace}
          value={locale.organizationCard.workspaceReady}
        />
      </div>
    </Card>
  );
}

function MetricTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}
