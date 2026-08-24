import { useCallback, useEffect, useMemo, useState } from "react";

interface StoredLayout {
  order: string[];
  hidden: string[];
}

function storageKey(projectId: string): string {
  return `impactStory.dashboardLayout.${projectId}`;
}

// Reads/writes are wrapped defensively — private browsing, a full quota, or
// a disabled storage API can all throw, and losing a saved card order/hide
// list is a cosmetic annoyance, never worth breaking the page over.
function readStoredLayout(projectId: string): StoredLayout | null {
  try {
    const raw = window.localStorage.getItem(storageKey(projectId));
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !Array.isArray((parsed as StoredLayout).order) ||
      !Array.isArray((parsed as StoredLayout).hidden)
    ) {
      return null;
    }
    return parsed as StoredLayout;
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

// Card order/hidden state lives in the browser, not on the backend: a
// regenerate reassembles the chart plan from scratch (the LLM's own
// chartId strings are not guaranteed stable run to run — see
// projectImpactStoryChartPlanExecution.ts), so a saved layout is really
// "how I want to view *this browser's* current set of charts," not a
// durable cross-device project setting. Ids the current generation no
// longer has are dropped silently; new ids the saved layout has never seen
// are appended in their natural (default) order rather than lost.
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
  const [layout, setLayout] = useState<StoredLayout>(() => ({
    order: [],
    hidden: [],
  }));

  useEffect(() => {
    setLayout(readStoredLayout(projectId) ?? { order: [], hidden: [] });
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

  const orderedIds = useMemo(() => {
    const known = new Set(defaultOrderedIds);
    const savedKnown = layout.order.filter((id) => known.has(id));
    const unseen = defaultOrderedIds.filter((id) => !layout.order.includes(id));
    return [...savedKnown, ...unseen];
  }, [defaultOrderedIds, layout.order]);

  const hiddenIds = useMemo(() => {
    const known = new Set(defaultOrderedIds);
    const savedHidden = new Set(layout.hidden.filter((id) => known.has(id)));
    // A backlog id the saved layout has never seen before (e.g. this
    // regeneration produced a chart-plan candidate that wasn't picked
    // before) defaults to hidden — that's the whole point of the backlog.
    // A dashboard id the saved layout has never seen defaults to visible.
    for (const id of defaultHiddenIds) {
      if (!layout.order.includes(id)) {
        savedHidden.add(id);
      }
    }
    return savedHidden;
  }, [defaultOrderedIds, defaultHiddenIds, layout.order, layout.hidden]);

  const visibleIds = useMemo(
    () => orderedIds.filter((id) => !hiddenIds.has(id)),
    [orderedIds, hiddenIds],
  );
  const backlogIds = useMemo(
    () => orderedIds.filter((id) => hiddenIds.has(id)),
    [orderedIds, hiddenIds],
  );

  const moveCard = useCallback(
    (activeId: string, overId: string) => {
      if (activeId === overId) {
        return;
      }
      const fromIndex = orderedIds.indexOf(activeId);
      const toIndex = orderedIds.indexOf(overId);
      if (fromIndex === -1 || toIndex === -1) {
        return;
      }
      const next = [...orderedIds];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, activeId);
      persist({ order: next, hidden: [...hiddenIds] });
    },
    [orderedIds, hiddenIds, persist],
  );

  const hideCard = useCallback(
    (id: string) => {
      persist({ order: orderedIds, hidden: [...hiddenIds, id] });
    },
    [orderedIds, hiddenIds, persist],
  );

  const showCard = useCallback(
    (id: string) => {
      persist({
        order: orderedIds,
        hidden: [...hiddenIds].filter((hiddenId) => hiddenId !== id),
      });
    },
    [orderedIds, hiddenIds, persist],
  );

  return {
    visibleIds,
    backlogIds,
    hiddenCount: hiddenIds.size,
    moveCard,
    hideCard,
    showCard,
  };
}
