// Kept in sync with `supportedDatasetExtensions` in
// ia_backend/src/modules/upload/fileStorageService.ts — update both together.
export const SUPPORTED_EVIDENCE_FILE_EXTENSIONS = [
  ".csv",
  ".xlsx",
  ".xls",
  ".pdf",
  ".docx",
] as const;
export const MAX_EVIDENCE_FILE_NAME_LENGTH = 255;

export const SUPPORTED_EVIDENCE_FILE_ACCEPT =
  SUPPORTED_EVIDENCE_FILE_EXTENSIONS.join(",");

export type EvidenceFileNameValidationError =
  "empty" | "too_long" | "invalid_characters";

function containsUnsupportedFileNameCharacters(fileName: string) {
  for (const character of fileName) {
    const charCode = character.charCodeAt(0);
    if ((charCode >= 0 && charCode <= 31) || charCode === 127) {
      return true;
    }
  }

  return false;
}

export function validateEvidenceFileName(
  fileName: string,
): EvidenceFileNameValidationError | null {
  const normalizedFileName = fileName.normalize("NFC").trim();

  if (normalizedFileName.length === 0) {
    return "empty";
  }

  if (normalizedFileName.length > MAX_EVIDENCE_FILE_NAME_LENGTH) {
    return "too_long";
  }

  if (
    normalizedFileName === "." ||
    normalizedFileName === ".." ||
    normalizedFileName.includes("/") ||
    normalizedFileName.includes("\\") ||
    containsUnsupportedFileNameCharacters(normalizedFileName)
  ) {
    return "invalid_characters";
  }

  return null;
}

export function isSupportedEvidenceFileType(fileName: string): boolean {
  const lowerCaseFileName = fileName.toLowerCase();
  return SUPPORTED_EVIDENCE_FILE_EXTENSIONS.some((extension) =>
    lowerCaseFileName.endsWith(extension),
  );
}
