"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowUpRight,
  X,
  Award,
  Globe2,
  Calendar,
  Layers,
  Mail,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

export interface TeamMember {
  id: string;
  number: string;
  name: string;
  role: string;
  department: string;
  location: string;
  tenure: string;
  image: string;
  quote: string;
  bio: string[];
  achievements: string[];
  disciplines: string[];
  stats: { label: string; value: string }[];
  socials: { linkedin?: string; twitter?: string; email?: string };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "elena-vance",
    number: "01",
    name: "Elena Vance",
    role: "Chief Spatial Architect & Co-Founder",
    department: "Spatial Design & Creative Direction",
    location: "London / Zurich",
    tenure: "Founding Partner • 12Y",
    image: "/images/team/elena-vance.jpg",
    quote: "“Space is not merely a container for speeches; it is the physical manifestation of corporate ambition.”",
    bio: [
      "Elena Vance pioneered the studio’s architectural philosophy, fusing large-scale timber joinery and kinetic 3D lighting into world-class enterprise arenas.",
      "Prior to co-founding Impact B2B, Elena led spatial installations for premier European architectural biennales and directed keynote environments for Fortune 50 technology conglomerates.",
      "She oversees the creative vision for all flagship summits, ensuring every stage geometry is engineered with mathematical precision and emotional reverence.",
    ],
    achievements: [
      "Architected the 50,000-attendee Global AI Summit arena in Geneva",
      "Pioneered proprietary volumetric sightline raytracing for arena auditoriums",
      "Recipient of 6 International Spatial Experience & Scenography Awards",
    ],
    disciplines: ["Volumetric Architecture", "Kinetic Scenography", "Light Direction", "Spatial Raytracing"],
    stats: [
      { label: "Summits Directed", value: "240+" },
      { label: "Design Awards", value: "6x" },
      { label: "Years at Helm", value: "12" },
    ],
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      email: "elena.vance@impactb2b.com",
    },
  },
  {
    id: "marcus-chen",
    number: "02",
    name: "Marcus Chen",
    role: "Technical Show Director & VP Engineering",
    department: "Live Operations & Automation",
    location: "San Francisco / Tokyo",
    tenure: "Partner • 9Y",
    image: "/images/team/marcus-chen.jpg",
    quote: "“When the keynote starts, there are no second takes. Redundancy must be absolute and silent.”",
    bio: [
      "Marcus brings over two decades of master show calling and technical directing experience from Olympic opening ceremonies and global enterprise product reveals.",
      "He engineered Impact B2B’s zero-fail SMPTE timecode automation matrix, linking lighting, video, kinetic hoists, and broadcast feeds into one synchronous ecosystem.",
      "His technical teams have delivered flawless live runs across 120+ countries with an unblemished 0.0ms failover record.",
    ],
    achievements: [
      "Directed 14 consecutive Fortune 10 annual global developer keynotes",
      "Designed the dual-redundant fiber-optic matrix powering 4K multi-feed broadcasts",
      "Author of the enterprise Zero-Fail Stage Automation Protocol",
    ],
    disciplines: ["SMPTE Timecode Automation", "Master Show Calling", "Kinetic Rigging", "Optical Fiber Routing"],
    stats: [
      { label: "Live Cues Called", value: "1.2M+" },
      { label: "Failover Record", value: "0.0ms" },
      { label: "Global Stages", value: "180+" },
    ],
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      email: "marcus.chen@impactb2b.com",
    },
  },
  {
    id: "aurelia-dubois",
    number: "03",
    name: "Aurelia Dubois",
    role: "Head of Sensory Design & Executive Experience",
    department: "Experience Strategy & Audience Cadence",
    location: "Paris / New York",
    tenure: "Principal • 7Y",
    image: "/images/team/aurelia-dubois.jpg",
    quote: "“The real magic occurs in the unspoken intervals — when light, sound, and stillness evoke collective focus.”",
    bio: [
      "Aurelia specializes in the neuro-architecture of audience engagement, mapping the sensory and emotional trajectory of keynote attendees from arrival to departure.",
      "Her background in cognitive psychology and acoustic engineering guides the studio’s bespoke VIP green-rooms, crowd-cadence planning, and interactive spatial audio matrices.",
      "She works intimately with C-suite executives and world leaders to calibrate their on-stage presence with surrounding kinetic environments.",
    ],
    achievements: [
      "Engineered audience journey maps yielding 99.8% executive CSAT across 300+ events",
      "Created sensory acoustic environments for Davos and UN flagship pavilions",
      "Pioneered real-time biometric telemetry integration for live keynote evaluation",
    ],
    disciplines: ["Sensory Experience", "Executive Coaching", "Spatial Acoustics", "Audience Journey Mapping"],
    stats: [
      { label: "Executive CSAT", value: "99.8%" },
      { label: "VIP Greenrooms", value: "450+" },
      { label: "Keynote Speakers", value: "800+" },
    ],
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      email: "aurelia.dubois@impactb2b.com",
    },
  },
  {
    id: "siddharth-patel",
    number: "04",
    name: "Siddharth Patel",
    role: "Master Systems & Live Broadcast Architect",
    department: "Telemetry & Global Distribution",
    location: "Dubai / Singapore",
    tenure: "Principal • 8Y",
    image: "/images/team/siddharth-patel.jpg",
    quote: "“A global keynote is only as powerful as its furthest receiver. We broadcast presence, not just pixels.”",
    bio: [
      "Siddharth orchestrates the ultra-low-latency 4K HDR broadcast architecture linking live arena keynotes to millions of streaming executive viewers worldwide.",
      "He designed the studio’s multi-hub satellite uplink and real-time audience telemetry matrix, tracking engagement analytics and spatial heatmaps in live production.",
      "Siddharth previously engineered satellite broadcast networks for international sporting summits and global financial forums.",
    ],
    achievements: [
      "Broadcast simultaneous keynotes to 2.4M live enterprise viewers across 120+ nations",
      "Developed the instant PR media clipping pipeline delivering 4K highlight reels within 30 minutes",
      "Architected edge-computed audience engagement heatmaps for stadium summits",
    ],
    disciplines: ["4K HDR Satellite Uplink", "Real-Time Telemetry", "NDI/Dante Distribution", "Live Edge Encoding"],
    stats: [
      { label: "Simultaneous Feeds", value: "120+" },
      { label: "Stream Viewers", value: "2.4M+" },
      { label: "Network Uptime", value: "100%" },
    ],
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      email: "siddharth.patel@impactb2b.com",
    },
  },
  {
    id: "david-thorne",
    number: "05",
    name: "David Thorne",
    role: "VP Global Strategy & Enterprise Partnerships",
    department: "Client Strategy & Summit Architecture",
    location: "Austin / London",
    tenure: "Partner • 10Y",
    image: "/images/team/david-thorne.jpg",
    quote: "“We align creative spectacle with cold commercial reality — ensuring every dollar invested generates outsized pipeline return.”",
    bio: [
      "David bridges executive boardroom vision with physical production reality, structuring multi-year global summit partnerships for the world's most valuable enterprises.",
      "With over a decade at Impact B2B, David has orchestrated more than $4.2B in client pipeline impact through strategic stagecraft and high-stakes product launches.",
      "He ensures every summit engagement delivers measurable ROI, brand equity expansion, and unmatched investor resonance.",
    ],
    achievements: [
      "Secured and structured $4.2B+ in client commercial pipeline generation",
      "Directed summit strategy for 35 of the Fortune 100 enterprise leaders",
      "Established Impact B2B’s international studio presence across 4 global continents",
    ],
    disciplines: ["Enterprise Strategy", "Pipeline ROI Modeling", "Commercial Architecture", "Global Client Ateliers"],
    stats: [
      { label: "Pipeline Value", value: "$4.2B+" },
      { label: "Fortune 100 Clients", value: "35+" },
      { label: "Global Studios", value: "4" },
    ],
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      email: "david.thorne@impactb2b.com",
    },
  },
];

