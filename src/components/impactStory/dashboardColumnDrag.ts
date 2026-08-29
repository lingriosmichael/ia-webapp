// Pure array logic for the two-column drag-and-drop dashboard grid. Kept
// separate from dnd-kit wiring (dashboardColumn.tsx, projectImpactStoryPage.tsx)
// so the move/reorder rules are plain, testable functions rather than logic
// buried inside event handlers.
export type ColumnPair = [string[], string[]];

// Sentinel ids for each column's own droppable region (see useDroppable in
// dashboardColumn.tsx) — distinct from any real chart/card id so a drop on
// empty column space (below the last card, or into an empty column) can be
// told apart from a drop on another card.
const COLUMN_CONTAINER_IDS = [
  "__impact-story-dashboard-column-0__",
  "__impact-story-dashboard-column-1__",
] as const;

export function columnContainerId(column: 0 | 1): string {
  return COLUMN_CONTAINER_IDS[column];
}

function containerColumnIndex(id: string): 0 | 1 | null {
  const index = COLUMN_CONTAINER_IDS.indexOf(
    id as (typeof COLUMN_CONTAINER_IDS)[number],
  );
  return index === -1 ? null : (index as 0 | 1);
}

function findCardColumn(columns: ColumnPair, cardId: string): 0 | 1 | null {
  if (columns[0].includes(cardId)) {
    return 0;
  }
  if (columns[1].includes(cardId)) {
    return 1;
  }
  return null;
}

// Moves `activeId` into `overId`'s column live, while the drag is still in
// progress (called from onDragOver), so the layout previews the drop
// instead of only snapping into place on release. `overId` is either
// another card's id or one of the two column container sentinel ids.
// No-ops if the drag hasn't actually crossed into a different column yet —
// same-column hover is left to reorderWithinColumn at drop time.
export function moveCardOverColumn(
  columns: ColumnPair,
  activeId: string,
  overId: string,
): ColumnPair {
  const fromColumn = findCardColumn(columns, activeId);
  if (fromColumn === null) {
    return columns;
  }

  const containerColumn = containerColumnIndex(overId);
  const toColumn = containerColumn ?? findCardColumn(columns, overId);
  if (toColumn === null || toColumn === fromColumn) {
    return columns;
  }

  const next: ColumnPair = [[...columns[0]], [...columns[1]]];
  next[fromColumn] = next[fromColumn].filter((id) => id !== activeId);

  if (containerColumn !== null) {
    next[toColumn] = [...next[toColumn], activeId];
  } else {
    const overIndex = next[toColumn].indexOf(overId);
    const insertAt = overIndex === -1 ? next[toColumn].length : overIndex;
    next[toColumn] = [
      ...next[toColumn].slice(0, insertAt),
      activeId,
      ...next[toColumn].slice(insertAt),
    ];
  }
  return next;
}

// Finalizes a same-column reorder on drop (onDragEnd). Cross-column moves
// are already applied live by moveCardOverColumn during onDragOver, so this
// only ever needs to reposition within a single column.
export function reorderWithinColumn(
  columns: ColumnPair,
  activeId: string,
  overId: string,
): ColumnPair {
  if (activeId === overId) {
    return columns;
  }
  const column = findCardColumn(columns, activeId);
  if (column === null) {
    return columns;
  }
  const overColumn =
    containerColumnIndex(overId) ?? findCardColumn(columns, overId);
  if (overColumn !== column) {
    return columns;
  }

  const fromIndex = columns[column].indexOf(activeId);
  const toIndex = columns[column].indexOf(overId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return columns;
  }

  const reordered = [...columns[column]];
  reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, activeId);

  const next: ColumnPair = [[...columns[0]], [...columns[1]]];
  next[column] = reordered;
  return next;
}
