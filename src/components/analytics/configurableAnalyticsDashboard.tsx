import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BarChart3,
  Download,
  EyeOff,
  FileJson,
  FileText,
  GripVertical,
  LineChart as LineChartIcon,
  ListTree,
  Quote,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Bar,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/workspaceUI";
import { resolveCategoryLabels } from "@/lib/analyticsCategoryLabel";
import { cn } from "@/lib/utils";
import type {
  AnalyticsDashboard,
  AnalyticsDashboardCategoryRankWidget,
  AnalyticsDashboardCompatibilitySource,
  AnalyticsDashboardExportRequestPayload,
  AnalyticsDashboardHorizontalBarWidget,
  AnalyticsDashboardKpiWidget,
  AnalyticsDashboardLineSeriesWidget,
  AnalyticsDashboardPreferenceRecord,
  AnalyticsDashboardSummaryWidget,
  AnalyticsDashboardUsageSummary,
  AnalyticsDashboardThemeListWidget,
  AnalyticsDashboardWidget,
  AnalyticsDashboardWidgetKind,
  AnalyticsResultRecord,
  UpdateAnalyticsDashboardPreferencePayload,
} from "@/services/apiClient";
import { AiCuratedBadge } from "./aiCuratedBadge";
import { formatMetricValue } from "./analyticsFormat";
import { CatalogDetailsSection } from "./catalogDetailsSection";
import {
  type AnalyticsDashboardFallbackCopy,
  resolveAnalyticsDashboard,
  resolveDashboardLayout,
} from "./analyticsDashboardLayout";
import { recordAnalyticsDashboardInteraction } from "./analyticsDashboardInstrumentation";

const MAX_Y_AXIS_LABEL_LINE_LENGTH = 18;
const MAX_Y_AXIS_LABEL_LINES = 3;
const MIN_HORIZONTAL_BAR_CHART_HEIGHT = 280;
const HORIZONTAL_BAR_ROW_HEIGHT = 56;
const MIN_HORIZONTAL_BAR_Y_AXIS_WIDTH = 150;
const MAX_HORIZONTAL_BAR_Y_AXIS_WIDTH = 240;

// Bar shade constants below must stay in sync with the OKLCH triples
// defined for --chart-1 / --chart-3 in src/styles.css.
const HORIZONTAL_BAR_BASE_COLOR = { l: 0.55, c: 0.22, h: 295 };
const CATEGORY_RANK_BASE_COLOR = { l: 0.7, c: 0.16, h: 180 };
const MIN_BAR_LIGHTNESS = 0.4;
const MAX_BAR_LIGHTNESS = 0.82;
const HIDDEN_WIDGET_KIND_ORDER: AnalyticsDashboardWidgetKind[] = [
  "horizontal_bar",
  "line_series",
  "category_rank",
  "kpi",
  "theme_list",
  "summary",
];

function getSequentialBarShade(
  base: { l: number; c: number; h: number },
  index: number,
  count: number,
): string {
  const position = count <= 1 ? 0 : index / (count - 1);
  const lightness =
    MIN_BAR_LIGHTNESS + position * (MAX_BAR_LIGHTNESS - MIN_BAR_LIGHTNESS);
  return `oklch(${lightness} ${base.c} ${base.h})`;
}

function wrapChartLabel(
  label: string,
  maxLineLength = MAX_Y_AXIS_LABEL_LINE_LENGTH,
  maxLines = MAX_Y_AXIS_LABEL_LINES,
): string[] {
  const normalizedLabel = label.replace(/\s+/g, " ").trim();
  if (normalizedLabel.length === 0) {
    return [""];
  }

  const words = normalizedLabel.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidateLine = currentLine ? `${currentLine} ${word}` : word;

    if (candidateLine.length <= maxLineLength) {
      currentLine = candidateLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word.slice(0, maxLineLength - 1).trimEnd() + "…");
      currentLine = "";
    }

    if (lines.length >= maxLines) {
      return lines.slice(0, maxLines);
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  return [
    ...lines.slice(0, maxLines - 1),
    `${lines[maxLines - 1]?.slice(0, maxLineLength - 1).trimEnd() ?? ""}…`,
  ];
}

function getHorizontalBarChartHeight(labels: string[]): number {
  return Math.max(
    MIN_HORIZONTAL_BAR_CHART_HEIGHT,
    labels.length * HORIZONTAL_BAR_ROW_HEIGHT,
  );
}

