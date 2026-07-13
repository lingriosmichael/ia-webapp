import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarRange, FolderKanban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "@/components/statusBadge";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
import {
  formatDateTime,
  formatMonthRange,
  translateStatus,
} from "@/lib/translationUtils";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/services/apiClient";

export function ProjectCard({
  project,
  activityCount,
  className,
}: {
  project: Pick<
    ProjectSummary,
    | "id"
    | "name"
    | "updatedAt"
    | "status"
    | "impactModel"
    | "successIndicators"
    | "fundingProgram"
    | "startMonth"
    | "endMonth"
  >;
  activityCount: number;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const period = formatMonthRange(
    project.startMonth,
    project.endMonth,
    i18n.language,
  );
  const summary =
    resolveProjectSummaryText(project) ??
    t("organizationProjects.noDescription");

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className={cn(
        "group flex h-full cursor-pointer flex-col rounded-[14px] border border-border/85 bg-card p-5 transition-colors hover:border-primary/20 hover:bg-primary-soft/20",
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[18px] font-semibold tracking-tight text-foreground">
              {project.name}
            </h3>
            <StatusBadge
              status={project.status}
              label={translateStatus(t, project.status)}
            />
          </div>
          <p className="mt-2 line-clamp-2 max-w-[44rem] text-sm leading-6 text-muted-foreground">
            {summary}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {project.fundingProgram ? (
              <span>{project.fundingProgram}</span>
            ) : null}
            {period ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarRange className="h-3.5 w-3.5 text-primary" />
                {period}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <FolderKanban className="h-3.5 w-3.5 text-primary" />
              {activityCount} {t("projectCard.activities")}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden text-right text-xs text-muted-foreground sm:block">
            <div>{t("projectCard.updated")}</div>
            <div className="mt-1 text-sm text-foreground">
              {formatDateTime(project.updatedAt, i18n.language)}
            </div>
          </div>
          <div className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors group-hover:border-primary/20 group-hover:text-primary">
            {t("common.open")}
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
