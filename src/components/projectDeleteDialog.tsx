import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    name: string;
  } | null;
  isDeleting: boolean;
  onConfirm: (projectName: string) => Promise<void>;
}

export function ProjectDeleteDialog({
  open,
  onOpenChange,
  project,
  isDeleting,
  onConfirm,
}: ProjectDeleteDialogProps) {
  const locale = useWorkspaceLocale();
  const [projectNameConfirmation, setProjectNameConfirmation] = useState("");

  useEffect(() => {
    if (!open) {
      setProjectNameConfirmation("");
    }
  }, [open, project?.id]);

  const projectNameMatches = projectNameConfirmation === project?.name;
  const deletionImpacts = [
    locale.projectDelete.impacts.activities,
    locale.projectDelete.impacts.datasets,
    locale.projectDelete.impacts.jobs,
    locale.projectDelete.impacts.reviews,
    locale.projectDelete.impacts.analyses,
    locale.projectDelete.impacts.insights,
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectNameMatches || !project) {
      return;
    }

    await onConfirm(projectNameConfirmation);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[28px] border border-border/80 bg-card/98 p-0 shadow-[var(--shadow-elevated)]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border/70 px-8 py-6 text-left">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {locale.projectDelete.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              {locale.projectDelete.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-8 py-6">
            <ul className="space-y-3 rounded-2xl border border-border bg-secondary/25 p-5 text-sm text-foreground">
              {deletionImpacts.map((impact) => (
                <li key={impact} className="flex items-start gap-3">
                  <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{impact}</span>
                </li>
              ))}
            </ul>

            <div className="grid gap-2">
              <Label htmlFor="project-delete-confirmation">
                {locale.projectDelete.confirmLabel}
              </Label>
              <Input
                id="project-delete-confirmation"
                value={projectNameConfirmation}
                onChange={(event) =>
                  setProjectNameConfirmation(event.target.value)
                }
                placeholder={project?.name ?? ""}
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border/70 px-8 py-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              {locale.dialogs.cancel}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!projectNameMatches || isDeleting}
            >
              {isDeleting
                ? locale.projectDelete.deleting
                : locale.projectDelete.confirmAction}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
