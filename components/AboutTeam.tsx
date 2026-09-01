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
    id: "managing-director",
    number: "01",
    name: "Tariq Al-Mansoor",
    role: "Managing Director & Founder",
    department: "Executive Leadership & Global Operations",
    location: "Dubai HQ, UAE",
    tenure: "Founder • 12Y",
    image: "/images/team/elena-vance.jpg",
    quote: "“Our vision has always been uncompromising: deliver bespoke exhibition architecture and turnkey event management that connects businesses across the globe.”",
    bio: [
      "Tariq established Impact Makers Events in Dubai with the vision of providing global enterprises with an authentic single-source fabrication and event management partner.",
      "Under his stewardship, the company expanded from a specialized Dubai joinery workshop into a global enterprise operating across 9 international hubs with Triple ISO certifications.",
      "He maintains active commercial oversight of flagship exhibitions, high-level diplomatic congresses, and strategic enterprise expansions across the GCC, Europe, USA, and Africa.",
    ],
    achievements: [
      "Steered the successful execution of 500+ exhibition stands and global corporate summits",
      "Achieved Triple ISO Certification (9001, 14001, 45001) under Universal Registrars",
      "Expanded international operations into Europe, the Americas, Asia, and Africa",
    ],
    disciplines: ["Executive Leadership", "Cross-Border Logistics", "Global Expansion", "Sponsorship Strategy"],
    stats: [
      { label: "Stands Delivered", value: "500+" },
      { label: "Global Hubs", value: "9" },
      { label: "Client CSAT", value: "99.8%" },
    ],
    socials: {
      linkedin: "https://www.linkedin.com/company/impact-makers-events",
      email: "sales@impactmakersevents.com",
    },
  },
  {
    id: "head-of-fabrication",
    number: "02",
    name: "Viktor Kowalski",
    role: "Director of In-House Fabrication & Joinery",
    department: "Workshop Operations & Structural Engineering",
    location: "Dubai Workshop, UAE",
    tenure: "Principal • 9Y",
    image: "/images/team/marcus-chen.jpg",
    quote: "“Millimeter accuracy is our baseline. In our in-house workshop, every timber curve, acrylic facet, and steel joint is tested for perfection before it reaches the exhibition hall.”",
    bio: [
      "Viktor oversees Impact Makers Events' in-house fabrication facility in Dubai, managing a dedicated team of master joiners, CNC programmers, structural metalworkers, and painters.",
      "He specializes in complex double-decker exhibition stands, cantilevered viewing decks, and rapid-assembly modular systems compliant with DWTC and DEC authority regulations.",
      "Viktor ensures strict compliance with ISO 9001 quality audits and ISO 45001 occupational safety guidelines on all workshop floor builds.",
    ],
    achievements: [
      "Fabricated over 350 bespoke exhibition stands with a 100% on-time venue handover record",
      "Engineered proprietary rapid-lock structural steel framing for double-decker pavilions",
      "Integrated 5-axis automated CNC cutting reducing fabrication lead times by 35%",
    ],
    disciplines: ["CNC 5-Axis Milling", "Structural Steel Engineering", "Double-Decker Pavilions", "Polyurethane Spray Finishing"],
    stats: [
      { label: "Tolerance Standard", value: "±0.5mm" },
      { label: "On-Time Handover", value: "100%" },
      { label: "Workshop Team", value: "65+" },
    ],
    socials: {
      linkedin: "https://www.linkedin.com/company/impact-makers-events",
      email: "sales@impactmakersevents.com",
    },
  },
  {
    id: "head-of-events",
    number: "03",
    name: "Amira Benali",
    role: "Head of Event Management & Protocol",
    department: "Congresses & Corporate Event Operations",
    location: "Dubai / Geneva",
    tenure: "Principal • 8Y",
    image: "/images/team/aurelia-dubois.jpg",
    quote: "“Flawless event management is the art of invisible orchestration. From VIP protocol to plenary stage calling, every second is choreographed.”",
    bio: [
      "Amira directs the event organizing division at Impact Makers Events, leading large-scale B2B conferences, government summits, and gala awards across Dubai and international venues.",
      "Her expertise spans diplomatic protocol, multi-hall venue operations at DEC/DWTC, delegate registration workflows, and executive speaker management.",
      "She has managed flagship projects for ministerial summits, Universal Postal Union congresses, and Fortune 500 corporate product reveals.",
    ],
    achievements: [
      "Directed operations for international government summits hosting delegates from 190+ nations",
      "Pioneered contactless VIP badge access and high-security delegate routing matrices",
      "Delivered a verified 99.8% executive satisfaction rating across all managed congresses",
    ],
    disciplines: ["Congress Organizing", "Diplomatic Protocol", "Venue Operations", "Executive Run of Show"],
    stats: [
      { label: "Congresses Managed", value: "120+" },
      { label: "Delegates Hosted", value: "250K+" },
      { label: "Protocol Rating", value: "99.8%" },
    ],
    socials: {
      linkedin: "https://www.linkedin.com/company/impact-makers-events",
      email: "sales@impactmakersevents.com",
    },
  },
  {
    id: "head-of-av",
    number: "04",
    name: "Jean-Paul Laurent",
    role: "Technical AV & Broadcast Systems Director",
    department: "Audiovisual, Sound & Dynamic Lighting",
    location: "Dubai / Lisbon",
    tenure: "Principal • 7Y",
    image: "/images/team/siddharth-patel.jpg",
    quote: "“Concert-grade sound, high-density LED curved ribbons, and broadcast-quality livestreaming turn an exhibition stand into an immersive brand universe.”",
    bio: [
      "Jean-Paul manages Impact Makers Events' extensive audiovisual rental inventory, including ultra-fine pitch LED video walls, line array acoustics, stage trussing, and multi-camera 4K livestream flypacks.",
      "He leads technical production for stadium-scale keynotes, corporate broadcast studios, and dynamic stage lighting choreographies across Europe and the GCC.",
      "His engineering team guarantees hot-swappable dual-redundant AV systems with zero audio dropouts and broadcast-grade color calibration.",
    ],
    achievements: [
      "Engineered broadcast studios for Bloomberg, CNBC, and international aerospace summits",
      "Designed curved Brompton-controlled 4K LED ribbon walls with zero-latency feeds",
      "Delivered multi-channel simultaneous translation systems in 8 live languages",
    ],
    disciplines: ["Curved LED Video Walls", "Concert Line Arrays", "4K Multi-Camera Flypacks", "Stage Trussing & Lighting"],
    stats: [
      { label: "LED Deployed", value: "15,000 m²" },
      { label: "Audio Output", value: "100% Clean" },
      { label: "Broadcast SLA", value: "99.99%" },
    ],
    socials: {
      linkedin: "https://www.linkedin.com/company/impact-makers-events",
      email: "sales@impactmakersevents.com",
    },
  },
  {
    id: "commercial-director",
    number: "05",
    name: "Marcus Sterling",
    role: "Commercial Director & Space Sales Lead",
    department: "Exhibition Space Selling & Sponsorships",
    location: "Dubai / Singapore",
    tenure: "Partner • 10Y",
    image: "/images/team/david-thorne.jpg",
    quote: "“We maximize floor plan monetization for exhibition organizers and connect exhibitors with high-yield B2B buyers worldwide.”",
    bio: [
      "Marcus leads commercial exhibition space monetization, exhibitor recruitment, and sponsorship packaging for trade show organizers and corporate pavilion holders.",
      "With deep networks across multinational corporations, trade promotion councils, and industry associations, Marcus drives high-occupancy floor plan sales across major international exhibitions.",
      "He also oversees Impact Makers Events' designer furniture rental division and luxury corporate gift branding partnerships.",
    ],
    achievements: [
      "Monetized over 150,000 m² of prime exhibition floor space for international trade shows",
      "Curated designer furniture rental inventory featuring Knoll, Corbusier, and Tolix collections",
      "Generated over $350M in trade show exhibitor and sponsorship commercial value",
    ],
    disciplines: ["Exhibition Space Selling", "Sponsorship Packaging", "Corporate Gift Solutions", "Designer Furniture Rental"],
    stats: [
      { label: "Floor Space Sold", value: "150K m²" },
      { label: "Exhibitor Value", value: "$350M+" },
      { label: "Global Partners", value: "200+" },
    ],
    socials: {
      linkedin: "https://www.linkedin.com/company/impact-makers-events",
      email: "sales@impactmakersevents.com",
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
