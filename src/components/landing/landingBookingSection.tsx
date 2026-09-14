import { CalendarCheck, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Static preview of a scheduling widget — not wired to a real calendar yet.
// The section is the intended embed point for Calendly: swap
// <BookingCalendarPreview /> for the Calendly inline widget once that
// integration lands, and the CTA button below for Calendly's own trigger.
function BookingCalendarPreview({ slots }: { slots: string[] }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-elevated)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <CalendarCheck className="h-4 w-4 text-signal" />
        <span>brindl · 15 min</span>
      </div>
      <div className="mt-4 space-y-2">
        {slots.map((slot) => (
          <div
            key={slot}
            className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground"
          >
            <span className="flex items-center gap-2">
              <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
              {slot}
            </span>
            <span className="text-xs font-medium text-signal">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingBookingSection() {
  const { t } = useTranslation();
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const slots = t("landing.booking.slots", { returnObjects: true }) as string[];

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

      <div className="grid gap-10 px-8 py-16 sm:px-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
        <div>
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
          <Button size="lg" className="mt-7" type="button">
            {t("landing.booking.cta")}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("landing.booking.note")}
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <BookingCalendarPreview slots={slots} />
        </div>
      </div>
    </section>
  );
}
