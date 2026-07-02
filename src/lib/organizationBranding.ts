import type { OrganizationRole } from "@/services/apiClient";

export interface OrganizationBranding {
  displayName: string;
  roleLabel: string;
  logoUrl: string | null;
  initials: string;
}

export function getOrganizationBranding({
  organizationName,
  organizationRole,
  logoUrl,
  language,
}: {
  organizationName: string;
  organizationRole: OrganizationRole;
  logoUrl?: string | null;
  language: string;
}): OrganizationBranding {
  const isGerman = language.startsWith("de");
  const displayName = organizationName;
  const roleLabel =
    organizationRole === "ORGANIZATION_ADMIN"
      ? isGerman
        ? "Organisationsadministration"
        : "Organization Admin"
      : isGerman
        ? "Projektleitung"
        : "Project Manager";

  return {
    displayName,
    roleLabel,
    logoUrl: logoUrl ?? null,
    initials: getInitials(displayName),
  };
}

function getInitials(value: string) {
  const words = value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return "GR";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
