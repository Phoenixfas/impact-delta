import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutStory from "@/components/AboutStory";
import AboutValues from "@/components/AboutValues";
import AboutTeam from "@/components/AboutTeam";
import AboutTimeline from "@/components/AboutTimeline";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "About Us | Impact Makers Events L.L.C — Connecting Businesses Worldwide",
  description:
    "Learn about Impact Makers Events L.L.C — Dubai's premier exhibition stand fabrication, event management, and audiovisual production partner with Triple ISO certification and operations across 9 countries.",
  openGraph: {
    title: "About Us | Impact Makers Events L.L.C — Connecting Businesses Worldwide",
    description:
      "From concept to reality — discover our in-house fabrication facility, triple ISO certifications (9001, 14001, 45001), and global event management footprint across 9 countries.",
    url: "https://www.impactmakersevents.com/about",
  },
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
