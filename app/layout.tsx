import type { Metadata } from "next";
import { Geist, Geist_Mono, Lobster } from "next/font/google";
import "./globals.css";
import KineticBackground from "@/components/KineticBackground";
import SmoothScroll from "@/components/SmoothScroll";
import RevealProvider from "@/components/RevealProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lobster = Lobster({
  variable: "--font-cursive",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.impactmakersevents.com"),
  title: {
    default: "Impact Makers Events | Connecting Businesses Worldwide | Exhibition Stand Fabrication & Corporate Events Dubai",
    template: "%s | Impact Makers Events L.L.C",
  },
  description:
    "Impact Makers Events L.L.C is a premier turnkey event management and custom exhibition stand fabrication company headquartered in Dubai with a presence across 9 countries. ISO 9001, 14001 & 45001 certified.",
  keywords: [
    "Impact Makers Events",
    "Exhibition Stand Fabrication Dubai",
    "Event Management Company UAE",
    "Custom Exhibition Booths Dubai",
    "Corporate Event Organizers Dubai",
    "DEC Exhibition Stand Contractor",
    "DWTC Stand Builder",
    "AV and Sound Systems Rental Dubai",
    "Corporate Gifts & Branding UAE",
    "Event Furniture Rental Dubai",
    "ISO Certified Event Company Dubai",
    "B2B Trade Show Management",
  ],
  authors: [{ name: "Impact Makers Events L.L.C" }],
  creator: "Impact Makers Events L.L.C",
  publisher: "Impact Makers Events L.L.C",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.impactmakersevents.com",
    siteName: "Impact Makers Events L.L.C",
    title: "Impact Makers Events | Connecting Businesses Worldwide | Dubai & Global Events",
    description:
      "Turnkey exhibition stand fabrication, corporate event management, audiovisual production, and space selling across UAE, Europe, USA, and Africa. Triple ISO certified.",
    images: [
      {
        url: "/og_logo_card.png",
        width: 1200,
        height: 630,
        alt: "Impact Makers Events - Custom Exhibition Stands and Corporate Summits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Impact Makers Events L.L.C | Connecting Businesses Worldwide",
    description:
      "Premier event management, custom booth fabrication, and technical AV production in Dubai & worldwide.",
    images: ["/og_logo_card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.impactmakersevents.com/#organization",
      name: "Impact Makers Events L.L.C",
      alternateName: "Impact Makers Events",
      url: "https://www.impactmakersevents.com",
      logo: "https://drive.google.com/uc?export=view&id=1DvHfeZZVbQeVCciLX_5QlzH9Q-KUwfl3",
      email: "sales@impactmakersevents.com",
      telephone: "+971547114951",
      slogan: "Connecting Businesses Worldwide - From Concept To Reality",
      description:
        "Turnkey event management, exhibition stand fabrication, AV & lighting production, furniture rental, corporate gifts, and exhibition space selling.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Tamem House Building, Barsha Heights (Tecom)",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "ISO Certification",
          name: "ISO 9001:2015 Quality Management System",
          recognizedBy: {
            "@type": "Organization",
            name: "Universal Registrars",
          },
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "ISO Certification",
          name: "ISO 14001:2015 Environmental Management System",
          recognizedBy: {
            "@type": "Organization",
            name: "Universal Registrars",
          },
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "ISO Certification",
          name: "ISO 45001:2018 Occupational Health & Safety",
          recognizedBy: {
            "@type": "Organization",
            name: "Universal Registrars",
          },
        },
      ],
      areaServed: [
        "United Arab Emirates",
        "Poland",
        "Portugal",
        "Netherlands",
        "United States",
        "Germany",
        "Singapore",
        "Rwanda",
        "Ethiopia",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.impactmakersevents.com/#localbusiness",
      name: "Impact Makers Events L.L.C",
      image: "https://drive.google.com/uc?export=view&id=14BHDHH40L4oLXGfnOEecXuB9YipwOBa1",
      telephone: "+971547114951",
      email: "sales@impactmakersevents.com",
      priceRange: "$$$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Tamem House Building, Barsha Heights (Tecom)",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 25.097,
        longitude: 55.1717,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lobster.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative text-slate-900 bg-white selection:bg-[#003E95] selection:text-white">
        <RevealProvider>
          <KineticBackground />
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </RevealProvider>
      </body>
    </html>
  );
}
