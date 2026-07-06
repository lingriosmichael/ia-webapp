import { useEffect, useState } from "react";
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
} from "@/components/entityDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const STATUS_OPTIONS: ActivityStatus[] = ["planning", "active", "completed"];

interface ActivityDialogState {
  name: string;
  description: string;
  activityType: string;
  owner: string;
  startDate: string;
  endDate: string;
  objectives: string;
  expectedOutcomes: string;
  successIndicators: string;
  targetAudience: string;
  beneficiaryGroup: string;
  status: ActivityStatus;
}

const initialState: ActivityDialogState = {
  name: "",
  description: "",
  activityType: "",
  owner: "",
  startDate: "",
  endDate: "",
  objectives: "",
  expectedOutcomes: "",
  successIndicators: "",
  targetAudience: "",
  beneficiaryGroup: "",
  status: "planning",
};

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

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      return;
    }

    if (initialActivity) {
      setForm({
        name: initialActivity.name,
        description: initialActivity.description ?? "",
        activityType: initialActivity.activityType ?? "",
        owner: initialActivity.owner ?? "",
        startDate: toDateInputValue(initialActivity.startDate),
        endDate: toDateInputValue(initialActivity.endDate),
        objectives: initialActivity.objectives ?? "",
        expectedOutcomes: initialActivity.expectedOutcomes ?? "",
        successIndicators: initialActivity.successIndicators ?? "",
        targetAudience: initialActivity.targetAudience ?? "",
        beneficiaryGroup: initialActivity.beneficiaryGroup ?? "",
        status: initialActivity.status,
      });
      return;
    }

    setForm(initialState);
  }, [initialActivity, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      name: form.name,
      description: form.description || undefined,
      activityType: form.activityType || undefined,
      owner: form.owner || undefined,
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      objectives: form.objectives || undefined,
      expectedOutcomes: form.expectedOutcomes || undefined,
      successIndicators: form.successIndicators || undefined,
      targetAudience: form.targetAudience || undefined,
      beneficiaryGroup: form.beneficiaryGroup || undefined,
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
      <DialogSection title={locale.dialogs.activity.name}>
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
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.activity.owner}</FieldLabel>
            <Input
              value={form.owner}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  owner: event.target.value,
                }))
              }
              placeholder={locale.dialogs.activity.ownerPlaceholder}
            />
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

      <DialogSection title={locale.dialogs.activity.objectives}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.activity.objectives}</FieldLabel>
            <Textarea
              value={form.objectives}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  objectives: event.target.value,
                }))
              }
              placeholder={locale.dialogs.activity.objectivesPlaceholder}
              rows={3}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.activity.expectedOutcomes}</FieldLabel>
            <Textarea
              value={form.expectedOutcomes}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  expectedOutcomes: event.target.value,
                }))
              }
              placeholder={locale.dialogs.activity.expectedOutcomesPlaceholder}
              rows={3}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.activity.successIndicators}</FieldLabel>
            <Textarea
              value={form.successIndicators}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  successIndicators: event.target.value,
                }))
              }
              placeholder={locale.dialogs.activity.successIndicatorsPlaceholder}
              rows={3}
            />
          </div>
        </div>
      </DialogSection>

      <DialogSection title={locale.dialogs.activity.targetAudience}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.activity.targetAudience}</FieldLabel>
            <Textarea
              value={form.targetAudience}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  targetAudience: event.target.value,
                }))
              }
              placeholder={locale.dialogs.activity.targetAudiencePlaceholder}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.activity.beneficiaryGroup}</FieldLabel>
            <Textarea
              value={form.beneficiaryGroup}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  beneficiaryGroup: event.target.value,
                }))
              }
              placeholder={locale.dialogs.activity.beneficiaryGroupPlaceholder}
              rows={3}
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
