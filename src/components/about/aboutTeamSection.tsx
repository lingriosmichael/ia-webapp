import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

// Team photos aren't translatable content, so they're mapped by position
// here rather than stored alongside the bios in the locale files.
const TEAM_PHOTOS = ["/team-katrina-zuchina.jpg", "/team-michael-ling.jpg"];

export function AboutTeamSection() {
  const { t } = useTranslation();
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();
  const team = t("about.team", { returnObjects: true }) as TeamMember[];

  return (
    <section className="py-12 md:py-16">
      <div ref={ref} className="grid gap-8 sm:grid-cols-2 sm:gap-6 lg:gap-10">
        {team.map((member, index) => (
          <div
            key={member.name}
            className="flex flex-col items-center rounded-2xl border border-border/70 bg-card px-6 py-10 text-center shadow-[var(--shadow-soft)] transition-[opacity,transform] duration-500 ease-out"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "translateY(0)" : "translateY(16px)",
              transitionDelay: `${index * 90}ms`,
            }}
          >
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border/70 shadow-[var(--shadow-soft)] md:h-32 md:w-32">
              <img
                src={TEAM_PHOTOS[index]}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-5 font-display text-xl font-semibold text-foreground">
              {member.name}
            </div>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-signal/10 px-3 py-1 text-xs font-medium text-signal">
              {member.role}
            </span>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              {member.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
