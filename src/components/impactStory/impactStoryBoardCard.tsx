import { Expand, EyeOff, Grip } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDashboardCardChrome } from "./dashboardCardChromeContext";

export function ImpactStoryBoardCard({
  title,
  subtitle,
  note,
  badge,
  children,
  expandedContent,
  className,
  contentClassName,
}: {
  title: string;
  subtitle?: string | null;
  note?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  expandedContent?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const { t } = useTranslation();
  const chrome = useDashboardCardChrome();
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = expandedContent !== undefined;

  return (
    <>
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
              {canExpand ? (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  aria-label={t("impactStory.expandChartLabel", { title })}
                  className="rounded-full p-1 text-border transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : null}
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
            <div className="flex shrink-0 items-center gap-1">
              {canExpand ? (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  aria-label={t("impactStory.expandChartLabel", { title })}
                  className="rounded-full p-1 text-border transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : null}
              <Grip
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-border"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <div className={cn("mt-3", contentClassName)}>{children}</div>

        {note ? (
          <div className="mt-3 border-t border-dashed border-border pt-3 text-[0.72rem] leading-[1.5] text-muted-foreground">
            {note}
          </div>
        ) : null}
      </Card>

      {canExpand ? (
        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="max-h-[88vh] max-w-[min(94vw,82rem)] overflow-hidden rounded-[1.85rem] border-border bg-card p-0 shadow-elevated">
            <div className="overflow-y-auto p-6 sm:p-7">
              <div className="pr-8">
                <DialogTitle className="text-xl leading-[1.1] font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                  {title}
                </DialogTitle>
                {subtitle ? (
                  <DialogDescription className="mt-2 max-w-[48rem] text-sm leading-6 text-muted-foreground">
                    {subtitle}
                  </DialogDescription>
                ) : null}
                {badge ? <div className="mt-2.5">{badge}</div> : null}
              </div>

              <div className="mt-5">{expandedContent ?? children}</div>

              {note ? (
                <div className="mt-5 border-t border-dashed border-border pt-4 text-sm leading-6 text-muted-foreground">
                  {note}
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
