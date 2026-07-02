import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import workspaceDe from '@/locales/workspaceDe';
import workspaceEn from '@/locales/workspaceEn';

export function useWorkspaceLocale() {
  const { i18n } = useTranslation();

  return useMemo(
    () => (i18n.resolvedLanguage ?? i18n.language).startsWith('de') ? workspaceDe : workspaceEn,
    [i18n.language, i18n.resolvedLanguage],
  );
}
