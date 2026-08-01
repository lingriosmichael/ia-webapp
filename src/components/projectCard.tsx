import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarRange,
  Clock3,
  FolderKanban,
} from "lucide-react";
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
    | "fundingOrganization"
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
  const sponsor = project.fundingOrganization ?? project.fundingProgram;
  const iconToneClassName =
    project.status === "completed"
      ? "border-slate-200 bg-slate-100 text-slate-700"
      : project.status === "active"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <div
      className={cn(
        "group rounded-[24px] border border-border/75 bg-card px-5 py-5 shadow-[var(--shadow-soft)] transition-colors hover:border-primary/20 sm:px-6 sm:py-6",
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-5">
          <div
            className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] border",
              iconToneClassName,
            )}
          >
            <FolderKanban className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-[1rem] leading-[1.25] font-semibold tracking-tight text-foreground">
                {project.name}
              </h3>
              <StatusBadge
                status={project.status}
                label={translateStatus(t, project.status)}
                className="h-6 rounded-full px-2.5 text-[10px]"
              />
            </div>
            <p className="mt-2 max-w-[52rem] text-[11px] leading-5 text-muted-foreground">
              {summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
              {sponsor ? (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  {sponsor}
                </span>
              ) : null}
              {period ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarRange className="h-3.5 w-3.5 text-primary" />
                  {period}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <FolderKanban className="h-3.5 w-3.5 text-primary" />
                {activityCount} {t("projectCard.activities")}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-3.5 w-3.5 text-primary" />
                {t("projectCard.updated")}:{" "}
                {formatDateTime(project.updatedAt, i18n.language)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-end lg:self-center">
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className="inline-flex h-10 items-center gap-2 rounded-[16px] border border-border bg-background px-4 text-[12px] font-medium text-foreground transition-colors hover:border-primary/20 hover:text-primary"
          >
            {t("common.open")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
