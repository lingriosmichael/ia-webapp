import "@/lib/i18n";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InterpretationQuestionCard } from "./interpretationQuestionCard";
import type { InterpretationQuestion } from "@/services/apiClient";

// This is live user-facing product copy (see
// CLARIFICATION_QUESTION_WORDING_PLAN.md Phase 4), so it gets a real test
// regardless of this frontend's normal light-testing default. The single
// thing worth locking in: the card renders userFacingPrompt/option labels
// and submits an option's value, not its label.
function baseQuestion(
  overrides: Partial<InterpretationQuestion>,
): InterpretationQuestion {
  return {
    id: "q1",
    goalId: null,
    kind: "single_choice",
    questionDomain: "preparation",
    userFacingPrompt: "Which column best shows whether something succeeded?",
    userFacingOptions: [
      { value: "status", label: "Status (recommended)" },
      { value: "outcome", label: "Outcome" },
    ],
    recommendedOption: null,
    recommendedConfidence: null,
    isBlocking: true,
    questionCode: "primary_status_field",
    targetTableName: "applications",
    targetColumnName: null,
    questionData: null,
    status: "pending",
    answeredValue: null,
    answeredById: null,
    answeredAt: null,
    preparationGroupId: null,
    preparationGroupColumns: null,
    ...overrides,
  };
}

describe("InterpretationQuestionCard", () => {
  afterEach(cleanup);

  it("renders userFacingPrompt and option labels", () => {
    render(
      <InterpretationQuestionCard
        activityName="Mentoring Program"
        question={baseQuestion({})}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Which column best shows whether something succeeded?"),
    ).toBeTruthy();
    expect(screen.getByText("Status (recommended)")).toBeTruthy();
    expect(screen.getByText("Outcome")).toBeTruthy();
  });

  it("submits the option's value, not its label, when a choice is picked", () => {
    const onSubmit = vi.fn();
    render(
      <InterpretationQuestionCard
        activityName="Mentoring Program"
        question={baseQuestion({})}
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByText("Status (recommended)"));

    expect(onSubmit).toHaveBeenCalledWith({
      questionId: "q1",
      answeredValue: "status",
    });
  });
});
