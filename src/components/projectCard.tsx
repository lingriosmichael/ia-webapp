import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
import { formatDateTime, translateStatus } from "@/lib/translationUtils";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/services/apiClient";

export function ProjectCard({
  project,
  activityCount,
  className,
}: {
  project: Pick<
    ProjectSummary,
    "id" | "name" | "updatedAt" | "status" | "impactModel" | "successIndicators"
  >;
  activityCount: number;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const summary =
    resolveProjectSummaryText(project) ??
    t("organizationProjects.noDescription");

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className={cn(
        "group flex h-full cursor-pointer flex-col rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_20px_45px_-28px_rgba(79,70,229,0.45)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
            {project.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-border bg-secondary/30 text-muted-foreground transition-colors group-hover:border-primary/25 group-hover:bg-primary-soft group-hover:text-primary">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <MetaPill icon={<FolderKanban className="h-3.5 w-3.5" />}>
          {activityCount} {t("projectCard.activities")}
        </MetaPill>
        <MetaPill>{translateStatus(t, project.status)}</MetaPill>
      </div>

      <div className="mt-4 border-t border-border/70 pt-4 text-xs">
        <DetailBlock
          label={t("projectCard.updated")}
          value={formatDateTime(project.updatedAt, i18n.language)}
        />
      </div>
    </Link>
  );
}

function MetaPill({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/25 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      {icon}
      <span>{children}</span>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-sm text-foreground">{value}</div>
    </div>
  );
}
