import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { DashboardCardChromeProvider } from "./dashboardCardChromeContext";

// One dnd-kit sortable item per chart card. Supplies drag-handle/hide
// chrome via context rather than props — see dashboardCardChromeContext's
// doc comment for why: the chart component rendered as `children` (e.g.
// ProjectImpactStoryChart) owns its own ImpactStoryBoardCard internally,
// so this wrapper can't reach the Grip icon directly.
export function SortableChartCard({
  id,
  onHide,
  children,
}: {
  id: string;
  onHide: () => void;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <DashboardCardChromeProvider
        value={{
          dragHandleRef: setActivatorNodeRef,
          dragHandleAttributes: attributes,
          dragHandleListeners: listeners,
          onHide,
        }}
      >
        {children}
      </DashboardCardChromeProvider>
    </div>
  );
}
