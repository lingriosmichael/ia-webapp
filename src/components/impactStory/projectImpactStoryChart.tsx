import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import { ProjectImpactStoryBarChart } from "./projectImpactStoryBarChart";
import { ProjectImpactStoryDistributionChart } from "./projectImpactStoryDistributionChart";
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
  switch (chart.chartType) {
    case "bar":
    case "comparison":
      return <ProjectImpactStoryBarChart chart={chart} />;
    case "distribution":
      return <ProjectImpactStoryDistributionChart chart={chart} />;
    case "pie":
      return <ProjectImpactStoryPieChart chart={chart} />;
    case "line":
      return <ProjectImpactStoryLineChart chart={chart} />;
    default:
      return null;
  }
}
