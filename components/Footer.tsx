"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Check,
  Copy,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSmoothScroll } from "./SmoothScroll";

interface SocialLink {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/impact-makers-events",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66A1.66 1.66 0 0 0 7.83 6.2z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/impactmakersevents",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@impactmakersevents",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const NAVIGATION_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Stand Brief Builder", href: "/brief" },
  { label: "Industry Journal", href: "/blog" },
  { label: "Contact & Locations", href: "/contact" },
];

const CORE_SERVICES = [
  { label: "Custom Stand Fabrication", href: "/services#stand-fabrication" },
  { label: "Event Management & Operations", href: "/services#event-management" },
  { label: "Event Organizing & Congresses", href: "/services#event-organizing" },
  { label: "AV & Sound Systems Rental", href: "/services#av-lighting" },
  { label: "Photography & 4K Videography", href: "/services#videography" },
  { label: "Exhibition Space Selling", href: "/services#space-selling" },
  { label: "Corporate Gifts & Branding", href: "/services#branding" },
  { label: "Designer Furniture Rental", href: "/services#furniture" },
];

const GLOBAL_PRESENCE = [
  "United Arab Emirates (HQ)",
  "Poland",
  "Portugal",
  "Netherlands",
  "United States",
  "Germany",
  "Singapore",
  "Rwanda",
  "Ethiopia",
];

export default function Footer() {
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  // Disable website footer on dashboard / admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleCopy = (text: string, badgeId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBadge(badgeId);
    setTimeout(() => {
      setCopiedBadge(null);
    }, 2000);
  };

  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;

    setNewsletterLoading(true);
    setNewsletterError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail.trim().toLowerCase(),
          topics: ["Executive Briefing", "Exhibition Insights"],
        }),
      });

      if (res.ok) {
        setNewsletterSubscribed(true);
        setNewsletterEmail("");
      } else {
        const data = await res.json();
        setNewsletterError(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setNewsletterError("Network error. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="relative w-full border-t border-slate-200/80 bg-gradient-to-b from-white/70 via-slate-50/80 to-white/90 backdrop-blur-2xl text-slate-700">
      {/* Top subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#00A7F5]/40 to-transparent" />

      {/* Main 4-Column Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-slate-200/80">

          {/* Column 1: Brand & Live Status (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand Logo */}
              <Link
                href="/"
                className="group flex items-center gap-3 text-left cursor-pointer mb-5"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white border border-slate-200/70 shadow-diffused-sm group-hover:shadow-diffused-md transition-shadow">
                  <Image
                    src="/logo_t_lightGrad.svg"
                    alt="Impact Makers Events Ring"
                    width={56}
                    height={56}
                    className="absolute w-full h-full object-contain animate-[spin_10s_linear_infinite_reverse]"
                  />
                  <Image
                    src="/logo_g_lightGrad.svg"
                    alt="Impact Makers Events Core"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight text-slate-900 block group-hover:text-[#003E95] transition-colors">
                    Impact Makers Events
                  </span>
                  <span className="text-[11px] text-[#00A7F5] font-bold tracking-wider uppercase">
                    Connecting Businesses Worldwide
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mb-4">
                From concept to reality — crafting bespoke spaces that bring brands to life across 9 countries with ISO-certified fabrication and event management excellence.
              </p>

              {/* ISO Accreditations Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#00A7F5]" />
                  ISO 9001:2015
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ISO 14001:2015
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  ISO 45001:2018
                </span>
              </div>
            </div>

            {/* Global Presence Hubs */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-diffused-sm text-xs text-slate-700">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                <Globe2 className="w-3.5 h-3.5 text-[#00A7F5]" />
                <span>Global Presence (9 Countries):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-medium">
                {GLOBAL_PRESENCE.map((country, idx) => (
                  <span key={country} className="after:content-['•'] after:ml-1.5 after:text-slate-300 last:after:content-none">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Navigation / Quick Links (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group relative inline-flex items-center text-slate-600 hover:text-[#003E95] font-medium transition-colors cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#003E95] to-[#00A7F5] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Services (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CORE_SERVICES.map((sol) => (
                <li key={sol.label}>
                  <Link
                    href={sol.href}
                    className="group relative inline-flex items-center text-slate-600 hover:text-[#003E95] font-medium transition-colors cursor-pointer text-xs sm:text-sm"
                  >
                    <span>{sol.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#003E95] to-[#00A7F5] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Official Contact & Dispatch (Col Span 3) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Dubai Headquarters & Contact
            </h4>

            {/* Interactive Contact Badges with One-Click Copy */}
            <div className="space-y-2.5">
              {/* Email Badge */}
              <button
                onClick={() => handleCopy("sales@impactmakersevents.com", "email")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 shadow-diffused-sm hover:shadow-diffused-md transition-all group cursor-pointer text-left"
                aria-label="Copy official sales email"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Mail className="w-4 h-4 text-[#003E95] shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    sales@impactmakersevents.com
                  </span>
                </div>
                <div className="text-slate-400 group-hover:text-[#003E95] transition-colors ml-2 shrink-0">
                  {copiedBadge === "email" ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              {/* Phone / WhatsApp Badge */}
              <button
                onClick={() => handleCopy("+971 54 711 4951", "phone")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 shadow-diffused-sm hover:shadow-diffused-md transition-all group cursor-pointer text-left"
                aria-label="Copy hotline phone number"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Phone className="w-4 h-4 text-[#00A7F5] shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    +971 54 711 4951
                  </span>
                </div>
                <div className="text-slate-400 group-hover:text-[#003E95] transition-colors ml-2 shrink-0">
                  {copiedBadge === "phone" ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              {/* HQ Address Badge */}
              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/50 border border-slate-100 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Tamem House Building, Barsha Heights (Tecom), Dubai, UAE</span>
              </div>
            </div>

            {/* Newsletter / Executive Briefing */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-800 mb-2">
                Industry & Exhibition Briefing
              </p>
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <Check className="w-4 h-4" />
                  <span>Subscribed to Impact Makers Events updates.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="Enter corporate email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003E95] transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to briefing"
                    className="absolute right-1.5 p-1.5 rounded-lg bg-[#003E95] hover:bg-[#002D6E] text-white transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Social Icons, Copyright & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 text-slate-600 hover:text-[#003E95] shadow-diffused-sm hover:shadow-diffused-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95"
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              );
            })}
          </div>

          {/* Legal / Copyright Statement */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Impact Makers Events L.L.C. All rights reserved.</span>
            <Link href="/about" className="hover:text-slate-800 transition-colors">
              About
            </Link>
            <Link href="/services" className="hover:text-slate-800 transition-colors">
              Services
            </Link>
            <Link href="/brief" className="hover:text-slate-800 transition-colors">
              Stand Brief
            </Link>
            <Link href="/contact" className="hover:text-slate-800 transition-colors">
              Contact
            </Link>
          </div>

          {/* Back to Top Floating Button */}
          <button
            onClick={handleScrollToTop}
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-[#003E95] shadow-diffused-sm hover:shadow-diffused-md transition-all cursor-pointer"
          >
            <span>Back to Top</span>
            <ChevronUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 text-slate-400 group-hover:text-[#003E95]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
