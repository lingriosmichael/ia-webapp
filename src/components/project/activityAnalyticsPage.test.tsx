import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalyticsQueryResponse } from "@/services/apiClient";

const routeState = vi.hoisted(() => ({
  auth: { token: "token" },
  projectQuery: { isLoading: false, data: { id: "project-1" } },
  activityQuery: {
    isLoading: false,
    data: { id: "activity-1", name: "Mentoring activity" },
  },
  analyticsQuery: {
    isLoading: false,
    isError: false,
    data: null as AnalyticsQueryResponse | null,
  },
  interpretationsQuery: {
    isLoading: false,
    isError: false,
    data: { results: [{ activityId: "activity-1" }] },
  },
}));

vi.mock("@tanstack/react-router", () => ({
  useParams: () => ({ projectId: "project-1", activityId: "activity-1" }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        "activityAnalytics.loading": "Loading analytics…",
        "activityAnalytics.loadFailed": "Analytics could not be loaded.",
        "activityAnalytics.eyebrow": "Activity analytics",
        "activityAnalytics.title": "Analysis",
        "activityAnalytics.crumb": "Analysis",
        "activityAnalytics.noVerifiedEvidenceCta": "Back to Activities",
      })[key] ?? key,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useRequireAuth: () => routeState.auth,
}));

vi.mock("@/hooks/useAnalyticsDashboardInteractionTracking", () => ({
  useActivityAnalyticsDashboardInteractionTracking: () => undefined,
}));

vi.mock("@/hooks/useWorkspaceQueries", () => ({
  useProjectQuery: () => routeState.projectQuery,
  useActivityQuery: () => routeState.activityQuery,
  useActivityAnalyticsQuery: () => routeState.analyticsQuery,
  useProjectInterpretationsQuery: () => routeState.interpretationsQuery,
  useGenerateActivityAnalyticsMutation: () => ({
    mutate: () => undefined,
    isPending: false,
  }),
  useUpdateActivityAnalyticsLayoutMutation: () => ({
    mutate: () => undefined,
    isPending: false,
  }),
  useResetActivityAnalyticsLayoutMutation: () => ({
    mutate: () => undefined,
    isPending: false,
  }),
}));

vi.mock("@/lib/interpretationWorkflow", () => ({
  deriveAnalyticsReadinessSummary: () => ({ status: "ready" }),
}));

vi.mock("@/hooks/useAnalyticsEmptyStateContent", () => ({
  useAnalyticsEmptyStateContent: () => ({
    title: "No verified evidence yet",
    description: "This activity has no verified structured evidence yet.",
    showCta: true,
  }),
}));

vi.mock("@/contexts/projectWorkspaceContext", () => ({
  useProjectHierarchy: () => ({
    organizationCrumb: { label: "Org" },
    projectsCrumb: { label: "Projects" },
    projectCrumb: { label: "Project" },
    activitiesLabel: "Activities",
  }),
}));

vi.mock("@/components/workspaceUI", () => ({
  TopBar: ({ children }: { children?: ReactNode }) => (
    <div>Top bar {children}</div>
  ),
  PageContainer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  PageHeader: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/activityTabs", () => ({
  ActivityTabs: () => <div>Activity tabs</div>,
}));

vi.mock("@/components/analytics/analyticsEmptyState", () => ({
  analyticsCtaLinkClassName: "cta",
  AnalyticsEmptyState: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div>
      Empty state {title} {description}
    </div>
  ),
  AnalyticsErrorState: ({ label }: { label: ReactNode }) => <div>{label}</div>,
}));

vi.mock("@/components/analytics/analyticsStatusBanner", () => ({
  AnalyticsStatusBanner: () => <div>Status banner</div>,
}));

vi.mock("@/components/analytics/configurableAnalyticsDashboard", () => ({
  ConfigurableAnalyticsDashboard: () => <div>Activity dashboard rendered</div>,
}));

import { ActivityAnalyticsPage } from "./activityAnalyticsPage";

function makeAnalyticsResponse(entryCount: number): AnalyticsQueryResponse {
  return {
    execution: {
      id: "execution-1",
      organizationId: "org-1",
      projectId: "project-1",
      activityId: "activity-1",
      scopeType: "ACTIVITY",
      status: "COMPLETED",
      startedAt: "2026-07-16T10:00:00.000Z",
      completedAt: "2026-07-16T10:01:00.000Z",
      errorCode: null,
      errorMessage: null,
      createdAt: "2026-07-16T10:00:00.000Z",
      updatedAt: "2026-07-16T10:01:00.000Z",
    },
    result: {
      id: "result-1",
      analyticsExecutionId: "execution-1",
      organizationId: "org-1",
      projectId: "project-1",
      activityId: "activity-1",
      scopeType: "ACTIVITY",
      catalogVersion: "3.0",
      knowledgeModelVersion: 1,
      catalog: {
        catalogVersion: "3.0",
        knowledgeModelVersion: 1,
        scope: {
          type: "ACTIVITY",
          projectId: "project-1",
          activityId: "activity-1",
        },
        entries: Array.from({ length: entryCount }, (_, index) => ({
          entryId: `metric-${index}`,
          entryType: "METRIC" as const,
          label: `Metric ${index}`,
          description: "Metric",
          value: 1,
          unit: "count",
          deduplicationConfidence: "not_applicable" as const,
          activityId: "activity-1",
          provenance: {
            knowledgeEntityId: `entity-${index}`,
            uploadMetadataId: `upload-${index}`,
            interpretationResultId: `interpretation-${index}`,
            sourceReference: `Metric ${index}`,
          },
        })),
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
        availableWidgets: [],
        defaultLayout: { orderedWidgetIds: [], hiddenWidgetIds: [] },
      },
      dataQuality: { recordsExcludedCount: 0, warnings: [] },
      limitations: [],
      generatedAt: "2026-07-16T10:01:00.000Z",
      createdAt: "2026-07-16T10:01:00.000Z",
      updatedAt: "2026-07-16T10:01:00.000Z",
    },
    layoutPreference: null,
    dashboardCompatibilitySource: null,
    dashboardUsageSummary: null,
  };
}

describe("Activity analytics route smoke", () => {
  beforeEach(() => {
    routeState.auth = { token: "token" };
    routeState.projectQuery = { isLoading: false, data: { id: "project-1" } };
    routeState.activityQuery = {
      isLoading: false,
      data: { id: "activity-1", name: "Mentoring activity" },
    };
    routeState.analyticsQuery = {
      isLoading: false,
      isError: false,
      data: makeAnalyticsResponse(1),
    };
    routeState.interpretationsQuery = {
      isLoading: false,
      isError: false,
      data: { results: [{ activityId: "activity-1" }] },
    };
  });

  it("renders the activity dashboard when a completed analytics result exists", () => {
    const markup = renderToStaticMarkup(<ActivityAnalyticsPage />);
    expect(markup).toContain("Activity dashboard rendered");
    expect(markup).toContain("Status banner");
  });

  it("renders the empty state when the activity has no catalog entries", () => {
    routeState.analyticsQuery.data = makeAnalyticsResponse(0);

    const markup = renderToStaticMarkup(<ActivityAnalyticsPage />);

    expect(markup).toContain("Empty state");
    expect(markup).not.toContain("Activity dashboard rendered");
  });
});
