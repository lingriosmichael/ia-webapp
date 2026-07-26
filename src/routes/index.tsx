import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingCtaSection } from "@/components/landing/landingCtaSection";
import { LandingFaqSection } from "@/components/landing/landingFaqSection";
import { LandingFooter } from "@/components/landing/landingFooter";
import { LandingHeroSection } from "@/components/landing/landingHeroSection";
import { LandingHowItWorksSection } from "@/components/landing/landingHowItWorksSection";
import { LandingPilotProgramSection } from "@/components/landing/landingPilotProgramSection";
import { LandingProblemSection } from "@/components/landing/landingProblemSection";
import { LandingTrustBar } from "@/components/landing/landingTrustBar";
import { PublicSiteHeader } from "@/components/PublicSiteHeader";
import { useSessionQuery } from "@/hooks/useAuth";
import { resolveActiveOrganizationId } from "@/lib/organizationSelection";
import { resolveWorkspaceDestination } from "@/lib/workspaceRouting";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const sessionQuery = useSessionQuery();
  const activeOrganizationId = resolveActiveOrganizationId(
    sessionQuery.data?.organizations ?? [],
  );

  useEffect(() => {
    if (sessionQuery.isLoading) {
      return;
    }

    if (!sessionQuery.data) {
      return;
    }

    if (!sessionQuery.data?.organizations.length) {
      void navigate({ to: "/onboarding/workspace" });
      return;
    }

    if (!activeOrganizationId) {
      return;
    }

    const organizationId = activeOrganizationId;

    let cancelled = false;

    async function redirectToWorkspace() {
      const destination = await resolveWorkspaceDestination(organizationId);
      if (!cancelled) {
        void navigate(destination);
      }
    }

    void redirectToWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    activeOrganizationId,
    navigate,
    sessionQuery.data,
    sessionQuery.data?.organizations.length,
    sessionQuery.isLoading,
  ]);

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,_#e4ece1_0%,_#ece8e0_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-4 md:pb-8 md:pt-5">
        <PublicSiteHeader currentPage="landing" />
        <LandingHeroSection />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-6 md:pb-8">
        <LandingProblemSection />
        <LandingHowItWorksSection />
        <LandingTrustBar />
        <LandingPilotProgramSection />
        <LandingCtaSection />
        <LandingFaqSection />
        <LandingFooter />
      </div>
    </div>
  );
}
