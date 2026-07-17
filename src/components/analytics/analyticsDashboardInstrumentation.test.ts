import { describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_DASHBOARD_EVENT_NAME,
  recordAnalyticsDashboardInteraction,
} from "./analyticsDashboardInstrumentation";

describe("analyticsDashboardInstrumentation", () => {
  it("dispatches a browser event with the dashboard interaction detail", () => {
    const dispatchEvent = vi.fn();
    const originalDispatchEvent = globalThis.dispatchEvent;
    const originalCustomEvent = globalThis.CustomEvent;

    globalThis.dispatchEvent = dispatchEvent;

    class TestCustomEvent<T> extends Event {
      detail: T;

      constructor(type: string, init: CustomEventInit<T>) {
        super(type);
        this.detail = init.detail as T;
      }
    }

    globalThis.CustomEvent =
      TestCustomEvent as unknown as typeof globalThis.CustomEvent;

    recordAnalyticsDashboardInteraction({
      interactionType: "widget_hidden",
      resultId: "result-1",
      projectId: "project-1",
      activityId: "activity-1",
      scopeType: "ACTIVITY",
      dashboardSchemaVersion: "dashboard-v2",
      dashboardCompatibilitySource: "generated",
      orderedWidgetIds: ["summary-primary", "kpi-1"],
      hiddenWidgetIds: ["kpi-1"],
      visibleWidgetIds: ["summary-primary"],
      widgetId: "kpi-1",
    });

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    const dispatchedEvent = dispatchEvent.mock.calls[0]?.[0] as Event & {
      detail: { widgetId: string | null };
    };
    expect(dispatchedEvent.type).toBe(ANALYTICS_DASHBOARD_EVENT_NAME);
    expect(dispatchedEvent.detail.widgetId).toBe("kpi-1");

    globalThis.dispatchEvent = originalDispatchEvent;
    globalThis.CustomEvent = originalCustomEvent;
  });
});
