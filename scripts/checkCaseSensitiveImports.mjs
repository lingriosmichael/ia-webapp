import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = join(projectRoot, "src");
const importableExtensions = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".cjs",
  ".cts",
  ".css",
];
const sourceFileExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".cjs",
  ".cts",
]);
const importPattern =
  /(?:import|export)\s+(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

function toRepoPath(absolutePath) {
  return relative(projectRoot, absolutePath).split(sep).join("/");
}

function getTrackedPaths() {
  const output = execFileSync("git", ["ls-files"], {
    cwd: projectRoot,
    encoding: "utf8",
  });

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function walkSourceFiles(directoryPath) {
  const entries = readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkSourceFiles(entryPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!sourceFileExtensions.has(extname(entry.name))) {
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

function listCandidateRepoPaths(importerPath, specifier) {
  let resolvedBasePath = null;

  if (specifier.startsWith("@/")) {
    resolvedBasePath = join(srcRoot, specifier.slice(2));
  } else if (specifier.startsWith("./") || specifier.startsWith("../")) {
    resolvedBasePath = resolve(dirname(importerPath), specifier);
  }

  if (!resolvedBasePath) {
    return [];
  }

  const specifierExtension = extname(specifier);
  if (specifierExtension && importableExtensions.includes(specifierExtension)) {
    return [toRepoPath(resolvedBasePath)];
  }

  const extensionCandidates = importableExtensions.flatMap((extension) => [
    toRepoPath(`${resolvedBasePath}${extension}`),
    toRepoPath(join(resolvedBasePath, `index${extension}`)),
  ]);

  if (!specifierExtension) {
    return extensionCandidates;
  }

  return [toRepoPath(resolvedBasePath), ...extensionCandidates];
}

function findImportIssues() {
  const trackedPaths = getTrackedPaths();
  const trackedPathSet = new Set(trackedPaths);
  const lowerCaseTrackedPathMap = new Map(
    trackedPaths.map((trackedPath) => [trackedPath.toLowerCase(), trackedPath]),
  );
  const sourceFiles = walkSourceFiles(srcRoot);
  const issues = [];

  for (const sourceFile of sourceFiles) {
    const source = readFileSync(sourceFile, "utf8");

    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1] ?? match[2];

      if (!specifier) {
        continue;
      }

      const candidateRepoPaths = listCandidateRepoPaths(sourceFile, specifier);
      if (candidateRepoPaths.length === 0) {
        continue;
      }

      const exactMatch = candidateRepoPaths.find((candidatePath) =>
        trackedPathSet.has(candidatePath),
      );
      if (exactMatch) {
        continue;
      }

      const caseInsensitiveMatch = candidateRepoPaths
        .map((candidatePath) => ({
          candidatePath,
          actualTrackedPath: lowerCaseTrackedPathMap.get(
            candidatePath.toLowerCase(),
          ),
        }))
        .find((entry) => entry.actualTrackedPath);

      if (caseInsensitiveMatch) {
        issues.push({
          type: "case-mismatch",
          importerPath: toRepoPath(sourceFile),
          specifier,
          expectedPath: caseInsensitiveMatch.candidatePath,
          actualPath: caseInsensitiveMatch.actualTrackedPath,
        });
        continue;
      }

      issues.push({
        type: "unresolved",
        importerPath: toRepoPath(sourceFile),
        specifier,
        attemptedPaths: candidateRepoPaths,
      });
    }
  }

  return issues;
}

const issues = findImportIssues();

if (issues.length === 0) {
  console.log("Case-sensitive import check passed.");
  process.exit(0);
}

console.error("Case-sensitive import check failed.\n");

for (const issue of issues) {
  if (issue.type === "case-mismatch") {
    console.error(`- ${issue.importerPath}`);
    console.error(`  import: ${issue.specifier}`);
    console.error(`  expected tracked path: ${issue.expectedPath}`);
    console.error(`  actual tracked path:   ${issue.actualPath}`);
    continue;
  }

  console.error(`- ${issue.importerPath}`);
  console.error(`  unresolved import: ${issue.specifier}`);
  console.error("  attempted tracked paths:");
  for (const attemptedPath of issue.attemptedPaths) {
    console.error(`    - ${attemptedPath}`);
  }
}

process.exit(1);
