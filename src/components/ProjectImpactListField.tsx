import { Plus, X } from "lucide-react";
import { FieldLabel } from "@/components/EntityDialog";
import { Input } from "@/components/ui/input";

export function ProjectImpactListField({
  label,
  values,
  placeholder,
  error,
  onChangeValue,
  onAddRow,
  onRemoveRow,
  addRowAriaLabel,
  removeRowAriaLabel,
  maxItems = 3,
}: {
  label: string;
  values: string[];
  placeholder: string;
  error?: string;
  onChangeValue: (index: number, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  addRowAriaLabel: string;
  removeRowAriaLabel: string;
  maxItems?: number;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-3">
        {values.map((value, index) => {
          const canAddRow =
            index === values.length - 1 && values.length < maxItems;
          const canRemoveRow = values.length > 1;

          return (
            <div key={index} className="flex items-start gap-2">
              <Input
                value={value}
                onChange={(event) => onChangeValue(index, event.target.value)}
                placeholder={placeholder}
                maxLength={200}
                required={index === 0}
              />
              <div className="flex items-center gap-2 pt-1">
                {canRemoveRow ? (
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                    aria-label={removeRowAriaLabel}
                    onClick={() => onRemoveRow(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
                {canAddRow ? (
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                    aria-label={addRowAriaLabel}
                    onClick={onAddRow}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
