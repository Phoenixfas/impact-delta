import type { Metadata } from "next";
import ContactHero from "@/components/ContactHero";
import ContactFormSection from "@/components/ContactFormSection";
import ContactMap from "@/components/ContactMap";
import ContactFAQ from "@/components/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact & Inquiries | IMPACT B2B — Global Event Architecture",
  description:
    "Connect with Impact B2B's executive production desk. Direct communication channels for enterprise summits, stadium-grade kinetic show control, press relations, and RFP submissions.",
};

export default function ContactPage() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <ContactHero />
      <ContactFormSection />
      <ContactMap />
      <ContactFAQ />
    </div>
  );
}