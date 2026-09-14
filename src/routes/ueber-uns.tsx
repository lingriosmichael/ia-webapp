import { createFileRoute } from "@tanstack/react-router";
import { AboutIntroSection } from "@/components/about/aboutIntroSection";
import { AboutTeamSection } from "@/components/about/aboutTeamSection";
import { LandingFooter } from "@/components/landing/landingFooter";
import { PublicSiteHeader } from "@/components/PublicSiteHeader";

export const Route = createFileRoute("/ueber-uns")({
  component: UeberUnsPage,
});

function UeberUnsPage() {
  return (
    <div
      className="min-h-screen bg-[linear-gradient(90deg,_#e4ece1_0%,_#ece8e0_100%)] text-foreground"
      // Matches the landing page's brighter brand-blue override — see
      // routes/index.tsx for why this is scoped per-route rather than
      // repainting the shared --signal token.
      style={{ "--signal": "#4f7dee" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-4 md:pb-8 md:pt-5">
        <PublicSiteHeader currentPage="landing" />
        <AboutIntroSection />
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-6 md:pb-8">
        <AboutTeamSection />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-6 md:pb-8">
        <LandingFooter />
      </div>
    </div>
  );
}