function getHorizontalBarYAxisWidth(labels: string[]): number {
  const longestWrappedLineLength = labels.reduce((longestLineLength, label) => {
    const wrappedLineLength = wrapChartLabel(label).reduce(
      (longestWrappedLineLength, line) =>
        Math.max(longestWrappedLineLength, line.length),
      0,
    );

    return Math.max(longestLineLength, wrappedLineLength);
  }, 0);

  return Math.min(
    MAX_HORIZONTAL_BAR_Y_AXIS_WIDTH,
    Math.max(
      MIN_HORIZONTAL_BAR_Y_AXIS_WIDTH,
      longestWrappedLineLength * 7 + 28,
    ),
  );
}

function MultilineYAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string };
}) {
  const lines = wrapChartLabel(payload?.value ?? "");
  const baseX = x ?? 0;
  const baseY = y ?? 0;

  return (
    <text
      x={baseX}
      y={baseY}
      textAnchor="end"
      fill="currentColor"
      className="text-[12px] fill-muted-foreground"
    >
      {lines.map((line, index) => (
        <tspan
          key={`${line}-${index}`}
          x={baseX}
          dy={index === 0 ? "-0.6em" : "1.1em"}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function ConfigurableAnalyticsDashboard({
  result,
  layoutPreference,
  dashboardCompatibilitySource,
  dashboardUsageSummary,
  onSaveLayout,
  onResetLayout,
  onExport,
  isSavingLayout,
  isResettingLayout,
}: {
  result: AnalyticsResultRecord;
  layoutPreference: AnalyticsDashboardPreferenceRecord | null;
  dashboardCompatibilitySource: AnalyticsDashboardCompatibilitySource | null;
  dashboardUsageSummary: AnalyticsDashboardUsageSummary | null;
  onSaveLayout: (payload: UpdateAnalyticsDashboardPreferencePayload) => void;
  onResetLayout: () => void;
  onExport: (payload: AnalyticsDashboardExportRequestPayload) => Promise<Blob>;
  isSavingLayout: boolean;
  isResettingLayout: boolean;
}) {
  const { t, i18n } = useTranslation();
  const fallbackCopy = useMemo<AnalyticsDashboardFallbackCopy>(
    () => ({
      summaryTitle: t("analytics.dashboard.fallbackSummaryTitle"),
      summaryDescription: t("analytics.dashboard.fallbackSummaryDescription"),
      themeListTitle: t("analytics.dashboard.themesTitle"),
      themeListDescription: t("analytics.dashboard.fallbackThemesDescription"),
    }),
    [t],
  );
  const resolvedDashboard = useMemo(
    () =>
      resolveAnalyticsDashboard({
        result,
        dashboardCompatibilitySource,
        fallbackCopy,
      }),
    [result, dashboardCompatibilitySource, fallbackCopy],
  );
  const dashboard = resolvedDashboard.dashboard;
  const resolvedLayoutPreference = useMemo(
    () =>
      resolveDashboardLayout({
        dashboard,
        preference: layoutPreference,
      }),
    [dashboard, layoutPreference],
  );
  const sensors = useSensors(useSensor(PointerSensor));
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isExporting, setIsExporting] = useState<"json" | "text" | null>(null);
  const buildLayoutState = (payload: {
    orderedWidgetIds: string[];
    hiddenWidgetIds: string[];
  }) => ({
    orderedWidgetIds: payload.orderedWidgetIds,
    hiddenWidgetIds: payload.hiddenWidgetIds,
    visibleWidgets: payload.orderedWidgetIds
      .filter((widgetId) => !payload.hiddenWidgetIds.includes(widgetId))
      .map((widgetId) =>
        dashboard.availableWidgets.find(
          (widget) => widget.widgetId === widgetId,
        ),
      )
      .filter((widget): widget is AnalyticsDashboardWidget => Boolean(widget)),
    hiddenWidgets: payload.orderedWidgetIds
      .filter((widgetId) => payload.hiddenWidgetIds.includes(widgetId))
      .map((widgetId) =>
        dashboard.availableWidgets.find(
          (widget) => widget.widgetId === widgetId,
        ),
      )
      .filter((widget): widget is AnalyticsDashboardWidget => Boolean(widget)),
  });
  const [layoutState, setLayoutState] = useState(
    () => resolvedLayoutPreference,
  );

  useEffect(() => {
    setLayoutState(resolvedLayoutPreference);
  }, [resolvedLayoutPreference]);

  useEffect(() => {
    recordAnalyticsDashboardInteraction({
      interactionType: "dashboard_viewed",
      resultId: result.id,
      projectId: result.projectId,
      activityId: result.activityId,
      scopeType: result.scopeType,
      dashboardSchemaVersion: dashboard.schemaVersion,
      dashboardCompatibilitySource: resolvedDashboard.compatibilitySource,
      orderedWidgetIds: resolvedLayoutPreference.orderedWidgetIds,
      hiddenWidgetIds: resolvedLayoutPreference.hiddenWidgetIds,
      visibleWidgetIds: resolvedLayoutPreference.visibleWidgets.map(
        (widget) => widget.widgetId,
      ),
      widgetId: null,
    });
  }, [
    result.id,
    result.projectId,
    result.activityId,
    result.scopeType,
    dashboard.schemaVersion,
    resolvedDashboard.compatibilitySource,
    resolvedLayoutPreference,
  ]);

  const downloadExport = async (format: "json" | "text") => {
    try {
      setIsExporting(format);
      const blob = await onExport({
        format,
        dashboardSchemaVersion: dashboard.schemaVersion,
        orderedWidgetIds: layoutState.orderedWidgetIds,
        hiddenWidgetIds: layoutState.hiddenWidgetIds,
      });
      const fileBaseName = [
        "impact-atlas-dashboard",
        result.projectId,
        result.activityId ?? result.scopeType.toLowerCase(),
      ].join("-");
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${fileBaseName}.${format === "json" ? "json" : "txt"}`;
      link.click();
      URL.revokeObjectURL(objectUrl);
      toast.success(t("analytics.dashboard.exportSuccess"));
    } catch {
      toast.error(t("analytics.dashboard.exportFailed"));
    } finally {
      setIsExporting(null);
    }
  };

  const persistLayout = (payload: {
    orderedWidgetIds: string[];
    hiddenWidgetIds: string[];
  }) => {
    setLayoutState(buildLayoutState(payload));
    onSaveLayout({
      dashboardSchemaVersion: dashboard.schemaVersion,
      orderedWidgetIds: payload.orderedWidgetIds,
      hiddenWidgetIds: payload.hiddenWidgetIds,
    });
  };

  const handleToggleWidget = (widgetId: string) => {
    const hiddenSet = new Set(layoutState.hiddenWidgetIds);
    const interactionType = hiddenSet.has(widgetId)
      ? "widget_shown"
      : "widget_hidden";
    if (hiddenSet.has(widgetId)) {
      hiddenSet.delete(widgetId);
    } else {
      hiddenSet.add(widgetId);
    }
    const nextHiddenWidgetIds = [...hiddenSet];
    recordAnalyticsDashboardInteraction({
      interactionType,
      resultId: result.id,
      projectId: result.projectId,
      activityId: result.activityId,
      scopeType: result.scopeType,
      dashboardSchemaVersion: dashboard.schemaVersion,
      dashboardCompatibilitySource: resolvedDashboard.compatibilitySource,
      orderedWidgetIds: layoutState.orderedWidgetIds,
      hiddenWidgetIds: nextHiddenWidgetIds,
      visibleWidgetIds: layoutState.orderedWidgetIds.filter(
        (currentWidgetId) => !nextHiddenWidgetIds.includes(currentWidgetId),
      ),
      widgetId,
    });
    persistLayout({
      orderedWidgetIds: layoutState.orderedWidgetIds,
      hiddenWidgetIds: nextHiddenWidgetIds,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const visibleWidgetIds = layoutState.visibleWidgets.map(
      (widget) => widget.widgetId,
    );
    const oldIndex = visibleWidgetIds.indexOf(String(active.id));
    const newIndex = visibleWidgetIds.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedVisible = arrayMove(visibleWidgetIds, oldIndex, newIndex);
    const reorderedHidden = layoutState.hiddenWidgets.map(
      (widget) => widget.widgetId,
    );
    const orderedWidgetIds = [...reorderedVisible, ...reorderedHidden];
    recordAnalyticsDashboardInteraction({
      interactionType: "layout_reordered",
      resultId: result.id,
      projectId: result.projectId,
      activityId: result.activityId,
      scopeType: result.scopeType,
      dashboardSchemaVersion: dashboard.schemaVersion,
      dashboardCompatibilitySource: resolvedDashboard.compatibilitySource,
      orderedWidgetIds,
      hiddenWidgetIds: layoutState.hiddenWidgetIds,
      visibleWidgetIds: reorderedVisible,
      widgetId: String(active.id),
    });
    persistLayout({
      orderedWidgetIds,
      hiddenWidgetIds: layoutState.hiddenWidgetIds,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-primary">
            {t("analytics.dashboard.eyebrow")}
          </div>
          <h2 className="mt-1 text-[1.65rem] font-semibold tracking-tight text-foreground">
            {t("analytics.dashboard.title")}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {resolvedDashboard.compatibilitySource ===
          "compatibility_fallback" ? (
            <div className="rounded-full border border-amber-300/80 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-900">
              {t("analytics.dashboard.compatibilityFallback")}
            </div>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isExporting !== null}
              >
                <Download className="h-4 w-4" />
                {t("analytics.dashboard.exportLabel")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => downloadExport("json")}>
                <FileJson className="h-4 w-4" />
                {t("analytics.dashboard.exportJson")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => downloadExport("text")}>
                <FileText className="h-4 w-4" />
                {t("analytics.dashboard.exportText")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCustomizing((value) => !value)}
          >
            <Settings2 className="h-4 w-4" />
            {isCustomizing
              ? t("analytics.dashboard.hideCustomizer")
              : t("analytics.dashboard.showCustomizer")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              recordAnalyticsDashboardInteraction({
                interactionType: "layout_restored",
                resultId: result.id,
                projectId: result.projectId,
                activityId: result.activityId,
                scopeType: result.scopeType,
                dashboardSchemaVersion: dashboard.schemaVersion,
                dashboardCompatibilitySource:
                  resolvedDashboard.compatibilitySource,
                orderedWidgetIds: dashboard.defaultLayout.orderedWidgetIds,
                hiddenWidgetIds: dashboard.defaultLayout.hiddenWidgetIds,
                visibleWidgetIds:
                  dashboard.defaultLayout.orderedWidgetIds.filter(
                    (widgetId) =>
                      !dashboard.defaultLayout.hiddenWidgetIds.includes(
                        widgetId,
                      ),
                  ),
                widgetId: null,
              });
              setLayoutState(buildLayoutState(dashboard.defaultLayout));
              onResetLayout();
            }}
            disabled={isResettingLayout}
          >
            <RotateCcw className="h-4 w-4" />
            {t("analytics.dashboard.restoreRecommended")}
          </Button>
        </div>
      </div>

      {isCustomizing ? (
        <DashboardCustomizationPanel
          widgets={dashboard.availableWidgets}
          hiddenWidgetIds={layoutState.hiddenWidgetIds}
          onToggleWidget={handleToggleWidget}
          isSavingLayout={isSavingLayout}
        />
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={layoutState.visibleWidgets.map((widget) => widget.widgetId)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
            {layoutState.visibleWidgets.map((widget) => (
              <SortableDashboardCard
                key={widget.widgetId}
                widget={widget}
                onHide={handleToggleWidget}
              >
                <AnalyticsWidgetCard widget={widget} language={i18n.language} />
              </SortableDashboardCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {layoutState.hiddenWidgets.length > 0 ? (
        <HiddenWidgetsManagerCard
          widgets={layoutState.hiddenWidgets}
          onShowWidget={handleToggleWidget}
        />
      ) : null}

      <DashboardUsageSummaryCard usageSummary={dashboardUsageSummary} />

      <CatalogDetailsSection
        catalog={result.catalog}
        featuredEntryIds={result.curation.featuredEntryIds}
      />
    </div>
  );
}

function DashboardUsageSummaryCard({
  usageSummary,
}: {
  usageSummary: AnalyticsDashboardUsageSummary | null;
}) {
  const { t, i18n } = useTranslation();

  const formatDate = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(i18n.language, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : t("analytics.dashboard.usageNoDate");

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">
            {t("analytics.dashboard.usageTitle")}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {t("analytics.dashboard.usageDescription")}
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      {usageSummary ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <UsageStat
              label={t("analytics.dashboard.usageViews")}
              value={String(usageSummary.dashboardViewCount)}
            />
            <UsageStat
              label={t("analytics.dashboard.usageHidden")}
              value={String(usageSummary.widgetHideCount)}
            />
            <UsageStat
              label={t("analytics.dashboard.usageShown")}
              value={String(usageSummary.widgetShowCount)}
            />
            <UsageStat
              label={t("analytics.dashboard.usageReordered")}
              value={String(usageSummary.layoutReorderCount)}
            />
            <UsageStat
              label={t("analytics.dashboard.usageRestored")}
              value={String(usageSummary.layoutRestoreCount)}
            />
          </div>
          <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <div>
              {t("analytics.dashboard.usageLastViewed", {
                value: formatDate(usageSummary.lastViewedAt),
              })}
            </div>
            <div>
              {t("analytics.dashboard.usageLastUpdated", {
                value: formatDate(usageSummary.lastOccurredAt),
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 text-sm text-muted-foreground">
          {t("analytics.dashboard.usageEmpty")}
        </div>
      )}
    </Card>
  );
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-border/70 bg-background px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

function HiddenWidgetsManagerCard({
  widgets,
  onShowWidget,
}: {
  widgets: AnalyticsDashboardWidget[];
  onShowWidget: (widgetId: string) => void;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const hiddenWidgetStats = HIDDEN_WIDGET_KIND_ORDER.map((kind) => {
    const count = widgets.filter((widget) => widget.kind === kind).length;

    return {
      kind,
      count,
      label: t(getHiddenWidgetKindLabelKey(kind)),
    };
  }).filter((stat) => stat.count > 0);

  const hiddenWidgetPreview = widgets.slice(0, 3);
  const normalizedSearchValue = searchValue.trim().toLowerCase();
  const filteredWidgets = widgets.filter((widget) => {
    if (!normalizedSearchValue) {
      return true;
    }

    const searchableText = [
      widget.title,
      widget.subtitle ?? "",
      widget.description,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchValue);
  });
  const hiddenWidgetSections = HIDDEN_WIDGET_KIND_ORDER.map((kind) => {
    const sectionWidgets = filteredWidgets.filter(
      (widget) => widget.kind === kind,
    );

    return sectionWidgets.length > 0 ? { kind, widgets: sectionWidgets } : null;
  }).filter(
    (
      section,
    ): section is {
      kind: AnalyticsDashboardWidgetKind;
      widgets: AnalyticsDashboardWidget[];
    } => section !== null,
  );

  return (
    <>
      <Card className="overflow-hidden border-primary/15 bg-[linear-gradient(135deg,rgba(13,148,136,0.08),rgba(255,255,255,0.98)_42%,rgba(250,250,250,1))] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <EyeOff className="h-4 w-4 text-primary" />
              {t("analytics.dashboard.hiddenWidgetsTitle", {
                count: widgets.length,
              })}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t("analytics.dashboard.hiddenWidgetsDescription")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hiddenWidgetStats.map((stat) => (
                <div
                  key={stat.kind}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <span>{stat.label}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[16px] border border-border/70 bg-background/80 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {t("analytics.dashboard.hiddenWidgetsPreview")}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {hiddenWidgetPreview.map((widget) => (
                  <span
                    key={widget.widgetId}
                    className="inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-xs text-foreground"
                  >
                    {widget.title}
                  </span>
                ))}
                {widgets.length > hiddenWidgetPreview.length ? (
                  <span className="inline-flex items-center rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground">
                    +{widgets.length - hiddenWidgetPreview.length}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={() => setIsOpen(true)}
          >
            {t("analytics.dashboard.hiddenWidgetsManage")}
          </Button>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[88vh] max-w-5xl overflow-hidden p-0">
          <div className="flex max-h-[88vh] flex-col">
            <DialogHeader className="border-b border-border/60 px-6 py-5">
              <DialogTitle>
                {t("analytics.dashboard.hiddenWidgetsManagerTitle", {
                  count: widgets.length,
                })}
              </DialogTitle>
              <DialogDescription className="max-w-3xl leading-6">
                {t("analytics.dashboard.hiddenWidgetsManagerDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="border-b border-border/60 px-6 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={t(
                    "analytics.dashboard.hiddenWidgetsSearchPlaceholder",
                  )}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              {hiddenWidgetSections.length > 0 ? (
                <div className="space-y-6">
                  {hiddenWidgetSections.map((section) => {
                    const sectionTitleKey = getHiddenWidgetSectionTitleKey(
                      section.kind,
                    );
                    const sectionDescriptionKey =
                      getHiddenWidgetSectionDescriptionKey(section.kind);

                    return (
                      <section key={section.kind}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">
                              {t(sectionTitleKey)}
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {t(sectionDescriptionKey)}
                            </p>
                          </div>
                          <div className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {section.widgets.length}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {section.widgets.map((widget) => (
                            <button
                              key={widget.widgetId}
                              type="button"
                              onClick={() => onShowWidget(widget.widgetId)}
                              className="rounded-[16px] border border-border/70 bg-background p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                    {getHiddenWidgetKindIcon(widget.kind)}
                                    {t(
                                      getHiddenWidgetKindLabelKey(widget.kind),
                                    )}
                                  </div>
                                  <div className="mt-3 text-sm font-semibold text-foreground">
                                    {widget.title}
                                  </div>
                                  {widget.subtitle ? (
                                    <div className="mt-1 text-xs font-medium text-primary">
                                      {widget.subtitle}
                                    </div>
                                  ) : null}
                                  <div className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
                                    {widget.description}
                                  </div>
                                </div>
                                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                                  {t("analytics.dashboard.hiddenWidgetShow")}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[16px] border border-dashed border-border p-8 text-center">
                  <div className="text-sm font-semibold text-foreground">
                    {t("analytics.dashboard.hiddenWidgetsNoResults")}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t("analytics.dashboard.hiddenWidgetsNoResultsHint")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getHiddenWidgetKindIcon(kind: AnalyticsDashboardWidgetKind) {
  switch (kind) {
    case "horizontal_bar":
      return <BarChart3 className="h-3.5 w-3.5" />;
    case "line_series":
      return <LineChartIcon className="h-3.5 w-3.5" />;
    case "category_rank":
      return <TrendingUp className="h-3.5 w-3.5" />;
    case "kpi":
      return <Sparkles className="h-3.5 w-3.5" />;
    case "theme_list":
      return <ListTree className="h-3.5 w-3.5" />;
    case "summary":
      return <FileText className="h-3.5 w-3.5" />;
  }
}

function getHiddenWidgetKindLabelKey(kind: AnalyticsDashboardWidgetKind) {
  switch (kind) {
    case "horizontal_bar":
      return "analytics.dashboard.hiddenWidgetTypeHorizontalBar";
    case "line_series":
      return "analytics.dashboard.hiddenWidgetTypeLineSeries";
    case "category_rank":
      return "analytics.dashboard.hiddenWidgetTypeCategoryRank";
    case "kpi":
      return "analytics.dashboard.hiddenWidgetTypeKpi";
    case "theme_list":
      return "analytics.dashboard.hiddenWidgetTypeThemeList";
    case "summary":
      return "analytics.dashboard.hiddenWidgetTypeSummary";
  }
}

function getHiddenWidgetSectionTitleKey(kind: AnalyticsDashboardWidgetKind) {
  switch (kind) {
    case "horizontal_bar":
      return "analytics.dashboard.hiddenWidgetSectionHorizontalBarTitle";
    case "line_series":
      return "analytics.dashboard.hiddenWidgetSectionLineSeriesTitle";
    case "category_rank":
      return "analytics.dashboard.hiddenWidgetSectionCategoryRankTitle";
    case "kpi":
      return "analytics.dashboard.hiddenWidgetSectionKpiTitle";
    case "theme_list":
      return "analytics.dashboard.hiddenWidgetSectionThemeListTitle";
    case "summary":
      return "analytics.dashboard.hiddenWidgetSectionSummaryTitle";
  }
}

function getHiddenWidgetSectionDescriptionKey(
  kind: AnalyticsDashboardWidgetKind,
) {
  switch (kind) {
    case "horizontal_bar":
      return "analytics.dashboard.hiddenWidgetSectionHorizontalBarDescription";
    case "line_series":
      return "analytics.dashboard.hiddenWidgetSectionLineSeriesDescription";
    case "category_rank":
      return "analytics.dashboard.hiddenWidgetSectionCategoryRankDescription";
    case "kpi":
      return "analytics.dashboard.hiddenWidgetSectionKpiDescription";
    case "theme_list":
      return "analytics.dashboard.hiddenWidgetSectionThemeListDescription";
    case "summary":
      return "analytics.dashboard.hiddenWidgetSectionSummaryDescription";
  }
}

function SortableDashboardCard({
  widget,
  onHide,
  children,
}: {
  widget: AnalyticsDashboardWidget;
  onHide: (widgetId: string) => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.widgetId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "min-w-0",
        widget.kind === "summary" || widget.kind === "theme_list"
          ? "md:col-span-2 xl:col-span-12"
          : widget.kind === "kpi"
            ? "xl:col-span-3"
            : "xl:col-span-6",
        isDragging ? "z-20 opacity-90" : "",
      )}
    >
      <div className="mb-2 flex justify-end gap-1">
        <button
          type="button"
          onClick={() => onHide(widget.widgetId)}
          aria-label={t("analytics.dashboard.hideWidget")}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className="inline-flex cursor-grab items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </div>
  );
}

function DashboardCustomizationPanel({
  widgets,
  hiddenWidgetIds,
  onToggleWidget,
  isSavingLayout,
}: {
  widgets: AnalyticsDashboard["availableWidgets"];
  hiddenWidgetIds: string[];
  onToggleWidget: (widgetId: string) => void;
  isSavingLayout: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">
            {t("analytics.dashboard.customizerTitle")}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {t("analytics.dashboard.customizerDescription")}
          </div>
        </div>
        {isSavingLayout ? (
          <div className="text-xs text-muted-foreground">
            {t("analytics.dashboard.savingLayout")}
          </div>
        ) : null}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {widgets.map((widget) => {
          const isHidden = hiddenWidgetIds.includes(widget.widgetId);

          return (
            <button
              key={widget.widgetId}
              type="button"
              onClick={() => onToggleWidget(widget.widgetId)}
              className={cn(
                "rounded-[12px] border p-4 text-left transition-colors",
                isHidden
                  ? "border-border bg-background"
                  : "border-primary/25 bg-primary/5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {widget.title}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {widget.description}
                  </div>
                </div>
                <div className="shrink-0 text-[11px] font-medium text-muted-foreground">
                  {isHidden
                    ? t("analytics.dashboard.hiddenBadge")
                    : t("analytics.dashboard.visibleBadge")}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function AnalyticsWidgetCard({
  widget,
  language,
}: {
  widget: AnalyticsDashboardWidget;
  language: string;
}) {
  switch (widget.kind) {
    case "kpi":
      return <KpiWidgetCard widget={widget} language={language} />;
    case "summary":
      return <SummaryWidgetCard widget={widget} />;
    case "horizontal_bar":
      return <HorizontalBarWidgetCard widget={widget} language={language} />;
    case "line_series":
      return <LineSeriesWidgetCard widget={widget} language={language} />;
    case "category_rank":
      return <CategoryRankWidgetCard widget={widget} language={language} />;
    case "theme_list":
      return <ThemeListWidgetCard widget={widget} />;
  }
}

function KpiWidgetCard({
  widget,
  language,
}: {
  widget: AnalyticsDashboardKpiWidget;
  language: string;
}) {
  return (
    <Card className="flex h-full min-h-[15rem] flex-col p-5">
      <div className="line-clamp-3 min-h-[4.75rem] text-[12px] font-medium text-muted-foreground">
        {widget.title}
      </div>
      <div className="mt-2 text-[28px] font-semibold tracking-tight text-primary">
        {formatMetricValue(
          { value: widget.value, unit: widget.unit },
          language,
        )}
      </div>
      {widget.description ? (
        <div className="mt-3 line-clamp-4 text-[12px] leading-6 text-muted-foreground">
          {widget.description}
        </div>
      ) : (
        <div className="mt-3 flex-1" />
      )}
    </Card>
  );
}

function SummaryWidgetCard({
  widget,
}: {
  widget: AnalyticsDashboardSummaryWidget;
}) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden border-primary/20 bg-[linear-gradient(135deg,rgba(13,148,136,0.12),rgba(13,148,136,0.03)_38%,rgba(255,255,255,0.96))] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-primary">
            {t("analytics.dashboard.summaryEyebrow")}
          </div>
          <h3 className="mt-2 text-[1.5rem] font-semibold tracking-tight text-foreground">
            {widget.title}
          </h3>
        </div>
        <AiCuratedBadge />
      </div>
      <div className="mt-4 space-y-3">
        {widget.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[15px] leading-7 text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>
      <WidgetMetadataFooter widget={widget} />
    </Card>
  );
}

function HorizontalBarWidgetCard({
  widget,
  language,
}: {
  widget: AnalyticsDashboardHorizontalBarWidget;
  language: string;
}) {
  const resolvedLabels = resolveCategoryLabels(
    widget.items.map((item) => item.label),
  );
  const data = widget.items.map((item, index) => ({
    id: item.id,
    name: resolvedLabels[index],
    value: widget.unit === "ratio" ? item.value * 100 : item.value,
  }));
  const labels = data.map((item) => item.name);
  const chartHeight = getHorizontalBarChartHeight(labels);
  const yAxisWidth = getHorizontalBarYAxisWidth(labels);

  return (
    <WidgetShell
      icon={<BarChart3 className="h-4 w-4 text-primary" />}
      widget={widget}
    >
      <div style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 12, right: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              width={yAxisWidth}
              tick={<MultilineYAxisTick />}
            />
            <Tooltip
              formatter={(value: ValueType | undefined) =>
                typeof value === "number"
                  ? formatMetricValue(
                      {
                        value: widget.unit === "ratio" ? value / 100 : value,
                        unit: widget.unit,
                      },
                      language,
                    )
                  : ""
              }
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.id}
                  fill={getSequentialBarShade(
                    HORIZONTAL_BAR_BASE_COLOR,
                    index,
                    data.length,
                  )}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetShell>
  );
}

function LineSeriesWidgetCard({
  widget,
  language,
}: {
  widget: AnalyticsDashboardLineSeriesWidget;
  language: string;
}) {
  const data = widget.points.map((point) => ({
    label: point.label,
    value: widget.unit === "ratio" ? point.value * 100 : point.value,
  }));

  return (
    <WidgetShell
      icon={<LineChartIcon className="h-4 w-4 text-primary" />}
      widget={widget}
    >
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: ValueType | undefined) =>
                typeof value === "number"
                  ? formatMetricValue(
                      {
                        value: widget.unit === "ratio" ? value / 100 : value,
                        unit: widget.unit,
                      },
                      language,
                    )
                  : ""
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-chart-2)"
              strokeWidth={3}
              dot={{ fill: "var(--color-chart-2)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetShell>
  );
}

function CategoryRankWidgetCard({
  widget,
  language,
}: {
  widget: AnalyticsDashboardCategoryRankWidget;
  language: string;
}) {
  const resolvedLabels = resolveCategoryLabels(
    widget.items.map((item) => item.label),
  );
  const data = widget.items.map((item, index) => ({
    id: item.id,
    name: resolvedLabels[index],
    value: widget.unit === "ratio" ? item.value * 100 : item.value,
  }));

  return (
    <WidgetShell
      icon={<TrendingUp className="h-4 w-4 text-primary" />}
      widget={widget}
    >
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: ValueType | undefined) =>
                typeof value === "number"
                  ? formatMetricValue(
                      {
                        value: widget.unit === "ratio" ? value / 100 : value,
                        unit: widget.unit,
                      },
                      language,
                    )
                  : ""
              }
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.id}
                  fill={getSequentialBarShade(
                    CATEGORY_RANK_BASE_COLOR,
                    index,
                    data.length,
                  )}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetShell>
  );
}

function ThemeListWidgetCard({
  widget,
}: {
  widget: AnalyticsDashboardThemeListWidget;
}) {
  const { t } = useTranslation();

  return (
    <WidgetShell
      icon={<ListTree className="h-4 w-4 text-primary" />}
      widget={widget}
    >
      <div className="space-y-3">
        {widget.items.map((item) => (
          <div
            key={item.entryId}
            className="rounded-[12px] border border-border/70 bg-secondary/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">
                  {item.label}
                </div>
                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </div>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                <Quote className="h-3 w-3" />
                {t("analytics.quoteCount", { count: item.quoteCount })}
              </div>
            </div>
            {item.outcomeReference ? (
              <div className="mt-3 text-xs font-medium text-primary">
                {item.outcomeReference}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

function WidgetShell({
  icon,
  widget,
  children,
}: {
  icon: ReactNode;
  widget: AnalyticsDashboardWidget;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {widget.title}
      </div>
      <div className="mt-5">{children}</div>
      {widget.description ? (
        <div className="mt-5 border-t border-border/60 pt-4 text-sm leading-6 text-muted-foreground">
          {widget.description}
        </div>
      ) : null}
    </Card>
  );
}

function WidgetMetadataFooter({
  widget,
}: {
  widget: AnalyticsDashboardWidget;
}) {
  const { t } = useTranslation();

  if (
    widget.goalLinkage.outcomeReferences.length === 0 &&
    widget.goalLinkage.successIndicators.length === 0 &&
    widget.qualityFlags.length === 0
  ) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
      {widget.goalLinkage.outcomeReferences.slice(0, 2).map((reference) => (
        <span
          key={reference}
          className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary"
        >
          <Sparkles className="h-3 w-3" />
          {reference}
        </span>
      ))}
      {widget.goalLinkage.successIndicators.slice(0, 1).map((indicator) => (
        <span
          key={indicator}
          className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground"
        >
          {t("analytics.dashboard.goalLinked", { value: indicator })}
        </span>
      ))}
      {widget.qualityFlags.slice(0, 2).map((flag) => (
        <span
          key={`${flag.sourceType}-${flag.message}`}
          className="inline-flex items-center rounded-full bg-amber-100/70 px-2.5 py-1 text-[11px] font-medium text-amber-900"
        >
          {flag.message}
        </span>
      ))}
    </div>
  );
}
