import { Building2, ImagePlus, UploadCloud } from "lucide-react";
import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { OrganizationAvatar } from "@/components/organizationAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/workspaceUI";
import { useUpdateOrganizationMutation } from "@/hooks/useGrantready";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { getOrganizationBranding } from "@/lib/organizationBranding";
import { cn } from "@/lib/utils";
import {
  ApiError,
  type OrganizationSettings,
  type OrganizationSummary,
} from "@/services/apiClient";

const acceptedLogoTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
const acceptedLogoExtensions = [".png", ".jpg", ".jpeg", ".webp"];
const multiValueSplitPattern = /[\n,]+/;

interface OrganizationSettingsFormState {
  organizationName: string;
  legalForm: string;
  foundingYear: string;
  country: string;
  employeeCount: string;
  mission: string;
  activityAreas: string;
  targetGroups: string;
  operatingRegions: string;
  isRecognizedNonProfit: "" | "true" | "false";
  taxExemptionValidFrom: string;
}

interface OrganizationSettingsFormErrors {
  organizationName?: string;
  foundingYear?: string;
  employeeCount?: string;
  taxExemptionValidFrom?: string;
}

export function OrganizationSettingsPanel({
  organization,
}: {
  organization: OrganizationSummary;
}) {
  const locale = useWorkspaceLocale();
  const { i18n } = useTranslation();
  const canEdit = organization.permissions?.canManageSettings ?? false;
  const updateOrganizationMutation = useUpdateOrganizationMutation(
    organization.id,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialFormState = useMemo(
    () => createFormState(organization.settings),
    [organization.settings],
  );
  const [formState, setFormState] =
    useState<OrganizationSettingsFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<OrganizationSettingsFormErrors>(
    {},
  );
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(
    organization.logoUrl,
  );

  useEffect(() => {
    setFormState(initialFormState);
    setFormErrors({});
    setPreviewLogoUrl(organization.logoUrl);
  }, [initialFormState, organization.logoUrl]);

  useEffect(() => {
    if (!selectedLogoFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(selectedLogoFile);
    setPreviewLogoUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedLogoFile]);

  const branding = useMemo(
    () =>
      getOrganizationBranding({
        organizationName:
          formState.organizationName.trim() ||
          organization.settings.organizationName,
        organizationRole: organization.role,
        logoUrl: previewLogoUrl,
        language: i18n.resolvedLanguage ?? i18n.language,
      }),
    [
      formState.organizationName,
      i18n.language,
      i18n.resolvedLanguage,
      organization.role,
      organization.settings.organizationName,
      previewLogoUrl,
    ],
  );

  const summaryActivityAreas = useMemo(
    () => parseListField(formState.activityAreas),
    [formState.activityAreas],
  );
  const hasChanges =
    Boolean(selectedLogoFile) ||
    hasFormStateChanges(formState, initialFormState);

  function updateField<K extends keyof OrganizationSettingsFormState>(
    field: K,
    value: OrganizationSettingsFormState[K],
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    if (formErrors[field as keyof OrganizationSettingsFormErrors]) {
      setFormErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function updateSelectedLogo(file: File) {
    const lowerName = file.name.toLowerCase();
    const matchesExtension = acceptedLogoExtensions.some((extension) =>
      lowerName.endsWith(extension),
    );

    if (!acceptedLogoTypes.has(file.type) && !matchesExtension) {
      toast.error(locale.organizationSettings.invalidFile);
      return;
    }

    setSelectedLogoFile(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];

    if (nextFile) {
      updateSelectedLogo(nextFile);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragActive(false);

    if (!canEdit) {
      return;
    }

    const nextFile = event.dataTransfer.files?.[0];

    if (nextFile) {
      updateSelectedLogo(nextFile);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canEdit) {
      return;
    }

    const nextErrors = validateFormState(
      formState,
      locale.organizationSettings,
    );
    setFormErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    try {
      await updateOrganizationMutation.mutateAsync({
        settings: createSettingsPayload(formState),
        logoFile: selectedLogoFile,
      });
      setSelectedLogoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success(locale.organizationSettings.success);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : locale.organizationSettings.failure;
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8 p-6 sm:p-8">
        {!canEdit ? (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm leading-6 text-primary">
            {locale.organizationSettings.readOnlyNotice}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
            <SectionCard
              title={locale.organizationSettings.generalSection}
              description={locale.organizationSettings.generalDescription}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <FieldGroup
                  label={locale.organizationSettings.organizationNameLabel}
                  error={formErrors.organizationName}
                >
                  <Input
                    id="organization-name"
                    value={formState.organizationName}
                    onChange={(event) =>
                      updateField("organizationName", event.target.value)
                    }
                    placeholder={
                      locale.organizationSettings.organizationNamePlaceholder
                    }
                    disabled={!canEdit}
                    required
                    maxLength={120}
                  />
                </FieldGroup>

                <FieldGroup label={locale.organizationSettings.legalFormLabel}>
                  <Input
                    id="organization-legal-form"
                    value={formState.legalForm}
                    onChange={(event) =>
                      updateField("legalForm", event.target.value)
                    }
                    placeholder={
                      locale.organizationSettings.legalFormPlaceholder
                    }
                    disabled={!canEdit}
                    maxLength={120}
                  />
                </FieldGroup>

                <FieldGroup
                  label={locale.organizationSettings.foundingYearLabel}
                  error={formErrors.foundingYear}
                >
                  <Input
                    id="organization-founding-year"
                    type="number"
                    min={1800}
                    max={3000}
                    value={formState.foundingYear}
                    onChange={(event) =>
                      updateField("foundingYear", event.target.value)
                    }
                    placeholder={
                      locale.organizationSettings.foundingYearPlaceholder
                    }
                    disabled={!canEdit}
                  />
                </FieldGroup>

                <FieldGroup label={locale.organizationSettings.countryLabel}>
                  <Input
                    id="organization-country"
                    value={formState.country}
                    onChange={(event) =>
                      updateField("country", event.target.value)
                    }
                    placeholder={locale.organizationSettings.countryPlaceholder}
                    disabled={!canEdit}
                    maxLength={120}
                  />
                </FieldGroup>

                <FieldGroup
                  label={locale.organizationSettings.employeeCountLabel}
                  optionalLabel={locale.organizationSettings.optionalLabel}
                  error={formErrors.employeeCount}
                >
                  <Input
                    id="organization-employee-count"
                    type="number"
                    min={0}
                    value={formState.employeeCount}
                    onChange={(event) =>
                      updateField("employeeCount", event.target.value)
                    }
                    placeholder={
                      locale.organizationSettings.employeeCountPlaceholder
                    }
                    disabled={!canEdit}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label={locale.organizationSettings.logoLabel}>
                <label
                  htmlFor="organization-logo"
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (canEdit) {
                      setDragActive(true);
                    }
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
                    canEdit
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-70",
                    dragActive && canEdit
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-secondary/40",
                    canEdit &&
                      "hover:border-primary/40 hover:bg-primary-soft/40",
                  )}
                >
                  <input
                    id="organization-logo"
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={!canEdit}
                  />
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-card text-primary shadow-[var(--shadow-soft)]">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-[15px] font-semibold tracking-tight text-foreground">
                    {locale.organizationSettings.dropzoneTitle}
                  </div>
                  <p className="mt-2 text-sm text-primary">
                    {selectedLogoFile
                      ? locale.organizationSettings.replaceLogo
                      : locale.organizationSettings.dropzoneAction}
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    {locale.organizationSettings.logoDescription}
                  </p>
                </label>

                {selectedLogoFile ? (
                  <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground">
                    <span className="font-medium">
                      {locale.organizationSettings.selectedLogo}:
                    </span>{" "}
                    {selectedLogoFile.name}
                  </div>
                ) : null}
              </FieldGroup>
            </SectionCard>

            <SectionCard
              title={locale.organizationSettings.missionSection}
              description={locale.organizationSettings.missionDescription}
            >
              <FieldGroup label={locale.organizationSettings.missionLabel}>
                <Textarea
                  id="organization-mission"
                  value={formState.mission}
                  onChange={(event) =>
                    updateField("mission", event.target.value)
                  }
                  placeholder={locale.organizationSettings.missionPlaceholder}
                  rows={4}
                  maxLength={2000}
                  disabled={!canEdit}
                />
              </FieldGroup>

              <div className="grid gap-6 lg:grid-cols-2">
                <FieldGroup
                  label={locale.organizationSettings.activityAreasLabel}
                >
                  <Textarea
                    id="organization-activity-areas"
                    value={formState.activityAreas}
                    onChange={(event) =>
                      updateField("activityAreas", event.target.value)
                    }
                    placeholder={
                      locale.organizationSettings.activityAreasPlaceholder
                    }
                    rows={5}
                    disabled={!canEdit}
                  />
                </FieldGroup>

                <FieldGroup
                  label={locale.organizationSettings.targetGroupsLabel}
                >
                  <Textarea
                    id="organization-target-groups"
                    value={formState.targetGroups}
                    onChange={(event) =>
                      updateField("targetGroups", event.target.value)
                    }
                    placeholder={
                      locale.organizationSettings.targetGroupsPlaceholder
                    }
                    rows={5}
                    disabled={!canEdit}
                  />
                </FieldGroup>
              </div>

              <FieldGroup
                label={locale.organizationSettings.operatingRegionsLabel}
                optionalLabel={locale.organizationSettings.optionalLabel}
              >
                <Textarea
                  id="organization-operating-regions"
                  value={formState.operatingRegions}
                  onChange={(event) =>
                    updateField("operatingRegions", event.target.value)
                  }
                  placeholder={
                    locale.organizationSettings.operatingRegionsPlaceholder
                  }
                  rows={4}
                  disabled={!canEdit}
                />
              </FieldGroup>

              <p className="text-xs leading-5 text-muted-foreground">
                {locale.organizationSettings.listFieldHint}
              </p>
            </SectionCard>

            <SectionCard
              title={locale.organizationSettings.nonProfitSection}
              description={locale.organizationSettings.nonProfitDescription}
            >
              <FieldGroup
                label={locale.organizationSettings.isRecognizedNonProfitLabel}
              >
                <RadioGroup
                  value={formState.isRecognizedNonProfit}
                  onValueChange={(value) =>
                    updateField(
                      "isRecognizedNonProfit",
                      value as OrganizationSettingsFormState["isRecognizedNonProfit"],
                    )
                  }
                  className="grid gap-3 sm:grid-cols-2"
                  disabled={!canEdit}
                >
                  <label className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/20 px-4 py-3">
                    <RadioGroupItem value="true" id="nonprofit-yes" />
                    <span className="text-sm font-medium text-foreground">
                      {locale.organizationSettings.nonProfitYes}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/20 px-4 py-3">
                    <RadioGroupItem value="false" id="nonprofit-no" />
                    <span className="text-sm font-medium text-foreground">
                      {locale.organizationSettings.nonProfitNo}
                    </span>
                  </label>
                </RadioGroup>
              </FieldGroup>

              <FieldGroup
                label={locale.organizationSettings.taxExemptionValidFromLabel}
                optionalLabel={locale.organizationSettings.optionalLabel}
                error={formErrors.taxExemptionValidFrom}
              >
                <Input
                  id="organization-tax-exemption-valid-from"
                  type="date"
                  value={formState.taxExemptionValidFrom}
                  onChange={(event) =>
                    updateField("taxExemptionValidFrom", event.target.value)
                  }
                  disabled={!canEdit}
                />
              </FieldGroup>
            </SectionCard>
          </div>

          <Card className="h-fit p-6 shadow-none">
            <div className="mt-6 rounded-2xl border border-border bg-secondary/25 p-5">
              <div className="flex items-center gap-4">
                <OrganizationAvatar
                  name={branding.displayName}
                  initials={branding.initials}
                  logoUrl={previewLogoUrl}
                  className="h-16 w-16 rounded-3xl text-lg"
                />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold tracking-tight text-foreground">
                    {formState.organizationName.trim() ||
                      organization.settings.organizationName}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {formatSummaryValue(
                      formState.legalForm.trim() ||
                        locale.organizationSettings.summaryNotProvided,
                    )}
                  </div>
                </div>
              </div>

              <SummaryBlock
                label={locale.organizationSettings.summaryMissionLabel}
                value={
                  formState.mission.trim() ||
                  locale.organizationSettings.summaryNotProvided
                }
              />

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {locale.organizationSettings.summaryActivityAreasLabel}
                </div>
                {summaryActivityAreas.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-foreground">
                    {summaryActivityAreas.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">
                    {locale.organizationSettings.summaryNotProvided}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {locale.organizationSettings.summaryNonProfitLabel}
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {formState.isRecognizedNonProfit === "true"
                      ? locale.organizationSettings.summaryNonProfitYes
                      : formState.isRecognizedNonProfit === "false"
                        ? locale.organizationSettings.summaryNonProfitNo
                        : locale.organizationSettings.nonProfitUnknown}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{branding.roleLabel}</span>
            </div>
          </Card>
        </div>

        {canEdit ? (
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={!hasChanges || updateOrganizationMutation.isPending}
            >
              {updateOrganizationMutation.isPending
                ? locale.organizationSettings.saving
                : locale.organizationSettings.save}
            </Button>
          </div>
        ) : null}
      </Card>
    </form>
  );
}

function createFormState(
  settings: OrganizationSettings,
): OrganizationSettingsFormState {
  return {
    organizationName: settings.organizationName,
    legalForm: settings.legalForm ?? "",
    foundingYear:
      settings.foundingYear === null ? "" : String(settings.foundingYear),
    country: settings.country ?? "",
    employeeCount:
      settings.employeeCount === null ? "" : String(settings.employeeCount),
    mission: settings.mission ?? "",
    activityAreas: settings.activityAreas.join("\n"),
    targetGroups: settings.targetGroups.join("\n"),
    operatingRegions: settings.operatingRegions.join("\n"),
    isRecognizedNonProfit:
      settings.isRecognizedNonProfit === null
        ? ""
        : String(settings.isRecognizedNonProfit),
    taxExemptionValidFrom: settings.taxExemptionValidFrom ?? "",
  };
}

function hasFormStateChanges(
  current: OrganizationSettingsFormState,
  initial: OrganizationSettingsFormState,
) {
  return Object.keys(current).some((key) => {
    const field = key as keyof OrganizationSettingsFormState;
    return current[field] !== initial[field];
  });
}

function parseListField(value: string) {
  return Array.from(
    new Set(
      value
        .split(multiValueSplitPattern)
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}

function createSettingsPayload(
  formState: OrganizationSettingsFormState,
): OrganizationSettings {
  return {
    organizationName: formState.organizationName.trim(),
    legalForm: toNullableText(formState.legalForm),
    foundingYear: toNullableInteger(formState.foundingYear),
    country: toNullableText(formState.country),
    employeeCount: toNullableInteger(formState.employeeCount),
    mission: toNullableText(formState.mission),
    activityAreas: parseListField(formState.activityAreas),
    targetGroups: parseListField(formState.targetGroups),
    operatingRegions: parseListField(formState.operatingRegions),
    isRecognizedNonProfit: toNullableBoolean(formState.isRecognizedNonProfit),
    taxExemptionValidFrom: toNullableText(formState.taxExemptionValidFrom),
  };
}

function toNullableText(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
}

function toNullableInteger(value: string) {
  if (!value.trim()) {
    return null;
  }

  return Number.parseInt(value, 10);
}

function toNullableBoolean(value: "" | "true" | "false") {
  if (!value) {
    return null;
  }

  return value === "true";
}

function validateFormState(
  formState: OrganizationSettingsFormState,
  locale: {
    validationOrganizationName: string;
    validationFoundingYear: string;
    validationEmployeeCount: string;
    validationTaxExemptionValidFrom: string;
  },
): OrganizationSettingsFormErrors {
  const errors: OrganizationSettingsFormErrors = {};

  if (!formState.organizationName.trim()) {
    errors.organizationName = locale.validationOrganizationName;
  }

  if (
    formState.foundingYear.trim() &&
    !/^\d{4}$/.test(formState.foundingYear.trim())
  ) {
    errors.foundingYear = locale.validationFoundingYear;
  }

  if (
    formState.employeeCount.trim() &&
    !/^\d+$/.test(formState.employeeCount.trim())
  ) {
    errors.employeeCount = locale.validationEmployeeCount;
  }

  if (
    formState.taxExemptionValidFrom.trim() &&
    !/^\d{4}-\d{2}-\d{2}$/.test(formState.taxExemptionValidFrom.trim())
  ) {
    errors.taxExemptionValidFrom = locale.validationTaxExemptionValidFrom;
  }

  return errors;
}

function formatSummaryValue(value: string) {
  return value.trim();
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-secondary/10 p-6">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function FieldGroup({
  label,
  children,
  optionalLabel,
  error,
}: {
  label: string;
  children: ReactNode;
  optionalLabel?: string;
  error?: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {optionalLabel ? (
          <span className="text-xs text-muted-foreground">{optionalLabel}</span>
        ) : null}
      </div>
      {children}
      {error ? <div className="text-xs text-destructive">{error}</div> : null}
    </div>
  );
}

function SummaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-foreground">{value}</div>
    </div>
  );
}
