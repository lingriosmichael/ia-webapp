import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [freeTextValue, setFreeTextValue] = useState(
    question.answeredValue ?? "",
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
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {question.prompt}
      </p>
      {question.kind === "free_text" || !question.options?.length ? (
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
