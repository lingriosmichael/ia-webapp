import en from "@/locales/en";
import type {
  AnalyticsDashboard,
  AnalyticsDashboardCompatibilitySource,
  AnalyticsDashboardLayoutDefinition,
  AnalyticsDashboardPreferenceRecord,
  AnalyticsDashboardWidget,
  AnalyticsResultRecord,
  EvidenceCatalogMetricEntry,
  EvidenceCatalogThemeEntry,
} from "@/services/apiClient";

export interface AnalyticsDashboardFallbackCopy {
  summaryTitle: string;
  summaryDescription: string;
  themeListTitle: string;
  themeListDescription: string;
}

function getDefaultFallbackCopy(): AnalyticsDashboardFallbackCopy {
  return {
    summaryTitle: en.analytics.dashboard.summaryEyebrow,
    summaryDescription: en.analytics.dashboard.fallbackSummaryDescription,
    themeListTitle: en.analytics.dashboard.themesTitle,
    themeListDescription: en.analytics.dashboard.fallbackThemesDescription,
  };
}

const DEFAULT_WIDGET_KIND_PRIORITY: Record<
  AnalyticsDashboardWidget["kind"],
  number
> = {
  kpi: 0,
  horizontal_bar: 1,
  line_series: 2,
  category_rank: 3,
  summary: 4,
  theme_list: 5,
};

function uniqueWidgetIds(widgetIds: string[]) {
  return [...new Set(widgetIds)];
}

function normalizeDefaultWidgetOrder(
  dashboard: AnalyticsDashboard,
): AnalyticsDashboard {
  const availableWidgetMap = new Map(
    dashboard.availableWidgets.map(
      (widget) => [widget.widgetId, widget] as const,
    ),
  );
  const availableWidgetIds = dashboard.availableWidgets.map(
    (widget) => widget.widgetId,
  );
  const orderedWidgetIds = uniqueWidgetIds([
    ...dashboard.defaultLayout.orderedWidgetIds,
    ...availableWidgetIds,
  ]).filter((widgetId) => availableWidgetMap.has(widgetId));
  const originalIndexByWidgetId = new Map(
    orderedWidgetIds.map((widgetId, index) => [widgetId, index] as const),
  );
  const normalizedOrderedWidgetIds = [...orderedWidgetIds].sort(
    (left, right) => {
      const leftWidget = availableWidgetMap.get(left);
      const rightWidget = availableWidgetMap.get(right);

      if (!leftWidget || !rightWidget) {
        return 0;
      }

      const leftPriority = DEFAULT_WIDGET_KIND_PRIORITY[leftWidget.kind];
      const rightPriority = DEFAULT_WIDGET_KIND_PRIORITY[rightWidget.kind];

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return (
        (originalIndexByWidgetId.get(left) ?? 0) -
        (originalIndexByWidgetId.get(right) ?? 0)
      );
    },
  );

  return {
    ...dashboard,
    defaultLayout: {
      orderedWidgetIds: normalizedOrderedWidgetIds,
      hiddenWidgetIds: uniqueWidgetIds(
        dashboard.defaultLayout.hiddenWidgetIds,
      ).filter((widgetId) => availableWidgetMap.has(widgetId)),
    },
  };
}

function isLegacyComparableHorizontalBar(widget: AnalyticsDashboardWidget) {
  return (
    widget.kind === "horizontal_bar" &&
    widget.widgetId.startsWith("horizontal-bar-") &&
    widget.items.some((item) => item.entryId !== null)
  );
}

function removeUnsafeComparableWidgets(
  dashboard: AnalyticsDashboard,
): AnalyticsDashboard {
  const hasReplacementCharts = dashboard.availableWidgets.some(
    (widget) =>
      widget.kind === "line_series" || widget.kind === "category_rank",
  );

  if (!hasReplacementCharts) {
    return dashboard;
  }

  const availableWidgets = dashboard.availableWidgets.filter(
    (widget) => !isLegacyComparableHorizontalBar(widget),
  );

  if (availableWidgets.length === dashboard.availableWidgets.length) {
    return dashboard;
  }

  const availableWidgetIds = new Set(
    availableWidgets.map((widget) => widget.widgetId),
  );

  return {
    ...dashboard,
    availableWidgets,
    defaultLayout: {
      orderedWidgetIds: dashboard.defaultLayout.orderedWidgetIds.filter(
        (widgetId) => availableWidgetIds.has(widgetId),
      ),
      hiddenWidgetIds: dashboard.defaultLayout.hiddenWidgetIds.filter(
        (widgetId) => availableWidgetIds.has(widgetId),
      ),
    },
  };
}

export const FALLBACK_ANALYTICS_DASHBOARD_SCHEMA_VERSION =
  "dashboard-fallback-v1";

