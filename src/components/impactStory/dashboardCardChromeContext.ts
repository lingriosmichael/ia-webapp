import { createContext, useContext } from "react";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

// Every chart component (ProjectImpactStoryChart, ProjectImpactStoryGoalProgressChart,
// etc.) renders its own ImpactStoryBoardCard internally — the drag handle
// and hide button are chrome that belongs to the card, not data any of
// those chart components should need to know about or forward. This
// context lets SortableChartCard (the dnd-kit wrapper, one per card in
// projectImpactStoryPage.tsx) supply that chrome without threading new
// props through every chart component's signature.
export interface DashboardCardChrome {
  dragHandleRef: (node: HTMLElement | null) => void;
  dragHandleAttributes: DraggableAttributes;
  dragHandleListeners: DraggableSyntheticListeners;
  onHide: () => void;
}

const DashboardCardChromeContext = createContext<DashboardCardChrome | null>(
  null,
);

export const DashboardCardChromeProvider = DashboardCardChromeContext.Provider;

export function useDashboardCardChrome(): DashboardCardChrome | null {
  return useContext(DashboardCardChromeContext);
}
