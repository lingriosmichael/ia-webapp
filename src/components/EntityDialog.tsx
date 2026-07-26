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
  submitDisabled,
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
  submitDisabled?: boolean;
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
            <Button type="submit" disabled={isSubmitting || submitDisabled}>
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
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      {title || description ? (
        <div>
          {title ? (
            <h3 className="text-sm font-semibold tracking-tight text-primary">
              {title}
            </h3>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function FieldLabel({
  children,
  optionalLabel,
}: {
  children: ReactNode;
  optionalLabel?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-foreground">{children}</label>
      {optionalLabel ? (
        <span className="text-xs text-muted-foreground">({optionalLabel})</span>
      ) : null}
    </div>
  );
}
