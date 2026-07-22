// From a pre-cookie version of this app that stored the actual bearer
// token here. Auth has since moved to an httpOnly session cookie (see
// apiClient.ts's `credentials: "include"`), so nothing writes this key
// anymore — it only exists so a browser that still has one lying around
// from before the migration gets cleanly upgraded to the current
// session-marker scheme instead of being stuck with a dead, unused key.
// Safe to delete this constant and migrateLegacyAccessToken() once enough
// time has passed that no real user's browser could still have it.
const LEGACY_ACCESS_TOKEN_KEY = "impact-atlas.access_token";
const SESSION_MARKER_KEY = "impact-atlas.session_present";
const ACTIVE_ORGANIZATION_KEY = "impact-atlas.active_organization_id";

function migrateLegacyAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY)) {
    return;
  }

  window.localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.localStorage.setItem(SESSION_MARKER_KEY, "1");
}

export function getSessionMarker(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  migrateLegacyAccessToken();
  return window.localStorage.getItem(SESSION_MARKER_KEY);
}

export function setSessionMarker() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.localStorage.setItem(SESSION_MARKER_KEY, "1");
}

export function clearSessionMarker() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(SESSION_MARKER_KEY);
}

export function getActiveOrganizationId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_ORGANIZATION_KEY);
}

export function setActiveOrganizationId(organizationId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACTIVE_ORGANIZATION_KEY, organizationId);
}

export function clearActiveOrganizationId() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
}
