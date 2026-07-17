import { useEffect, useEffectEvent } from "react";
import {
  useTrackActivityAnalyticsInteractionMutation,
  useTrackProjectAnalyticsInteractionMutation,
} from "@/hooks/useWorkspaceQueries";
import {
  ANALYTICS_DASHBOARD_EVENT_NAME,
  type AnalyticsDashboardInteractionEventDetail,
} from "@/components/analytics/analyticsDashboardInstrumentation";

export function useProjectAnalyticsDashboardInteractionTracking(
  projectId: string,
  enabled = true,
) {
  const mutation = useTrackProjectAnalyticsInteractionMutation(projectId);
  const onInteraction = useEffectEvent((event: Event) => {
    const detail = (
      event as CustomEvent<AnalyticsDashboardInteractionEventDetail>
    ).detail;

    if (
      !detail ||
      detail.projectId !== projectId ||
      detail.activityId !== null
    ) {
      return;
    }

    mutation.mutate(detail);
  });

  useEffect(() => {
    if (!enabled || typeof globalThis.addEventListener !== "function") {
      return;
    }

    const handler = (event: Event) => onInteraction(event);
    globalThis.addEventListener(ANALYTICS_DASHBOARD_EVENT_NAME, handler);
    return () => {
      globalThis.removeEventListener(ANALYTICS_DASHBOARD_EVENT_NAME, handler);
    };
  }, [enabled, onInteraction]);
}

export function useActivityAnalyticsDashboardInteractionTracking(
  projectId: string,
  activityId: string,
  enabled = true,
) {
  const mutation = useTrackActivityAnalyticsInteractionMutation(
    projectId,
    activityId,
  );
  const onInteraction = useEffectEvent((event: Event) => {
    const detail = (
      event as CustomEvent<AnalyticsDashboardInteractionEventDetail>
    ).detail;

    if (
      !detail ||
      detail.projectId !== projectId ||
      detail.activityId !== activityId
    ) {
      return;
    }

    mutation.mutate(detail);
  });

  useEffect(() => {
    if (!enabled || typeof globalThis.addEventListener !== "function") {
      return;
    }

    const handler = (event: Event) => onInteraction(event);
    globalThis.addEventListener(ANALYTICS_DASHBOARD_EVENT_NAME, handler);
    return () => {
      globalThis.removeEventListener(ANALYTICS_DASHBOARD_EVENT_NAME, handler);
    };
  }, [enabled, onInteraction]);
}
