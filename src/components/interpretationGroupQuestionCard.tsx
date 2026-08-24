import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { InterpretationQuestion } from "@/services/apiClient";

// Duplicated from interpretationQuestionCard.tsx rather than shared: these
// are just Tailwind utility strings, and this component intentionally
// doesn't reach into that file's private helpers/state.
const ANSWER_CHOICE_CLASSNAME =
  "h-auto max-w-full min-h-8 justify-start gap-1.5 rounded-[10px] px-2.5 py-1.5 text-left text-[0.8rem] leading-4 whitespace-normal break-words";
const TEXT_INPUT_CLASSNAME =
  "h-8 w-full max-w-[24rem] rounded-[10px] border-border/80 bg-white/85 px-2.5 text-[0.8rem] shadow-[var(--shadow-soft)]";

const SCALE_BOUNDS_PRESETS: Array<{ label: string; min: number; max: number }> =
  [
    { label: "1–5", min: 1, max: 5 },
    { label: "1–7", min: 1, max: 7 },
    { label: "0–10", min: 0, max: 10 },
  ];

function formatScaleBoundsAnswer(min: number, max: number): string {
  return `${min} to ${max}`;
}

interface InterpretationGroupQuestionCardProps {
  activityName: string;
  // One validated_scale_confirmation + one declared_scale_bounds question
  // per member column, all sharing the same preparationGroupId — see the
  // groupedByGroupId partition in interpretation.tsx.
  questions: InterpretationQuestion[];
  isSubmitting: boolean;
  draftAnswers: Record<string, string>;
  onAnswerChange: (input: {
    questionId: string;
    answeredValue: string;
  }) => void;
  onReject: () => void;
}

export function InterpretationGroupQuestionCard({
  activityName,
  questions,
  isSubmitting,
  draftAnswers,
  onAnswerChange,
  onReject,
}: InterpretationGroupQuestionCardProps) {
  const { t } = useTranslation();
  const confirmationMembers = questions.filter(
    (question) => question.questionCode === "validated_scale_confirmation",
  );
  const boundsMembers = questions.filter(
    (question) => question.questionCode === "declared_scale_bounds",
  );
  const confirmationQuestion = confirmationMembers[0] ?? null;
  const boundsQuestion = boundsMembers[0] ?? null;
  const memberColumns =
    confirmationQuestion?.preparationGroupColumns ??
    boundsQuestion?.preparationGroupColumns ??
    [];

  const [scaleBoundsMin, setScaleBoundsMin] = useState("");
  const [scaleBoundsMax, setScaleBoundsMax] = useState("");

  function applyToAllMembers(
    members: InterpretationQuestion[],
    answeredValue: string,
  ) {
    for (const member of members) {
      onAnswerChange({ questionId: member.id, answeredValue });
    }
  }

  function commitScaleBounds(min: string, max: string) {
    const parsedMin = Number.parseFloat(min);
    const parsedMax = Number.parseFloat(max);
    if (
      Number.isNaN(parsedMin) ||
      Number.isNaN(parsedMax) ||
      parsedMin >= parsedMax
    ) {
      return;
    }
    applyToAllMembers(
      boundsMembers,
      formatScaleBoundsAnswer(parsedMin, parsedMax),
    );
  }

  const selectedSelfRatingValue = confirmationQuestion
    ? (draftAnswers[confirmationQuestion.id] ?? null)
    : null;

  return (
    <Card className="border-primary/25 p-2.5 sm:p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="text-[1rem] font-semibold tracking-tight text-foreground">
          {activityName}
        </div>
        <Badge
          variant="secondary"
          className="rounded-full px-2 py-0.5 text-[0.58rem] font-semibold"
        >
          {t("projectWorkspace.interpretation.questionGroupBadge")}
        </Badge>
      </div>
      <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {t("projectWorkspace.interpretation.questionGroupSubtitle")}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {memberColumns.map((column) => (
          <Badge
            key={`${column.tableName}.${column.columnName}`}
            variant="outline"
            className="rounded-full px-2 py-0.5 font-mono text-[0.7rem] font-normal"
          >
            {column.columnName}
          </Badge>
        ))}
      </div>

      <p className="mt-2 text-[0.8rem] leading-5 text-foreground/75">
        {t("projectWorkspace.interpretation.questionGroupExplanation")}
      </p>

      {confirmationQuestion ? (
        <div className="mt-2 space-y-1.5">
          <p className="text-[0.8rem] font-medium leading-5 text-foreground">
            {confirmationQuestion.userFacingPrompt}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(confirmationQuestion.userFacingOptions ?? []).map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={
                  selectedSelfRatingValue === option.value
                    ? "default"
                    : "outline"
                }
                className={ANSWER_CHOICE_CLASSNAME}
                onClick={() =>
                  applyToAllMembers(confirmationMembers, option.value)
                }
                disabled={isSubmitting}
                aria-pressed={selectedSelfRatingValue === option.value}
              >
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {boundsQuestion ? (
        <div className="mt-2 space-y-1.5">
          <p className="text-[0.8rem] font-medium leading-5 text-foreground">
            {boundsQuestion.userFacingPrompt}
          </p>
          <p className="text-[0.72rem] leading-4 text-muted-foreground">
            {t("projectWorkspace.interpretation.questionScaleBoundsHint")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SCALE_BOUNDS_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant={
                  scaleBoundsMin === String(preset.min) &&
                  scaleBoundsMax === String(preset.max)
                    ? "default"
                    : "outline"
                }
                className={ANSWER_CHOICE_CLASSNAME}
                onClick={() => {
                  setScaleBoundsMin(String(preset.min));
                  setScaleBoundsMax(String(preset.max));
                  commitScaleBounds(String(preset.min), String(preset.max));
                }}
                disabled={isSubmitting}
              >
                <span>{preset.label}</span>
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Input
              type="number"
              value={scaleBoundsMin}
              onChange={(event) => {
                setScaleBoundsMin(event.target.value);
                commitScaleBounds(event.target.value, scaleBoundsMax);
              }}
              placeholder={t(
                "projectWorkspace.interpretation.questionScaleBoundsMinPlaceholder",
              )}
              className={cn(TEXT_INPUT_CLASSNAME, "max-w-[6rem]")}
            />
            <span className="text-[0.8rem] text-muted-foreground">
              {t("projectWorkspace.interpretation.questionScaleBoundsTo")}
            </span>
            <Input
              type="number"
              value={scaleBoundsMax}
              onChange={(event) => {
                setScaleBoundsMax(event.target.value);
                commitScaleBounds(scaleBoundsMin, event.target.value);
              }}
              placeholder={t(
                "projectWorkspace.interpretation.questionScaleBoundsMaxPlaceholder",
              )}
              className={cn(TEXT_INPUT_CLASSNAME, "max-w-[6rem]")}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-3 border-t border-border/60 pt-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-auto px-1.5 py-1 text-[0.72rem] font-medium text-muted-foreground hover:text-foreground"
          onClick={onReject}
          disabled={isSubmitting}
        >
          {t("projectWorkspace.interpretation.questionGroupRejectAction")}
        </Button>
      </div>
    </Card>
  );
}
