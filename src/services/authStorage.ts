// From pre-cookie versions of this app that stored the actual bearer
// token here. Auth has since moved to an httpOnly session cookie (see
// apiClient.ts's `credentials: "include"`), so nothing should write
// either key anymore — they only exist so a browser that still has one
// lying around gets cleanly upgraded to the current session-marker
// scheme instead of being stuck with dead, unused keys.
const LEGACY_ACCESS_TOKEN_KEYS = [
  "impact-atlas.access_token",
  "brindl.access_token",
] as const;
const LEGACY_SESSION_MARKER_KEYS = ["impact-atlas.session_present"] as const;
const LEGACY_ACTIVE_ORGANIZATION_KEYS = [
  "impact-atlas.active_organization_id",
] as const;
const SESSION_MARKER_KEY = "brindl.session_present";
const ACTIVE_ORGANIZATION_KEY = "brindl.active_organization_id";

function findFirstStoredValue(keys: readonly string[]) {
  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  return null;
}

function removeStoredKeys(keys: readonly string[]) {
  for (const key of keys) {
    window.localStorage.removeItem(key);
  }
}

function migrateLegacyAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  if (!findFirstStoredValue(LEGACY_ACCESS_TOKEN_KEYS)) {
    return;
  }

  removeStoredKeys(LEGACY_ACCESS_TOKEN_KEYS);

  if (!window.localStorage.getItem(SESSION_MARKER_KEY)) {
    window.localStorage.setItem(SESSION_MARKER_KEY, "1");
  }
}

function migrateLegacySessionMarker() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.localStorage.getItem(SESSION_MARKER_KEY)) {
    return;
  }

  const legacySessionMarker = findFirstStoredValue(LEGACY_SESSION_MARKER_KEYS);
  if (!legacySessionMarker) {
    return;
  }

  window.localStorage.setItem(SESSION_MARKER_KEY, legacySessionMarker);
  removeStoredKeys(LEGACY_SESSION_MARKER_KEYS);
}

function migrateLegacyActiveOrganizationId() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.localStorage.getItem(ACTIVE_ORGANIZATION_KEY)) {
    return;
  }

  const legacyOrganizationId = findFirstStoredValue(
    LEGACY_ACTIVE_ORGANIZATION_KEYS,
  );
  if (!legacyOrganizationId) {
    return;
  }

  window.localStorage.setItem(ACTIVE_ORGANIZATION_KEY, legacyOrganizationId);
  removeStoredKeys(LEGACY_ACTIVE_ORGANIZATION_KEYS);
}

function migrateLegacyStorage() {
  migrateLegacyAccessToken();
  migrateLegacySessionMarker();
  migrateLegacyActiveOrganizationId();
}

export function getSessionMarker(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  migrateLegacyStorage();
  return window.localStorage.getItem(SESSION_MARKER_KEY);
}

export function setSessionMarker() {
  if (typeof window === "undefined") {
    return;
  }

  removeStoredKeys(LEGACY_ACCESS_TOKEN_KEYS);
  removeStoredKeys(LEGACY_SESSION_MARKER_KEYS);
  window.localStorage.setItem(SESSION_MARKER_KEY, "1");
}

export function clearSessionMarker() {
  if (typeof window === "undefined") {
    return;
  }

  removeStoredKeys(LEGACY_ACCESS_TOKEN_KEYS);
  removeStoredKeys(LEGACY_SESSION_MARKER_KEYS);
  window.localStorage.removeItem(SESSION_MARKER_KEY);
}

export function getActiveOrganizationId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  migrateLegacyStorage();
  return window.localStorage.getItem(ACTIVE_ORGANIZATION_KEY);
}

export function setActiveOrganizationId(organizationId: string) {
  if (typeof window === "undefined") {
    return;
  }

  removeStoredKeys(LEGACY_ACTIVE_ORGANIZATION_KEYS);
  window.localStorage.setItem(ACTIVE_ORGANIZATION_KEY, organizationId);
}

export function clearActiveOrganizationId() {
  if (typeof window === "undefined") {
    return;
  }

  removeStoredKeys(LEGACY_ACTIVE_ORGANIZATION_KEYS);
  window.localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
}
