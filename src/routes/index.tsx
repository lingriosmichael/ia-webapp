import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingCtaSection } from "@/components/landing/landingCtaSection";
import { LandingFaqSection } from "@/components/landing/landingFaqSection";
import { LandingFooter } from "@/components/landing/landingFooter";
import { LandingHeroSection } from "@/components/landing/landingHeroSection";
import { LandingHowItWorksSection } from "@/components/landing/landingHowItWorksSection";
import { LandingPageHeader } from "@/components/landing/landingPageHeader";
import { LandingPilotProgramSection } from "@/components/landing/landingPilotProgramSection";
import { LandingProblemSection } from "@/components/landing/landingProblemSection";
import { LandingTrustBar } from "@/components/landing/landingTrustBar";
import { useSessionQuery } from "@/hooks/useAuth";
import { resolveActiveOrganizationId } from "@/lib/organizationSelection";
import { resolveWorkspaceDestination } from "@/lib/workspaceRouting";
import { getAccessToken } from "@/services/authStorage";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const sessionQuery = useSessionQuery();
  const token = getAccessToken();
  const activeOrganizationId = resolveActiveOrganizationId(
    sessionQuery.data?.organizations ?? [],
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    if (sessionQuery.isLoading) {
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
    sessionQuery.data?.organizations.length,
    sessionQuery.isLoading,
    token,
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,126,105,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(197,132,24,0.16),_transparent_22%),linear-gradient(180deg,_#fbf7ee_0%,_#f4efe6_44%,_#ffffff_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <LandingPageHeader />
        <LandingHeroSection />
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
