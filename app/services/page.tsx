import type { Metadata } from "next";
import ServicesHero from "@/components/ServicesHero";
import ServicesGrid from "@/components/ServicesGrid";
import ServicesProcess from "@/components/ServicesProcess";
import ServicesTechSpecs from "@/components/ServicesTechSpecs";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Services & Capabilities | IMPACT B2B — Technical Event Mastery",
  description:
    "Explore Impact B2B's end-to-end event execution capabilities, including stadium show control, kinetic volumetric lighting, haute hospitality, and zero-fail international logistics.",
};

export default function ServicesPage() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <ServicesHero />
      <ServicesGrid />
      <ServicesProcess />
      <ServicesTechSpecs />
      <CTA />
    </div>
  );
}
