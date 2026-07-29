import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import type {
  ActivityStatus,
  ActivitySummary,
  CreateActivityPayload,
  WorkspaceActivity,
} from "@/services/apiClient";
import {
  EntityDialog,
  DialogSection,
  FieldLabel,
} from "@/components/EntityDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STATUS_OPTIONS: ActivityStatus[] = ["active", "completed"];

interface ActivityDialogState {
  name: string;
  description: string;
  activityType: string;
  customActivityType: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  objectives: string;
  output: string;
  outcome: string;
  status: ActivityStatus;
}

const initialState: ActivityDialogState = {
  name: "",
  description: "",
  activityType: "",
  customActivityType: "",
  startDate: "",
  endDate: "",
  targetAudience: "",
  objectives: "",
  output: "",
  outcome: "",
  status: "active",
};

function ActivityTextareaField({
  label,
  tooltipLabel,
  tooltip,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  tooltipLabel: string;
  tooltip: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <FieldLabel>{label}</FieldLabel>
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
      </div>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </>
  );
}

export function ActivityDialog({
  open,
  onOpenChange,
  isSubmitting,
  mode = "create",
  initialActivity,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  initialActivity?: ActivitySummary | WorkspaceActivity | null;
  onSubmit: (payload: CreateActivityPayload) => Promise<void> | void;
}) {
  const locale = useWorkspaceLocale();
  const [form, setForm] = useState<ActivityDialogState>(initialState);
  const customActivityTypeOption =
    locale.dialogs.options.customActivityTypeOption;

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      return;
    }

    if (initialActivity) {
      const rawActivityType = initialActivity.activityType ?? "";
      const isFixedActivityType = (
        locale.dialogs.options.activityTypes as readonly string[]
      ).includes(rawActivityType);

      setForm({
        name: initialActivity.name,
        description: initialActivity.description ?? "",
        activityType:
          rawActivityType === ""
            ? ""
            : isFixedActivityType
              ? rawActivityType
              : customActivityTypeOption,
        customActivityType:
          rawActivityType !== "" && !isFixedActivityType ? rawActivityType : "",
        startDate: toDateInputValue(initialActivity.startDate),
        endDate: toDateInputValue(initialActivity.endDate),
        targetAudience: initialActivity.targetAudience ?? "",
        objectives: initialActivity.objectives ?? "",
        output: initialActivity.output ?? "",
        outcome: initialActivity.outcome ?? "",
        status: initialActivity.status,
      });
      return;
    }

    setForm(initialState);
  }, [
    customActivityTypeOption,
    initialActivity,
    locale.dialogs.options.activityTypes,
    open,
  ]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const activityType =
      form.activityType === customActivityTypeOption
        ? form.customActivityType.trim() || undefined
        : form.activityType || undefined;

    await onSubmit({
      name: form.name,
      description: form.description || undefined,
      activityType,
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      targetAudience: form.targetAudience || undefined,
      objectives: form.objectives || undefined,
      output: form.output || undefined,
      outcome: form.outcome || undefined,
      status: form.status,
    });

    onOpenChange(false);
  }

  return (
    <EntityDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "edit"
          ? locale.dialogs.editActivityTitle
          : locale.dialogs.createActivityTitle
      }
      description={
        mode === "edit"
          ? locale.dialogs.editActivityDescription
          : locale.dialogs.createActivityDescription
      }
      submitLabel={
        isSubmitting
          ? mode === "edit"
            ? locale.dialogs.activity.updating
            : locale.dialogs.activity.creating
          : mode === "edit"
            ? locale.dialogs.activity.updateSubmit
            : locale.dialogs.activity.submit
      }
      cancelLabel={locale.dialogs.cancel}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <DialogSection title={locale.dialogs.activity.sectionTitle}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.activity.name}</FieldLabel>
            <Input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder={locale.dialogs.activity.namePlaceholder}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.activity.description}</FieldLabel>
            <Textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder={locale.dialogs.activity.descriptionPlaceholder}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.activity.activityType}</FieldLabel>
            <Select
              value={form.activityType}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, activityType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={locale.dialogs.activity.activityType}
                />
              </SelectTrigger>
              <SelectContent>
                {locale.dialogs.options.activityTypes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
                <SelectItem value={customActivityTypeOption}>
                  {customActivityTypeOption}
                </SelectItem>
              </SelectContent>
            </Select>
            {form.activityType === customActivityTypeOption ? (
              <Input
                value={form.customActivityType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customActivityType: event.target.value,
                  }))
                }
                placeholder={
                  locale.dialogs.activity.activityTypeCustomPlaceholder
                }
              />
            ) : null}
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.activity.startDate}</FieldLabel>
            <Input
              type="date"
              value={form.startDate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.activity.endDate}</FieldLabel>
            <Input
              type="date"
              value={form.endDate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  endDate: event.target.value,
                }))
              }
            />
          </div>
        </div>
      </DialogSection>

      <DialogSection>
        <div className="space-y-2">
          <ActivityTextareaField
            label={locale.dialogs.activity.targetAudience}
            tooltipLabel={locale.dialogs.activity.targetAudienceTooltipLabel}
            tooltip={locale.dialogs.activity.targetAudienceTooltip}
            value={form.targetAudience}
            onChange={(value) =>
              setForm((current) => ({ ...current, targetAudience: value }))
            }
            placeholder={locale.dialogs.activity.targetAudiencePlaceholder}
          />
        </div>
      </DialogSection>

      <DialogSection>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <ActivityTextareaField
              label={locale.dialogs.activity.output}
              tooltipLabel={locale.dialogs.activity.outputTooltipLabel}
              tooltip={locale.dialogs.activity.outputTooltip}
              value={form.output}
              onChange={(value) =>
                setForm((current) => ({ ...current, output: value }))
              }
              placeholder={locale.dialogs.activity.outputPlaceholder}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <ActivityTextareaField
              label={locale.dialogs.activity.outcome}
              tooltipLabel={locale.dialogs.activity.outcomeTooltipLabel}
              tooltip={locale.dialogs.activity.outcomeTooltip}
              value={form.outcome}
              onChange={(value) =>
                setForm((current) => ({ ...current, outcome: value }))
              }
              placeholder={locale.dialogs.activity.outcomePlaceholder}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.activity.status}</FieldLabel>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  status: value as ActivityStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {locale.status[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogSection>
    </EntityDialog>
  );
}

function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}
