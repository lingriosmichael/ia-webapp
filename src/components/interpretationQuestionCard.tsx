import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  InterpretationQuestion,
  InterpretationQuestionDomain,
} from "@/services/apiClient";

function getQuestionDomainLabelKey(
  questionDomain: InterpretationQuestionDomain,
) {
  return questionDomain === "preparation"
    ? "projectWorkspace.interpretation.questionDomainPreparationLabel"
    : "projectWorkspace.interpretation.questionDomainInterpretationLabel";
}

function parseCompositePrompt(prompt: string): {
  intro: string;
  parts: string[];
} | null {
  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) {
    return null;
  }

  const bulletPattern = /^(?:[-*•]+|\d+[.)])\s+(.*)$/;
  const introParts: string[] = [];
  const questionParts: string[] = [];
  let currentQuestion: string | null = null;

  for (const line of lines) {
    const bulletMatch = line.match(bulletPattern);
    if (bulletMatch) {
      if (currentQuestion) {
        questionParts.push(currentQuestion);
      }
      currentQuestion = bulletMatch[1]?.trim() ?? "";
      continue;
    }

    if (currentQuestion) {
      currentQuestion = `${currentQuestion} ${line}`.trim();
      continue;
    }

    introParts.push(line);
  }

  if (currentQuestion) {
    questionParts.push(currentQuestion);
  }

  if (questionParts.length < 2) {
    return null;
  }

  return {
    intro: introParts.join("\n\n"),
    parts: questionParts,
  };
}

function buildCompositeAnswer(prompts: string[], values: string[]): string {
  return prompts
    .map((prompt, index) => {
      const answer = values[index]?.trim() ?? "";
      return `${index + 1}. ${prompt}\nAntwort: ${answer}`;
    })
    .join("\n\n");
}

type InterpretationQuestionCardProps =
  // Default mode: each answer submits (and triggers a replan) immediately.
  | {
      mode?: "submit";
      activityName: string;
      question: InterpretationQuestion;
      isSubmitting: boolean;
      onSubmit: (input: { questionId: string; answeredValue: string }) => void;
    }
  // Batch mode: picking/typing an answer only stages it in the parent's
  // draft state — nothing is submitted until the parent sends every staged
  // answer together in one call. selectedValue reflects the current draft
  // so a chosen option can be shown visually selected.
  | {
      mode: "select";
      activityName: string;
      question: InterpretationQuestion;
      isSubmitting: boolean;
      selectedValue: string | null;
      onSelectionChange: (input: {
        questionId: string;
        answeredValue: string;
      }) => void;
    };

// Both current callers (activityAnalysisV2Panel.tsx, interpretation.tsx)
// pre-filter to status === "pending" before rendering this card, so it only
// ever needs to render the answer-collection form — there is no "already
// answered, click to edit" state to support here.
export function InterpretationQuestionCard(
  props: InterpretationQuestionCardProps,
) {
  const { activityName, question, isSubmitting } = props;
  const { t } = useTranslation();
  const compositePrompt =
    question.kind === "free_text" || !question.options?.length
      ? parseCompositePrompt(question.prompt)
      : null;
  const [freeTextValue, setFreeTextValue] = useState(
    question.answeredValue ??
      (props.mode === "select" ? (props.selectedValue ?? "") : ""),
  );
  const [compositeValues, setCompositeValues] = useState<string[]>(
    () => compositePrompt?.parts.map(() => "") ?? [],
  );

  function commitAnswer(answeredValue: string) {
    if (props.mode === "select") {
      props.onSelectionChange({ questionId: question.id, answeredValue });
      return;
    }
    if (!answeredValue.trim()) {
      return;
    }
    props.onSubmit({ questionId: question.id, answeredValue });
  }

  function updateFreeTextValue(value: string) {
    setFreeTextValue(value);
    if (props.mode === "select") {
      commitAnswer(value.trim());
    }
  }

  function updateCompositeValue(index: number, value: string) {
    const nextValues = compositeValues.map((current, currentIndex) =>
      currentIndex === index ? value : current,
    );
    setCompositeValues(nextValues);
    if (props.mode === "select" && compositePrompt) {
      // Only stage a combined answer once every part has something in it —
      // otherwise the parent would treat this question as "answered" with
      // a partially blank composite response.
      const isComplete = nextValues.every((current) => current.trim());
      commitAnswer(
        isComplete
          ? buildCompositeAnswer(compositePrompt.parts, nextValues)
          : "",
      );
    }
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {activityName}
        </div>
        <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
          {question.isBlocking
            ? t("projectWorkspace.interpretation.questionRequiredLabel")
            : t("projectWorkspace.interpretation.questionOptionalLabel")}
        </Badge>
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {t(getQuestionDomainLabelKey(question.questionDomain))}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
        {compositePrompt?.intro || question.prompt}
      </p>
      {question.kind === "free_text" || !question.options?.length ? (
        compositePrompt ? (
          <div className="mt-4 space-y-4">
            {compositePrompt.parts.map((part, index) => (
              <div key={`${question.id}-part-${index}`} className="space-y-2">
                <p className="text-sm font-medium leading-6 text-foreground">
                  {index + 1}. {part}
                </p>
                <Textarea
                  value={compositeValues[index] ?? ""}
                  onChange={(event) =>
                    updateCompositeValue(index, event.target.value)
                  }
                  placeholder={t(
                    "projectWorkspace.interpretation.questionFreeTextPlaceholder",
                  )}
                  className="min-h-24"
                />
              </div>
            ))}
            {props.mode === "select" ? null : (
              <Button
                size="sm"
                onClick={() =>
                  commitAnswer(
                    buildCompositeAnswer(
                      compositePrompt.parts,
                      compositeValues,
                    ),
                  )
                }
                disabled={
                  compositeValues.some((value) => !value.trim()) || isSubmitting
                }
              >
                {isSubmitting
                  ? t("projectWorkspace.interpretation.questionSubmitting")
                  : t("projectWorkspace.interpretation.questionSubmit")}
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <Input
              value={freeTextValue}
              onChange={(event) => updateFreeTextValue(event.target.value)}
              placeholder={t(
                "projectWorkspace.interpretation.questionFreeTextPlaceholder",
              )}
              className="max-w-sm"
            />
            {props.mode === "select" ? null : (
              <Button
                size="sm"
                onClick={() => commitAnswer(freeTextValue)}
                disabled={!freeTextValue.trim() || isSubmitting}
              >
                {isSubmitting
                  ? t("projectWorkspace.interpretation.questionSubmitting")
                  : t("projectWorkspace.interpretation.questionSubmit")}
              </Button>
            )}
          </div>
        )
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.options.map((option) => {
            const isRecommended =
              question.recommendedOption === option &&
              (question.recommendedConfidence ?? 0) >= 0.8;
            const isSelected =
              props.mode === "select" && props.selectedValue === option;
            return (
              <Button
                key={option}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => commitAnswer(option)}
                disabled={isSubmitting}
                aria-pressed={props.mode === "select" ? isSelected : undefined}
              >
                <span>{option}</span>
                {isRecommended ? (
                  <span className="text-[10px] uppercase tracking-[0.08em] opacity-70">
                    {t("projectWorkspace.interpretation.questionRecommended")}
                  </span>
                ) : null}
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
