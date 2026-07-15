import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface LegacyRedirectProps {
  onRedirect: () => void;
}

// Shared shell for routes kept around only to preserve old bookmarked/shared
// URLs. Nothing in the app links to these routes anymore — they exist solely
// so an external link to a pre-redesign URL lands somewhere useful instead
// of 404ing. The actual `navigate(...)` call stays at each route's own call
// site (rather than being passed in as data) so TanStack Router can still
// type-check each route's `to`/`params` pair against its route tree.
export function LegacyRedirect({ onRedirect }: LegacyRedirectProps) {
  const { t } = useTranslation();

  useEffect(() => {
    onRedirect();
  }, [onRedirect]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {t("activityBrief.redirectingToOverview")}
    </div>
  );
}
