import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnPair } from "@/components/impactStory/dashboardColumnDrag";

interface StoredLayout {
  columns: ColumnPair;
  hidden: string[];
}

const EMPTY_LAYOUT: StoredLayout = { columns: [[], []], hidden: [] };

function storageKey(projectId: string): string {
  return `impactStory.dashboardLayout.${projectId}`;
}

function isStoredLayout(value: unknown): value is StoredLayout {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Partial<StoredLayout>;
  return (
    Array.isArray(candidate.columns) &&
    candidate.columns.length === 2 &&
    Array.isArray(candidate.columns[0]) &&
    Array.isArray(candidate.columns[1]) &&
    Array.isArray(candidate.hidden)
  );
}

// Reads/writes are wrapped defensively — private browsing, a full quota, or
// a disabled storage API can all throw, and losing a saved card layout/hide
// list is a cosmetic annoyance, never worth breaking the page over.
function readStoredLayout(projectId: string): StoredLayout | null {
  try {
    const raw = window.localStorage.getItem(storageKey(projectId));
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isStoredLayout(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredLayout(projectId: string, layout: StoredLayout): void {
  try {
    window.localStorage.setItem(storageKey(projectId), JSON.stringify(layout));
  } catch {
    // Best-effort only — see readStoredLayout's comment.
  }
}

// Assigns every id not already placed in `columns` to whichever column is
// currently shorter, so a fresh chart plan (or a card returning from the
// backlog) starts reasonably balanced instead of piling everything into
// column 0.
function appendBalanced(columns: ColumnPair, ids: string[]): ColumnPair {
  const next: ColumnPair = [[...columns[0]], [...columns[1]]];
  for (const id of ids) {
    const target = next[0].length <= next[1].length ? 0 : 1;
    next[target].push(id);
  }
  return next;
}

// Card layout/hidden state lives in the browser, not on the backend: a
// regenerate reassembles the chart plan from scratch (the LLM's own
// chartId strings are not guaranteed stable run to run — see
// projectImpactStoryChartPlanExecution.ts), so a saved layout is really
// "how I want to view *this browser's* current set of charts," not a
// durable cross-device project setting. Ids the current generation no
// longer has are dropped silently; new ids the saved layout has never seen
// are appended in their natural (default) order, balanced across the two
// columns.
//
// `defaultHiddenIds` (the backlog: charts the chart plan didn't select —
// see projectImpactStoryChartBacklog.ts) start out of view unless a viewer
// has previously moved them onto the dashboard; `defaultVisibleIds` starts
// shown unless a viewer has explicitly hidden it. Both directions — hide a
// dashboard card into the backlog, add a backlog card onto the dashboard —
// are just moves between the same two id sets, backed by the one saved
// `hidden` list.
export function useImpactStoryDashboardLayout(
  projectId: string,
  defaultVisibleIds: string[],
  defaultHiddenIds: string[] = [],
) {
  const [layout, setLayout] = useState<StoredLayout>(EMPTY_LAYOUT);

  useEffect(() => {
    setLayout(readStoredLayout(projectId) ?? EMPTY_LAYOUT);
  }, [projectId]);

  const persist = useCallback(
    (next: StoredLayout) => {
      setLayout(next);
      writeStoredLayout(projectId, next);
    },
    [projectId],
  );

  const defaultOrderedIds = useMemo(
    () => [...defaultVisibleIds, ...defaultHiddenIds],
    [defaultVisibleIds, defaultHiddenIds],
  );

  const savedHiddenIds = useMemo(() => {
    const known = new Set(defaultOrderedIds);
    return layout.hidden.filter((id) => known.has(id));
  }, [defaultOrderedIds, layout.hidden]);

  const columns = useMemo<ColumnPair>(() => {
    // Must recognize both dashboard- and backlog-origin ids: a card a viewer
    // explicitly moved out of the backlog (via showCard) lives in
    // layout.columns but only ever started out in defaultHiddenIds.
    const knownIds = new Set(defaultOrderedIds);
    const hiddenSet = new Set(savedHiddenIds);
    const filtered: ColumnPair = [
      layout.columns[0].filter((id) => knownIds.has(id) && !hiddenSet.has(id)),
      layout.columns[1].filter((id) => knownIds.has(id) && !hiddenSet.has(id)),
    ];
    const placed = new Set([...filtered[0], ...filtered[1]]);
    // Only genuinely new dashboard-plan cards get auto-placed; backlog cards
    // must stay hidden until a viewer explicitly clicks "+".
    const unseen = defaultVisibleIds.filter(
      (id) => !placed.has(id) && !hiddenSet.has(id),
    );
    return appendBalanced(filtered, unseen);
  }, [defaultOrderedIds, defaultVisibleIds, layout.columns, savedHiddenIds]);

  // Backlog order is simply "the order ids were hidden in" (hideCard always
  // appends), plus any never-before-seen default-hidden id appended in its
  // natural chart-plan order — there's no drag-to-reorder inside the
  // backlog panel, so no richer ordering is needed.
  const hiddenIds = useMemo(() => {
    const placedOnDashboard = new Set([...columns[0], ...columns[1]]);
    const placedAnywhere = new Set([...placedOnDashboard, ...savedHiddenIds]);
    const newlyHidden = defaultHiddenIds.filter(
      (id) => !placedAnywhere.has(id),
    );
    return [...savedHiddenIds, ...newlyHidden];
  }, [columns, savedHiddenIds, defaultHiddenIds]);

  const setColumns = useCallback(
    (next: ColumnPair) => {
      persist({ columns: next, hidden: hiddenIds });
    },
    [persist, hiddenIds],
  );

  const hideCard = useCallback(
    (id: string) => {
      persist({
        columns: [
          columns[0].filter((cardId) => cardId !== id),
          columns[1].filter((cardId) => cardId !== id),
        ],
        hidden: hiddenIds.includes(id) ? hiddenIds : [...hiddenIds, id],
      });
    },
    [columns, hiddenIds, persist],
  );

  const showCard = useCallback(
    (id: string) => {
      persist({
        columns: appendBalanced(columns, [id]),
        hidden: hiddenIds.filter((hiddenId) => hiddenId !== id),
      });
    },
    [columns, hiddenIds, persist],
  );

  return {
    leftColumnIds: columns[0],
    rightColumnIds: columns[1],
    backlogIds: hiddenIds,
    hiddenCount: hiddenIds.length,
    setColumns,
    hideCard,
    showCard,
  };
}
