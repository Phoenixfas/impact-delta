"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  Cpu,
  Radio,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  Globe2,
  Sliders,
  Maximize2,
  type LucideIcon,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface ProcessPhase {
  id: string;
  stepNumber: string;
  category: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  image: string;
  alt: string;
  deliverables: { title: string; desc: string; badge: string }[];
  metrics: { label: string; value: string }[];
  techPills: string[];
  visualSchematic: {
    accentColor: string;
    stageLabel: string;
    diagramType: "blueprint" | "network" | "stagecraft" | "analytics";
  };
}

const PHASES_DATA: ProcessPhase[] = [
  {
    id: "phase-discovery",
    stepNumber: "01",
    category: "PHASE 01 // 3D CONCEPT & BLUEPRINT",
    title: "3D Spatial Design & Permitting",
    subtitle: "3D Max/V-Ray Previz, Structural Engineering & Venue Clearances",
    tagline: "Translating brand objectives into an engineered spatial blueprint.",
    description:
      "We begin with photorealistic 360° 3D renders and virtual walkthroughs. Our structural engineering team calculates double-decker cantilever loads and secures certified municipal and venue approvals (DWTC, DEC, ADNEC).",
    icon: Compass,
    image: "/images/prev/atss-1-landscape.webp",
    alt: "3D exhibition stand design and structural engineering blueprint",
    deliverables: [
      {
        title: "Photorealistic 360° 3D Max / V-Ray Previz",
        desc: "Interactive spatial walkthroughs verifying sightlines, branding angles, and lighting.",
        badge: "3D Architecture",
      },
      {
        title: "PE-Stamped Structural Calculations",
        desc: "Certified load tests for double-decker mezzanines and suspended canopy trusses.",
        badge: "Engineering",
      },
      {
        title: "Official Venue & Authority Approvals",
        desc: "Direct submission to DWTC, DEC, ADNEC, and UAE Civil Defense for all mandatory safety permits.",
        badge: "Compliance",
      },
    ],
    metrics: [
      { label: "Concept Turnaround", value: "48 Hours" },
      { label: "CAD Precision", value: "±0.5 mm" },
      { label: "Approval Rate", value: "100%" },
    ],
    techPills: ["3D Max & V-Ray", "AutoCAD Blueprints", "Venue Permitting", "Structural PE Stamps"],
    visualSchematic: {
      accentColor: "#00A7F5",
      stageLabel: "3D ARCHITECTURAL BLUEPRINT",
      diagramType: "blueprint",
    },
  },
  {
    id: "phase-fabrication",
    stepNumber: "02",
    category: "PHASE 02 // IN-HOUSE WORKSHOP BUILD",
    title: "In-House Workshop Fabrication",
    subtitle: "5-Axis CNC Milling, Timber Joinery & Polyurethane Spray Finishing",
    tagline: "Direct build control in our dedicated Dubai manufacturing facility.",
    description:
      "Every structural frame, custom curved timber wall, and acrylic showcase is built inside our Dubai workshop. We eliminate subcontractor delays and verify fitment before shipping to the exhibition hall.",
    icon: Cpu,
    image: "/images/prev/booth_1.webp",
    alt: "In-house CNC joinery and custom booth fabrication",
    deliverables: [
      {
        title: "Automated 5-Axis CNC Precision Joinery",
        desc: "Sub-millimeter timber cutting and bespoke cabinetry for reception counters and meeting suites.",
        badge: "In-House Build",
      },
      {
        title: "Structural Steel Frame Fabrication",
        desc: "Heavy-duty modular steel sections engineered for rapid multi-tier assembly.",
        badge: "Structural Steel",
      },
      {
        title: "Pressurized Spray Booth Finishing",
        desc: "Flawless multi-coat polyurethane high-gloss and matte paint applications.",
        badge: "Luxury Paint",
      },
    ],
    metrics: [
      { label: "CNC Tolerance", value: "±0.5 mm" },
      { label: "Pre-Build Check", value: "100% Verified" },
      { label: "Lead Time Saving", value: "35%" },
    ],
    techPills: ["5-Axis CNC", "Downdraft Spray Booth", "MIG/TIG Welding", "ISO 9001:2015"],
    visualSchematic: {
      accentColor: "#003E95",
      stageLabel: "IN-HOUSE WORKSHOP FABRICATION",
      diagramType: "network",
    },
  },
  {
    id: "phase-assembly",
    stepNumber: "03",
    category: "PHASE 03 // ON-SITE BUILD & AV RIGGING",
    title: "Turnkey On-Site Assembly & AV Setup",
    subtitle: "48-Hour Rapid Load-In, Curved LED Calibration & Furniture Placement",
    tagline: "Surgical on-site execution with zero snag items at handover.",
    description:
      "Our installation crews execute rapid, coordinated load-ins at DEC, DWTC, or international venues. Master joiners assemble structures while our AV engineers rig curved LED video ribbons and concert line arrays.",
    icon: Radio,
    image: "/images/prev/14.webp",
    alt: "On-site exhibition stand assembly and audiovisual installation",
    deliverables: [
      {
        title: "Rapid 48-Hour On-Site Load-In",
        desc: "Modular lockstep assembly ensuring completion at least 12 hours prior to exhibition opening.",
        badge: "Rapid Assembly",
      },
      {
        title: "Curved 4K LED & Audio Calibration",
        desc: "Fine-pitch LED video wall calibration with color-matched processors and crisp sound tuning.",
        badge: "Broadcast AV",
      },
      {
        title: "Designer Furniture Styling & VIP Handover",
        desc: "Placement of pristine designer sofas, high barstools, corporate gifts, and final white-glove clean.",
        badge: "Turnkey Handover",
      },
    ],
    metrics: [
      { label: "On-Time Handover", value: "100%" },
      { label: "Early Delivery", value: "12+ Hours" },
      { label: "Snag Free Rate", value: "99.8%" },
    ],
    techPills: ["Rapid Load-In", "Brompton SX40", "Designer Seating", "White-Glove Handover"],
    visualSchematic: {
      accentColor: "#3B82F6",
      stageLabel: "TURNKEY ON-SITE HANDOVER",
      diagramType: "stagecraft",
    },
  },
  {
    id: "phase-live-strike",
    stepNumber: "04",
    category: "PHASE 04 // LIVE STANDBY & GREEN STRIKE",
    title: "Live Show Standby & Eco-Dismantle",
    subtitle: "24/7 On-Site Maintenance, 4K PR Media & ISO 14001 Green Strike",
    tagline: "Continuous support during the expo followed by sustainable dismantling.",
    description:
      "During exhibition days, our technical team remains on-site for immediate maintenance, AV support, and 4K media capture. Post-event, we execute a rapid ISO 14001 green dismantle, diverting reusable materials from landfills.",
    icon: BarChart3,
    image: "/images/prev/booth_2.webp",
    alt: "Post-event media delivery and sustainable green dismantling",
    deliverables: [
      {
        title: "24/7 Dedicated On-Site Technical Standby",
        desc: "Immediate support for lighting adjustments, media playback, and daily booth maintenance.",
        badge: "24/7 Support",
      },
      {
        title: "Same-Day 4K PR Video & Photo Package",
        desc: "Curated highlight reels and architectural booth photography ready for immediate press distribution.",
        badge: "4K Media Pack",
      },
      {
        title: "ISO 14001 Certified Green Dismantle",
        desc: "Safe structural teardown with recycling certificates and warehouse storage for re-use.",
        badge: "Eco Strike",
      },
    ],
    metrics: [
      { label: "PR Delivery", value: "< 4 Hours" },
      { label: "CSAT Score", value: "99.8%" },
      { label: "Material Recycling", value: "85%+" },
    ],
    techPills: ["24/7 Tech Standby", "4K Video Editing", "ISO 14001 Strike", "Storage Asset Vault"],
    visualSchematic: {
      accentColor: "#059669",
      stageLabel: "LIVE SUPPORT & GREEN STRIKE",
      diagramType: "analytics",
    },
  },
];

