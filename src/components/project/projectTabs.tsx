import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ClipboardList,
  Database,
  FolderKanban,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectTab {
  to: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
  comingSoon?: boolean;
}

export function ProjectTabs({
  projectId,
  className,
}: {
  projectId: string;
  className?: string;
}) {
  const { t } = useTranslation();

  const tabs: ProjectTab[] = [
    {
      to: "/projects/$projectId",
      label: t("projectWorkspace.tabs.overview"),
      icon: <ClipboardList className="h-4 w-4" />,
      exact: true,
    },
    {
      to: "/projects/$projectId/activities",
      label: t("projectWorkspace.tabs.activities"),
      icon: <FolderKanban className="h-4 w-4" />,
    },
    {
      to: "/projects/$projectId/evidence",
      label: t("projectWorkspace.tabs.evidence"),
      icon: <Database className="h-4 w-4" />,
    },
    {
      to: "/projects/$projectId/interpretation",
      label: t("projectWorkspace.tabs.interpretation"),
      icon: <WandSparkles className="h-4 w-4" />,
    },
    {
      to: "/projects/$projectId/analytics",
      label: t("projectWorkspace.tabs.analytics"),
      icon: <BarChart3 className="h-4 w-4" />,
      comingSoon: true,
    },
    {
      to: "/projects/$projectId/insights",
      label: t("projectWorkspace.tabs.insights"),
      icon: <Sparkles className="h-4 w-4" />,
      comingSoon: true,
    },
  ];

  return (
    <nav
      className={cn(
        "flex gap-1 overflow-x-auto border-b border-border/70 pb-px",
        className,
      )}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          params={{ projectId }}
          activeOptions={{ exact: tab.exact ?? false }}
          className={cn(
            "inline-flex h-12 shrink-0 items-center gap-2 border-b-2 border-transparent px-3.5 text-sm font-medium text-foreground/70 transition-colors",
            "hover:text-foreground",
            "data-[status=active]:border-primary data-[status=active]:text-primary data-[status=active]:font-semibold",
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.comingSoon ? (
            <Badge variant="secondary" className="h-5 px-1.5 py-0 text-[10px]">
              {t("projectWorkspace.tabs.comingSoon")}
            </Badge>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
