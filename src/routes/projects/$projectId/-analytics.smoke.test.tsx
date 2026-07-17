import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalyticsQueryResponse } from "@/services/apiClient";

const routeState = vi.hoisted(() => ({
  auth: { token: "token" },
  analyticsQuery: {
    isLoading: false,
    isError: false,
    data: null as AnalyticsQueryResponse | null,
  },
  interpretationsQuery: {
    isLoading: false,
    isError: false,
    data: { results: [] as Array<{ activityId: string | null }> },
  },
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({
    component: null,
    useParams: () => ({ projectId: "project-1" }),
  }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        "projectAnalytics.loading": "Loading analytics…",
        "projectAnalytics.loadFailed": "Analytics could not be loaded.",
        "projectAnalytics.subtitle":
          "Analytics are based exclusively on verified, structured evidence.",
        "projectAnalytics.noVerifiedEvidenceCta": "Go to Interpretation",
      })[key] ?? key,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useRequireAuth: () => routeState.auth,
}));

vi.mock("@/hooks/useAnalyticsDashboardInteractionTracking", () => ({
  useProjectAnalyticsDashboardInteractionTracking: () => undefined,
}));

vi.mock("@/hooks/useWorkspaceQueries", () => ({
  useProjectAnalyticsQuery: () => routeState.analyticsQuery,
  useProjectInterpretationsQuery: () => routeState.interpretationsQuery,
  useGenerateProjectAnalyticsMutation: () => ({
    mutate: () => undefined,
    isPending: false,
  }),
  useUpdateProjectAnalyticsLayoutMutation: () => ({
    mutate: () => undefined,
    isPending: false,
  }),
  useResetProjectAnalyticsLayoutMutation: () => ({
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
    description: "This project has no verified structured evidence yet.",
    showCta: true,
  }),
}));

vi.mock("@/components/project/projectWorkspaceShell", () => ({
  ProjectWorkspaceShell: ({ children }: { children: ReactNode }) => (
    <div>Project shell {children}</div>
  ),
}));

vi.mock("@/components/analytics/analyticsEmptyState", () => ({
  analyticsCtaLinkClassName: "cta",
  AnalyticsEmptyState: ({
    title,
    description,
    cta,
  }: {
    title: string;
    description: string;
    cta?: ReactNode;
  }) => (
    <div>
      Empty state {title} {description} {cta}
    </div>
  ),
}));

vi.mock("@/components/analytics/analyticsStatusBanner", () => ({
  AnalyticsStatusBanner: () => <div>Status banner</div>,
}));

vi.mock("@/components/analytics/configurableAnalyticsDashboard", () => ({
  ConfigurableAnalyticsDashboard: () => <div>Dashboard rendered</div>,
}));

import { ProjectAnalyticsPage } from "./analytics";

function makeAnalyticsResponse(entryCount: number): AnalyticsQueryResponse {
  return {
    execution: {
      id: "execution-1",
      organizationId: "org-1",
      projectId: "project-1",
      activityId: null,
      scopeType: "PROJECT",
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
      activityId: null,
      scopeType: "PROJECT",
      catalogVersion: "3.0",
      knowledgeModelVersion: 1,
      catalog: {
        catalogVersion: "3.0",
        knowledgeModelVersion: 1,
        scope: { type: "PROJECT", projectId: "project-1", activityId: null },
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

describe("Project analytics route smoke", () => {
  beforeEach(() => {
    routeState.auth = { token: "token" };
    routeState.analyticsQuery = {
      isLoading: false,
      isError: false,
      data: makeAnalyticsResponse(1),
    };
    routeState.interpretationsQuery = {
      isLoading: false,
      isError: false,
      data: { results: [] },
    };
  });

  it("renders the dashboard when a completed analytics result exists", () => {
    const markup = renderToStaticMarkup(<ProjectAnalyticsPage />);
    expect(markup).toContain("Dashboard rendered");
    expect(markup).toContain("Status banner");
  });

  it("renders the empty state when no catalog entries are available", () => {
    routeState.analyticsQuery.data = makeAnalyticsResponse(0);

    const markup = renderToStaticMarkup(<ProjectAnalyticsPage />);

    expect(markup).toContain("Empty state");
    expect(markup).not.toContain("Dashboard rendered");
  });
});
