import { describe, expect, it } from "vitest";
import {
  createFallbackDashboard,
  resolveAnalyticsDashboard,
  resolveDashboardLayout,
} from "./analyticsDashboardLayout";
import type { AnalyticsResultRecord } from "@/services/apiClient";

function makeResult(): AnalyticsResultRecord {
  return {
    id: "result-1",
    analyticsExecutionId: "execution-1",
    organizationId: "org-1",
    projectId: "project-1",
    activityId: null,
    scopeType: "PROJECT",
    catalogVersion: "3.0",
    knowledgeModelVersion: 1,
    catalog: {
      catalogVersion: "3.0",
      knowledgeModelVersion: 1,
      scope: { type: "PROJECT", projectId: "project-1", activityId: null },
      entries: [
        {
          entryId: "metric-1",
          entryType: "METRIC",
          label: "Attendance rate",
          description: "Share of participants attending sessions.",
          value: 0.82,
          unit: "ratio",
          deduplicationConfidence: "not_applicable",
          activityId: "activity-1",
          provenance: {
            knowledgeEntityId: "entity-1",
            uploadMetadataId: "upload-1",
            interpretationResultId: "interpretation-1",
            sourceReference: "Attendance rate",
          },
        },
        {
          entryId: "theme-1",
          entryType: "QUALITATIVE_THEME",
          label: "Mentors requested more preparation time",
          description: "Interviewees described compressed onboarding.",
          quoteCount: 3,
          categories: ["barrier"],
          outcomeReferences: ["Participants sustain mentor relationships."],
          outcomeAnchorTypes: ["project_outcome"],
          sourceActivityIds: ["activity-1"],
          sourceUploadMetadataIds: ["upload-2"],
        },
      ],
      omittedEntries: [],
      qualitySignals: [],
    },
    curation: {
      featuredEntryIds: ["metric-1", "theme-1"],
      narrative: [
        {
          text: "Attendance stayed stable while mentor preparation remained a constraint.",
          referencedEntryIds: ["metric-1", "theme-1"],
        },
      ],
      groundingStatus: "PASSED",
      groundingRetryCount: 0,
      curatorModelVersion: "curator-prompt-v1",
      fellBackToSelectionOnly: false,
    },
    dashboard: null,
    dataQuality: {
      recordsExcludedCount: 0,
      warnings: [],
    },
    limitations: [],
    generatedAt: "2026-07-16T10:00:00.000Z",
    createdAt: "2026-07-16T10:00:00.000Z",
    updatedAt: "2026-07-16T10:00:00.000Z",
  };
}

