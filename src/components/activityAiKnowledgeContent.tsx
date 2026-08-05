import { Fragment, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { ActivityAiKnowledgeRecord } from "@/services/apiClient";

// The AI-knowledge summary prompt is instructed to emit a small, fixed
// subset of Markdown (## headers, - bullets, **bold** labels), so this
// stays a tiny hand-rolled renderer instead of pulling in a full Markdown
// library for output whose shape this app's own prompt already controls.
function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, index) =>
      index % 2 === 1 ? (
        <strong key={`${keyPrefix}-${index}`}>{part}</strong>
      ) : (
        <Fragment key={`${keyPrefix}-${index}`}>{part}</Fragment>
      ),
    );
}

function renderSummaryMarkdown(summaryText: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let currentListItems: string[] = [];

  function flushList() {
    if (currentListItems.length === 0) {
      return;
    }
    const items = currentListItems;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="list-disc space-y-1 pl-5">
        {items.map((item, index) => (
          <li key={index}>
            {renderInlineMarkdown(item, `li-${blocks.length}-${index}`)}
          </li>
        ))}
      </ul>,
    );
    currentListItems = [];
  }

  for (const rawLine of summaryText.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    const headerMatch = /^#{1,3}\s+(.*)$/.exec(line);
    if (headerMatch) {
      flushList();
      blocks.push(
        <h3
          key={`h-${blocks.length}`}
          className="text-sm font-semibold text-foreground"
        >
          {renderInlineMarkdown(headerMatch[1] ?? "", `h-${blocks.length}`)}
        </h3>,
      );
      continue;
    }

    const bulletMatch = /^[-*]\s+(.*)$/.exec(line);
    if (bulletMatch) {
      currentListItems.push(bulletMatch[1] ?? "");
      continue;
    }

    flushList();
    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="text-sm leading-7 text-foreground"
      >
        {renderInlineMarkdown(line, `p-${blocks.length}`)}
      </p>,
    );
  }

  flushList();
  return blocks;
}

export function ActivityAiKnowledgeContent({
  knowledge,
}: {
  knowledge: ActivityAiKnowledgeRecord;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">
        {t("projectWorkspace.interpretation.simplified.knowledgeDialogMeta", {
          count: knowledge.insights.length,
          evidenceCount: knowledge.interpretedEvidenceCount,
        })}
      </div>

      <div className="space-y-3">
        {knowledge.summaryText ? (
          renderSummaryMarkdown(knowledge.summaryText)
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">
            {t(
              "projectWorkspace.interpretation.simplified.knowledgeDialogEmpty",
            )}
          </p>
        )}
      </div>
    </div>
  );
}
