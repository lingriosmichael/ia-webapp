import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import { ProjectImpactStoryBarChart } from "./projectImpactStoryBarChart";
import { ProjectImpactStoryDistributionChart } from "./projectImpactStoryDistributionChart";
import { coerceImpactStoryText } from "./impactStoryFormat";
import { ProjectImpactStoryLineChart } from "./projectImpactStoryLineChart";
import { ProjectImpactStoryPieChart } from "./projectImpactStoryPieChart";

// Dispatches a backend-planned chart spec to its renderer by chartType.
// Only chart types PROJECT_IMPACT_STORY_ALLOWED_CHART_TYPES (ia_backend)
// ever reach here — an unrecognized chartType renders nothing rather than
// guessing a fallback visual.
export function ProjectImpactStoryChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const normalizedChart: ProjectImpactStoryChartSpec = {
    ...chart,
    chartId: coerceImpactStoryText(chart.chartId, "impact-story-chart"),
    title: coerceImpactStoryText(chart.title),
    subtitle:
      chart.subtitle === null ? null : coerceImpactStoryText(chart.subtitle),
    narrativeReason: coerceImpactStoryText(chart.narrativeReason),
    data: Array.isArray(chart.data) ? chart.data : [],
  };

  switch (normalizedChart.chartType) {
    case "bar":
    case "comparison":
      return <ProjectImpactStoryBarChart chart={normalizedChart} />;
    case "distribution":
      return <ProjectImpactStoryDistributionChart chart={normalizedChart} />;
    case "pie":
      return <ProjectImpactStoryPieChart chart={normalizedChart} />;
    case "line":
      return <ProjectImpactStoryLineChart chart={normalizedChart} />;
    default:
      return null;
  }
}