describe("analyticsDashboardLayout", () => {
  it("normalizes widget order and hidden state against the available widget set", () => {
    const dashboard = createFallbackDashboard(makeResult());

    const resolved = resolveDashboardLayout({
      dashboard,
      preference: {
        id: "layout-1",
        organizationId: "org-1",
        projectId: "project-1",
        activityId: null,
        scopeType: "PROJECT",
        dashboardSchemaVersion: dashboard.schemaVersion,
        orderedWidgetIds: ["theme-list-fallback", "missing-widget"],
        hiddenWidgetIds: ["missing-widget", "theme-list-fallback"],
        updatedById: "user-1",
        createdAt: "2026-07-16T10:00:00.000Z",
        updatedAt: "2026-07-16T10:00:00.000Z",
      },
    });

    expect(resolved.orderedWidgetIds).toEqual([
      "theme-list-fallback",
      "kpi-metric-1",
      "summary-fallback",
    ]);
    expect(resolved.hiddenWidgetIds).toEqual(["theme-list-fallback"]);
    expect(resolved.visibleWidgets.map((widget) => widget.widgetId)).toEqual([
      "kpi-metric-1",
      "summary-fallback",
    ]);
  });

  it("keeps legacy comparable charts when no replacement charts exist yet", () => {
    const result = makeResult();
    result.dashboard = {
      schemaVersion: "dashboard-v1",
      availableWidgets: [
        {
          widgetId: "horizontal-bar-counts",
          kind: "horizontal_bar",
          title: "Comparable counts",
          subtitle: null,
          description: "Legacy comparable chart.",
          sourceActivityIds: ["activity-1"],
          sourceUploadMetadataIds: ["upload-1"],
          goalLinkage: {
            outcomeReferences: [],
            successIndicators: [],
            matchedProjectGoalPhrases: [],
          },
          qualityFlags: [],
          unit: "count",
          items: [
            {
              id: "item-1",
              label: "Applications",
              description: "Applications",
              value: 12,
              unit: "count",
              entryId: "metric-1",
            },
          ],
        },
      ],
      defaultLayout: {
        orderedWidgetIds: ["horizontal-bar-counts"],
        hiddenWidgetIds: [],
      },
    };

    const resolved = resolveAnalyticsDashboard({
      result,
      dashboardCompatibilitySource: "generated",
    });

    expect(resolved.dashboard.availableWidgets).toHaveLength(1);
    expect(resolved.dashboard.availableWidgets[0]?.widgetId).toBe(
      "horizontal-bar-counts",
    );
  });

  it("drops legacy comparable charts once replacement charts exist", () => {
    const result = makeResult();
    result.dashboard = {
      schemaVersion: "dashboard-v2",
      availableWidgets: [
        {
          widgetId: "horizontal-bar-counts",
          kind: "horizontal_bar",
          title: "Comparable counts",
          subtitle: null,
          description: "Legacy comparable chart.",
          sourceActivityIds: ["activity-1"],
          sourceUploadMetadataIds: ["upload-1"],
          goalLinkage: {
            outcomeReferences: [],
            successIndicators: [],
            matchedProjectGoalPhrases: [],
          },
          qualityFlags: [],
          unit: "count",
          items: [
            {
              id: "item-1",
              label: "Applications",
              description: "Applications",
              value: 12,
              unit: "count",
              entryId: "metric-1",
            },
          ],
        },
        {
          widgetId: "category-rank-safe",
          kind: "category_rank",
          title: "Applications by district",
          subtitle: null,
          description: "Safer grouped chart.",
          sourceActivityIds: ["activity-1"],
          sourceUploadMetadataIds: ["upload-1"],
          goalLinkage: {
            outcomeReferences: [],
            successIndicators: [],
            matchedProjectGoalPhrases: [],
          },
          qualityFlags: [],
          label: "Applications by district",
          tableName: "Sheet 1",
          activityId: "activity-1",
          unit: "count",
          items: [
            {
              id: "segment-1",
              label: "Mitte",
              value: 8,
            },
            {
              id: "segment-2",
              label: "Pankow",
              value: 4,
            },
          ],
        },
      ],
      defaultLayout: {
        orderedWidgetIds: ["horizontal-bar-counts", "category-rank-safe"],
        hiddenWidgetIds: [],
      },
    };

    const resolved = resolveAnalyticsDashboard({
      result,
      dashboardCompatibilitySource: "generated",
    });

    expect(
      resolved.dashboard.availableWidgets.map((widget) => widget.widgetId),
    ).toEqual(["category-rank-safe"]);
    expect(resolved.dashboard.defaultLayout.orderedWidgetIds).toEqual([
      "category-rank-safe",
    ]);
  });

  it("keeps deterministic distribution bars when replacement charts exist", () => {
    const result = makeResult();
    result.dashboard = {
      schemaVersion: "dashboard-v2",
      availableWidgets: [
        {
          widgetId: "horizontal-bar-safe-distribution",
          kind: "horizontal_bar",
          title: "Recommendation distribution",
          subtitle: "responses",
          description:
            "A deterministic category distribution from structured evidence.",
          sourceActivityIds: ["activity-1"],
          sourceUploadMetadataIds: ["upload-1"],
          goalLinkage: {
            outcomeReferences: [],
            successIndicators: [],
            matchedProjectGoalPhrases: [],
          },
          qualityFlags: [],
          unit: "count",
          items: [
            {
              id: "item-1",
              label: "Suitable",
              description: "Recommendation distribution",
              value: 12,
              unit: "count",
              entryId: null,
            },
            {
              id: "item-2",
              label: "Unsuitable",
              description: "Recommendation distribution",
              value: 4,
              unit: "count",
              entryId: null,
            },
          ],
        },
        {
          widgetId: "category-rank-safe",
          kind: "category_rank",
          title: "Applications by district",
          subtitle: null,
          description: "Safer grouped chart.",
          sourceActivityIds: ["activity-1"],
          sourceUploadMetadataIds: ["upload-1"],
          goalLinkage: {
            outcomeReferences: [],
            successIndicators: [],
            matchedProjectGoalPhrases: [],
          },
          qualityFlags: [],
          label: "Applications by district",
          tableName: "Sheet 1",
          activityId: "activity-1",
          unit: "count",
          items: [
            {
              id: "segment-1",
              label: "Mitte",
              value: 8,
            },
            {
              id: "segment-2",
              label: "Pankow",
              value: 4,
            },
          ],
        },
      ],
      defaultLayout: {
        orderedWidgetIds: [
          "horizontal-bar-safe-distribution",
          "category-rank-safe",
        ],
        hiddenWidgetIds: [],
      },
    };

    const resolved = resolveAnalyticsDashboard({
      result,
      dashboardCompatibilitySource: "generated",
    });

    expect(
      resolved.dashboard.availableWidgets.map((widget) => widget.widgetId),
    ).toEqual(["horizontal-bar-safe-distribution", "category-rank-safe"]);
  });
});
