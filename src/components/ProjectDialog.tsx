import { useEffect, useState } from "react";
import { Check, ChevronDown, Info, Plus, X } from "lucide-react";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import type { CreateProjectPayload } from "@/services/apiClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EntityDialog,
  DialogSection,
  FieldLabel,
} from "@/components/EntityDialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function parseListInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function deduplicateValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

interface ProjectDialogState {
  name: string;
  startMonth: string;
  endMonth: string;
  fundingProgram: string;
  fundingOrganization: string;
  targetGroups: string[];
  customTargetGroupEnabled: boolean;
  customTargetGroup: string;
  areaOfOperation: string;
  partnerships: string;
  sdgs: string;
  impactModelInputs: string;
  impactModelActivities: string;
  impactModelOutputs: string;
  impactModelImpact: string;
  impactModelOutcomes: string;
  successIndicators: string;
}

const initialState: ProjectDialogState = {
  name: "",
  startMonth: "",
  endMonth: "",
  fundingProgram: "",
  fundingOrganization: "",
  targetGroups: [],
  customTargetGroupEnabled: false,
  customTargetGroup: "",
  areaOfOperation: "",
  partnerships: "",
  sdgs: "",
  impactModelInputs: "",
  impactModelActivities: "",
  impactModelOutputs: "",
  impactModelImpact: "",
  impactModelOutcomes: "",
  successIndicators: "",
};

