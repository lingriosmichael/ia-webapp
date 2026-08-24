import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ImpactStoryBacklogCard {
  id: string;
  title: string;
}

// Replaces the old read-only chart-opportunity diagnostics panel: instead
// of just listing which ready charts weren't selected this run, every
// backlog card here is actionable — click one to add it to the dashboard.
// The backlog is exactly the dashboard layout's current hidden set (see
// useImpactStoryDashboardLayout), so it includes both never-selected
// chart-plan candidates (projectImpactStoryChartBacklog.ts, deterministic,
// no LLM) and any dashboard card a viewer has explicitly hidden — hiding
// and adding are the same move in opposite directions.
export function ImpactStoryBacklogPanel({
  cards,
  onAdd,
}: {
  cards: ImpactStoryBacklogCard[];
  onAdd: (id: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-[1.85rem] border border-border bg-card px-4 shadow-soft sm:px-[1.125rem]">
      <Accordion type="single" collapsible>
        <AccordionItem value="backlog" className="border-b-0">
          <AccordionTrigger>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[0.86rem] font-semibold text-foreground">
                {t("impactStory.backlogPanelTitle")}
              </span>
              <span className="text-[0.68rem] font-normal text-muted-foreground">
                {t("impactStory.backlogPanelSummary", {
                  count: cards.length,
                })}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {cards.length > 0 ? (
              <ul className="space-y-1.5 pb-1">
                {cards.map((card) => (
                  <li key={card.id}>
                    <button
                      type="button"
                      onClick={() => onAdd(card.id)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="text-[0.76rem] font-medium text-foreground">
                        {card.title}
                      </span>
                      <Plus
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pb-1 text-[0.7rem] text-muted-foreground">
                {t("impactStory.backlogPanelEmpty")}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