export function createFallbackDashboard(
  result: AnalyticsResultRecord,
  copy: AnalyticsDashboardFallbackCopy = getDefaultFallbackCopy(),
): AnalyticsDashboard {
  const metrics = result.catalog.entries.filter(
    (entry): entry is EvidenceCatalogMetricEntry =>
      entry.entryType === "METRIC",
  );
  const themes = result.catalog.entries.filter(
    (entry): entry is EvidenceCatalogThemeEntry =>
      entry.entryType === "QUALITATIVE_THEME",
  );
  const widgetIds: string[] = [];
  const availableWidgets: AnalyticsDashboardWidget[] = metrics
    .slice(0, 4)
    .map((entry) => {
      const widgetId = `kpi-${entry.entryId}`;
      widgetIds.push(widgetId);
      return {
        widgetId,
        kind: "kpi",
        title: entry.label,
        subtitle: null,
        description: entry.description,
        sourceActivityIds: [entry.activityId],
        sourceUploadMetadataIds: [entry.provenance.uploadMetadataId],
        goalLinkage: {
          outcomeReferences: [],
          successIndicators: [],
          matchedProjectGoalPhrases: [],
        },
        qualityFlags: [],
        entryId: entry.entryId,
        label: entry.label,
        value: entry.value,
        unit: entry.unit,
        deduplicationConfidence: entry.deduplicationConfidence,
      };
    });

  if (result.curation.narrative.length > 0) {
    const widgetId = "summary-fallback";
    widgetIds.push(widgetId);
    availableWidgets.push({
      widgetId,
      kind: "summary",
      title: copy.summaryTitle,
      subtitle: null,
      description: copy.summaryDescription,
      sourceActivityIds: [],
      sourceUploadMetadataIds: [],
      goalLinkage: {
        outcomeReferences: [],
        successIndicators: [],
        matchedProjectGoalPhrases: [],
      },
      qualityFlags: [],
      paragraphs: result.curation.narrative.map((item) => item.text),
      referencedEntryIds: result.curation.narrative.flatMap(
        (item) => item.referencedEntryIds,
      ),
    });
  }

  if (themes.length > 0) {
    const widgetId = "theme-list-fallback";
    widgetIds.push(widgetId);
    availableWidgets.push({
      widgetId,
      kind: "theme_list",
      title: copy.themeListTitle,
      subtitle: null,
      description: copy.themeListDescription,
      sourceActivityIds: themes.flatMap((theme) => theme.sourceActivityIds),
      sourceUploadMetadataIds: themes.flatMap(
        (theme) => theme.sourceUploadMetadataIds,
      ),
      goalLinkage: {
        outcomeReferences: themes.flatMap((theme) => theme.outcomeReferences),
        successIndicators: [],
        matchedProjectGoalPhrases: [],
      },
      qualityFlags: [],
      items: themes.slice(0, 4).map((theme) => ({
        entryId: theme.entryId,
        label: theme.label,
        description: theme.description,
        quoteCount: theme.quoteCount,
        outcomeReference: theme.outcomeReferences[0] ?? null,
      })),
    });
  }

  const dashboard: AnalyticsDashboard = {
    schemaVersion: FALLBACK_ANALYTICS_DASHBOARD_SCHEMA_VERSION,
    availableWidgets,
    defaultLayout: {
      orderedWidgetIds: widgetIds,
      hiddenWidgetIds: [],
    },
  };

  return normalizeDefaultWidgetOrder(dashboard);
}

export function resolveAnalyticsDashboard(params: {
  result: AnalyticsResultRecord;
  dashboardCompatibilitySource?: AnalyticsDashboardCompatibilitySource | null;
  fallbackCopy?: AnalyticsDashboardFallbackCopy;
}) {
  if (params.result.dashboard) {
    return {
      dashboard: normalizeDefaultWidgetOrder(
        removeUnsafeComparableWidgets(params.result.dashboard),
      ),
      compatibilitySource:
        params.dashboardCompatibilitySource ?? ("generated" as const),
    };
  }

  return {
    dashboard: createFallbackDashboard(
      params.result,
      params.fallbackCopy ?? getDefaultFallbackCopy(),
    ),
    compatibilitySource: "compatibility_fallback" as const,
  };
}

export function resolveDashboardLayout(params: {
  dashboard: AnalyticsDashboard;
  preference: AnalyticsDashboardPreferenceRecord | null;
}) {
  const availableWidgetMap = new Map(
    params.dashboard.availableWidgets.map((widget) => [
      widget.widgetId,
      widget,
    ]),
  );
  const availableWidgetIds = params.dashboard.availableWidgets.map(
    (widget) => widget.widgetId,
  );
  const layoutSource: AnalyticsDashboardLayoutDefinition =
    params.preference &&
    params.preference.dashboardSchemaVersion === params.dashboard.schemaVersion
      ? {
          orderedWidgetIds: params.preference.orderedWidgetIds,
          hiddenWidgetIds: params.preference.hiddenWidgetIds,
        }
      : params.dashboard.defaultLayout;

  const orderedWidgetIds = [
    ...uniqueWidgetIds(
      layoutSource.orderedWidgetIds.filter((widgetId) =>
        availableWidgetMap.has(widgetId),
      ),
    ),
    ...availableWidgetIds.filter(
      (widgetId) => !layoutSource.orderedWidgetIds.includes(widgetId),
    ),
  ];
  const hiddenWidgetIds = uniqueWidgetIds(layoutSource.hiddenWidgetIds).filter(
    (widgetId) => availableWidgetMap.has(widgetId),
  );
  const visibleWidgets = orderedWidgetIds
    .filter((widgetId) => !hiddenWidgetIds.includes(widgetId))
    .map((widgetId) => availableWidgetMap.get(widgetId))
    .filter((widget): widget is AnalyticsDashboardWidget => Boolean(widget));
  const hiddenWidgets = orderedWidgetIds
    .filter((widgetId) => hiddenWidgetIds.includes(widgetId))
    .map((widgetId) => availableWidgetMap.get(widgetId))
    .filter((widget): widget is AnalyticsDashboardWidget => Boolean(widget));

  return {
    orderedWidgetIds,
    hiddenWidgetIds,
    visibleWidgets,
    hiddenWidgets,
  };
}
