import { useTranslation } from "react-i18next";
import type { WorkspaceActivity } from "@/services/apiClient";
import { Card } from "@/components/WorkspaceUI";
import { IMPACT_STORY_COLORS } from "./projectImpactStoryChartColors";

const timelineColors = [
  IMPACT_STORY_COLORS.green,
  IMPACT_STORY_COLORS.amber,
  IMPACT_STORY_COLORS.coral,
  IMPACT_STORY_COLORS.blue,
] as const;

function resolveTimelineColor(middleIndex: number): string {
  return (
    timelineColors[middleIndex % timelineColors.length] ?? timelineColors[0]
  );
}

function resolveTimelinePosition(index: number, total: number): number {
  if (total <= 1) {
    return 0;
  }

  return (index / (total - 1)) * 100;
}

function formatActivityRange(
  startDate: string | null,
  endDate: string | null,
  language: string,
  undatedLabel: string,
): string {
  if (!startDate && !endDate) {
    return undatedLabel;
  }

  const locale = language === "de" ? "de-DE" : "en-US";
  const shortMonth = new Intl.DateTimeFormat(locale, { month: "short" });
  const shortMonthYear = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  });
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && end) {
    const sameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();
    if (sameMonth) {
      return shortMonth.format(start).replace(".", "");
    }
    const sameYear = start.getFullYear() === end.getFullYear();
    if (sameYear) {
      return `${shortMonth.format(start).replace(".", "")}\u2013${shortMonth.format(end).replace(".", "")}`;
    }
    return `${shortMonthYear.format(start).replace(".", "")}\u2013${shortMonthYear.format(end).replace(".", "")}`;
  }

  const value = start ?? end;
  return value ? shortMonthYear.format(value).replace(".", "") : undatedLabel;
}

export function ImpactStoryActivityTimeline({
  activities,
}: {
  activities: WorkspaceActivity[];
}) {
  const { t, i18n } = useTranslation();
  const timelineTitle = t("impactStory.timelineTitle", {
    defaultValue:
      i18n.language === "de"
        ? "Aktivitäten im Jahresverlauf"
        : "Activities through the year",
  });
  const undatedLabel = t("impactStory.timelineUndated", {
    defaultValue: i18n.language === "de" ? "Ohne Datum" : "Undated",
  });

  // The merged "Ausgangslage & Wirkungsdaten" activity (OUTCOME_EVIDENCE_MERGE_PLAN.md)
  // doesn't represent a single point or range in time — it has no dates of
  // its own — so it has no honest place on a chronological timeline. Rather
  // than pin it to an arbitrary position, this timeline only shows the
  // program's dated activities.
  const datedActivities = activities.filter(
    (activity) => activity.systemType !== "outcome_evidence",
  );

  if (datedActivities.length === 0) {
    return null;
  }

  const sortedActivities = [...datedActivities]
    .map((activity, index) => ({ activity, index }))
    .sort((left, right) => {
      const leftDate =
        left.activity.startDate ??
        left.activity.endDate ??
        left.activity.createdAt;
      const rightDate =
        right.activity.startDate ??
        right.activity.endDate ??
        right.activity.createdAt;
      const dateDelta = leftDate.localeCompare(rightDate);

      return dateDelta === 0 ? left.index - right.index : dateDelta;
    })
    .map(({ activity }) => activity);
  const timelineWidthRem = Math.max(sortedActivities.length * 12, 42);

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-border bg-card px-5 py-5 shadow-soft sm:px-6 sm:py-6">
      <div className="text-[0.78rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {timelineTitle}
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div
          className="relative min-h-[11rem]"
          style={{ minWidth: `${timelineWidthRem}rem` }}
        >
          <div className="absolute top-3 left-0 right-0 h-[2px] rounded-full bg-muted" />
          {sortedActivities.map((activity, index) => {
            const color = resolveTimelineColor(index);
            const isFirst = index === 0;
            const isLast = index === sortedActivities.length - 1;
            const position = resolveTimelinePosition(
              index,
              sortedActivities.length,
            );
            return (
              <div
                key={activity.id}
                className={[
                  "absolute top-0 flex w-32 flex-col",
                  isFirst
                    ? "items-start text-left"
                    : isLast
                      ? "items-end text-right"
                      : "items-center text-center",
                ].join(" ")}
                style={{
                  left: `${position}%`,
                  transform: isFirst
                    ? "translateX(0)"
                    : isLast
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
                }}
              >
                <div
                  className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-[3px] bg-card"
                  style={{ borderColor: color }}
                  aria-hidden="true"
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="mt-4 max-w-[8rem] overflow-hidden text-[0.8rem] leading-[1.1] font-semibold text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] break-words">
                  {activity.name}
                </div>
                <div className="mt-1 text-[0.72rem] leading-4 text-muted-foreground">
                  {formatActivityRange(
                    activity.startDate,
                    activity.endDate,
                    i18n.language,
                    undatedLabel,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
