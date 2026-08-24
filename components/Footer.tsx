"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Check,
  Copy,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

// Social links configuration with custom SVG icons or Lucide icons
interface SocialLink {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66A1.66 1.66 0 0 0 7.83 6.2z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://x.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

const NAVIGATION_LINKS = [
  { label: "Executive Experience", href: "#hero" },
  { label: "About Our Studio", href: "#about" },
  { label: "Milestones & Impact", href: "#achievements" },
  { label: "Flagship Portfolio", href: "#portfolio" },
  { label: "End-to-End Solutions", href: "#services" },
  { label: "Execution Blueprint", href: "#process" },
  { label: "Cinematic Showreel", href: "#showreel" },
  { label: "Spatial Constellation", href: "#stage" },
];

const SOLUTIONS_LINKS = [
  { label: "Keynote Stadium Stages", href: "#services" },
  { label: "Executive Pavilion Design", href: "#services" },
  { label: "Kinetic Spatial Lighting", href: "#services" },
  { label: "Hybrid Broadcast Control", href: "#services" },
  { label: "Interactive Brand Immersion", href: "#services" },
  { label: "Real-time Telemetry & Audio", href: "#services" },
];

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleCopy = (text: string, badgeId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBadge(badgeId);
    setTimeout(() => {
      setCopiedBadge(null);
    }, 2000);
  };

  const handleScrollToSection = (href: string) => {
    scrollTo(href, { offset: -60, duration: 1.2 });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
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
              {/* Brand Logo with dynamic spin rings */}
              <button
                onClick={() => handleScrollToSection("#hero")}
                className="group flex items-center gap-3 text-left cursor-pointer mb-5"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white border border-slate-200/70 shadow-diffused-sm group-hover:shadow-diffused-md transition-shadow">
                  <Image
                    src="/logo_t_lightGrad.svg"
                    alt="IMPACT Ring"
                    width={56}
                    height={56}
                    className="absolute w-full h-full object-contain animate-[spin_10s_linear_infinite_reverse]"
                  />
                  <Image
                    src="/logo_g_lightGrad.svg"
                    alt="IMPACT Core"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-slate-900 block group-hover:text-[#003E95] transition-colors">
                    IMPACT B2B
                  </span>
                  <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                    Spatial Summit Architecture
                  </span>
                </div>
              </button>

              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                Engineering world-class spatial stages, immersive kinetic pavilions, and zero-fail summit experiences for premier enterprise organizations worldwide.
              </p>
            </div>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 border border-slate-200/70 shadow-diffused-sm text-xs text-slate-700 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-semibold text-slate-800">Operational:</span>
              <span className="text-slate-500 font-mono text-[11px]">99.98% Live SLA</span>
            </div>
          </div>

          {/* Column 2: Navigation / Quick Links with Animated Underline (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleScrollToSection(link.href)}
                    className="group relative inline-flex items-center text-slate-600 hover:text-[#003E95] font-medium transition-colors cursor-pointer"
                  >
                    <span>{link.label}</span>
                    {/* Hover underline motion */}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#003E95] to-[#00A7F5] transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Solutions & Capabilities (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SOLUTIONS_LINKS.map((sol) => (
                <li key={sol.label}>
                  <button
                    onClick={() => handleScrollToSection(sol.href)}
                    className="group relative inline-flex items-center text-slate-600 hover:text-[#003E95] font-medium transition-colors cursor-pointer"
                  >
                    <span>{sol.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#003E95] to-[#00A7F5] transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Badges & Executive Briefing (Col Span 3) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Contact & Dispatch
            </h4>

            {/* Interactive Contact Badges with One-Click Copy */}
            <div className="space-y-2.5">
              {/* Email Badge */}
              <button
                onClick={() => handleCopy("summit@impactb2b.com", "email")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 shadow-diffused-sm hover:shadow-diffused-md transition-all group cursor-pointer text-left"
                aria-label="Copy executive contact email"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Mail className="w-4 h-4 text-[#003E95] shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    summit@impactb2b.com
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

              {/* Phone / Hotline Badge */}
              <button
                onClick={() => handleCopy("+1 (800) 840-9200", "phone")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 shadow-diffused-sm hover:shadow-diffused-md transition-all group cursor-pointer text-left"
                aria-label="Copy production hotline phone number"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Phone className="w-4 h-4 text-[#00A7F5] shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    +1 (800) 840-9200
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

              {/* HQ Badge */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/50 border border-slate-100 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">San Francisco • London • Dubai</span>
              </div>
            </div>

            {/* Newsletter / Executive Briefing */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-800 mb-2">
                Spatial Architecture Briefing
              </p>
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <Check className="w-4 h-4" />
                  <span>Subscribed to quarterly executive dispatch.</span>
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

        {/* Bottom Bar: Social Icons with Elastic Bounce, Copyright & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Dynamic Social Icons with Elastic Hover Bounce */}
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
            <span>© {new Date().getFullYear()} IMPACT B2B Global Inc. All rights reserved.</span>
            <a href="#hero" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#hero" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </a>
            <a href="#hero" className="hover:text-slate-800 transition-colors">
              Security SLA
            </a>
          </div>

          {/* Back to Top Floating Button */}
          <button
            onClick={() => handleScrollToSection("#hero")}
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
