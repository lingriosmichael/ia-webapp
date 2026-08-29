import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X } from "lucide-react";
import { Card } from "@/components/WorkspaceUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { InterpretationQuestion } from "@/services/apiClient";

// A dedicated drop target id for "not assigned to any cohort yet" — distinct
// from any real group name a human could type, since group names are
// arbitrary free text and could otherwise collide with an internal id.
const UNASSIGNED_DROP_ID = "__cohort_unassigned__";
const TEXT_INPUT_CLASSNAME =
  "h-8 w-full max-w-[16rem] rounded-[10px] border-border/80 bg-white/85 px-2.5 text-[0.8rem] shadow-[var(--shadow-soft)]";

interface CohortFileEntry {
  questionId: string;
  tableName: string;
  // Already-answered files are shown for context but are not draggable —
  // this app has no "already answered, click to edit" flow anywhere else
  // in the interpretation UI, and this board follows that same convention
  // rather than introducing re-answering just for this one question type.
  isPending: boolean;
}

interface InterpretationCohortGroupingBoardProps {
  questions: InterpretationQuestion[];
  draftAnswers: Record<string, string>;
  isSubmitting: boolean;
  onAnswerChange: (input: {
    questionId: string;
    answeredValue: string;
  }) => void;
}

export function InterpretationCohortGroupingBoard({
  questions,
  draftAnswers,
  isSubmitting,
  onAnswerChange,
}: InterpretationCohortGroupingBoardProps) {
  const { t } = useTranslation();
  const [manualEmptyGroupNames, setManualEmptyGroupNames] = useState<string[]>(
    [],
  );
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [activeDragTableName, setActiveDragTableName] = useState<string | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const pendingEntries = questions.filter(
    (question) => question.status === "pending",
  );

  const groups = new Map<string, CohortFileEntry[]>();
  function addToGroup(groupName: string, entry: CohortFileEntry) {
    const existing = groups.get(groupName) ?? [];
    existing.push(entry);
    groups.set(groupName, existing);
  }

  for (const question of questions) {
    if (question.status === "pending") {
      continue;
    }
    const groupName = question.answeredValue?.trim();
    if (groupName) {
      addToGroup(groupName, {
        questionId: question.id,
        tableName: question.targetTableName ?? "",
        isPending: false,
      });
    }
  }

  const unassigned: CohortFileEntry[] = [];
  for (const question of pendingEntries) {
    const draftValue = draftAnswers[question.id]?.trim();
    const entry: CohortFileEntry = {
      questionId: question.id,
      tableName: question.targetTableName ?? "",
      isPending: true,
    };
    if (draftValue) {
      addToGroup(draftValue, entry);
    } else {
      unassigned.push(entry);
    }
  }

  const groupNames = Array.from(
    new Set([...groups.keys(), ...manualEmptyGroupNames]),
  ).sort((left, right) => left.localeCompare(right));

  // Trivial case: exactly one file, ever, and nothing to group it
  // against — a whole board with drop targets would just be extra chrome
  // for a decision with no alternative to weigh yet.
  if (
    questions.length === 1 &&
    pendingEntries.length === 1 &&
    groupNames.length === 0
  ) {
    const onlyQuestion = pendingEntries[0]!;
    return (
      <Card className="space-y-2 p-2.5 sm:p-3">
        <p className="text-sm leading-6 text-muted-foreground">
          {t(
            "projectWorkspace.interpretation.cohortGrouping.instructionSingle",
          )}
        </p>
        <Input
          className={TEXT_INPUT_CLASSNAME}
          value={draftAnswers[onlyQuestion.id] ?? ""}
          onChange={(event) =>
            onAnswerChange({
              questionId: onlyQuestion.id,
              answeredValue: event.target.value,
            })
          }
          placeholder={t(
            "projectWorkspace.interpretation.cohortGrouping.newGroupPlaceholder",
          )}
          disabled={isSubmitting}
        />
      </Card>
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const entry = pendingEntries.find(
      (question) => question.id === event.active.id,
    );
    setActiveDragTableName(entry?.targetTableName ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragTableName(null);
    const overId = event.over?.id;
    if (!overId || typeof event.active.id !== "string") {
      return;
    }
    const groupName = overId === UNASSIGNED_DROP_ID ? "" : String(overId);
    onAnswerChange({ questionId: event.active.id, answeredValue: groupName });
    if (groupName) {
      setManualEmptyGroupNames((current) =>
        current.filter((name) => name !== groupName),
      );
    }
  }

  function confirmNewGroup() {
    const trimmed = newGroupName.trim();
    if (
      !trimmed ||
      groupNames.some((name) => name.toLowerCase() === trimmed.toLowerCase())
    ) {
      return;
    }
    setManualEmptyGroupNames((current) => [...current, trimmed]);
    setNewGroupName("");
    setIsAddingGroup(false);
  }

  return (
    <Card className="space-y-3 p-2.5 sm:p-3">
      <p className="text-sm leading-6 text-muted-foreground">
        {t("projectWorkspace.interpretation.cohortGrouping.instruction")}
      </p>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {groupNames.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {groupNames.map((groupName) => (
              <CohortGroupBox
                key={groupName}
                groupName={groupName}
                members={groups.get(groupName) ?? []}
                isRemovableEmpty={
                  manualEmptyGroupNames.includes(groupName) &&
                  !groups.get(groupName)?.length
                }
                onRemoveEmpty={() =>
                  setManualEmptyGroupNames((current) =>
                    current.filter((name) => name !== groupName),
                  )
                }
              />
            ))}
          </div>
        ) : null}

        {isAddingGroup ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <Input
              autoFocus
              value={newGroupName}
              onChange={(event) => setNewGroupName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  confirmNewGroup();
                } else if (event.key === "Escape") {
                  setIsAddingGroup(false);
                  setNewGroupName("");
                }
              }}
              placeholder={t(
                "projectWorkspace.interpretation.cohortGrouping.newGroupPlaceholder",
              )}
              className={TEXT_INPUT_CLASSNAME}
            />
            <Button
              type="button"
              size="sm"
              onClick={confirmNewGroup}
              disabled={!newGroupName.trim()}
            >
              {t(
                "projectWorkspace.interpretation.cohortGrouping.addGroupConfirm",
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAddingGroup(false);
                setNewGroupName("");
              }}
            >
              {t(
                "projectWorkspace.interpretation.cohortGrouping.addGroupCancel",
              )}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setIsAddingGroup(true)}
            disabled={isSubmitting}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("projectWorkspace.interpretation.cohortGrouping.addGroupAction")}
          </Button>
        )}

        {unassigned.length > 0 ? <UnassignedTray members={unassigned} /> : null}

        <DragOverlay>
          {activeDragTableName ? (
            <div className="rounded-[10px] border border-primary/40 bg-white px-2.5 py-1.5 text-[0.78rem] shadow-[var(--shadow-elevated)]">
              {activeDragTableName}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}

function CohortGroupBox({
  groupName,
  members,
  isRemovableEmpty,
  onRemoveEmpty,
}: {
  groupName: string;
  members: CohortFileEntry[];
  isRemovableEmpty: boolean;
  onRemoveEmpty: () => void;
}) {
  const { t } = useTranslation();
  const { isOver, setNodeRef } = useDroppable({ id: groupName });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[5.5rem] rounded-[12px] border-2 border-dashed border-border/70 bg-secondary/20 p-2.5 transition-colors",
        isOver && "border-primary/60 bg-primary-soft/40",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[0.82rem] font-semibold text-foreground">
          {groupName}
        </div>
        {isRemovableEmpty ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={onRemoveEmpty}
            aria-label={t(
              "projectWorkspace.interpretation.cohortGrouping.removeEmptyGroupAction",
            )}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {members.length === 0 ? (
          <p className="text-[0.72rem] text-muted-foreground">
            {t("projectWorkspace.interpretation.cohortGrouping.groupEmptyHint")}
          </p>
        ) : (
          members.map((member) => (
            <DraggableFileChip key={member.questionId} entry={member} />
          ))
        )}
      </div>
    </div>
  );
}

function UnassignedTray({ members }: { members: CohortFileEntry[] }) {
  const { t } = useTranslation();
  const { isOver, setNodeRef } = useDroppable({ id: UNASSIGNED_DROP_ID });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-[12px] border border-border/70 bg-white/60 p-2.5 transition-colors",
        isOver && "border-primary/60 bg-primary-soft/30",
      )}
    >
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {t("projectWorkspace.interpretation.cohortGrouping.unassignedTitle")}
      </div>
      <p className="mt-1 text-[0.72rem] text-muted-foreground">
        {t(
          "projectWorkspace.interpretation.cohortGrouping.unassignedDescription",
        )}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {members.map((member) => (
          <DraggableFileChip key={member.questionId} entry={member} />
        ))}
      </div>
    </div>
  );
}

function DraggableFileChip({ entry }: { entry: CohortFileEntry }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: entry.questionId,
      disabled: !entry.isPending,
    });

  if (!entry.isPending) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white/70 px-2 py-1 text-[0.72rem] text-muted-foreground">
        {entry.tableName}
      </span>
    );
  }

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "inline-flex cursor-grab items-center gap-1 rounded-full border border-primary/30 bg-white px-2 py-1 text-[0.72rem] font-medium text-foreground shadow-[var(--shadow-soft)] active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
    >
      <GripVertical className="h-3 w-3 text-muted-foreground" />
      {entry.tableName}
    </button>
  );
}
