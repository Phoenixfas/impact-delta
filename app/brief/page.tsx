import type { Metadata } from "next";
import BriefHero from "@/components/brief/BriefHero";
import StandBriefWizard from "@/components/brief/StandBriefWizard";

export const metadata: Metadata = {
  title: "Stand Brief & Architecture Wizard | IMPACT MAKERS EVENTS",
  description:
    "Configure your trade show and exhibition stand specifications with IMPACT MAKERS EVENTS' interactive multi-step engineering wizard.",
};

export default function StandBriefPage() {
  return (
    <main className="relative w-full min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* Ambient background illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header with GSAP Entrance Reveal */}
      <BriefHero />

      {/* Main Glass Card Form Container */}
      <StandBriefWizard />
    </main>
  );
}
