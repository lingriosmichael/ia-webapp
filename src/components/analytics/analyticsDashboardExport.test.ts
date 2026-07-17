import { describe, expect, it } from "vitest";
import { buildAnalyticsDashboardExportDocument } from "./analyticsDashboardExport";
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
      entries: [],
      omittedEntries: [],
      qualitySignals: [],
    },
    curation: {
      featuredEntryIds: [],
      narrative: [],
      groundingStatus: "PASSED",
      groundingRetryCount: 0,
      curatorModelVersion: "curator-prompt-v1",
      fellBackToSelectionOnly: false,
    },
    dashboard: {
      schemaVersion: "dashboard-v2",
      availableWidgets: [
        {
          widgetId: "summary-primary",
          kind: "summary",
          title: "In plain language",
          subtitle: null,
          description: "Summary",
          sourceActivityIds: [],
          sourceUploadMetadataIds: [],
          goalLinkage: {
            outcomeReferences: [],
            successIndicators: [],
            matchedProjectGoalPhrases: [],
          },
          qualityFlags: [],
          paragraphs: ["Attendance held steady."],
          referencedEntryIds: [],
        },
        {
          widgetId: "kpi-1",
          kind: "kpi",
          title: "Attendance rate",
          subtitle: null,
          description: "Share of participants attending sessions.",
          sourceActivityIds: ["activity-1"],
          sourceUploadMetadataIds: ["upload-1"],
          goalLinkage: {
            outcomeReferences: [],
            successIndicators: [],
            matchedProjectGoalPhrases: [],
          },
          qualityFlags: [],
          entryId: "metric-1",
          label: "Attendance rate",
          value: 0.82,
          unit: "ratio",
          deduplicationConfidence: "not_applicable",
        },
      ],
      defaultLayout: {
        orderedWidgetIds: ["summary-primary", "kpi-1"],
        hiddenWidgetIds: [],
      },
    },
    dataQuality: {
      recordsExcludedCount: 0,
      warnings: ["One upload had incomplete status values."],
    },
    limitations: [],
    generatedAt: "2026-07-16T10:00:00.000Z",
    createdAt: "2026-07-16T10:00:00.000Z",
    updatedAt: "2026-07-16T10:00:00.000Z",
  };
}

describe("analyticsDashboardExport", () => {
  it("builds export sections from the visible dashboard layout", () => {
    const exportDocument = buildAnalyticsDashboardExportDocument({
      result: makeResult(),
      layoutPreference: {
        id: "layout-1",
        organizationId: "org-1",
        projectId: "project-1",
        activityId: null,
        scopeType: "PROJECT",
        dashboardSchemaVersion: "dashboard-v2",
        orderedWidgetIds: ["kpi-1", "summary-primary"],
        hiddenWidgetIds: ["summary-primary"],
        updatedById: "user-1",
        createdAt: "2026-07-16T10:00:00.000Z",
        updatedAt: "2026-07-16T10:00:00.000Z",
      },
      dashboardCompatibilitySource: "generated",
    });

    expect(exportDocument.visibleWidgetIds).toEqual(["kpi-1"]);
    expect(exportDocument.hiddenWidgetIds).toEqual(["summary-primary"]);
    expect(exportDocument.sections).toEqual([
      {
        widgetId: "kpi-1",
        kind: "kpi",
        title: "Attendance rate",
        subtitle: null,
        description: "Share of participants attending sessions.",
        lines: ["Attendance rate: 0.82 ratio"],
      },
    ]);
    expect(exportDocument.dataQualityWarnings).toEqual([
      "One upload had incomplete status values.",
    ]);
  });
});
