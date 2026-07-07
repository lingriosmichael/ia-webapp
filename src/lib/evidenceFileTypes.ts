// Kept in sync with `supportedDatasetExtensions` in
// ia_backend/src/modules/upload/fileStorageService.ts — update both together.
export const SUPPORTED_EVIDENCE_FILE_EXTENSIONS = [
  ".csv",
  ".xlsx",
  ".xls",
  ".pdf",
  ".docx",
] as const;

export const SUPPORTED_EVIDENCE_FILE_ACCEPT =
  SUPPORTED_EVIDENCE_FILE_EXTENSIONS.join(",");

export function isSupportedEvidenceFileType(fileName: string): boolean {
  const lowerCaseFileName = fileName.toLowerCase();
  return SUPPORTED_EVIDENCE_FILE_EXTENSIONS.some((extension) =>
    lowerCaseFileName.endsWith(extension),
  );
}
