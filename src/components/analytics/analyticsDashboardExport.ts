import en from "@/locales/en";
import type {
  AnalyticsDashboardCompatibilitySource,
  AnalyticsDashboardPreferenceRecord,
  AnalyticsDashboardWidget,
  AnalyticsResultRecord,
} from "@/services/apiClient";
import {
  resolveAnalyticsDashboard,
  resolveDashboardLayout,
} from "./analyticsDashboardLayout";

export interface AnalyticsDashboardExportSection {
  widgetId: string;
  kind: AnalyticsDashboardWidget["kind"];
  title: string;
  subtitle: string | null;
  description: string;
  lines: string[];
}

export interface AnalyticsDashboardExportDocument {
  resultId: string;
  projectId: string;
  activityId: string | null;
  scopeType: AnalyticsResultRecord["scopeType"];
  dashboardSchemaVersion: string;
  dashboardCompatibilitySource: AnalyticsDashboardCompatibilitySource;
  visibleWidgetIds: string[];
  hiddenWidgetIds: string[];
  sections: AnalyticsDashboardExportSection[];
  dataQualityWarnings: string[];
}

interface AnalyticsDashboardExportCopy {
  title: string;
  scopeLabel: string;
  projectLabel: string;
  activityLabel: string;
  schemaLabel: string;
  compatibilitySourceLabel: string;
  dataQualityWarningsTitle: string;
}

function getDefaultExportCopy(): AnalyticsDashboardExportCopy {
  return {
    title: en.analytics.dashboard.exportDocumentTitle,
    scopeLabel: en.analytics.dashboard.exportDocumentScopeLabel,
    projectLabel: en.analytics.dashboard.exportDocumentProjectLabel,
    activityLabel: en.analytics.dashboard.exportDocumentActivityLabel,
    schemaLabel: en.analytics.dashboard.exportDocumentSchemaLabel,
    compatibilitySourceLabel:
      en.analytics.dashboard.exportDocumentCompatibilitySourceLabel,
    dataQualityWarningsTitle:
      en.analytics.dashboard.exportDocumentWarningsTitle,
  };
}

function buildSectionLines(widget: AnalyticsDashboardWidget): string[] {
  switch (widget.kind) {
    case "kpi":
      return [
        `${widget.label}: ${widget.value}${widget.unit ? ` ${widget.unit}` : ""}`,
      ];
    case "summary":
      return widget.paragraphs;
    case "horizontal_bar":
    case "category_rank":
      return widget.items.map((item) => `${item.label}: ${item.value}`);
    case "line_series":
      return widget.points.map((point) => `${point.label}: ${point.value}`);
    case "theme_list":
      return widget.items.map((item) => item.description);
  }
}

export function buildAnalyticsDashboardExportDocument(params: {
  result: AnalyticsResultRecord;
  layoutPreference: AnalyticsDashboardPreferenceRecord | null;
  dashboardCompatibilitySource?: AnalyticsDashboardCompatibilitySource | null;
}): AnalyticsDashboardExportDocument {
  const resolvedDashboard = resolveAnalyticsDashboard({
    result: params.result,
    dashboardCompatibilitySource: params.dashboardCompatibilitySource,
  });
  const layout = resolveDashboardLayout({
    dashboard: resolvedDashboard.dashboard,
    preference: params.layoutPreference,
  });

  return {
    resultId: params.result.id,
    projectId: params.result.projectId,
    activityId: params.result.activityId,
    scopeType: params.result.scopeType,
    dashboardSchemaVersion: resolvedDashboard.dashboard.schemaVersion,
    dashboardCompatibilitySource: resolvedDashboard.compatibilitySource,
    visibleWidgetIds: layout.visibleWidgets.map((widget) => widget.widgetId),
    hiddenWidgetIds: layout.hiddenWidgetIds,
    sections: layout.visibleWidgets.map((widget) => ({
      widgetId: widget.widgetId,
      kind: widget.kind,
      title: widget.title,
      subtitle: widget.subtitle,
      description: widget.description,
      lines: buildSectionLines(widget),
    })),
    dataQualityWarnings: params.result.dataQuality.warnings,
  };
}

export function renderAnalyticsDashboardExportDocumentText(
  document: AnalyticsDashboardExportDocument,
  copy: AnalyticsDashboardExportCopy = getDefaultExportCopy(),
) {
  return [
    copy.title,
    `${copy.scopeLabel}: ${document.scopeType}`,
    `${copy.projectLabel}: ${document.projectId}`,
    document.activityId
      ? `${copy.activityLabel}: ${document.activityId}`
      : null,
    `${copy.schemaLabel}: ${document.dashboardSchemaVersion}`,
    `${copy.compatibilitySourceLabel}: ${document.dashboardCompatibilitySource}`,
    "",
    ...document.sections.flatMap((section) => [
      `${section.title}`,
      section.subtitle,
      section.description,
      ...section.lines.map((line) => `- ${line}`),
      "",
    ]),
    ...(document.dataQualityWarnings.length > 0
      ? [
          copy.dataQualityWarningsTitle,
          ...document.dataQualityWarnings.map((warning) => `- ${warning}`),
        ]
      : []),
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
