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

function buildCompositeAnswer(
  prompts: string[],
  values: string[],
): string {
  return prompts
    .map((prompt, index) => {
      const answer = values[index]?.trim() ?? "";
      return `${index + 1}. ${prompt}\nAntwort: ${answer}`;
    })
    .join("\n\n");
}

// Both current callers (activityAnalysisV2Panel.tsx, interpretation.tsx)
// pre-filter to status === "pending" before rendering this card, so it only
// ever needs to render the answer-collection form — there is no "already
// answered, click to edit" state to support here.
export function InterpretationQuestionCard({
  activityName,
  question,
  isSubmitting,
  onSubmit,
}: {
  activityName: string;
  question: InterpretationQuestion;
  isSubmitting: boolean;
  onSubmit: (input: { questionId: string; answeredValue: string }) => void;
}) {
  const { t } = useTranslation();
  const compositePrompt =
    question.kind === "free_text" || !question.options?.length
      ? parseCompositePrompt(question.prompt)
      : null;
  const [freeTextValue, setFreeTextValue] = useState(
    question.answeredValue ?? "",
  );
  const [compositeValues, setCompositeValues] = useState<string[]>(
    () => compositePrompt?.parts.map(() => "") ?? [],
  );

  function submitAnswer(answeredValue: string) {
    if (!answeredValue.trim()) {
      return;
    }
    onSubmit({ questionId: question.id, answeredValue });
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
                    setCompositeValues((currentValues) =>
                      currentValues.map((value, valueIndex) =>
                        valueIndex === index ? event.target.value : value,
                      ),
                    )
                  }
                  placeholder={t(
                    "projectWorkspace.interpretation.questionFreeTextPlaceholder",
                  )}
                  className="min-h-24"
                />
              </div>
            ))}
            <Button
              size="sm"
              onClick={() =>
                submitAnswer(
                  buildCompositeAnswer(compositePrompt.parts, compositeValues),
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
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <Input
              value={freeTextValue}
              onChange={(event) => setFreeTextValue(event.target.value)}
              placeholder={t(
                "projectWorkspace.interpretation.questionFreeTextPlaceholder",
              )}
              className="max-w-sm"
            />
            <Button
              size="sm"
              onClick={() => submitAnswer(freeTextValue)}
              disabled={!freeTextValue.trim() || isSubmitting}
            >
              {isSubmitting
                ? t("projectWorkspace.interpretation.questionSubmitting")
                : t("projectWorkspace.interpretation.questionSubmit")}
            </Button>
          </div>
        )
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.options.map((option) => {
            const isRecommended =
              question.recommendedOption === option &&
              (question.recommendedConfidence ?? 0) >= 0.8;
            return (
              <Button
                key={option}
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => submitAnswer(option)}
                disabled={isSubmitting}
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
