import type { OrganizationSummary } from "@/services/apiClient";
import {
  getActiveOrganizationId,
  setActiveOrganizationId,
} from "@/services/authStorage";

export function resolveActiveOrganizationId(
  organizations: OrganizationSummary[],
  preferredOrganizationId?: string | null,
) {
  if (organizations.length === 0) {
    return null;
  }

  const availableOrganizationIds = new Set(
    organizations.map((organization) => organization.id),
  );
  if (
    preferredOrganizationId &&
    availableOrganizationIds.has(preferredOrganizationId)
  ) {
    return preferredOrganizationId;
  }

  const storedOrganizationId = getActiveOrganizationId();

  if (
    storedOrganizationId &&
    availableOrganizationIds.has(storedOrganizationId)
  ) {
    return storedOrganizationId;
  }

  const mostRecentOrganization = organizations.slice().sort((left, right) => {
    const leftTimestamp = Date.parse(left.createdAt);
    const rightTimestamp = Date.parse(right.createdAt);
    return rightTimestamp - leftTimestamp;
  })[0];

  return mostRecentOrganization?.id ?? organizations[0]?.id ?? null;
}

export function rememberActiveOrganizationId(organizationId: string) {
  setActiveOrganizationId(organizationId);
}
