import { AlertTriangle } from "lucide-react";
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

interface ActivityDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityName: string | null;
  isDeleting: boolean;
  onConfirm: () => Promise<void> | void;
}

export function ActivityDeleteDialog({
  open,
  onOpenChange,
  activityName,
  isDeleting,
  onConfirm,
}: ActivityDeleteDialogProps) {
  const locale = useWorkspaceLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[28px] border border-border/80 bg-card/98 p-0 shadow-[var(--shadow-elevated)]">
        <DialogHeader className="border-b border-border/70 px-8 py-6 text-left">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {locale.activityDelete.title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
            {locale.activityDelete.description.replace(
              "{{name}}",
              activityName ?? "",
            )}
          </DialogDescription>
        </DialogHeader>

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
            type="button"
            variant="destructive"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
          >
            {isDeleting
              ? locale.activityDelete.deleting
              : locale.activityDelete.confirmAction}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
