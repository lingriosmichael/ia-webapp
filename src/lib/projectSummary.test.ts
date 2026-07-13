import { describe, expect, it } from "vitest";

import { resolveProjectSummaryText } from "./projectSummary";

function makeImpactModel(overrides?: {
  impact?: string | null;
  outcomes?: string | null;
}) {
  return {
    inputs: null,
    activities: null,
    outputs: null,
    impact: overrides?.impact ?? null,
    outcomes: overrides?.outcomes ?? null,
  };
}

describe("resolveProjectSummaryText", () => {
  it("prefers impact over all fallback values", () => {
    const summary = resolveProjectSummaryText({
      impactModel: makeImpactModel({
        impact: "Impact text",
        outcomes: "Outcome text",
      }),
      successIndicators: "Indicators text",
    });

    expect(summary).toBe("Impact text");
  });

  it("falls back to outcomes when impact is missing", () => {
    const summary = resolveProjectSummaryText({
      impactModel: makeImpactModel({ outcomes: "Outcome text" }),
      successIndicators: "Indicators text",
    });

    expect(summary).toBe("Outcome text");
  });

  it("falls back to success indicators when impact model is empty", () => {
    const summary = resolveProjectSummaryText({
      impactModel: makeImpactModel(),
      successIndicators: "Indicators text",
    });

    expect(summary).toBe("Indicators text");
  });

  it("returns null when all values are absent", () => {
    const summary = resolveProjectSummaryText({
      impactModel: makeImpactModel(),
      successIndicators: null,
    });

    expect(summary).toBeNull();
  });
});
