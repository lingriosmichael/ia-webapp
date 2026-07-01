import {
  CalendarRange,
  MapPin,
  ShieldAlert,
  Target,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import { Button } from "@/components/ui/button";
import { useWorkspaceLocale } from "@/hooks/use-workspace-locale";
import { formatDateTime, translateStatus } from "@/lib/translation-utils";
import type { ProjectSummary } from "@/services/api-client";

export function ProjectSettingsPanel({
  project,
  organizationName,
  onDeleteProject,
}: {
  project: ProjectSummary;
  organizationName: string;
  onDeleteProject: () => void;
}) {
  const locale = useWorkspaceLocale();
  const { i18n, t } = useTranslation();

  const timeline = [project.startMonth, project.endMonth]
    .filter(Boolean)
    .join(" -> ");
  const location = [project.regionCity, project.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <Card className="p-6 sm:p-8">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {locale.projectSettings.general}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {locale.projectSettings.generalDescription}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <DetailCard
            label={locale.projectSettings.fields.status}
            value={translateStatus(t, project.status)}
          />
          <DetailCard
            label={locale.projectSettings.fields.organization}
            value={organizationName}
          />
          <DetailCard
            label={locale.projectSettings.fields.timeline}
            value={timeline || locale.projectSettings.notSet}
            icon={<CalendarRange className="h-4 w-4 text-primary" />}
          />
          <DetailCard
            label={locale.projectSettings.fields.location}
            value={location || locale.projectSettings.notSet}
            icon={<MapPin className="h-4 w-4 text-primary" />}
          />
          <DetailCard
            label={locale.projectSettings.fields.funding}
            value={project.fundingSource || locale.projectSettings.notSet}
          />
          <DetailCard
            label={locale.projectSettings.fields.goal}
            value={project.programGoal || locale.projectSettings.notSet}
            icon={<Target className="h-4 w-4 text-primary" />}
          />
          <DetailCard
            label={locale.projectSettings.fields.created}
            value={formatDateTime(project.createdAt, i18n.language)}
          />
          <DetailCard
            label={locale.projectSettings.fields.updated}
            value={formatDateTime(project.updatedAt, i18n.language)}
          />
        </div>
      </Card>

      <div>
        <Card className="border-destructive/25 bg-destructive/[0.04] p-6 shadow-none">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            {locale.projectSettings.dangerTitle}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {locale.projectSettings.dangerDescription}
          </p>
          <Button
            type="button"
            variant="destructive"
            className="mt-6 w-full justify-center"
            onClick={onDeleteProject}
          >
            <Trash2 className="h-4 w-4" />
            {locale.projectSettings.deleteAction}
          </Button>
        </Card>
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-sm leading-6 text-foreground">{value}</div>
    </div>
  );
}
