import { useEffect, useState } from 'react';
import { useWorkspaceLocale } from '@/hooks/useWorkspaceLocale';
import type { CreateProjectPayload, ProjectStatus } from '@/services/apiClient';
import { Checkbox } from '@/components/ui/checkbox';
import { EntityDialog, DialogSection, FieldLabel } from '@/components/entityDialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const STATUS_OPTIONS: ProjectStatus[] = ['planning', 'active', 'completed'];

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

interface ProjectDialogState {
  name: string;
  description: string;
  programGoal: string;
  startMonth: string;
  endMonth: string;
  country: string;
  regionCity: string;
  sdgs: string[];
  targetBeneficiaries: string[];
  fundingSource: string;
  status: ProjectStatus;
}

const initialState: ProjectDialogState = {
  name: '',
  description: '',
  programGoal: '',
  startMonth: '',
  endMonth: '',
  country: '',
  regionCity: '',
  sdgs: [],
  targetBeneficiaries: [],
  fundingSource: '',
  status: 'planning',
};

export function ProjectDialog({
  open,
  onOpenChange,
  organizationName,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationName: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateProjectPayload) => Promise<void> | void;
}) {
  const locale = useWorkspaceLocale();
  const [form, setForm] = useState<ProjectDialogState>(initialState);

  useEffect(() => {
    if (!open) {
      setForm(initialState);
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      name: form.name,
      description: form.description || undefined,
      programGoal: form.programGoal || undefined,
      startMonth: form.startMonth || undefined,
      endMonth: form.endMonth || undefined,
      country: form.country || undefined,
      regionCity: form.regionCity || undefined,
      sdgs: form.sdgs,
      targetBeneficiaries: form.targetBeneficiaries,
      fundingSource: form.fundingSource || undefined,
      status: form.status,
    });

    onOpenChange(false);
  }

  return (
    <EntityDialog
      open={open}
      onOpenChange={onOpenChange}
      title={locale.dialogs.createProjectTitle}
      description={locale.dialogs.createProjectDescription}
      submitLabel={isSubmitting ? locale.dialogs.project.creating : locale.dialogs.project.submit}
      cancelLabel={locale.dialogs.cancel}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <DialogSection title={locale.dialogs.project.name}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.project.name}</FieldLabel>
            <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder={locale.dialogs.project.namePlaceholder} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.project.description}</FieldLabel>
            <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder={locale.dialogs.project.descriptionPlaceholder} rows={4} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.project.programGoal}</FieldLabel>
            <Textarea value={form.programGoal} onChange={(event) => setForm((current) => ({ ...current, programGoal: event.target.value }))} placeholder={locale.dialogs.project.programGoalPlaceholder} rows={3} />
          </div>
        </div>
      </DialogSection>

      <DialogSection title={locale.dialogs.project.organization}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.startMonth}</FieldLabel>
            <Input type="month" value={form.startMonth} onChange={(event) => setForm((current) => ({ ...current, startMonth: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.endMonth}</FieldLabel>
            <Input type="month" value={form.endMonth} onChange={(event) => setForm((current) => ({ ...current, endMonth: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.country}</FieldLabel>
            <Input value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} placeholder={locale.dialogs.project.countryPlaceholder} />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.regionCity}</FieldLabel>
            <Input value={form.regionCity} onChange={(event) => setForm((current) => ({ ...current, regionCity: event.target.value }))} placeholder={locale.dialogs.project.regionCityPlaceholder} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel>{locale.dialogs.project.organization}</FieldLabel>
            <Input value={organizationName} readOnly disabled />
          </div>
        </div>
      </DialogSection>

      <DialogSection title={locale.dialogs.project.sdgs}>
        <div className="grid gap-3 md:grid-cols-2">
          {locale.dialogs.options.sdgs.map((sdg) => (
            <label key={sdg} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm font-medium">
              <Checkbox checked={form.sdgs.includes(sdg)} onCheckedChange={() => setForm((current) => ({ ...current, sdgs: toggleValue(current.sdgs, sdg) }))} />
              <span>{sdg}</span>
            </label>
          ))}
        </div>
      </DialogSection>

      <DialogSection title={locale.dialogs.project.targetBeneficiaries}>
        <div className="grid gap-3 md:grid-cols-2">
          {locale.dialogs.options.targetBeneficiaries.map((beneficiary) => (
            <label key={beneficiary} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm font-medium">
              <Checkbox checked={form.targetBeneficiaries.includes(beneficiary)} onCheckedChange={() => setForm((current) => ({ ...current, targetBeneficiaries: toggleValue(current.targetBeneficiaries, beneficiary) }))} />
              <span>{beneficiary}</span>
            </label>
          ))}
        </div>
      </DialogSection>

      <DialogSection title={locale.dialogs.project.fundingSource}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.fundingSource}</FieldLabel>
            <Input value={form.fundingSource} onChange={(event) => setForm((current) => ({ ...current, fundingSource: event.target.value }))} placeholder={locale.dialogs.project.fundingSourcePlaceholder} />
          </div>
          <div className="space-y-2">
            <FieldLabel>{locale.dialogs.project.status}</FieldLabel>
            <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as ProjectStatus }))}>
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
