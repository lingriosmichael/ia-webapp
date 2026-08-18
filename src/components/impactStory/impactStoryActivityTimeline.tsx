import { useTranslation } from "react-i18next";
import type { WorkspaceActivity } from "@/services/apiClient";
import { Card } from "@/components/WorkspaceUI";

const timelineColors = ["#4C8F6B", "#C6912F", "#C2593F", "#2F6690"] as const;

function getActivityDisplayRank(systemType: WorkspaceActivity["systemType"]) {
  if (systemType === "baseline") {
    return 0;
  }

  if (systemType === "impact_measurement") {
    return 2;
  }

  return 1;
}

function resolveTimelineColor(
  activity: WorkspaceActivity,
  middleIndex: number,
): string {
  if (activity.systemType === "baseline") {
    return "#C6912F";
  }

  if (activity.systemType === "impact_measurement") {
    return "#C2593F";
  }

  return (
    timelineColors[middleIndex % timelineColors.length] ?? timelineColors[0]
  );
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

  if (activities.length === 0) {
    return null;
  }

  const sortedActivities = [...activities]
    .map((activity, index) => ({ activity, index }))
    .sort((left, right) => {
      const rankDelta =
        getActivityDisplayRank(left.activity.systemType) -
        getActivityDisplayRank(right.activity.systemType);

      if (rankDelta !== 0) {
        return rankDelta;
      }

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

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-border bg-card px-5 py-5 shadow-soft sm:px-6 sm:py-6">
      <div className="text-[0.78rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {timelineTitle}
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div
          className="relative grid min-w-max items-start gap-5"
          style={{
            gridTemplateColumns: `repeat(${sortedActivities.length}, minmax(7rem, 1fr))`,
          }}
        >
          <div className="absolute top-3 left-0 right-0 h-[2px] rounded-full bg-muted" />
          {sortedActivities.map((activity, index) => {
            const color = resolveTimelineColor(activity, index);
            const isFirst = index === 0;
            const isLast = index === sortedActivities.length - 1;
            return (
              <div
                key={activity.id}
                className={[
                  "relative flex min-w-[7rem] max-w-[8rem] flex-1 flex-col",
                  isFirst
                    ? "items-start text-left"
                    : isLast
                      ? "items-end text-right"
                      : "items-center text-center",
                ].join(" ")}
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
