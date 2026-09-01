"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PhoneCall,
  Mail,
  Send,
  MessageCircle,
  Copy,
  Check,
  Globe2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  FileDown,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";
import { useReveal } from "./RevealProvider";

interface DirectChannel {
  id: "phone" | "email" | "press";
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  primaryValue: string;
  secondaryValue: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  primaryActionIcon: React.ElementType;
  secondaryActionLabel: string;
  secondaryActionHref: string;
  secondaryActionIcon: React.ElementType;
  copyValue: string;
  copyLabel: string;
  statusText: string;
  tags: string[];
  gradientAccent: string;
  borderAccent: string;
}

const DIRECT_CHANNELS: DirectChannel[] = [
  {
    id: "phone",
    badge: "DIRECT DIAL & WHATSAPP",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    title: "Direct Phone & WhatsApp",
    subtitle:
      "Direct line to our Dubai headquarters production desk and international project directors.",
    primaryValue: "+971 54 711 4951",
    secondaryValue: "WhatsApp: +971 54 711 4951",
    primaryActionLabel: "Direct Dial",
    primaryActionHref: "tel:+971547114951",
    primaryActionIcon: PhoneCall,
    secondaryActionLabel: "WhatsApp Chat",
    secondaryActionHref: "https://wa.me/971547114951",
    secondaryActionIcon: MessageCircle,
    copyValue: "+971547114951",
    copyLabel: "Copy Phone Number",
    statusText: "Dubai Desk Live · < 5 Min Response",
    tags: ["24/7 Stand Support", "Rapid Quotation", "WhatsApp Direct"],
    gradientAccent: "from-emerald-500/10 via-teal-500/5 to-transparent",
    borderAccent: "group-hover:border-emerald-500/40",
  },
  {
    id: "email",
    badge: "PROJECT INQUIRIES & RFPS",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    title: "Project Inquiries & Stand Briefs",
    subtitle:
      "Submit stand briefs, 3D architectural RFPs, congress management scopes, or AV rental inquiries.",
    primaryValue: "sales@impactmakersevents.com",
    secondaryValue: "RFP Desk: sales@impactmakersevents.com",
    primaryActionLabel: "Send Email",
    primaryActionHref: "mailto:sales@impactmakersevents.com?subject=New%20Stand%20%26%20Event%20Inquiry%20%E2%80%94%20Impact%20Makers%20Events",
    primaryActionIcon: Send,
    secondaryActionLabel: "Stand Brief Wizard",
    secondaryActionHref: "/brief",
    secondaryActionIcon: ArrowUpRight,
    copyValue: "sales@impactmakersevents.com",
    copyLabel: "Copy Official Email",
    statusText: "Direct In-House Desk · Same-Day RFP Review",
    tags: ["3D Stand Proposal", "CNC Joinery Quote", "Turnkey SLA"],
    gradientAccent: "from-[#003E95]/10 via-[#00A7F5]/5 to-transparent",
    borderAccent: "group-hover:border-[#00A7F5]/50",
  },
  {
    id: "press",
    badge: "DUBAI HQ & GLOBAL DESK",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200/80",
    title: "Headquarters & Global Hubs",
    subtitle:
      "Tamem House Building, Barsha Heights, Dubai, UAE with operations across 9 countries.",
    primaryValue: "info@impactmakersevents.com",
    secondaryValue: "HQ: Tamem House, Barsha Heights, Dubai",
    primaryActionLabel: "Inquire at HQ",
    primaryActionHref: "mailto:info@impactmakersevents.com?subject=Global%20Hub%20Inquiry%20%E2%80%94%20Impact%20Makers%20Events",
    primaryActionIcon: Mail,
    secondaryActionLabel: "View 9 Hubs",
    secondaryActionHref: "#map",
    secondaryActionIcon: Globe2,
    copyValue: "info@impactmakersevents.com",
    copyLabel: "Copy HQ Email",
    statusText: "Dubai HQ Live · Triple ISO Certified",
    tags: ["9 Global Hubs", "Universal Registrars", "Turnkey Delivery"],
    gradientAccent: "from-sky-500/10 via-indigo-500/5 to-transparent",
    borderAccent: "group-hover:border-sky-500/40",
  },
];

