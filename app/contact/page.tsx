import type { Metadata } from "next";
import ContactHero from "@/components/ContactHero";
import ContactFormSection from "@/components/ContactFormSection";
import ContactMap from "@/components/ContactMap";
import ContactFAQ from "@/components/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact Us | Impact Makers Events L.L.C — Dubai HQ & 9 Global Hubs",
  description:
    "Get in touch with Impact Makers Events L.L.C. Request custom exhibition stand proposals, international congress organizing, and turnkey AV quotes. Tamem House, Barsha Heights, Dubai, UAE.",
  openGraph: {
    title: "Contact Us | Impact Makers Events L.L.C — Connecting Businesses Worldwide",
    description:
      "Direct line: +971 54 711 4951 | Email: sales@impactmakersevents.com | Headquarters: Tamem House Building, Barsha Heights, Dubai, UAE.",
    url: "https://www.impactmakersevents.com/contact",
  },
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