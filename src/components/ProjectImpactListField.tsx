import { Info, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldLabel } from "@/components/EntityDialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PROJECT_INTENDED_CHANGES_MAX_ITEMS = 6;

export function ProjectImpactListField({
  label,
  optionalLabel,
  tooltipLabel,
  tooltip,
  values,
  placeholder,
  error,
  onChangeValue,
  onAddRow,
  onRemoveRow,
  addRowAriaLabel,
  removeRowAriaLabel,
  required = true,
  maxItems = PROJECT_INTENDED_CHANGES_MAX_ITEMS,
}: {
  label: string;
  optionalLabel?: string;
  tooltipLabel?: string;
  tooltip?: string;
  values: string[];
  placeholder: string;
  error?: string;
  onChangeValue: (index: number, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  addRowAriaLabel: string;
  removeRowAriaLabel: string;
  required?: boolean;
  maxItems?: number;
}) {
  // Rows are keyed by a locally-generated id, not their array index — `values`
  // has no stable identity of its own (plain strings, duplicates allowed), and
  // index-as-key would let React reuse a removed row's DOM node (and its
  // focus) for whatever row now sits at that position after a mid-list removal.
  const [rowIds, setRowIds] = useState(() =>
    values.map(() => crypto.randomUUID()),
  );

  useEffect(() => {
    setRowIds((current) => {
      if (current.length === values.length) {
        return current;
      }

      if (current.length > values.length) {
        return current.slice(0, values.length);
      }

      return [
        ...current,
        ...Array.from({ length: values.length - current.length }, () =>
          crypto.randomUUID(),
        ),
      ];
    });
  }, [values.length]);

  function handleAddRow() {
    setRowIds((current) => [...current, crypto.randomUUID()]);
    onAddRow();
  }

  function handleRemoveRow(index: number) {
    setRowIds((current) => current.filter((_, rowIndex) => rowIndex !== index));
    onRemoveRow(index);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FieldLabel optionalLabel={required ? undefined : optionalLabel}>
          {label}
        </FieldLabel>
        {tooltipLabel && tooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                  aria-label={tooltipLabel}
                >
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm px-3 py-2 text-left text-xs leading-5">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      <div className="space-y-3">
        {values.map((value, index) => {
          const canAddRow =
            index === values.length - 1 && values.length < maxItems;
          const canRemoveRow = values.length > 1;

          return (
            <div
              key={rowIds[index] ?? index}
              className="flex items-start gap-2"
            >
              <Input
                value={value}
                onChange={(event) => onChangeValue(index, event.target.value)}
                placeholder={placeholder}
                maxLength={200}
                required={required && index === 0}
              />
              <div className="flex items-center gap-2 pt-1">
                {canRemoveRow ? (
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                    aria-label={removeRowAriaLabel}
                    onClick={() => handleRemoveRow(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
                {canAddRow ? (
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                    aria-label={addRowAriaLabel}
                    onClick={handleAddRow}
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
