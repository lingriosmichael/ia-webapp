import {
  CalendarRange,
  Check,
  ChevronDown,
  Plus,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FieldLabel } from "@/components/entityDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/workspaceUI";
import { useUpdateProjectMutation } from "@/hooks/useGrantready";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/translationUtils";
import { ApiError, type ProjectSummary } from "@/services/apiClient";

function deduplicateValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function parseListInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

interface ProjectSettingsFormState {
  name: string;
  startMonth: string;
  endMonth: string;
  fundingProgram: string;
  fundingOrganization: string;
  targetGroups: string[];
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

interface ProjectSettingsFormErrors {
  name?: string;
  startMonth?: string;
  endMonth?: string;
  fundingProgram?: string;
  fundingOrganization?: string;
  areaOfOperation?: string;
  impactModelInputs?: string;
  impactModelActivities?: string;
  impactModelOutputs?: string;
  impactModelImpact?: string;
  impactModelOutcomes?: string;
  successIndicators?: string;
}

export function ProjectSettingsPanel({
  project,
  isEditing,
  onCancelEditing,
  onDeleteProject,
}: {
  project: ProjectSummary;
  isEditing: boolean;
  onCancelEditing: () => void;
  onDeleteProject: () => void;
}) {
  const locale = useWorkspaceLocale();
  const { i18n } = useTranslation();
  const canEdit = project.permissions.canEdit;
  const updateProjectMutation = useUpdateProjectMutation(
    project.id,
    project.organizationId,
  );
  const initialFormState = useMemo(() => createFormState(project), [project]);
  const [isCustomTargetGroupInputOpen, setIsCustomTargetGroupInputOpen] =
    useState(false);
  const [formState, setFormState] =
    useState<ProjectSettingsFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<ProjectSettingsFormErrors>({});
  const [targetGroupsError, setTargetGroupsError] = useState(false);

  useEffect(() => {
    setFormState(initialFormState);
    setFormErrors({});
    setTargetGroupsError(false);
    setIsCustomTargetGroupInputOpen(false);
  }, [initialFormState]);

  useEffect(() => {
    if (!isEditing) {
      setFormState(initialFormState);
      setFormErrors({});
      setTargetGroupsError(false);
      setIsCustomTargetGroupInputOpen(false);
    }
  }, [initialFormState, isEditing]);

  const hasChanges = hasFormStateChanges(formState, initialFormState);
  const timeline = [project.startMonth, project.endMonth].filter(Boolean).join(" -> ");

  function updateField<Key extends keyof ProjectSettingsFormState>(
    key: Key,
    value: ProjectSettingsFormState[Key],
  ) {
    setFormState((current) => ({ ...current, [key]: value }));

    if (key === "targetGroups" && targetGroupsError) {
      setTargetGroupsError(false);
    }

    if (formErrors[key as keyof ProjectSettingsFormErrors]) {
      setFormErrors((current) => ({
        ...current,
        [key]: undefined,
      }));
    }
  }

  function addCustomTargetGroup() {
    const nextValue = formState.customTargetGroup.trim();

    if (!nextValue) {
      return;
    }

    setFormState((current) => ({
      ...current,
      targetGroups: deduplicateValues([...current.targetGroups, nextValue]),
      customTargetGroup: "",
    }));
    setTargetGroupsError(false);
  }

  function removeTargetGroup(value: string) {
    setFormState((current) => ({
      ...current,
      targetGroups: current.targetGroups.filter((item) => item !== value),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canEdit || !isEditing) {
      return;
    }

    const nextErrors = validateFormState(formState, locale.projectSettings);
    const normalizedTargetGroups = deduplicateValues([
      ...formState.targetGroups,
      formState.customTargetGroup,
    ]);

    setFormErrors(nextErrors);
    setTargetGroupsError(normalizedTargetGroups.length === 0);

    if (Object.values(nextErrors).some(Boolean) || normalizedTargetGroups.length === 0) {
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({
        name: formState.name.trim(),
        startMonth: formState.startMonth,
        endMonth: formState.endMonth,
        fundingProgram: formState.fundingProgram.trim(),
        fundingOrganization: formState.fundingOrganization.trim(),
        targetGroups: normalizedTargetGroups,
        areaOfOperation: formState.areaOfOperation.trim(),
        partnerships: formState.partnerships.trim() || null,
        sdgs: parseListInput(formState.sdgs),
        impactModel: {
          inputs: formState.impactModelInputs.trim(),
          activities: formState.impactModelActivities.trim(),
          outputs: formState.impactModelOutputs.trim(),
          impact: formState.impactModelImpact.trim(),
          outcomes: formState.impactModelOutcomes.trim(),
        },
        successIndicators: formState.successIndicators.trim(),
      });
      toast.success(locale.projectSettings.success);
      setIsCustomTargetGroupInputOpen(false);
      onCancelEditing();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : locale.projectSettings.failure;
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-8 space-y-6">
          <Card className="p-6 sm:p-8">
            <div>
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {locale.projectSettings.general}
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {locale.projectSettings.generalDescription}
              </p>
            </div>

            {!canEdit ? (
              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm leading-6 text-primary">
                {locale.projectSettings.readOnlyNotice}
              </div>
            ) : null}

            {isEditing ? (
              <div className="mt-8 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <FieldGroup
                    className="md:col-span-2"
                    label={locale.dialogs.project.name}
                    error={formErrors.name}
                  >
                    <Input
                      value={formState.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder={locale.dialogs.project.namePlaceholder}
                      maxLength={120}
                      required
                    />
                  </FieldGroup>

                  <FieldGroup
                    label={locale.dialogs.project.startMonth}
                    error={formErrors.startMonth}
                  >
                    <Input
                      type="month"
                      value={formState.startMonth}
                      onChange={(event) =>
                        updateField("startMonth", event.target.value)
                      }
                      required
                    />
                  </FieldGroup>

                  <FieldGroup
                    label={locale.dialogs.project.endMonth}
                    error={formErrors.endMonth}
                  >
                    <Input
                      type="month"
                      value={formState.endMonth}
                      onChange={(event) => updateField("endMonth", event.target.value)}
                      required
                    />
                  </FieldGroup>

                  <FieldGroup
                    label={locale.dialogs.project.fundingProgram}
                    error={formErrors.fundingProgram}
                  >
                    <Input
                      value={formState.fundingProgram}
                      onChange={(event) =>
                        updateField("fundingProgram", event.target.value)
                      }
                      placeholder={locale.dialogs.project.fundingProgramPlaceholder}
                      maxLength={200}
                      required
                    />
                  </FieldGroup>

                  <FieldGroup
                    label={locale.dialogs.project.fundingOrganization}
                    error={formErrors.fundingOrganization}
                  >
                    <Input
                      value={formState.fundingOrganization}
                      onChange={(event) =>
                        updateField("fundingOrganization", event.target.value)
                      }
                      placeholder={
                        locale.dialogs.project.fundingOrganizationPlaceholder
                      }
                      maxLength={200}
                      required
                    />
                  </FieldGroup>

                  <FieldGroup
                    label={locale.dialogs.project.targetGroups}
                    error={
                      targetGroupsError
                        ? locale.dialogs.project.targetGroupsValidation
                        : undefined
                    }
                  >
                    <TargetGroupMultiSelect
                      options={locale.dialogs.options.targetGroups}
                      selectedValues={formState.targetGroups}
                      customOption={locale.dialogs.options.customTargetGroupOption}
                      customValue={formState.customTargetGroup}
                      customValueOpen={isCustomTargetGroupInputOpen}
                      onToggleValue={(value) => {
                        setTargetGroupsError(false);
                        updateField(
                          "targetGroups",
                          toggleValue(formState.targetGroups, value),
                        );
                      }}
                      onToggleCustomValueOpen={() =>
                        setIsCustomTargetGroupInputOpen((current) => !current)
                      }
                      onCustomValueChange={(value) =>
                        updateField("customTargetGroup", value)
                      }
                      onAddCustomValue={addCustomTargetGroup}
                      onRemoveValue={removeTargetGroup}
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
                      error={targetGroupsError}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label={locale.dialogs.project.areaOfOperation}
                    error={formErrors.areaOfOperation}
                  >
                    <Input
                      value={formState.areaOfOperation}
                      onChange={(event) =>
                        updateField("areaOfOperation", event.target.value)
                      }
                      placeholder={locale.dialogs.project.areaOfOperationPlaceholder}
                      maxLength={2000}
                      required
                    />
                  </FieldGroup>

                  <FieldGroup
                    className="md:col-span-2"
                    label={locale.dialogs.project.partnerships}
                    optionalLabel={locale.projectSettings.optionalLabel}
                  >
                    <Textarea
                      value={formState.partnerships}
                      onChange={(event) =>
                        updateField("partnerships", event.target.value)
                      }
                      placeholder={locale.dialogs.project.partnershipsPlaceholder}
                      rows={4}
                      maxLength={2000}
                    />
                  </FieldGroup>

                  <FieldGroup
                    className="md:col-span-2"
                    label={locale.dialogs.project.sdgs}
                    optionalLabel={locale.projectSettings.optionalLabel}
                    hint={locale.dialogs.project.sdgsHint}
                  >
                    <Textarea
                      value={formState.sdgs}
                      onChange={(event) => updateField("sdgs", event.target.value)}
                      placeholder={locale.dialogs.project.sdgsPlaceholder}
                      rows={3}
                    />
                  </FieldGroup>
                </div>

                <div className="rounded-2xl border border-border/70 p-5">
                  <div className="text-sm font-semibold tracking-tight text-foreground">
                    {locale.dialogs.project.impactModel}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {locale.dialogs.project.impactModelDescription}
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <FieldGroup
                      label={locale.dialogs.project.inputs}
                      error={formErrors.impactModelInputs}
                    >
                      <Textarea
                        value={formState.impactModelInputs}
                        onChange={(event) =>
                          updateField("impactModelInputs", event.target.value)
                        }
                        placeholder={locale.dialogs.project.inputsPlaceholder}
                        rows={4}
                        maxLength={2000}
                        required
                      />
                    </FieldGroup>

                    <FieldGroup
                      label={locale.dialogs.project.activities}
                      error={formErrors.impactModelActivities}
                    >
                      <Textarea
                        value={formState.impactModelActivities}
                        onChange={(event) =>
                          updateField("impactModelActivities", event.target.value)
                        }
                        placeholder={locale.dialogs.project.activitiesPlaceholder}
                        rows={4}
                        maxLength={2000}
                        required
                      />
                    </FieldGroup>

                    <FieldGroup
                      label={locale.dialogs.project.outputs}
                      error={formErrors.impactModelOutputs}
                    >
                      <Textarea
                        value={formState.impactModelOutputs}
                        onChange={(event) =>
                          updateField("impactModelOutputs", event.target.value)
                        }
                        placeholder={locale.dialogs.project.outputsPlaceholder}
                        rows={4}
                        maxLength={2000}
                        required
                      />
                    </FieldGroup>

                    <FieldGroup
                      label={locale.dialogs.project.impact}
                      error={formErrors.impactModelImpact}
                    >
                      <Textarea
                        value={formState.impactModelImpact}
                        onChange={(event) =>
                          updateField("impactModelImpact", event.target.value)
                        }
                        placeholder={locale.dialogs.project.impactPlaceholder}
                        rows={4}
                        maxLength={2000}
                        required
                      />
                    </FieldGroup>

                    <FieldGroup
                      label={locale.dialogs.project.outcomes}
                      error={formErrors.impactModelOutcomes}
                      className="md:col-span-2"
                    >
                      <Textarea
                        value={formState.impactModelOutcomes}
                        onChange={(event) =>
                          updateField("impactModelOutcomes", event.target.value)
                        }
                        placeholder={locale.dialogs.project.outcomesPlaceholder}
                        rows={4}
                        maxLength={2000}
                        required
                      />
                    </FieldGroup>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 p-5">
                  <FieldGroup
                    label={locale.dialogs.project.successIndicators}
                    error={formErrors.successIndicators}
                  >
                    <Textarea
                      value={formState.successIndicators}
                      onChange={(event) =>
                        updateField("successIndicators", event.target.value)
                      }
                      placeholder={
                        locale.dialogs.project.successIndicatorsPlaceholder
                      }
                      rows={4}
                      maxLength={2000}
                      required
                    />
                  </FieldGroup>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <DetailCard
                  label={locale.dialogs.project.name}
                  value={project.name}
                />
                <DetailCard
                  label={locale.projectSettings.fields.timeline}
                  value={timeline || locale.projectSettings.notSet}
                  icon={<CalendarRange className="h-4 w-4 text-primary" />}
                />
                <DetailCard
                  label={locale.projectSettings.fields.fundingProgram}
                  value={project.fundingProgram || locale.projectSettings.notSet}
                />
                <DetailCard
                  label={locale.projectSettings.fields.fundingOrganization}
                  value={project.fundingOrganization || locale.projectSettings.notSet}
                />
                <DetailCard
                  label={locale.projectSettings.fields.targetGroups}
                  value={
                    project.targetGroups.length > 0
                      ? project.targetGroups.join(", ")
                      : locale.projectSettings.notSet
                  }
                />
                <DetailCard
                  label={locale.projectSettings.fields.areaOfOperation}
                  value={project.areaOfOperation || locale.projectSettings.notSet}
                />
                <DetailCard
                  label={locale.projectSettings.fields.partnerships}
                  value={project.partnerships || locale.projectSettings.notSet}
                />
                <DetailCard
                  label={locale.projectSettings.fields.sdgs}
                  value={
                    project.sdgs.length > 0
                      ? project.sdgs.join(", ")
                      : locale.projectSettings.notSet
                  }
                />
                <DetailCard
                  label={locale.projectSettings.fields.created}
                  value={formatDateTime(project.createdAt, i18n.language)}
                />
                <DetailCard
                  label={locale.projectSettings.fields.updated}
                  value={formatDateTime(project.updatedAt, i18n.language)}
                />
              </div>
            )}
          </Card>

          {!isEditing ? (
            <>
              <Card className="p-6 sm:p-8">
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  {locale.dialogs.project.impactModel}
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <DetailCard
                    label={locale.projectSettings.fields.inputs}
                    value={project.impactModel.inputs || locale.projectSettings.notSet}
                  />
                  <DetailCard
                    label={locale.projectSettings.fields.activities}
                    value={
                      project.impactModel.activities || locale.projectSettings.notSet
                    }
                  />
                  <DetailCard
                    label={locale.projectSettings.fields.outputs}
                    value={
                      project.impactModel.outputs || locale.projectSettings.notSet
                    }
                  />
                  <DetailCard
                    label={locale.projectSettings.fields.impact}
                    value={project.impactModel.impact || locale.projectSettings.notSet}
                  />
                  <DetailCard
                    label={locale.projectSettings.fields.outcomes}
                    value={
                      project.impactModel.outcomes || locale.projectSettings.notSet
                    }
                    className="md:col-span-2"
                  />
                </div>
              </Card>

              <Card className="p-6 sm:p-8">
                <DetailCard
                  label={locale.projectSettings.fields.successIndicators}
                  value={project.successIndicators || locale.projectSettings.notSet}
                />
              </Card>
            </>
          ) : null}

          {isEditing ? (
            <Card className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancelEditing}
                >
                  {locale.projectSettings.cancelEditAction}
                </Button>
                <Button
                  type="submit"
                  disabled={updateProjectMutation.isPending || !hasChanges}
                >
                  {updateProjectMutation.isPending
                    ? locale.projectSettings.savingAction
                    : locale.projectSettings.saveAction}
                </Button>
              </div>
            </Card>
          ) : null}

        {project.permissions.canDelete ? (
          <Card className="border-destructive/20 p-5 shadow-none sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  {locale.projectSettings.dangerTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {locale.projectSettings.dangerDescription}
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                className="justify-center md:self-center"
                onClick={onDeleteProject}
              >
                <Trash2 className="h-4 w-4" />
                {locale.projectSettings.deleteAction}
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </form>
  );
}

function createFormState(project: ProjectSummary): ProjectSettingsFormState {
  return {
    name: project.name,
    startMonth: project.startMonth ?? "",
    endMonth: project.endMonth ?? "",
    fundingProgram: project.fundingProgram ?? "",
    fundingOrganization: project.fundingOrganization ?? "",
    targetGroups: project.targetGroups,
    customTargetGroup: "",
    areaOfOperation: project.areaOfOperation ?? "",
    partnerships: project.partnerships ?? "",
    sdgs: project.sdgs.join("\n"),
    impactModelInputs: project.impactModel.inputs ?? "",
    impactModelActivities: project.impactModel.activities ?? "",
    impactModelOutputs: project.impactModel.outputs ?? "",
    impactModelImpact: project.impactModel.impact ?? "",
    impactModelOutcomes: project.impactModel.outcomes ?? "",
    successIndicators: project.successIndicators ?? "",
  };
}

function hasFormStateChanges(
  current: ProjectSettingsFormState,
  initial: ProjectSettingsFormState,
) {
  return JSON.stringify(current) !== JSON.stringify(initial);
}

function validateFormState(
  formState: ProjectSettingsFormState,
  locale: {
    requiredField: string;
    requiredMonth: string;
  },
): ProjectSettingsFormErrors {
  const errors: ProjectSettingsFormErrors = {};

  if (!formState.name.trim()) {
    errors.name = locale.requiredField;
  }

  if (!formState.startMonth) {
    errors.startMonth = locale.requiredMonth;
  }

  if (!formState.endMonth) {
    errors.endMonth = locale.requiredMonth;
  }

  if (!formState.fundingProgram.trim()) {
    errors.fundingProgram = locale.requiredField;
  }

  if (!formState.fundingOrganization.trim()) {
    errors.fundingOrganization = locale.requiredField;
  }

  if (!formState.areaOfOperation.trim()) {
    errors.areaOfOperation = locale.requiredField;
  }

  if (!formState.impactModelInputs.trim()) {
    errors.impactModelInputs = locale.requiredField;
  }

  if (!formState.impactModelActivities.trim()) {
    errors.impactModelActivities = locale.requiredField;
  }

  if (!formState.impactModelOutputs.trim()) {
    errors.impactModelOutputs = locale.requiredField;
  }

  if (!formState.impactModelImpact.trim()) {
    errors.impactModelImpact = locale.requiredField;
  }

  if (!formState.impactModelOutcomes.trim()) {
    errors.impactModelOutcomes = locale.requiredField;
  }

  if (!formState.successIndicators.trim()) {
    errors.successIndicators = locale.requiredField;
  }

  return errors;
}

function FieldGroup({
  label,
  optionalLabel,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  optionalLabel?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <FieldLabel>{label}</FieldLabel>
        {optionalLabel ? (
          <span className="text-xs text-muted-foreground">({optionalLabel})</span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function DetailCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-secondary/20 p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
        {value}
      </div>
    </div>
  );
}

function TargetGroupMultiSelect({
  options,
  selectedValues,
  customOption,
  customValue,
  customValueOpen,
  onToggleValue,
  onToggleCustomValueOpen,
  onCustomValueChange,
  onAddCustomValue,
  onRemoveValue,
  placeholder,
  customPlaceholder,
  selectedSummarySingle,
  selectedSummaryMultiple,
  error,
}: {
  options: string[];
  selectedValues: string[];
  customOption: string;
  customValue: string;
  customValueOpen: boolean;
  onToggleValue: (value: string) => void;
  onToggleCustomValueOpen: () => void;
  onCustomValueChange: (value: string) => void;
  onAddCustomValue: () => void;
  onRemoveValue: (value: string) => void;
  placeholder: string;
  customPlaceholder: string;
  selectedSummarySingle: string;
  selectedSummaryMultiple: string;
  error: boolean;
}) {
  const [open, setOpen] = useState(false);
  const presetOptions = options.filter((option) => option !== customOption);
  const selectedCount = selectedValues.length;
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
            {presetOptions.map((option) => (
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
            ))}
          </div>

          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={onToggleCustomValueOpen}
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-secondary"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span className="flex-1">{customOption}</span>
            </button>

            {customValueOpen ? (
              <div className="mt-3 flex gap-2">
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
            ) : null}
          </div>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 ? (
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
        </div>
      ) : null}
    </div>
  );
}
