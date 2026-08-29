import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import { columnContainerId } from "./dashboardColumnDrag";
import { SortableChartCard } from "./sortableChartCard";

// One vertical stack of chart cards. Two of these side by side (see
// projectImpactStoryPage.tsx) form the dashboard grid — each column packs
// its own cards tightly regardless of the other column's card heights,
// which a single shared CSS grid can't do (a shared grid's row height is
// set by its tallest cell, leaving blank space under every shorter
// neighbor). The column's own div is a dnd-kit droppable so a card can
// still be dragged onto an empty column, or below the last card in a
// shorter one — not just onto another card.
export function DashboardColumn({
  column,
  cardIds,
  chartCardsById,
  onHide,
}: {
  column: 0 | 1;
  cardIds: string[];
  chartCardsById: Map<string, { title: string; node: ReactNode }>;
  onHide: (id: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id: columnContainerId(column) });

  return (
    <div ref={setNodeRef} className="flex min-h-10 flex-col gap-3">
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        {cardIds.map((id) => {
          const card = chartCardsById.get(id);
          if (!card) {
            return null;
          }
          return (
            <SortableChartCard key={id} id={id} onHide={() => onHide(id)}>
              {card.node}
            </SortableChartCard>
          );
        })}
      </SortableContext>
    </div>
  );
}
