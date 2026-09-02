import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  ClarificationQuestionOption,
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

// Option text is AI-generated and can run to a full sentence, unlike the
// short fixed labels the shared Button component is styled for (which stay
// on one line by design). Override that here so long options wrap inside
// the card instead of overflowing it.
const ANSWER_CHOICE_CLASSNAME =
  "h-auto max-w-full min-h-8 justify-start gap-1.5 rounded-[10px] px-2.5 py-1.5 text-left text-[0.8rem] leading-4 whitespace-normal break-words";
const RECOMMENDATION_BADGE_CLASSNAME =
  "rounded-full border-primary/30 bg-white/85 px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.06em] text-primary";
const TEXT_INPUT_CLASSNAME =
  "h-8 w-full rounded-[10px] border-border/80 bg-white/85 px-2.5 text-[0.8rem] shadow-[var(--shadow-soft)]";
const TEXTAREA_CLASSNAME =
  "min-h-14 rounded-[10px] border-border/80 bg-white/85 px-2.5 py-2 text-[0.8rem] shadow-[var(--shadow-soft)]";
const RECOMMENDATION_PANEL_CLASSNAME =
  "flex w-full max-w-[24rem] items-center gap-1.5 rounded-[10px] border border-primary/20 bg-primary-soft/65 px-2.5 py-1.5 shadow-[var(--shadow-soft)]";

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

// Some previously-stored answers use a bare "alle"/"all" shorthand instead
// of a full comma-separated option list — e.g. an older answer format, or an
// LLM-prefilled draft. Recognized independent of the current UI language,
// since a stored answer may have been written under either locale; this
// component's own "select all" button never produces this shorthand itself
// (it writes out every option value instead — see buildMultiChoiceAnswer),
// so this exists purely to stay compatible with that upstream format.
const ALL_OPTIONS_SHORTHAND_TOKENS = new Set(["alle", "all"]);

