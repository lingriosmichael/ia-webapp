import { useEffect, useState } from "react";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OutcomeStatementImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: string[];
  isImporting: boolean;
  onConfirm: (selectedStatements: string[]) => Promise<void> | void;
}

export function OutcomeStatementImportDialog({
  open,
  onOpenChange,
  candidates,
  isImporting,
  onConfirm,
}: OutcomeStatementImportDialogProps) {
  const locale = useWorkspaceLocale();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setSelected(new Set(candidates));
    }
  }, [open, candidates]);

  function toggle(candidate: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(candidate);
      } else {
        next.delete(candidate);
      }
      return next;
    });
  }

  async function handleConfirm() {
    await onConfirm(candidates.filter((candidate) => selected.has(candidate)));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-[28px] border border-border/80 bg-card/98 p-0 shadow-[var(--shadow-elevated)]">
        <DialogHeader className="border-b border-border/70 px-8 py-6 text-left">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {locale.outcomeStatements.importTitle}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
            {locale.outcomeStatements.importDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-8 py-6">
          {candidates.map((candidate) => (
            <label
              key={candidate}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-secondary/20 px-4 py-3"
            >
              <Checkbox
                checked={selected.has(candidate)}
                onCheckedChange={(checked) =>
                  toggle(candidate, checked === true)
                }
                className="mt-0.5"
              />
              <span className="text-sm leading-6 text-foreground">
                {candidate}
              </span>
            </label>
          ))}
        </div>

        <DialogFooter className="border-t border-border/70 px-8 py-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            {locale.dialogs.cancel}
          </Button>
          <Button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={isImporting || selected.size === 0}
          >
            {isImporting
              ? locale.outcomeStatements.importing
              : locale.outcomeStatements.importAction.replace(
                  "{{count}}",
                  String(selected.size),
                )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
