import { useEffect, useState } from "react";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import type {
  CreateOutcomeStatementPayload,
  OutcomeTerm,
  ProjectOutcomeStatement,
} from "@/services/apiClient";
import {
  EntityDialog,
  DialogSection,
  FieldLabel,
} from "@/components/EntityDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface OutcomeStatementDialogState {
  term: OutcomeTerm;
  statement: string;
}

const initialState: OutcomeStatementDialogState = {
  term: "short",
  statement: "",
};

export function OutcomeStatementDialog({
  open,
  onOpenChange,
  isSubmitting,
  mode = "create",
  initialOutcomeStatement,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  initialOutcomeStatement?: ProjectOutcomeStatement | null;
  onSubmit: (payload: CreateOutcomeStatementPayload) => Promise<void> | void;
}) {
  const locale = useWorkspaceLocale();
  const [form, setForm] = useState<OutcomeStatementDialogState>(initialState);

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      return;
    }

    if (initialOutcomeStatement) {
      setForm({
        term: initialOutcomeStatement.term,
        statement: initialOutcomeStatement.statement,
      });
      return;
    }

    setForm(initialState);
  }, [initialOutcomeStatement, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      term: form.term,
      statement: form.statement.trim(),
    });

    onOpenChange(false);
  }

  return (
    <EntityDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "edit"
          ? locale.dialogs.editOutcomeStatementTitle
          : locale.dialogs.createOutcomeStatementTitle
      }
      description={
        mode === "edit" ? locale.dialogs.editOutcomeStatementDescription : null
      }
      submitLabel={
        isSubmitting
          ? mode === "edit"
            ? locale.dialogs.outcomeStatement.updating
            : locale.dialogs.outcomeStatement.creating
          : mode === "edit"
            ? locale.dialogs.outcomeStatement.updateSubmit
            : locale.dialogs.outcomeStatement.submit
      }
      cancelLabel={locale.dialogs.cancel}
      isSubmitting={isSubmitting}
      submitDisabled={form.statement.trim().length === 0}
      onSubmit={handleSubmit}
    >
      <DialogSection>
        <div className="space-y-5">
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.outcomeStatement.term}</FieldLabel>
            <Select
              value={form.term}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  term: value as OutcomeTerm,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">
                  {locale.dialogs.outcomeStatement.termShort}
                </SelectItem>
                <SelectItem value="long">
                  {locale.dialogs.outcomeStatement.termLong}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.outcomeStatement.statement}</FieldLabel>
            <Textarea
              value={form.statement}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  statement: event.target.value,
                }))
              }
              placeholder={locale.dialogs.outcomeStatement.statementPlaceholder}
              rows={4}
              required
            />
          </div>
        </div>
      </DialogSection>
    </EntityDialog>
  );
}
