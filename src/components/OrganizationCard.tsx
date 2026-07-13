import { FolderKanban, Users2 } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { OrganizationAvatar } from "@/components/organizationAvatar";
import { StatusBadge } from "@/components/statusBadge";
import { Card } from "@/components/workspaceUI";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { getOrganizationBranding } from "@/lib/organizationBranding";
import type { OrganizationSummary } from "@/services/apiClient";

export function OrganizationCard({
  organization,
  memberCount,
  projectCount,
}: {
  organization: OrganizationSummary;
  memberCount: number;
  projectCount: number;
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
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3.5">
          <OrganizationAvatar
            name={branding.displayName}
            initials={branding.initials}
            logoUrl={branding.logoUrl}
            className="h-12 w-12 rounded-[14px] text-base"
          />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              {locale.organizationCard.eyebrow}
            </div>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
              {organization.settings.organizationName}
            </h2>
            {organization.settings.legalForm ? (
              <p className="mt-1 text-sm text-foreground/75">
                {organization.settings.legalForm}
              </p>
            ) : null}
            <p className="mt-2 max-w-[42rem] text-sm leading-6 text-muted-foreground">
              {organization.settings.mission ||
                locale.organizationCard.noMission}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="available" label={branding.roleLabel} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MetricTile
          icon={<Users2 className="h-4 w-4 text-primary" />}
          label={locale.organizationCard.members}
          value={String(memberCount)}
        />
        <MetricTile
          icon={<FolderKanban className="h-4 w-4 text-primary" />}
          label={locale.organizationCard.projects}
          value={String(projectCount)}
        />
        <MetricTile
          label={locale.organizationCard.role}
          value={branding.roleLabel}
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
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[12px] border border-border/80 bg-secondary/35 p-3.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-base font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}