export function ProjectDialog({
  open,
  onOpenChange,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateProjectPayload) => Promise<void> | void;
}) {
  const locale = useWorkspaceLocale();
  const [form, setForm] = useState<ProjectDialogState>(initialState);
  const [targetGroupsError, setTargetGroupsError] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setTargetGroupsError(false);
    }
  }, [open]);

  function updateField<Key extends keyof ProjectDialogState>(
    key: Key,
    value: ProjectDialogState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addCustomTargetGroup() {
    const nextValue = form.customTargetGroup.trim();
    if (!nextValue) {
      return;
    }

    setForm((current) => ({
      ...current,
      targetGroups: deduplicateValues([...current.targetGroups, nextValue]),
      customTargetGroup: "",
    }));
    setTargetGroupsError(false);
  }

  function removeTargetGroup(value: string) {
    setForm((current) => ({
      ...current,
      targetGroups: current.targetGroups.filter((item) => item !== value),
    }));
  }

  function clearCustomTargetGroup() {
    setForm((current) => ({
      ...current,
      customTargetGroupEnabled: false,
      customTargetGroup: "",
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const customTargetGroup = form.customTargetGroupEnabled
      ? form.customTargetGroup.trim()
      : "";
    const normalizedTargetGroups = deduplicateValues([
      ...form.targetGroups,
      customTargetGroup,
    ]);
    if (normalizedTargetGroups.length === 0) {
      setTargetGroupsError(true);
      return;
    }

    await onSubmit({
      name: form.name.trim(),
      startMonth: form.startMonth,
      endMonth: form.endMonth,
      fundingProgram: form.fundingProgram.trim(),
      fundingOrganization: form.fundingOrganization.trim(),
      targetGroups: normalizedTargetGroups,
      areaOfOperation: form.areaOfOperation.trim(),
      partnerships: form.partnerships.trim() || undefined,
      sdgs: parseListInput(form.sdgs),
      impactModel: {
        inputs: form.impactModelInputs.trim(),
        activities: form.impactModelActivities.trim(),
        outputs: form.impactModelOutputs.trim(),
        impact: form.impactModelImpact.trim(),
        outcomes: form.impactModelOutcomes.trim(),
      },
      successIndicators: form.successIndicators.trim(),
    });

    onOpenChange(false);
  }

  return (
    <EntityDialog
      open={open}
      onOpenChange={onOpenChange}
      title={locale.dialogs.createProjectTitle}
      description={locale.dialogs.createProjectDescription}
      submitLabel={
        isSubmitting
          ? locale.dialogs.project.creating
          : locale.dialogs.project.submit
      }
      cancelLabel={locale.dialogs.cancel}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <DialogSection title={locale.dialogs.project.projectProfile}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.project.name}</FieldLabel>
            <Input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder={locale.dialogs.project.namePlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.startMonth}</FieldLabel>
            <Input
              type="month"
              value={form.startMonth}
              onChange={(event) =>
                updateField("startMonth", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.endMonth}</FieldLabel>
            <Input
              type="month"
              value={form.endMonth}
              onChange={(event) => updateField("endMonth", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.fundingProgram}</FieldLabel>
            <Input
              value={form.fundingProgram}
              onChange={(event) =>
                updateField("fundingProgram", event.target.value)
              }
              placeholder={locale.dialogs.project.fundingProgramPlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>
              {locale.dialogs.project.fundingOrganization}
            </FieldLabel>
            <Input
              value={form.fundingOrganization}
              onChange={(event) =>
                updateField("fundingOrganization", event.target.value)
              }
              placeholder={
                locale.dialogs.project.fundingOrganizationPlaceholder
              }
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.targetGroups}</FieldLabel>
            <TargetGroupMultiSelect
              options={[...locale.dialogs.options.targetGroups]}
              selectedValues={form.targetGroups}
              customOption={locale.dialogs.options.customTargetGroupOption}
              customValueEnabled={form.customTargetGroupEnabled}
              customValue={form.customTargetGroup}
              error={targetGroupsError}
              onToggleValue={(value) => {
                setTargetGroupsError(false);
                setForm((current) => ({
                  ...current,
                  targetGroups: toggleValue(current.targetGroups, value),
                }));
              }}
              onToggleCustomValueEnabled={() => {
                setTargetGroupsError(false);
                setForm((current) => ({
                  ...current,
                  customTargetGroupEnabled: !current.customTargetGroupEnabled,
                  customTargetGroup: current.customTargetGroupEnabled
                    ? ""
                    : current.customTargetGroup,
                }));
              }}
              onCustomValueChange={(value) => {
                setTargetGroupsError(false);
                updateField("customTargetGroup", value);
              }}
              onAddCustomValue={addCustomTargetGroup}
              onRemoveValue={removeTargetGroup}
              onRemoveCustomValue={clearCustomTargetGroup}
              placeholder={locale.dialogs.project.targetGroupsPlaceholder}
              customPlaceholder={
                locale.dialogs.project.customTargetGroupPlaceholder
              }
              selectedSummarySingle={
                locale.dialogs.project.targetGroupsSelectedSingle
              }
              selectedSummaryMultiple={
                locale.dialogs.project.targetGroupsSelectedMultiple
              }
              errorMessage={locale.dialogs.project.targetGroupsValidation}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.areaOfOperation}</FieldLabel>
            <Input
              value={form.areaOfOperation}
              onChange={(event) =>
                updateField("areaOfOperation", event.target.value)
              }
              placeholder={locale.dialogs.project.areaOfOperationPlaceholder}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.project.partnerships}</FieldLabel>
            <Textarea
              value={form.partnerships}
              onChange={(event) =>
                updateField("partnerships", event.target.value)
              }
              placeholder={locale.dialogs.project.partnershipsPlaceholder}
              rows={3}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.project.sdgs}</FieldLabel>
            <Textarea
              value={form.sdgs}
              onChange={(event) => updateField("sdgs", event.target.value)}
              placeholder={locale.dialogs.project.sdgsPlaceholder}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {locale.dialogs.project.sdgsHint}
            </p>
          </div>
        </div>
      </DialogSection>

      <DialogSection title={locale.dialogs.project.impactModel}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{locale.dialogs.project.impactModelDescription}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                  aria-label={locale.dialogs.project.impactModelTooltipLabel}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm space-y-1 px-3 py-2 text-left text-xs leading-5">
                <p>{locale.dialogs.project.impactModelTooltip.inputs}</p>
                <p>{locale.dialogs.project.impactModelTooltip.activities}</p>
                <p>{locale.dialogs.project.impactModelTooltip.outputs}</p>
                <p>{locale.dialogs.project.impactModelTooltip.impact}</p>
                <p>{locale.dialogs.project.impactModelTooltip.outcomes}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <TextAreaField
            label={locale.dialogs.project.inputs}
            value={form.impactModelInputs}
            onChange={(value) => updateField("impactModelInputs", value)}
            placeholder={locale.dialogs.project.inputsPlaceholder}
            required
          />
          <TextAreaField
            label={locale.dialogs.project.activities}
            value={form.impactModelActivities}
            onChange={(value) => updateField("impactModelActivities", value)}
            placeholder={locale.dialogs.project.activitiesPlaceholder}
            required
          />
          <TextAreaField
            label={locale.dialogs.project.outputs}
            value={form.impactModelOutputs}
            onChange={(value) => updateField("impactModelOutputs", value)}
            placeholder={locale.dialogs.project.outputsPlaceholder}
            required
          />
          <TextAreaField
            label={locale.dialogs.project.outcomes}
            value={form.impactModelOutcomes}
            onChange={(value) => updateField("impactModelOutcomes", value)}
            placeholder={locale.dialogs.project.outcomesPlaceholder}
            required
          />
          <TextAreaField
            label={locale.dialogs.project.impact}
            value={form.impactModelImpact}
            onChange={(value) => updateField("impactModelImpact", value)}
            placeholder={locale.dialogs.project.impactPlaceholder}
            required
          />
        </div>
      </DialogSection>

      <DialogSection title={locale.dialogs.project.successIndicatorsSection}>
        <TextAreaField
          label={locale.dialogs.project.successIndicators}
          value={form.successIndicators}
          onChange={(value) => updateField("successIndicators", value)}
          placeholder={locale.dialogs.project.successIndicatorsPlaceholder}
          required
          rows={4}
        />
      </DialogSection>
    </EntityDialog>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </div>
  );
}

function TargetGroupMultiSelect({
  options,
  selectedValues,
  customOption,
  customValueEnabled,
  customValue,
  error,
  onToggleValue,
  onToggleCustomValueEnabled,
  onCustomValueChange,
  onAddCustomValue,
  onRemoveValue,
  onRemoveCustomValue,
  placeholder,
  customPlaceholder,
  selectedSummarySingle,
  selectedSummaryMultiple,
  errorMessage,
}: {
  options: string[];
  selectedValues: string[];
  customOption: string;
  customValueEnabled: boolean;
  customValue: string;
  error: boolean;
  onToggleValue: (value: string) => void;
  onToggleCustomValueEnabled: () => void;
  onCustomValueChange: (value: string) => void;
  onAddCustomValue: () => void;
  onRemoveValue: (value: string) => void;
  onRemoveCustomValue: () => void;
  placeholder: string;
  customPlaceholder: string;
  selectedSummarySingle: string;
  selectedSummaryMultiple: string;
  errorMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const normalizedCustomValue = customValue.trim();
  const visibleSelectedValues = normalizedCustomValue
    ? [...selectedValues, normalizedCustomValue]
    : selectedValues;

  const selectedCount = visibleSelectedValues.length;
  const selectedLabel =
    selectedCount === 0
      ? placeholder
      : selectedCount === 1
        ? selectedSummarySingle
        : selectedSummaryMultiple.replace("{{count}}", String(selectedCount));

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "min-h-11 w-full justify-between px-3 py-2 text-left font-normal",
              selectedCount === 0 && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive",
            )}
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] space-y-4 p-3"
        >
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {options.map((option) =>
              option === customOption ? (
                <button
                  key={option}
                  type="button"
                  onClick={onToggleCustomValueEnabled}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-secondary"
                >
                  <Checkbox checked={customValueEnabled} />
                  <span className="flex-1">{option}</span>
                  {customValueEnabled ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : null}
                </button>
              ) : (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggleValue(option)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-secondary"
                >
                  <Checkbox checked={selectedValues.includes(option)} />
                  <span className="flex-1">{option}</span>
                  {selectedValues.includes(option) ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : null}
                </button>
              ),
            )}
          </div>
          {customValueEnabled ? (
            <div className="border-t border-border pt-3">
              <div className="flex gap-2">
                <Input
                  value={customValue}
                  onChange={(event) => onCustomValueChange(event.target.value)}
                  placeholder={customPlaceholder}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onAddCustomValue();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={onAddCustomValue}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>

      {visibleSelectedValues.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="gap-1 rounded-full px-3 py-1 text-xs font-medium"
            >
              <span>{value}</span>
              <button
                type="button"
                onClick={() => onRemoveValue(value)}
                className="rounded-full p-0.5 transition-colors hover:bg-black/10"
                aria-label={`Remove ${value}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {normalizedCustomValue ? (
            <Badge
              key={normalizedCustomValue}
              variant="secondary"
              className="gap-1 rounded-full px-3 py-1 text-xs font-medium"
            >
              <span>{normalizedCustomValue}</span>
              <button
                type="button"
                onClick={onRemoveCustomValue}
                className="rounded-full p-0.5 transition-colors hover:bg-black/10"
                aria-label={`Remove ${normalizedCustomValue}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
