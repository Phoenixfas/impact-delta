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
    category: "PHASE 01 // DISCOVERY & STRATEGY",
    title: "Discovery & Spatial Blueprint",
    subtitle: "LiDAR Venue Scanning, 3D Unreal Previz & ROS Architecture",
    tagline: "Translating executive summit goals into an immutable spatial and acoustic blueprint.",
    description:
      "We begin by digitizing your physical venue with millimeter-accurate LiDAR laser scans. Our team builds 1:1 photorealistic digital twins in Unreal Engine 5, testing sightlines, acoustic dispersion, and minute-by-minute cue choreography months before load-in.",
    icon: Compass,
    image: "/images/summit-keynote.jpg",
    alt: "3D architectural stage previz and LiDAR blueprint",
    deliverables: [
      {
        title: "1:1 Photorealistic Unreal Engine 5 Previz",
        desc: "Interactive spatial walkthroughs verifying executive sightlines and lighting angles.",
        badge: "3D Virtual Twin",
      },
      {
        title: "Master Run of Show (ROS) Cue Architecture",
        desc: "Microsecond-synchronized timeline mapping speaker entrances, video stingers, and audio cues.",
        badge: "Choreography",
      },
      {
        title: "Structural Rigging & Acoustic Raytracing",
        desc: "PE-stamped structural load calculations and 3D finite-element sound pressure simulations.",
        badge: "Engineering",
      },
    ],
    metrics: [
      { label: "Concept Turnaround", value: "48 Hours" },
      { label: "CAD Precision", value: "±2.0 mm" },
      { label: "Sightline Clarity", value: "100%" },
    ],
    techPills: ["LiDAR Scanning", "Unreal Engine 5.4", "Acoustic Raytracing", "Master ROS"],
    visualSchematic: {
      accentColor: "#00A7F5",
      stageLabel: "HOLOGRAPHIC SPATIAL BLUEPRINT",
      diagramType: "blueprint",
    },
  },
  {
    id: "phase-architecture",
    stepNumber: "02",
    category: "PHASE 02 // TECHNICAL ENGINEERING",
    title: "Technical Architecture & Redundancy",
    subtitle: "Dual-Redundant Optical Backbones, SMPTE Sync & Show Networks",
    tagline: "Zero-fail network topology with sub-millisecond failover guarantees.",
    description:
      "Every audio stream, 16K video canvas, and kinetic motor cue is isolated on dedicated tactical optical fiber rings. We architect active-active hot standby media servers and redundant electrical distribution, eliminating any single point of failure.",
    icon: Cpu,
    image: "/images/kinetic-installation.jpg",
    alt: "Dual redundant show control and network rack engineering",
    deliverables: [
      {
        title: "Dual-Redundant Optical Media Servers",
        desc: "disguise gx3 cluster configured with instantaneous sub-frame optical failover switches.",
        badge: "Redundancy",
      },
      {
        title: "Master SMPTE Timecode Distribution",
        desc: "Brainstorm SR-112 master clocks distributing locked timecode to lighting, audio, and lasers.",
        badge: "Sync Lock",
      },
      {
        title: "Dual-Fed Clean Power Grid Distribution",
        desc: "Isolated twin-pack generator synchronization preventing voltage fluctuations and brownouts.",
        badge: "Power SLA",
      },
    ],
    metrics: [
      { label: "Failover Latency", value: "0.0 ms" },
      { label: "DMX Universes", value: "128 Active" },
      { label: "Bandwidth Backbone", value: "100 Gbps" },
    ],
    techPills: ["disguise gx3", "SMPTE Timecode", "Tactical Fiber Rings", "Dante / AES67"],
    visualSchematic: {
      accentColor: "#003E95",
      stageLabel: "OPTICAL REDUNDANCY MATRIX",
      diagramType: "network",
    },
  },
  {
    id: "phase-production",
    stepNumber: "03",
    category: "PHASE 03 // LIVE OPERATIONS",
    title: "On-Site Production & Live Command",
    subtitle: "Flawless Show Calling, Kinetic Automation & Incident Command",
    tagline: "Where rigorous engineering discipline meets high-stakes live execution.",
    description:
      "Our veteran technical directors, master riggers, and show callers run the summit from a unified Event Operations Center (EOC). With 300+ channel Riedel Bolero wireless comms and real-time sensor telemetry, every transition is executed flawlessly.",
    icon: Radio,
    image: "/images/prev/booth_1.webp",
    alt: "Live show calling and unified command center console",
    deliverables: [
      {
        title: "Unified Event Operations Command Hub (EOC)",
        desc: "Live telemetry monitoring audio SPL, power draw, load-cell strain, and weather variables.",
        badge: "Live Telemetry",
      },
      {
        title: "Synchronized Kinetic Motion & Laser Calling",
        desc: "Kinesys variable-speed hoists moving LED kinetic trusses in sync with executive reveals.",
        badge: "Automation",
      },
      {
        title: "300+ Channel Matrix Wireless Intercom",
        desc: "Riedel Bolero digital comms connecting executive staff, cameras, and technical leads.",
        badge: "Comms Grid",
      },
    ],
    metrics: [
      { label: "Cue Accuracy", value: "100%" },
      { label: "Incident Dispatch", value: "< 30s" },
      { label: "Max Arena Scale", value: "50,000+" },
    ],
    techPills: ["Riedel Bolero", "Kinesys Rigging", "grandMA3 Full", "EOC Dispatch"],
    visualSchematic: {
      accentColor: "#3B82F6",
      stageLabel: "LIVE SHOWCALLING TELEMETRY",
      diagramType: "stagecraft",
    },
  },
  {
    id: "phase-analytics",
    stepNumber: "04",
    category: "PHASE 04 // POST-EVENT MASTERY",
    title: "Post-Event Analytics & Media Delivery",
    subtitle: "Same-Day 4K PR Mastering, Audience Telemetry & Carbon Audits",
    tagline: "Extending the summit's impact with pristine asset delivery and transparent ROI.",
    description:
      "Within hours of the closing keynote, we distribute broadcast-grade 4K executive highlight reels for global media. We provide transparent audience engagement analytics, technical performance logs, and certified ISO 14001 carbon sustainability reports.",
    icon: BarChart3,
    image: "/images/executive-pavilion.jpg",
    alt: "Post-event media delivery and audience analytics suite",
    deliverables: [
      {
        title: "Same-Day 4K Executive Keynote Media Pack",
        desc: "Color-graded 4K HDR master video packages ready for press release distribution.",
        badge: "PR Pipeline",
      },
      {
        title: "Audience Dwell & Spatial Engagement Heatmaps",
        desc: "Telemetry reporting foot traffic density, stage engagement curves, and session retention.",
        badge: "ROI Analytics",
      },
      {
        title: "ISO 14001 ESG Sustainability & Waste Audit",
        desc: "Certified zero-waste landfill diversion and carbon offset calculation report.",
        badge: "ESG Certified",
      },
    ],
    metrics: [
      { label: "PR Delivery Time", value: "< 4 Hours" },
      { label: "CSAT Score", value: "99.8%" },
      { label: "Waste Diverted", value: "94.2%" },
    ],
    techPills: ["4K HDR Mastering", "Audience Analytics", "ESG Carbon Audit", "Asset Vault"],
    visualSchematic: {
      accentColor: "#059669",
      stageLabel: "ANALYTICS & ASSET VAULT",
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