export default function AboutTeam() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previewInnerRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { lenis } = useSmoothScroll();

  // Smooth Cursor Follower Physics with GSAP QuickTo
  useEffect(() => {
    const previewEl = previewRef.current;
    if (!previewEl) return;

    const xTo = gsap.quickTo(previewEl, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(previewEl, "y", { duration: 0.35, ease: "power3.out" });
    const rotTo = gsap.quickTo(previewEl, "rotation", { duration: 0.45, ease: "power2.out" });

    let prevX = 0;

    const handlePointerMove = (e: PointerEvent) => {
      // Offset preview smoothly next to cursor
      xTo(e.clientX + 24);
      yTo(e.clientY - 140);

      // Subtle dynamic tilt based on horizontal velocity
      const deltaX = e.clientX - prevX;
      prevX = e.clientX;
      const tilt = Math.max(-12, Math.min(12, deltaX * 0.4));
      rotTo(tilt);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Animate floating preview appearance on hover change
  useEffect(() => {
    const inner = previewInnerRef.current;
    if (!inner) return;

    if (hoveredMember) {
      gsap.to(inner, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(inner, {
        opacity: 0,
        scale: 0.85,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [hoveredMember]);

  // Modal / Slide-over Drawer Animation & Scroll Freeze
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;

    if (selectedMember) {
      lenis?.stop();
      if (backdrop) {
        backdrop.style.visibility = "visible";
        gsap.to(backdrop, { opacity: 1, duration: 0.35, ease: "power2.out" });
      }
      if (drawer) {
        drawer.style.visibility = "visible";
        gsap.fromTo(
          drawer,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    } else {
      lenis?.start();
      if (drawer) {
        gsap.to(drawer, {
          xPercent: 100,
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => {
            if (drawer) drawer.style.visibility = "hidden";
          },
        });
      }
      if (backdrop) {
        gsap.to(backdrop, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            if (backdrop) backdrop.style.visibility = "hidden";
          },
        });
      }
    }
  }, [selectedMember, lenis]);

  // Close on Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedMember) {
        setSelectedMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMember]);

  // GSAP ScrollTrigger Entrance
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      gsap.fromTo(
        ".team-intro-el",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".team-row-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".team-list-container",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-white selection:bg-[#003E95] selection:text-white"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/6 -left-48 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.07),transparent_70%)] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-2/3 -right-48 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.06),transparent_70%)] pointer-events-none -z-10"
      />

      {/* =========================================================================
          CURSOR-FOLLOWING FLOATING PORTRAIT PREVIEW CARD
          ========================================================================= */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block will-change-transform"
      >
        <div
          ref={previewInnerRef}
          className="relative w-64 aspect-[3/4] rounded-3xl overflow-hidden glass-card-elevated p-2 border border-white shadow-[0_24px_60px_-10px_rgba(0,62,149,0.25)] opacity-0 scale-85 will-change-transform bg-white/90 backdrop-blur-2xl"
        >
          {hoveredMember && (
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
              <Image
                src={hoveredMember.image}
                alt={hoveredMember.name}
                fill
                sizes="256px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono tracking-widest text-[#92DCFF] uppercase block">
                  {hoveredMember.tenure}
                </span>
                <span className="text-sm font-bold text-white block truncate">
                  {hoveredMember.name}
                </span>
                <span className="text-[10px] text-slate-300 font-medium truncate block">
                  {hoveredMember.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION HEADER
          ========================================================================= */}
      <div className="relative max-w-7xl mx-auto mb-16 sm:mb-24 text-left">
        <div className="team-intro-el inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
          <span>Leadership & Master Strategists</span>
        </div>

        <h2 className="team-intro-el text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] max-w-3xl">
          The Minds Orchestrating <span className="text-gradient">The Movement.</span>
        </h2>

        <p className="team-intro-el mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          A collective of veteran architects, technical directors, and sensory strategists uniting
          decades of live stage craft.
        </p>
      </div>

      {/* =========================================================================
          MINIMALIST EDITORIAL TYPOGRAPHY LIST TABLE
          ========================================================================= */}
      <div className="team-list-container relative max-w-7xl mx-auto border-t border-slate-200/90">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            onPointerEnter={() => setHoveredMember(member)}
            onPointerLeave={() => setHoveredMember(null)}
            className="team-row-item group relative py-8 sm:py-10 border-b border-slate-200/80 hover:border-[#00A7F5]/50 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/70 rounded-2xl px-4 sm:px-6"
          >
            {/* Ambient hover glint */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#00A7F5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Left: Number + Name & Role */}
            <div className="relative z-10 flex items-start sm:items-center gap-6 sm:gap-10">
              <span className="font-mono text-xs sm:text-sm font-black text-slate-400 group-hover:text-[#003E95] transition-colors mt-1 sm:mt-0">
                {member.number}
              </span>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight group-hover:text-[#003E95] transition-colors">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm sm:text-base font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {member.role}
                </p>
              </div>
            </div>

            {/* Middle: Discipline Tags (Desktop) */}
            <div className="relative z-10 hidden xl:flex items-center gap-2">
              {member.disciplines.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-xs font-medium text-slate-700 group-hover:bg-white group-hover:border-[#00A7F5]/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Right: Location & Trigger Action */}
            <div className="relative z-10 flex items-center justify-between md:justify-end gap-6 text-left md:text-right">
              <div className="text-xs sm:text-sm">
                <span className="font-mono font-bold text-[#003E95] block">{member.location}</span>
                <span className="text-slate-500 font-medium text-xs">{member.tenure}</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#003E95] text-slate-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-110">
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          SLIDE-OVER DRAWER MODAL (EXPANDABLE BIO & ACHIEVEMENTS)
          ========================================================================= */}
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={() => setSelectedMember(null)}
        style={{ visibility: "hidden", opacity: 0 }}
        className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Slide-over Drawer */}
      <div
        ref={drawerRef}
        style={{ visibility: "hidden", transform: "translateX(100%)" }}
        className="fixed top-0 right-0 bottom-0 z-[65] w-full max-w-2xl bg-white shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-slate-200 will-change-transform"
      >
        {selectedMember && (
          <div className="p-6 sm:p-10 flex flex-col justify-between min-h-full">
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 mb-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#003E95]/10 text-[#003E95] text-xs font-bold font-mono">
                    LEADERSHIP PROFILE // {selectedMember.number}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {selectedMember.department}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  aria-label="Close bio drawer"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Leader Header with Photo Vignette */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden glass-card-elevated p-1.5 border border-slate-200 shadow-diffused-md shrink-0">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {selectedMember.name}
                  </h3>
                  <p className="text-base font-bold text-[#00A7F5] mt-1">{selectedMember.role}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-2">
                    <span className="flex items-center gap-1 font-mono text-slate-700">
                      <Globe2 className="w-3.5 h-3.5 text-[#003E95]" />
                      {selectedMember.location}
                    </span>
                    <span>•</span>
                    <span>{selectedMember.tenure}</span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border-l-4 border-[#00A7F5] text-sm sm:text-base font-semibold text-[#003E95] italic leading-relaxed mb-8">
                {selectedMember.quote}
              </blockquote>

              {/* Extended Biography */}
              <div className="mb-8">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Executive Background
                </h4>
                <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {selectedMember.bio.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Key Event Achievements */}
              <div className="mb-8">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Key Career Milestones & Summit Deliverables
                </h4>
                <div className="space-y-2.5">
                  {selectedMember.achievements.map((ach) => (
                    <div
                      key={ach}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00A7F5] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 mb-8 p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-center">
                {selectedMember.stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-xl sm:text-2xl font-black text-[#003E95]">{s.value}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Core Disciplines */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Core Disciplines & Tooling
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.disciplines.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Socials */}
            <div className="pt-8 mt-8 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Connect with Leadership</span>
              <div className="flex items-center gap-2">
                {selectedMember.socials.linkedin && (
                  <a
                    href={selectedMember.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#003E95] hover:text-white flex items-center justify-center text-slate-700 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                )}
                {selectedMember.socials.twitter && (
                  <a
                    href={selectedMember.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X / Twitter profile"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#00A7F5] hover:text-white flex items-center justify-center text-slate-700 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {selectedMember.socials.email && (
                  <a
                    href={`mailto:${selectedMember.socials.email}`}
                    aria-label="Send email"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
