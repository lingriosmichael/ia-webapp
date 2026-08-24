import { EyeOff, Grip } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import { cn } from "@/lib/utils";
import { useDashboardCardChrome } from "./dashboardCardChromeContext";

export function ImpactStoryBoardCard({
  title,
  subtitle,
  note,
  badge,
  children,
  className,
  contentClassName,
}: {
  title: string;
  subtitle?: string | null;
  note?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const { t } = useTranslation();
  const chrome = useDashboardCardChrome();

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[1.85rem] border-border bg-card px-4 py-4 shadow-soft sm:px-[1.125rem] sm:py-[1.125rem]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.96rem] leading-[1.15] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.08rem]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1.5 max-w-[36rem] text-[0.74rem] leading-[1.45] text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
          {badge ? <div className="mt-1.5">{badge}</div> : null}
        </div>
        {chrome ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={chrome.onHide}
              aria-label={t("impactStory.hideChartLabel", { title })}
              className="rounded-full p-1 text-border transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              ref={chrome.dragHandleRef}
              {...chrome.dragHandleAttributes}
              {...chrome.dragHandleListeners}
              aria-label={t("impactStory.dragHandleLabel", { title })}
              className="touch-none rounded-full p-1 text-border transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
              style={{ cursor: "grab" }}
            >
              <Grip className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Grip
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-border"
            aria-hidden="true"
          />
        )}
      </div>

      <div className={cn("mt-3", contentClassName)}>{children}</div>

      {note ? (
        <div className="mt-3 border-t border-dashed border-border pt-3 text-[0.72rem] leading-[1.5] text-muted-foreground">
          {note}
        </div>
      ) : null}
    </Card>
  );
}
