import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function LandingFaqSection() {
  const { t } = useTranslation();
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();
  const items = t("landing.faq.items", {
    returnObjects: true,
  }) as { question: string; answer: string }[];

  return (
    <section id="faq" className="scroll-mt-24 py-16">
      <h2 className="text-center text-[1.725rem] font-semibold tracking-tight text-foreground sm:text-[2.156rem]">
        {t("landing.faq.title")}
      </h2>

      {/* Quiet opacity-only fade: the accordion's own open/close interaction
          is this section's liveliness, not another slide-up entrance. */}
      <div
        ref={ref}
        className="mt-10 rounded-2xl border border-border/70 bg-card px-6 transition-opacity duration-500 ease-out"
        style={{ opacity: isRevealed ? 1 : 0 }}
      >
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <span className="flex items-baseline gap-3 text-left">
                  <span className="text-sm text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{item.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-7 whitespace-pre-line leading-7">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