const GLOBAL_HUBS = [
  { city: "DUBAI (HQ)", tz: "GST (UTC+4)", status: "Tamem House HQ" },
  { city: "WARSAW", tz: "CET (UTC+1)", status: "Poland Hub" },
  { city: "LISBON", tz: "WET (UTC+0)", status: "Portugal Hub" },
  { city: "AMSTERDAM", tz: "CET (UTC+1)", status: "Netherlands Hub" },
  { city: "BERLIN", tz: "CET (UTC+1)", status: "Germany Hub" },
  { city: "NEW YORK", tz: "EST (UTC-5)", status: "USA Hub" },
  { city: "SINGAPORE", tz: "SGT (UTC+8)", status: "Asia Hub" },
  { city: "KIGALI", tz: "CAT (UTC+2)", status: "Rwanda Hub" },
  { city: "ADDIS ABABA", tz: "EAT (UTC+3)", status: "Ethiopia Hub" },
];

export default function ContactHero() {
  const { scrollTo } = useSmoothScroll();
  const { setRevealed } = useReveal();

  const sectionRef = useRef<HTMLElement | null>(null);
  const ambientGlowRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State for active copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Activate global background reveal on mount
  useEffect(() => {
    setRevealed(true);
  }, [setRevealed]);

  // Copy to clipboard with instant glass checkmark feedback
  const handleCopy = useCallback((text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedId(null);
    }, 2400);
  }, []);

  // 1. Dynamic ambient glow following mouse movement across the hero section
  useEffect(() => {
    const section = sectionRef.current;
    const glow = ambientGlowRef.current;
    if (!section || !glow) return;

    let targetX = 50;
    let targetY = 30;
    let curX = 50;
    let curY = 30;
    let rafId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      targetX = Math.max(0, Math.min(100, relX * 100));
      targetY = Math.max(0, Math.min(100, relY * 100));
    };

    const loop = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      glow.style.setProperty("--glow-x", `${curX.toFixed(2)}%`);
      glow.style.setProperty("--glow-y", `${curY.toFixed(2)}%`);
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 2. 3D Tilt & Specular Dynamic Glare Tracking on Each Glass Card
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const cleanupFns: (() => void)[] = [];

    cards.forEach((card) => {
      let targetTiltX = 0;
      let targetTiltY = 0;
      let curTiltX = 0;
      let curTiltY = 0;
      let lightX = 50;
      let lightY = 50;
      let curLightX = 50;
      let curLightY = 50;
      let isHovered = false;
      let rafId = 0;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentX = x / rect.width;
        const percentY = y / rect.height;

        targetTiltX = (percentY - 0.5) * -10;
        targetTiltY = (percentX - 0.5) * 12;

        lightX = percentX * 100;
        lightY = percentY * 100;
      };

      const handlePointerEnter = () => {
        isHovered = true;
      };

      const handlePointerLeave = () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
        lightX = 50;
        lightY = 50;
      };

      const loop = () => {
        curTiltX += (targetTiltX - curTiltX) * 0.12;
        curTiltY += (targetTiltY - curTiltY) * 0.12;
        curLightX += (lightX - curLightX) * 0.15;
        curLightY += (lightY - curLightY) * 0.15;

        if (isHovered || Math.abs(curTiltX) > 0.05 || Math.abs(curTiltY) > 0.05) {
          card.style.transform = `perspective(1000px) rotateX(${curTiltX.toFixed(2)}deg) rotateY(${curTiltY.toFixed(2)}deg) translateZ(4px)`;
        } else {
          card.style.transform = "";
        }

        card.style.setProperty("--light-x", `${curLightX.toFixed(2)}%`);
        card.style.setProperty("--light-y", `${curLightY.toFixed(2)}%`);

        rafId = requestAnimationFrame(loop);
      };

      card.addEventListener("pointermove", handlePointerMove, { passive: true });
      card.addEventListener("pointerenter", handlePointerEnter);
      card.addEventListener("pointerleave", handlePointerLeave);
      rafId = requestAnimationFrame(loop);

      cleanupFns.push(() => {
        card.removeEventListener("pointermove", handlePointerMove);
        card.removeEventListener("pointerenter", handlePointerEnter);
        card.removeEventListener("pointerleave", handlePointerLeave);
        cancelAnimationFrame(rafId);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  // 4. GSAP Entrance Choreography with Split-Text Reveal
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Initial States
      gsap.set(".contact-badge-strip", { opacity: 0, y: -20, scale: 0.95 });
      gsap.set(".contact-eyebrow", { opacity: 0, y: 25 });
      gsap.set(".contact-split-word", { opacity: 0, yPercent: 120, rotateX: 35 });
      gsap.set(".contact-subheading", { opacity: 0, y: 30 });
      gsap.set(".contact-hubs-bar", { opacity: 0, y: 20 });
      gsap.set(".contact-channel-card", { opacity: 0, y: 45, scale: 0.94 });
      gsap.set(".contact-bottom-assist", { opacity: 0, y: 20 });

      // Orchestrated Entrance Timeline
      tl.to(".contact-badge-strip", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: "back.out(1.7)",
      })
        .to(
          ".contact-eyebrow",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.4"
        )
        .to(
          ".contact-split-word",
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 1.15,
            stagger: 0.055,
            ease: "power4.out",
          },
          "-=0.55"
        )
        .to(
          ".contact-subheading",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          ".contact-hubs-bar",
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          ".contact-channel-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to(
          ".contact-bottom-assist",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Editorial Split Text tokens
  const headlineWords = [
    { text: "Let’s", highlight: false },
    { text: "Bring", highlight: false },
    { text: "Your", highlight: false },
    { text: "Vision", highlight: true },
    { text: "to", highlight: true },
    { text: "Life.", highlight: true },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact-hero"
      className="relative w-full min-h-[92vh] pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden selection:bg-[#003E95] selection:text-white"
    >
      {/* ---------------------------------------------------------------------- */}
      {/* B. EDITORIAL HEADER & MOTION STAGE                                     */}
      {/* ---------------------------------------------------------------------- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Top Operational Status Pill */}
        <div className="contact-badge-strip inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/80 border border-slate-200/80 shadow-sm shadow-slate-100 mb-6 group cursor-default">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-slate-700">
            GLOBAL OPERATIONS DESK ACTIVE
          </span>
          <span className="text-slate-300 font-mono">|</span>
          <span className="text-[11px] sm:text-xs font-mono font-medium text-emerald-600">
            LIVE RESPONSE &lt; 15 MIN
          </span>
        </div>

        {/* Section Eyebrow */}
        <div className="contact-eyebrow flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#00A7F5]" />
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.22em] font-semibold text-[#003E95]">
            DIRECT ENGAGEMENT & PROTOCOLS
          </span>
          <Sparkles className="w-4 h-4 text-[#00A7F5]" />
        </div>

        {/* GSAP Split-Text Editorial Headline */}
        <h1
          aria-label="Let’s Bring Your Vision to Life."
          className="contact-headline text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-slate-900 leading-[1.08] max-w-5xl mx-auto mb-6 text-balance"
          style={{ perspective: 1000 }}
        >
          {headlineWords.map((item, index) => (
            <span
              key={index}
              className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0"
            >
              <span
                className={`contact-split-word inline-block will-change-transform ${item.highlight
                  ? "text-gradient font-black drop-shadow-[0_2px_12px_rgba(0,167,245,0.2)]"
                  : "text-slate-900"
                  }`}
              >
                {item.text}
              </span>
            </span>
          ))}
        </h1>

        {/* Editorial Subheading Description */}
        <p className="contact-subheading text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal mb-8 text-balance">
          Direct communication channels to our executive production desk.
          Whether architecting a 50,000-attendee global summit, kinetic stadium
          rigging, or bespoke spatial previz, our engineering directors are on
          standby.
        </p>

        {/* Global Hubs Availability Ticker Bar */}
        <div className="contact-hubs-bar w-full max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="backdrop-blur-md bg-white/70 border border-slate-200/70 shadow-sm rounded-2xl p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold pl-1">
                <Globe2 className="w-3.5 h-3.5 text-[#00A7F5]" />
                <span>COMMAND DESKS:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 flex-1">
                {GLOBAL_HUBS.map((hub) => (
                  <div
                    key={hub.city}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50/80 border border-slate-200/60 text-[11px] font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-800">{hub.city}</span>
                    <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">
                      {hub.tz}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* C. DIRECT CHANNELS GRID (3-COLUMN LIGHT-GLASS ROW)                 */}
        {/* ------------------------------------------------------------------ */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl mx-auto text-left"
        >
          {DIRECT_CHANNELS.map((channel, index) => {
            const isCopied = copiedId === channel.id;
            const PrimaryIcon = channel.primaryActionIcon;
            const SecondaryIcon = channel.secondaryActionIcon;

            return (
              <div
                key={channel.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                style={
                  {
                    "--light-x": "50%",
                    "--light-y": "50%",
                  } as React.CSSProperties
                }
                className={`contact-channel-card group relative flex flex-col justify-between rounded-3xl backdrop-blur-md bg-white/80 border border-slate-200/60 shadow-lg shadow-slate-100/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1 overflow-hidden ${channel.borderAccent}`}
              >
                {/* Dynamic specular glare tracking */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  style={{
                    background: `
                      radial-gradient(
                        320px circle at var(--light-x, 50%) var(--light-y, 50%),
                        rgba(255, 255, 255, 0.95) 0%,
                        rgba(0, 167, 245, 0.08) 40%,
                        transparent 70%
                      )
                    `,
                  }}
                />

                {/* Subtle gradient background wash */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${channel.gradientAccent} opacity-60 pointer-events-none z-0`}
                />

                {/* Card Top: Badge & Status Indicator */}
                <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase border ${channel.badgeColor}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {channel.badge}
                  </span>

                  {/* Instant Copy-to-Clipboard Button with Magnetic micro-interaction & Glass Checkmark */}
                  <button
                    onClick={() => handleCopy(channel.copyValue, channel.id)}
                    aria-label={channel.copyLabel}
                    title={channel.copyLabel}
                    className={`relative inline-flex items-center justify-center p-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-sm ${isCopied
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-300 ring-2 ring-emerald-200 scale-105"
                      : "bg-white/90 text-slate-600 border border-slate-200 hover:text-[#003E95] hover:border-[#00A7F5]/50 hover:bg-white active:scale-95"
                      }`}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Copy className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                    )}

                    {/* Temporary glass tooltip badge on click */}
                    {isCopied && (
                      <span className="absolute -top-9 right-0 z-30 whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900 text-white shadow-lg shadow-black/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        ✓ Copied to clipboard!
                      </span>
                    )}
                  </button>
                </div>

                {/* Card Body: Title, Subtitle, Direct Channel Info */}
                <div className="relative z-10 flex-1 flex flex-col mb-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2 group-hover:text-[#003E95] transition-colors">
                    {channel.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {channel.subtitle}
                  </p>

                  {/* Primary & Secondary Channel Values */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 mb-4 transition-all group-hover:bg-blue-50/40 group-hover:border-blue-200/60">
                    <div className="font-mono text-sm sm:text-base font-bold text-slate-900 select-all mb-0.5 flex items-center justify-between">
                      <span>{channel.primaryValue}</span>
                    </div>
                    <div className="font-mono text-[11px] sm:text-xs text-slate-500 font-medium select-all">
                      {channel.secondaryValue}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {channel.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/80 border border-slate-200/60 text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Action Buttons */}
                <div className="relative z-10 pt-4 border-t border-slate-200/60 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {/* Primary Action Button */}
                    <a
                      href={channel.primaryActionHref}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#003E95] to-[#00A7F5] hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-blue-900/10"
                    >
                      <PrimaryIcon className="w-3.5 h-3.5" />
                      <span>{channel.primaryActionLabel}</span>
                    </a>

                    {/* Secondary Action Link / Button */}
                    <a
                      href={channel.secondaryActionHref}
                      onClick={(e) => {
                        if (channel.secondaryActionHref.startsWith("#")) {
                          e.preventDefault();
                          scrollTo(channel.secondaryActionHref, { offset: -60 });
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:border-[#00A7F5]/60 hover:text-[#003E95] hover:bg-slate-50 active:scale-[0.98] transition-all"
                    >
                      <SecondaryIcon className="w-3.5 h-3.5 text-[#00A7F5]" />
                      <span className="hidden sm:inline">
                        {channel.secondaryActionLabel}
                      </span>
                    </a>
                  </div>

                  {/* Response status metadata */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 pt-1">
                    <Clock className="w-3 h-3 text-[#00A7F5]" />
                    <span>{channel.statusText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* D. FAST-TRACK PROTOCOL & ENCRYPTED RFP ADVISORY                    */}
        {/* ------------------------------------------------------------------ */}
        <div className="contact-bottom-assist mt-12 sm:mt-16 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl backdrop-blur-md bg-white/70 border border-slate-200/70 shadow-sm text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#003E95] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Institutional Security & Mutual NDA Standard
              </h4>
              <p className="text-xs text-slate-500">
                All submitted stage designs, CAD schematics, and RFP materials are
                automatically protected under enterprise-tier confidentiality.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="mailto:sales@impactmakersevents.com?subject=Enterprise%20RFP%20Submission%20%E2%80%94%20Impact%20Makers%20Events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Submit Secure RFP</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
