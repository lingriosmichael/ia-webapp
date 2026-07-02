import type { TFunction } from "i18next";
import type { OrganizationRole } from "@/services/apiClient";

export function translateRole(t: TFunction, role: OrganizationRole) {
  return t(`enums.roles.${role}`);
}

const statusKeyMap = {
  draft: "planning",
  planning: "planning",
  active: "active",
  archived: "completed",
  queued: "queued",
  processing: "processing",
  completed: "completed",
  failed: "failed",
  pending: "pending",
  uploaded: "uploaded",
  available: "available",
} as const;

export function translateStatus(
  t: TFunction,
  status:
    | "draft"
    | "planning"
    | "active"
    | "archived"
    | "queued"
    | "processing"
    | "completed"
    | "failed"
    | "pending"
    | "uploaded"
    | "available"
    | null
    | undefined
    | string,
) {
  const translationKey = status
    ? statusKeyMap[status as keyof typeof statusKeyMap]
    : undefined;

  return t(
    translationKey ? `enums.status.${translationKey}` : "enums.status.planning",
  );
}

export function translatePrivacyCategory(
  t: TFunction,
  category:
    | "Direct Identifier"
    | "Quasi Identifier"
    | "High Risk"
    | "Operational"
    | "Outcome",
) {
  const keyMap = {
    "Direct Identifier": "directIdentifier",
    "Quasi Identifier": "quasiIdentifier",
    "High Risk": "highRisk",
    Operational: "operational",
    Outcome: "outcome",
  } as const;

  return t(`enums.privacyCategory.${keyMap[category]}`);
}

export function translateTransformation(
  t: TFunction,
  transformation: "Hashed" | "Removed" | "Generalised" | "Kept",
) {
  const keyMap = {
    Hashed: "hashed",
    Removed: "removed",
    Generalised: "generalised",
    Kept: "kept",
  } as const;

  return t(`enums.transformation.${keyMap[transformation]}`);
}

export function formatDateTime(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
