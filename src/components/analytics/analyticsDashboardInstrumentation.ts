import type {
  AnalyticsDashboardCompatibilitySource,
  AnalyticsScopeType,
} from "@/services/apiClient";

export const ANALYTICS_DASHBOARD_EVENT_NAME =
  "impact-atlas:analytics-dashboard";

export type AnalyticsDashboardInteractionType =
  | "dashboard_viewed"
  | "widget_hidden"
  | "widget_shown"
  | "layout_reordered"
  | "layout_restored";

export interface AnalyticsDashboardInteractionEventDetail {
  interactionType: AnalyticsDashboardInteractionType;
  resultId: string;
  projectId: string;
  activityId: string | null;
  scopeType: AnalyticsScopeType;
  dashboardSchemaVersion: string;
  dashboardCompatibilitySource: AnalyticsDashboardCompatibilitySource;
  orderedWidgetIds: string[];
  hiddenWidgetIds: string[];
  visibleWidgetIds: string[];
  widgetId: string | null;
}

export function recordAnalyticsDashboardInteraction(
  detail: AnalyticsDashboardInteractionEventDetail,
) {
  if (
    typeof globalThis.dispatchEvent !== "function" ||
    typeof globalThis.CustomEvent !== "function"
  ) {
    return;
  }

  globalThis.dispatchEvent(
    new CustomEvent<AnalyticsDashboardInteractionEventDetail>(
      ANALYTICS_DASHBOARD_EVENT_NAME,
      {
        detail,
      },
    ),
  );
}
