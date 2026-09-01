import type { Metadata } from "next";
import ServicesHero from "@/components/ServicesHero";
import ServicesGrid from "@/components/ServicesGrid";
import ServicesProcess from "@/components/ServicesProcess";
import ServicesTechSpecs from "@/components/ServicesTechSpecs";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Our Services | Impact Makers Events L.L.C — Stand Fabrication & Event Solutions",
  description:
    "Explore our 8 turnkey services: Custom Stand Fabrication, Event Management, Congress Organizing, AV & Lighting, 4K Videography, Space Selling, Corporate Branding/Gifts, and Designer Furniture Rental.",
  openGraph: {
    title: "Our Services | Impact Makers Events L.L.C — Turnkey Event & Exhibition Solutions",
    description:
      "From in-house CNC joinery to concert-grade audiovisual systems across Dubai and 9 global hubs, explore Impact Makers Events' complete service catalog.",
    url: "https://www.impactmakersevents.com/services",
  },
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