export default function ServicesProcess() {
  const { scrollTo } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const connectorPathRef = useRef<SVGPathElement | null>(null);
  const laserBeadRef = useRef<SVGCircleElement | null>(null);
  const phaseCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const filterId = useId();

  // ScrollTrigger for vertical progress line, pinning & active phase card synchronization
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !containerRef.current || !leftColRef.current) return;

      // 1. GSAP Pinning for Left Sticky Visual Stage on Desktop
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top+=110",
          end: "bottom bottom",
          pin: leftColRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });

      // 2. Dynamic SVG progress connector scrubbing
      const pathEl = connectorPathRef.current;
      const beadEl = laserBeadRef.current;

      if (pathEl) {
        const pathLength = pathEl.getTotalLength ? pathEl.getTotalLength() : 1600;
        gsap.set(pathEl, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        ScrollTrigger.create({
          trigger: ".process-phases-track",
          start: "top 60%",
          end: "bottom 70%",
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            const drawLength = pathLength * (1 - progress);
            gsap.to(pathEl, {
              strokeDashoffset: drawLength,
              duration: 0.1,
              ease: "none",
              overwrite: "auto",
            });

            if (beadEl && pathEl.getPointAtLength) {
              try {
                const point = pathEl.getPointAtLength(pathLength * progress);
                gsap.to(beadEl, {
                  attr: { cx: point.x, cy: point.y },
                  opacity: progress > 0.02 && progress < 0.98 ? 1 : 0.3,
                  duration: 0.1,
                  ease: "none",
                  overwrite: "auto",
                });
              } catch {
                // Safeguard
              }
            }
          },
        });
      }

      // 3. Individual Card Triggers to switch active phase on scroll
      phaseCardRefs.current.forEach((card, index) => {
        if (!card) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActivePhaseIndex(index),
          onEnterBack: () => setActivePhaseIndex(index),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentPhase = PHASES_DATA[activePhaseIndex];

  return (
    <section
      id="services-process"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-36 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-50/20 to-slate-50 text-slate-900 overflow-visible"
    >
      {/* Background Ambience & Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 rounded-full bg-[#003E95]/10 border border-[#003E95]/20 text-[#003E95] text-xs font-bold tracking-wider uppercase">
            <Activity className="w-3.5 h-3.5 text-[#00A7F5]" />
            <span>EXECUTION LIFECYCLE METHODOLOGY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.06] mb-6">
            From Spatial Blueprint to <span className="text-gradient">Flawless Strike.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Our 4-phase production lifecycle bridges computational previsualization, optical redundancy engineering, and high-precision show execution.
          </p>
        </div>

        {/* Dual-Column Pinned Layout */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start overflow-visible relative"
        >
          {/* =========================================================================
              LEFT COLUMN: PINNED 3D GRAPHIC & MORPHING SCHEMATIC VISUAL STAGE
              ========================================================================= */}
          <div
            ref={leftColRef}
            className="lg:col-span-5 will-change-transform z-20 w-full overflow-visible"
          >
            <div className="w-full h-[480px] sm:h-[540px] lg:h-[580px] rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Dynamic Glow Spotlight */}
              <div
                className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors duration-700"
                style={{ backgroundColor: currentPhase.visualSchematic.accentColor }}
              />
              <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />

              {/* Top Stage Telemetry Bar */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A7F5] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A7F5]"></span>
                  </span>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-slate-300 uppercase">
                    {currentPhase.visualSchematic.stageLabel}
                  </span>
                </div>

                <div className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-[#00A7F5]">
                  PHASE 0{activePhaseIndex + 1} / 04
                </div>
              </div>

              {/* Central Morphing SVG Schematics Engine */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center min-h-[220px]">
                {/* 1. Blueprint Wireframe Mode */}
                {activePhaseIndex === 0 && (
                  <div className="relative w-full h-48 flex items-center justify-center transition-all duration-500 animate-[fadeIn_0.4s_ease-out]">
                    <svg className="w-56 h-56" viewBox="0 0 200 200">
                      {/* Radar & Coordinate Rings */}
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#00A7F5" strokeWidth="1" strokeDasharray="4 4" className="animate-spin [animation-duration:24s]" />
                      <circle cx="100" cy="100" r="65" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                      <circle cx="100" cy="100" r="35" fill="none" stroke="#003E95" strokeWidth="1.5" />

                      {/* Coordinate Axes */}
                      <line x1="10" y1="100" x2="190" y2="100" stroke="#00A7F5" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.6" />
                      <line x1="100" y1="10" x2="100" y2="190" stroke="#00A7F5" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.6" />

                      {/* 3D Wireframe Cube / Spatial Arena */}
                      <polygon points="100,45 150,75 150,135 100,165 50,135 50,75" fill="rgba(0,167,245,0.06)" stroke="#00A7F5" strokeWidth="1.5" />
                      <line x1="100" y1="45" x2="100" y2="105" stroke="#38bdf8" strokeWidth="1.2" />
                      <line x1="150" y1="75" x2="100" y2="105" stroke="#38bdf8" strokeWidth="1.2" />
                      <line x1="50" y1="75" x2="100" y2="105" stroke="#38bdf8" strokeWidth="1.2" />
                      <line x1="100" y1="105" x2="100" y2="165" stroke="#38bdf8" strokeWidth="1.2" />

                      {/* Hot Nodes */}
                      <circle cx="100" cy="45" r="3.5" fill="#38bdf8" />
                      <circle cx="150" cy="75" r="3.5" fill="#38bdf8" />
                      <circle cx="150" cy="135" r="3.5" fill="#38bdf8" />
                      <circle cx="100" cy="165" r="3.5" fill="#38bdf8" />
                      <circle cx="50" cy="135" r="3.5" fill="#38bdf8" />
                      <circle cx="50" cy="75" r="3.5" fill="#38bdf8" />
                      <circle cx="100" cy="105" r="4" fill="#00A7F5" className="animate-ping" />
                    </svg>
                  </div>
                )}

                {/* 2. Network Redundancy Matrix Mode */}
                {activePhaseIndex === 1 && (
                  <div className="relative w-full h-48 flex items-center justify-center transition-all duration-500 animate-[fadeIn_0.4s_ease-out]">
                    <svg className="w-56 h-56" viewBox="0 0 200 200">
                      {/* Fiber Ring Orbit */}
                      <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="#003E95" strokeWidth="2" strokeDasharray="6 4" className="animate-spin [animation-duration:16s]" />
                      <ellipse cx="100" cy="100" rx="40" ry="80" fill="none" stroke="#00A7F5" strokeWidth="1.5" strokeOpacity="0.5" />

                      {/* Server Node Blocks */}
                      <rect x="35" y="85" width="30" height="30" rx="6" fill="#003E95" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="50" y="103" fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PRI</text>

                      <rect x="135" y="85" width="30" height="30" rx="6" fill="#0f172a" stroke="#00A7F5" strokeWidth="1.5" />
                      <text x="150" y="103" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SEC</text>

                      <circle cx="100" cy="100" r="18" fill="#00A7F5" fillOpacity="0.2" stroke="#00A7F5" strokeWidth="2" />
                      <path d="M92 100 L108 100 M100 92 L100 108" stroke="#fff" strokeWidth="2" />

                      {/* Signal Wave pulses */}
                      <path d="M 65,100 Q 100,60 135,100" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                      <path d="M 65,100 Q 100,140 135,100" fill="none" stroke="#003E95" strokeWidth="1.5" strokeDasharray="4 2" />
                    </svg>
                  </div>
                )}

                {/* 3. Stagecraft Live Telemetry Mode */}
                {activePhaseIndex === 2 && (
                  <div className="relative w-full h-48 flex items-center justify-center transition-all duration-500 animate-[fadeIn_0.4s_ease-out]">
                    <svg className="w-56 h-56" viewBox="0 0 200 200">
                      {/* Laser Fan Beams */}
                      <polygon points="100,160 30,30 50,20" fill="rgba(59,130,246,0.18)" />
                      <polygon points="100,160 80,15 120,15" fill="rgba(0,167,245,0.22)" />
                      <polygon points="100,160 150,20 170,30" fill="rgba(59,130,246,0.18)" />

                      {/* Stage Arc Floor */}
                      <path d="M 20,160 Q 100,130 180,160" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                      <path d="M 40,170 Q 100,145 160,170" fill="none" stroke="#003E95" strokeWidth="1.5" strokeDasharray="4 4" />

                      {/* Central EOC Command Pulse */}
                      <circle cx="100" cy="155" r="8" fill="#3b82f6" className="animate-pulse" />
                      <circle cx="100" cy="155" r="16" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />

                      {/* Audio VU Levels */}
                      <line x1="50" y1="80" x2="50" y2="120" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                      <line x1="60" y1="65" x2="60" y2="120" stroke="#00A7F5" strokeWidth="3" strokeLinecap="round" />
                      <line x1="140" y1="65" x2="140" y2="120" stroke="#00A7F5" strokeWidth="3" strokeLinecap="round" />
                      <line x1="150" y1="80" x2="150" y2="120" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                )}

                {/* 4. Analytics & Asset Vault Mode */}
                {activePhaseIndex === 3 && (
                  <div className="relative w-full h-48 flex items-center justify-center transition-all duration-500 animate-[fadeIn_0.4s_ease-out]">
                    <svg className="w-56 h-56" viewBox="0 0 200 200">
                      {/* Hexagonal Asset Vault Ring */}
                      <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="rgba(5,150,105,0.08)" stroke="#10b981" strokeWidth="1.5" />

                      {/* Metric Graphs */}
                      <path d="M 45,130 L 70,110 L 100,120 L 130,80 L 155,60" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Area Fill */}
                      <polygon points="45,130 70,110 100,120 130,80 155,60 155,140 45,140" fill="rgba(16,185,129,0.15)" />

                      {/* Data Point Nodes */}
                      <circle cx="70" cy="110" r="3.5" fill="#34d399" />
                      <circle cx="100" cy="120" r="3.5" fill="#34d399" />
                      <circle cx="130" cy="80" r="3.5" fill="#34d399" />
                      <circle cx="155" cy="60" r="4.5" fill="#10b981" className="animate-ping" />

                      <text x="100" y="165" fill="#6ee7b7" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        CSAT: 99.8% // 4K PR READY
                      </text>
                    </svg>
                  </div>
                )}

                <div className="text-center mt-2">
                  <div className="text-xs font-mono text-[#00A7F5] font-bold tracking-wider uppercase">
                    ACTIVE TELEMETRY STREAM
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {currentPhase.title}
                  </div>
                </div>
              </div>

              {/* Bottom Quick-Jump Phase Switcher Navigation */}
              <div className="relative z-10 pt-4 border-t border-white/10 grid grid-cols-4 gap-2">
                {PHASES_DATA.map((phase, idx) => {
                  const isActive = activePhaseIndex === idx;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => {
                        const targetCard = phaseCardRefs.current[idx];
                        if (targetCard) {
                          scrollTo(targetCard, { offset: -100 });
                        }
                      }}
                      className={`p-2 rounded-xl text-center transition-all cursor-pointer select-none ${isActive
                          ? "bg-white text-slate-950 font-bold shadow-diffused-sm scale-105"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <div className="text-[10px] font-mono font-bold">0{idx + 1}</div>
                      <div className="text-[9px] font-semibold truncate hidden sm:block">
                        {phase.title.split(" ")[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: SCROLLING NARRATIVE TEXT CARDS & VERTICAL SVG CONNECTOR
              ========================================================================= */}
          <div className="lg:col-span-7 relative process-phases-track pl-4 sm:pl-8 lg:pl-10">
            {/* Dynamic Animated Vertical SVG Progress Connector Line */}
            <div className="absolute top-0 bottom-0 left-0 sm:left-2 w-8 pointer-events-none flex justify-center">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00A7F5" />
                    <stop offset="50%" stopColor="#003E95" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Track Background Gray Line */}
                <line
                  x1="16"
                  y1="20"
                  x2="16"
                  y2="98%"
                  stroke="#e2e8f0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Dynamic Scrubbing Gradient Line */}
                <path
                  ref={connectorPathRef}
                  d="M 16,20 L 16,3000"
                  fill="none"
                  stroke={`url(#grad-${filterId})`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter={`url(#glow-${filterId})`}
                />

                {/* Moving Laser Bead */}
                <circle
                  ref={laserBeadRef}
                  cx="16"
                  cy="20"
                  r="5"
                  fill="#00A7F5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter={`url(#glow-${filterId})`}
                  className="opacity-0"
                />
              </svg>
            </div>

            {/* Narrative Phase Cards */}
            <div className="space-y-16 sm:space-y-24">
              {PHASES_DATA.map((phase, index) => {
                const IconComp = phase.icon;
                const isCurrent = activePhaseIndex === index;
                return (
                  <div
                    key={phase.id}
                    ref={(el) => {
                      phaseCardRefs.current[index] = el;
                    }}
                    className={`relative rounded-3xl p-6 sm:p-10 transition-all duration-500 border ${isCurrent
                        ? "bg-white border-slate-300 shadow-diffused-xl scale-[1.01]"
                        : "bg-white/60 border-slate-200/60 shadow-diffused-sm opacity-75 hover:opacity-100"
                      }`}
                  >
                    {/* Header: Phase Number & Badge */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-xs font-extrabold tracking-wider uppercase text-[#003E95] bg-[#003E95]/10 px-3 py-1 rounded-full">
                        {phase.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <IconComp className="w-5 h-5 text-[#00A7F5]" />
                        <span className="font-mono text-xs font-bold text-slate-400">
                          STAGE 0{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#003E95] mb-4">
                      {phase.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                      {phase.description}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      {phase.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {m.label}
                          </div>
                          <div className="text-sm sm:text-lg font-black text-slate-900 mt-0.5">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables Checklist */}
                    <div className="space-y-3 pt-2 border-t border-slate-100 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        PHASE DELIVERABLES & ARTIFACTS:
                      </span>
                      {phase.deliverables.map((deliv, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#00A7F5]/40 transition-colors shadow-diffused-sm"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              {deliv.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {deliv.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 pl-5">{deliv.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {phase.techPills.map((pill, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60 text-slate-600 text-xs font-mono font-medium"
                        >
                          #{pill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
