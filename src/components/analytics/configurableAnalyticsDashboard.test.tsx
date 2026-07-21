import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { AnalyticsResultRecord } from "@/services/apiClient";
import { ConfigurableAnalyticsDashboard } from "./configurableAnalyticsDashboard";

vi.mock("react-i18next", () => {
  const translations: Record<string, string> = {
    "analytics.dashboard.eyebrow": "Configurable dashboard",
    "analytics.dashboard.title": "Evidence dashboard",
    "analytics.dashboard.compatibilityFallback": "Legacy analytics record",
    "analytics.dashboard.exportLabel": "Export",
    "analytics.dashboard.exportJson": "Export JSON",
    "analytics.dashboard.exportText": "Export text",
    "analytics.dashboard.showCustomizer": "Customize widgets",
    "analytics.dashboard.hideCustomizer": "Hide customizer",
    "analytics.dashboard.restoreRecommended": "Restore recommended layout",
    "analytics.dashboard.fallbackSummaryTitle": "In plain language",
    "analytics.dashboard.summaryEyebrow": "Plain-language view",
    "analytics.dashboard.comparisonTitle": "Comparable metrics",
    "analytics.dashboard.timelineTitle": "Timeline",
    "analytics.dashboard.rankTitle": "Strongest segments",
    "analytics.dashboard.hiddenWidgetsDescription":
      "Keep this area compact, then review hidden widgets in a clearer library with labels, context, and restore actions.",
    "analytics.dashboard.hiddenWidgetsPreview": "Recently hidden",
    "analytics.dashboard.hiddenWidgetsManage": "Browse hidden widgets",
    "analytics.dashboard.hiddenWidgetTypeThemeList": "Theme list",
    "analytics.dashboard.themesTitle": "Qualitative signals",
    "analytics.dashboard.usageTitle": "Dashboard usage",
    "analytics.dashboard.usageDescription":
      "Internal telemetry from this dashboard view, based on persisted widget interactions.",
    "analytics.dashboard.usageViews": "Views",
    "analytics.dashboard.usageHidden": "Hidden",
    "analytics.dashboard.usageShown": "Shown",
    "analytics.dashboard.usageReordered": "Reordered",
    "analytics.dashboard.usageRestored": "Restored",
    "analytics.dashboard.usageEmpty":
      "No dashboard interactions have been recorded yet.",
    "analytics.dashboard.usageNoDate": "No data yet",
  };

  return {
    useTranslation: () => ({
      i18n: { language: "en" },
      t: (key: string, options?: Record<string, unknown>) => {
        if (key === "analytics.dashboard.hiddenWidgetsTitle") {
          return `${options?.count} hidden widget`;
        }
        if (key === "analytics.quoteCount") {
          return `${options?.count} supporting quotes`;
        }
        if (key === "analytics.dashboard.goalLinked") {
          return `Goal-linked: ${options?.value}`;
        }
        if (key === "analytics.dashboard.usageLastViewed") {
          return `Last viewed: ${options?.value}`;
        }
        if (key === "analytics.dashboard.usageLastUpdated") {
          return `Last interaction: ${options?.value}`;
        }
        return translations[key] ?? key;
      },
    }),
  };
});

vi.mock("@/components/ui/dropdownMenu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
  }: {
    children: ReactNode;
    onSelect?: () => void;
  }) => <button type="button">{children}</button>,
}));

vi.mock("@/components/analytics/catalogDetailsSection", () => ({
  CatalogDetailsSection: () => <div>Catalog details placeholder</div>,
}));

vi.mock("./aiCuratedBadge", () => ({
  AiCuratedBadge: () => <div>AI-curated</div>,
}));

vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PointerSensor: class PointerSensor {},
  closestCenter: {},
  useSensor: () => ({}),
  useSensors: () => [],
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  arrayMove: <T,>(items: T[]) => items,
  rectSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => undefined,
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div data-chart="responsive">{children}</div>
  ),
  BarChart: ({ children }: { children: ReactNode }) => (
    <div data-chart="bar">{children}</div>
  ),
  LineChart: ({ children }: { children: ReactNode }) => (
    <div data-chart="line">{children}</div>
  ),
  CartesianGrid: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Bar: () => <div />,
  Cell: () => <div />,
  Line: () => <div />,
}));

function makeResult(
  dashboard: AnalyticsResultRecord["dashboard"],
): AnalyticsResultRecord {
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
          text: "Attendance held steady while onboarding remained compressed.",
          referencedEntryIds: ["metric-1", "theme-1"],
        },
      ],
      groundingStatus: "PASSED",
      groundingRetryCount: 0,
      curatorModelVersion: "curator-prompt-v1",
      fellBackToSelectionOnly: false,
    },
    dashboard,
    dataQuality: {
      recordsExcludedCount: 0,
      warnings: ["Sample coverage is partial."],
    },
    limitations: [],
    generatedAt: "2026-07-16T10:00:00.000Z",
    createdAt: "2026-07-16T10:00:00.000Z",
    updatedAt: "2026-07-16T10:00:00.000Z",
  };
}

describe("ConfigurableAnalyticsDashboard", () => {
  it("renders fallback dashboard content, compatibility badge, hidden widgets, and empty usage state", () => {
    const markup = renderToStaticMarkup(
      <ConfigurableAnalyticsDashboard
        result={makeResult(null)}
        layoutPreference={{
          id: "layout-1",
          organizationId: "org-1",
          projectId: "project-1",
          activityId: null,
          scopeType: "PROJECT",
          dashboardSchemaVersion: "dashboard-fallback-v1",
          orderedWidgetIds: [
            "summary-fallback",
            "theme-list-fallback",
            "kpi-metric-1",
          ],
          hiddenWidgetIds: ["theme-list-fallback"],
          updatedById: "user-1",
          createdAt: "2026-07-16T10:00:00.000Z",
          updatedAt: "2026-07-16T10:00:00.000Z",
        }}
        dashboardCompatibilitySource="compatibility_fallback"
        dashboardUsageSummary={null}
        onSaveLayout={() => undefined}
        onResetLayout={() => undefined}
        onExport={async () => new Blob(["test"])}
        isSavingLayout={false}
        isResettingLayout={false}
      />,
    );

    expect(markup).toContain("Legacy analytics record");
    expect(markup).toContain("In plain language");
    expect(markup).toContain(
      "Attendance held steady while onboarding remained compressed.",
    );
    expect(markup).toContain("1 hidden widget");
    expect(markup).toContain("Qualitative signals");
    expect(markup).toContain(
      "Keep this area compact, then review hidden widgets in a clearer library with labels, context, and restore actions.",
    );
    expect(markup).toContain("Browse hidden widgets");
    expect(markup).toContain("Recently hidden");
    expect(markup).toContain("Qualitative signals");
    expect(markup).toContain(
      "No dashboard interactions have been recorded yet.",
    );
  });
});
