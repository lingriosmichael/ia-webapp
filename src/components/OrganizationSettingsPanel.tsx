import { ImagePlus, UploadCloud } from 'lucide-react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { OrganizationAvatar } from '@/components/organizationAvatar';
import { Card } from '@/components/workspaceUI';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateOrganizationMutation } from '@/hooks/useGrantready';
import { useWorkspaceLocale } from '@/hooks/useWorkspaceLocale';
import { getOrganizationBranding } from '@/lib/organizationBranding';
import { cn } from '@/lib/utils';
import { ApiError, type OrganizationSummary } from '@/services/apiClient';

const acceptedLogoTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
const acceptedLogoExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

export function OrganizationSettingsPanel({
  organization,
}: {
  organization: OrganizationSummary;
}) {
  const locale = useWorkspaceLocale();
  const { i18n } = useTranslation();
  const updateOrganizationMutation = useUpdateOrganizationMutation(organization.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(organization.name);
  const [mission, setMission] = useState(organization.mission ?? '');
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(
    organization.logoUrl,
  );

  useEffect(() => {
    setName(organization.name);
    setMission(organization.mission ?? '');

    if (!selectedLogoFile) {
      setPreviewLogoUrl(organization.logoUrl);
    }
  }, [organization.logoUrl, organization.mission, organization.name, selectedLogoFile]);

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
        organizationName: name.trim() || organization.name,
        organizationRole: organization.role,
        logoUrl: previewLogoUrl,
        language: i18n.resolvedLanguage ?? i18n.language,
      }),
    [i18n.language, i18n.resolvedLanguage, name, organization.name, organization.role, previewLogoUrl],
  );

  const hasChanges =
    name.trim() !== organization.name ||
    mission !== (organization.mission ?? '') ||
    Boolean(selectedLogoFile);

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
    const nextFile = event.dataTransfer.files?.[0];

    if (nextFile) {
      updateSelectedLogo(nextFile);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await updateOrganizationMutation.mutateAsync({
        name: name.trim(),
        mission,
        logoFile: selectedLogoFile,
      });
      setSelectedLogoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success(locale.organizationSettings.success);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : locale.organizationSettings.failure;
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8 p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div className="text-sm font-semibold tracking-tight text-foreground">
              {locale.organizationSettings.general}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {locale.organizationSettings.generalDescription}
            </p>

            <div className="mt-8 grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="organization-name">
                  {locale.organizationSettings.nameLabel}
                </Label>
                <Input
                  id="organization-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={locale.organizationSettings.namePlaceholder}
                  required
                  maxLength={120}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organization-description">
                  {locale.organizationSettings.missionLabel}
                </Label>
                <Textarea
                  id="organization-description"
                  value={mission}
                  onChange={(event) => setMission(event.target.value)}
                  placeholder={locale.organizationSettings.missionPlaceholder}
                  rows={5}
                  maxLength={2000}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="organization-logo">
                  {locale.organizationSettings.logoLabel}
                </Label>
                <label
                  htmlFor="organization-logo"
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
                    dragActive
                      ? 'border-primary bg-primary-soft'
                      : 'border-border bg-secondary/40 hover:border-primary/40 hover:bg-primary-soft/40',
                  )}
                >
                  <input
                    id="organization-logo"
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={handleFileChange}
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
                    </span>{' '}
                    {selectedLogoFile.name}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <Card className="h-fit p-6 shadow-none">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              <ImagePlus className="h-4 w-4 text-primary" />
              {locale.organizationSettings.previewLabel}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {locale.organizationSettings.previewDescription}
            </p>

            <div className="mt-6 flex flex-col items-center rounded-2xl border border-border bg-secondary/30 px-5 py-8 text-center">
              <OrganizationAvatar
                name={branding.displayName}
                initials={branding.initials}
                logoUrl={previewLogoUrl}
                className="h-20 w-20 rounded-3xl text-xl"
              />
              <div className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                {name.trim() || organization.name}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {branding.roleLabel}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={!hasChanges || updateOrganizationMutation.isPending}
            className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateOrganizationMutation.isPending
              ? locale.organizationSettings.saving
              : locale.organizationSettings.save}
          </button>
        </div>
      </Card>
    </form>
  );
}
