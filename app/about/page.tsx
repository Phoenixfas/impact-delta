import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutStory from "@/components/AboutStory";
import AboutValues from "@/components/AboutValues";
import AboutTeam from "@/components/AboutTeam";
import AboutTimeline from "@/components/AboutTimeline";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "About Us | IMPACT B2B — Architecting Spatial Experiences",
  description:
    "Explore how Impact B2B architects unforgettable corporate summits, kinetic light systems, and spatial brand worlds across 120+ countries with zero-fail engineering.",
};

export default function AboutPage() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      <AboutTimeline />
      <CTA />
    </div>
  );
}
