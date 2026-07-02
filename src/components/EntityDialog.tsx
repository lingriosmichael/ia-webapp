import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EntityDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  cancelLabel,
  isSubmitting,
  onSubmit,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  cancelLabel: string;
  isSubmitting?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto rounded-[28px] border border-border/80 bg-card/97 p-0 shadow-[var(--shadow-elevated)] backdrop-blur">
        <form onSubmit={onSubmit}>
          <DialogHeader className="border-b border-border/70 px-8 py-6">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8 px-8 py-6">{children}</div>
          <DialogFooter className="border-t border-border/70 px-8 py-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DialogSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-sm font-medium text-foreground">{children}</label>
  );
}
