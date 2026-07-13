import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  FolderKanban,
  LayoutGrid,
  Settings2,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Tab {
  to:
    | "/projects/$projectId/activities"
    | "/projects/$projectId/activities/$activityId/analysis"
    | "/projects/$projectId/activities/$activityId/data-review"
    | "/projects/$projectId/activities/$activityId/insights"
    | "/projects/$projectId/activities/$activityId/settings";
  label: string;
  icon: ReactNode;
  comingSoon?: boolean;
  params: { projectId: string } | { projectId: string; activityId: string };
}

export function ActivityTabs({
  projectId,
  activityId,
  className,
}: {
  projectId: string;
  activityId: string;
  className?: string;
}) {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      to: "/projects/$projectId/activities",
      label: t("projectWorkspace.tabs.activities"),
      icon: <FolderKanban className="h-3.5 w-3.5" />,
      params: { projectId },
    },
    {
      to: "/projects/$projectId/activities/$activityId/data-review",
      label: t("activityTabs.schema"),
      icon: <LayoutGrid className="h-3.5 w-3.5" />,
      comingSoon: true,
      params: { projectId, activityId },
    },
    {
      to: "/projects/$projectId/activities/$activityId/analysis",
      label: t("activityTabs.analytics"),
      icon: <BarChart3 className="h-3.5 w-3.5" />,
      comingSoon: true,
      params: { projectId, activityId },
    },
    {
      to: "/projects/$projectId/activities/$activityId/insights",
      label: t("activityTabs.insights"),
      icon: <Sparkles className="h-3.5 w-3.5" />,
      comingSoon: true,
      params: { projectId, activityId },
    },
    {
      to: "/projects/$projectId/activities/$activityId/settings",
      label: t("activityTabs.settings"),
      icon: <Settings2 className="h-3.5 w-3.5" />,
      params: { projectId, activityId },
    },
  ];

  return (
    <nav
      className={cn(
        "flex w-full gap-1 overflow-x-auto border-b border-border pb-px",
        className,
      )}
    >
      {tabs.map((tItem) => (
        <Link
          key={tItem.to}
          to={tItem.to}
          params={tItem.params}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-t-md border-b-2 border-transparent px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors",
            "hover:text-foreground",
            "data-[status=active]:border-primary data-[status=active]:text-primary",
          )}
        >
          {tItem.icon}
          {tItem.label}
          {tItem.comingSoon ? (
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
              {t("projectWorkspace.tabs.comingSoon")}
            </Badge>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