function parseSelectedOptionsFromAnswer(
  answer: string | null,
  options: string[],
): string[] {
  if (!answer) {
    return [];
  }

  const normalizedAnswer = normalizeOptionToken(answer);
  if (ALL_OPTIONS_SHORTHAND_TOKENS.has(normalizedAnswer)) {
    return options;
  }

  if (answer.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(answer);
      if (!Array.isArray(parsed)) {
        return [];
      }

      const exactTokens = new Set(
        parsed
          .filter((token): token is string => typeof token === "string")
          .map((token) => normalizeOptionToken(token))
          .filter(Boolean),
      );

      return options.filter((option) =>
        exactTokens.has(normalizeOptionToken(option)),
      );
    } catch {
      return [];
    }
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

function QuestionCardHeader({
  activityName,
  statusLabel,
  domainLabel,
}: {
  activityName: string;
  statusLabel: string;
  domainLabel: string;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="text-[1rem] font-semibold tracking-tight text-foreground">
          {activityName}
        </div>
        <Badge
          variant="secondary"
          className="rounded-full px-2 py-0.5 text-[0.58rem] font-semibold"
        >
          {statusLabel}
        </Badge>
      </div>
      <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {domainLabel}
      </p>
    </>
  );
}

function AnswerChoiceButton({
  label,
  isSelected,
  isRecommended,
  onClick,
  disabled,
}: {
  label: string;
  isSelected: boolean;
  isRecommended?: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={cn(
        ANSWER_CHOICE_CLASSNAME,
        isRecommended && !isSelected
          ? "border-primary/35 bg-primary-soft text-primary hover:bg-primary-soft/80"
          : undefined,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
    >
      <span>{label}</span>
    </Button>
  );
}

function RecommendationPanel({
  label,
  value,
  isActive = false,
  onClick,
  disabled,
}: {
  label: string;
  value: string;
  isActive?: boolean;
  onClick?: (() => void) | null;
  disabled: boolean;
}) {
  if (!onClick) {
    return (
      <div className={RECOMMENDATION_PANEL_CLASSNAME}>
        <Badge variant="outline" className={RECOMMENDATION_BADGE_CLASSNAME}>
          {label}
        </Badge>
        <span className="text-[0.8rem] font-medium leading-4 text-foreground">
          {value}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        RECOMMENDATION_PANEL_CLASSNAME,
        "text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        isActive
          ? "border-signal/30 bg-primary-soft/80"
          : "hover:bg-primary-soft/78",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Badge variant="outline" className={RECOMMENDATION_BADGE_CLASSNAME}>
        {label}
      </Badge>
      <span className="text-[0.8rem] font-medium leading-4 text-foreground">
        {value}
      </span>
    </button>
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

// The current caller (routes/projects/$projectId/interpretation.tsx)
// pre-filters to status === "pending" before rendering this card, so it only
// ever needs to render the answer-collection form — there is no "already
// answered, click to edit" state to support here.
export function InterpretationQuestionCard(
  props: InterpretationQuestionCardProps,
) {
  const { activityName, question, isSubmitting } = props;
  const { t } = useTranslation();
  const displayPrompt = question.userFacingPrompt;
  const recommendedValue =
    question.recommendedOption && (question.recommendedConfidence ?? 0) >= 0.8
      ? question.recommendedOption
      : null;
  const multiChoiceOptions: ClarificationQuestionOption[] | null =
    question.kind === "multi_choice" && question.userFacingOptions?.length
      ? question.userFacingOptions
      : null;
  const multiChoiceValues =
    multiChoiceOptions?.map((option) => option.value) ?? [];
  const compositePrompt =
    question.kind === "free_text" || !question.userFacingOptions?.length
      ? parseCompositePrompt(displayPrompt)
      : null;
  const [freeTextValue, setFreeTextValue] = useState(
    question.answeredValue ??
      (props.mode === "select" ? (props.selectedValue ?? "") : ""),
  );
  const [compositeValues, setCompositeValues] = useState<string[]>(
    () => compositePrompt?.parts.map(() => "") ?? [],
  );
  const [selectedMultiChoiceValues, setSelectedMultiChoiceValues] = useState<
    string[]
  >(() =>
    parseSelectedOptionsFromAnswer(
      question.answeredValue ??
        (props.mode === "select" ? (props.selectedValue ?? "") : ""),
      multiChoiceValues,
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

  function buildMultiChoiceAnswer(values: string[]): string {
    return JSON.stringify(values);
  }

  function toggleMultiChoiceValue(option: string) {
    const nextValues = selectedMultiChoiceValues.includes(option)
      ? selectedMultiChoiceValues.filter((value) => value !== option)
      : [...selectedMultiChoiceValues, option];
    setSelectedMultiChoiceValues(nextValues);
    if (props.mode === "select") {
      commitAnswer(buildMultiChoiceAnswer(nextValues));
    }
  }

  const choiceRecommendedValue =
    question.kind !== "free_text" && question.userFacingOptions?.length
      ? (question.userFacingOptions.find(
          (option) => option.value === recommendedValue,
        )?.value ?? null)
      : null;
  const selectedChoiceValue =
    props.mode === "select"
      ? (props.selectedValue ?? null)
      : question.answeredValue;
  const recommendedLabel = t(
    "projectWorkspace.interpretation.questionRecommended",
  );
  const statusLabel = question.isBlocking
    ? t("projectWorkspace.interpretation.questionRequiredLabel")
    : t("projectWorkspace.interpretation.questionOptionalLabel");
  const promptText = compositePrompt?.intro || displayPrompt;

  function renderRecommendationPanel(
    value: string,
    options?: {
      onClick?: (() => void) | null;
      isActive?: boolean;
    },
  ) {
    return (
      <RecommendationPanel
        label={recommendedLabel}
        value={value}
        isActive={options?.isActive ?? false}
        onClick={options?.onClick}
        disabled={isSubmitting}
      />
    );
  }

  function renderSubmitButton(onClick: () => void, disabled: boolean) {
    if (props.mode === "select") {
      return null;
    }

    return (
      <Button size="sm" onClick={onClick} disabled={disabled}>
        {isSubmitting
          ? t("projectWorkspace.interpretation.questionSubmitting")
          : t("projectWorkspace.interpretation.questionSubmit")}
      </Button>
    );
  }

  function renderChoiceGroup({
    options,
    selectedValues,
    onSelect,
    recommended,
  }: {
    options: ClarificationQuestionOption[];
    selectedValues: string[];
    onSelect: (value: string) => void;
    recommended?: string | null;
  }) {
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <AnswerChoiceButton
            key={option.value}
            label={option.label}
            isSelected={selectedValues.includes(option.value)}
            isRecommended={option.value === recommended}
            onClick={() => onSelect(option.value)}
            disabled={isSubmitting}
          />
        ))}
      </div>
    );
  }

  return (
    <Card className="p-2.5 sm:p-3">
      <QuestionCardHeader
        activityName={activityName}
        statusLabel={statusLabel}
        domainLabel={t(getQuestionDomainLabelKey(question.questionDomain))}
      />
      <p className="mt-2 whitespace-pre-line text-[0.8rem] leading-5 text-foreground/75">
        {promptText}
      </p>
      {multiChoiceOptions ? (
        <>
          {renderChoiceGroup({
            options: multiChoiceOptions,
            selectedValues: selectedMultiChoiceValues,
            onSelect: toggleMultiChoiceValue,
            recommended:
              recommendedValue && multiChoiceValues.includes(recommendedValue)
                ? recommendedValue
                : null,
          })}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {renderSubmitButton(
              () =>
                commitAnswer(buildMultiChoiceAnswer(selectedMultiChoiceValues)),
              !selectedMultiChoiceValues.length || isSubmitting,
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const nextValues = [...multiChoiceValues];
                setSelectedMultiChoiceValues(nextValues);
                if (props.mode === "select") {
                  commitAnswer(buildMultiChoiceAnswer(nextValues));
                }
              }}
              disabled={
                isSubmitting ||
                selectedMultiChoiceValues.length === multiChoiceValues.length
              }
            >
              {t("projectWorkspace.interpretation.questionSelectAllOptions")}
            </Button>
          </div>
        </>
      ) : question.kind === "free_text" ||
        !question.userFacingOptions?.length ? (
        compositePrompt ? (
          <div className="mt-2 space-y-2">
            {compositePrompt.parts.map((part, index) => (
              <div key={`${question.id}-part-${index}`} className="space-y-1.5">
                <p className="text-[0.8rem] font-medium leading-5 text-foreground">
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
                  className={TEXTAREA_CLASSNAME}
                />
              </div>
            ))}
            {renderSubmitButton(
              () =>
                commitAnswer(
                  buildCompositeAnswer(compositePrompt.parts, compositeValues),
                ),
              compositeValues.some((value) => !value.trim()) || isSubmitting,
            )}
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {recommendedValue
              ? renderRecommendationPanel(recommendedValue, {
                  onClick: () => updateFreeTextValue(recommendedValue),
                  isActive: freeTextValue.trim() === recommendedValue,
                })
              : null}
            <div className="flex flex-wrap gap-1.5">
              <Input
                value={freeTextValue}
                onChange={(event) => updateFreeTextValue(event.target.value)}
                placeholder={t(
                  "projectWorkspace.interpretation.questionFreeTextPlaceholder",
                )}
                className={TEXT_INPUT_CLASSNAME}
              />
              {renderSubmitButton(
                () => commitAnswer(freeTextValue),
                !freeTextValue.trim() || isSubmitting,
              )}
            </div>
          </div>
        )
      ) : (
        renderChoiceGroup({
          options: question.userFacingOptions ?? [],
          selectedValues: selectedChoiceValue ? [selectedChoiceValue] : [],
          onSelect: commitAnswer,
          recommended: choiceRecommendedValue,
        })
      )}
    </Card>
  );
}
