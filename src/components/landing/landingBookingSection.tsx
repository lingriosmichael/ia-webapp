import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCalendlyPopupWidget } from "@/hooks/useCalendlyPopupWidget";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CALENDLY_EVENT_URL = import.meta.env.VITE_CALENDLY_URL as
  string | undefined;

export function LandingBookingSection() {
  const { t } = useTranslation();
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const { openCalendlyPopup } = useCalendlyPopupWidget();

  return (
    <section
      id="termin"
      className="scroll-mt-24 relative isolate mt-6 overflow-hidden rounded-[28px] border border-border/70 md:mt-8"
    >
      <div className="absolute inset-0 -z-10">
        {!prefersReducedMotion ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/booking-ambient-poster.jpg"
          >
            <source
              src="/booking-ambient.mp4"
              type="video/mp4"
              media="(min-width: 768px)"
            />
            <source src="/booking-ambient-m.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/booking-ambient-poster.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-stone/85 via-warm-stone/55 to-warm-stone/20" />
      </div>

      <div className="flex flex-col items-center px-8 py-16 text-center sm:px-10 md:py-20">
        <h2 className="max-w-md text-balance text-[1.725rem] font-semibold tracking-tight text-foreground sm:text-[2.156rem]">
          {t("landing.booking.titleBefore")}
          <span className="text-signal">
            {t("landing.booking.titleHighlight1")}
          </span>
          {t("landing.booking.titleMiddle")}
          <span className="text-signal">
            {t("landing.booking.titleHighlight2")}
          </span>
          {t("landing.booking.titleAfter")}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          {t("landing.booking.description")}
        </p>
        <Button
          size="lg"
          className="mt-7"
          type="button"
          disabled={!CALENDLY_EVENT_URL}
          onClick={() => {
            if (CALENDLY_EVENT_URL) {
              openCalendlyPopup(CALENDLY_EVENT_URL);
            }
          }}
        >
          {t("landing.booking.cta")}
        </Button>
      </div>
    </section>
  );
}
