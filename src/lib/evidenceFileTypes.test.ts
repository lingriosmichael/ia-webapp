import { describe, expect, it } from "vitest";

import {
  SUPPORTED_EVIDENCE_FILE_ACCEPT,
  SUPPORTED_EVIDENCE_FILE_EXTENSIONS,
  isSupportedEvidenceFileType,
} from "./evidenceFileTypes";

describe("evidenceFileTypes", () => {
  it("builds a file input accept string from supported extensions", () => {
    expect(SUPPORTED_EVIDENCE_FILE_ACCEPT).toBe(
      SUPPORTED_EVIDENCE_FILE_EXTENSIONS.join(","),
    );
  });

  it("accepts supported extensions case-insensitively", () => {
    expect(isSupportedEvidenceFileType("report.CSV")).toBe(true);
    expect(isSupportedEvidenceFileType("summary.XlSX")).toBe(true);
    expect(isSupportedEvidenceFileType("narrative.PDF")).toBe(true);
    expect(isSupportedEvidenceFileType("notes.docx")).toBe(true);
  });

  it("rejects unsupported extensions", () => {
    expect(isSupportedEvidenceFileType("archive.zip")).toBe(false);
    expect(isSupportedEvidenceFileType("readme.md")).toBe(false);
    expect(isSupportedEvidenceFileType("file")).toBe(false);
  });
});
