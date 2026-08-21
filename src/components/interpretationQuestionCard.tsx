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

function sanitizeClarificationPrompt(prompt: string): string {
  return prompt
    .replace(
      /,?\s*(?:uploadMetadataId|metadataId|goalId)\s*[:=]\s*["']?[0-9a-f-]{8,}["']?/gi,
      "",
    )
    .replace(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
      "",
    )
    .replace(/\(\s*,?\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

// Option text is AI-generated and can run to a full sentence, unlike the
// short fixed labels the shared Button component is styled for (which stay
// on one line by design). Override that here so long options wrap inside
// the card instead of overflowing it.
const OPTION_BUTTON_CLASSNAME =
  "h-auto max-w-full min-h-8 justify-start gap-2 whitespace-normal break-words py-1.5 text-left";

function buildCompositeAnswer(prompts: string[], values: string[]): string {
  return prompts
    .map((prompt, index) => {
      const answer = values[index]?.trim() ?? "";
      return `${index + 1}. ${prompt}\nAntwort: ${answer}`;
    })
    .join("\n\n");
}

function normalizeOptionToken(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function parseSelectedOptionsFromAnswer(
  answer: string | null,
  options: string[],
): string[] {
  if (!answer) {
    return [];
  }

  const normalizedAnswer = normalizeOptionToken(answer);
  if (normalizedAnswer === "alle" || normalizedAnswer === "all") {
    return options;
  }

  const exactTokens = new Set(
    answer
      .split(/[,;\n]/)
      .map((token) => normalizeOptionToken(token))
      .filter(Boolean),
  );

  return options.filter((option) =>
    exactTokens.has(normalizeOptionToken(option)),
  );
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
  const displayPrompt = sanitizeClarificationPrompt(question.prompt);
  const recommendedValue =
    question.recommendedOption && (question.recommendedConfidence ?? 0) >= 0.8
      ? sanitizeClarificationPrompt(question.recommendedOption)
      : null;
  const selectableStatusOptions =
    question.questionCode === "positive_status_values" &&
    question.options?.length
      ? question.options
      : null;
  const compositePrompt =
    question.kind === "free_text" || !question.options?.length
      ? parseCompositePrompt(displayPrompt)
      : null;
  const [freeTextValue, setFreeTextValue] = useState(
    question.answeredValue ??
      (props.mode === "select" ? (props.selectedValue ?? "") : ""),
  );
  const [compositeValues, setCompositeValues] = useState<string[]>(
    () => compositePrompt?.parts.map(() => "") ?? [],
  );
  const [selectedStatusValues, setSelectedStatusValues] = useState<string[]>(
    () =>
      parseSelectedOptionsFromAnswer(
        question.answeredValue ??
          (props.mode === "select" ? (props.selectedValue ?? "") : ""),
        selectableStatusOptions ?? [],
      ),
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

  function buildSelectedStatusAnswer(values: string[]): string {
    return values.join(", ");
  }

  function toggleStatusValue(option: string) {
    const nextValues = selectedStatusValues.includes(option)
      ? selectedStatusValues.filter((value) => value !== option)
      : [...selectedStatusValues, option];
    setSelectedStatusValues(nextValues);
    if (props.mode === "select") {
      commitAnswer(buildSelectedStatusAnswer(nextValues));
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
        {compositePrompt?.intro || displayPrompt}
      </p>
      {recommendedValue &&
      !(question.kind === "free_text" || !question.options?.length) ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[12px] border border-primary/20 bg-primary-soft/60 px-3 py-2 text-sm text-foreground">
          <Badge
            variant="outline"
            className="border-primary/30 bg-white/70 text-primary"
          >
            {t("projectWorkspace.interpretation.questionRecommended")}
          </Badge>
          <span className="font-medium">{recommendedValue}</span>
        </div>
      ) : null}
      {selectableStatusOptions ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {selectableStatusOptions.map((option) => {
              const isSelected = selectedStatusValues.includes(option);
              return (
                <Button
                  key={option}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={OPTION_BUTTON_CLASSNAME}
                  onClick={() => toggleStatusValue(option)}
                  disabled={isSubmitting}
                  aria-pressed={isSelected}
                >
                  {option}
                </Button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {props.mode === "select" ? null : (
              <Button
                size="sm"
                onClick={() =>
                  commitAnswer(buildSelectedStatusAnswer(selectedStatusValues))
                }
                disabled={!selectedStatusValues.length || isSubmitting}
              >
                {isSubmitting
                  ? t("projectWorkspace.interpretation.questionSubmitting")
                  : t("projectWorkspace.interpretation.questionSubmit")}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const nextValues = [...selectableStatusOptions];
                setSelectedStatusValues(nextValues);
                if (props.mode === "select") {
                  commitAnswer(buildSelectedStatusAnswer(nextValues));
                }
              }}
              disabled={
                isSubmitting ||
                selectedStatusValues.length === selectableStatusOptions.length
              }
            >
              {t("projectWorkspace.interpretation.questionSelectAllOptions")}
            </Button>
          </div>
        </div>
      ) : question.kind === "free_text" || !question.options?.length ? (
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
          <div className="mt-3 space-y-3">
            {recommendedValue ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-white/70 text-primary"
                >
                  {t("projectWorkspace.interpretation.questionRecommended")}
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={OPTION_BUTTON_CLASSNAME}
                  onClick={() => updateFreeTextValue(recommendedValue)}
                  disabled={isSubmitting}
                >
                  {recommendedValue}
                </Button>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
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
          </div>
        )
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.options.map((option) => {
            const isRecommended = recommendedValue === option;
            const isSelected =
              props.mode === "select" && props.selectedValue === option;
            return (
              <Button
                key={option}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={
                  isRecommended && !isSelected
                    ? `${OPTION_BUTTON_CLASSNAME} border-primary/35 bg-primary-soft text-primary hover:bg-primary-soft/80`
                    : OPTION_BUTTON_CLASSNAME
                }
                onClick={() => commitAnswer(option)}
                disabled={isSubmitting}
                aria-pressed={props.mode === "select" ? isSelected : undefined}
              >
                <span>{option}</span>
                {isRecommended ? (
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-white/70 text-primary"
                  >
                    {t("projectWorkspace.interpretation.questionRecommended")}
                  </Badge>
                ) : null}
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
