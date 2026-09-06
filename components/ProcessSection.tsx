"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  Cpu,
  Radio,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  ChevronRight,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface StepDeliverable {
  title: string;
  desc: string;
  badge?: string;
}

interface StepMetric {
  label: string;
  value: string;
  detail: string;
}

interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  image: string;
  alt: string;
  deliverables: StepDeliverable[];
  metrics: StepMetric[];
  techPills: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "3D Concept & Blueprint",
    subtitle: "Discovery, Structural CAD & Venue Compliance",
    tagline: "Translating brand objectives into photorealistic 3D stand renders and engineering blueprints.",
    description:
      "We deconstruct your exhibition or event requirements into precise 3D walkthroughs, structural load calculations, and official DEC/DWTC/ADNEC venue authority submittals. Every spatial detail is verified under ISO 9001 quality guidelines.",
    icon: Compass,
    image: "/images/prev/atss-1-landscape.webp",
    alt: "3D spatial design and structural CAD blueprint for exhibition stand",
    deliverables: [
      {
        title: "Photorealistic 3D Stand Renders",
        desc: "360° virtual walkthroughs of exhibition stands and stage layouts.",
        badge: "3D Previz",
      },
      {
        title: "Structural Engineering CAD",
        desc: "Stamped load calculations for double-decker and truss structures.",
        badge: "Engineering",
      },
      {
        title: "Venue & Authority Approvals",
        desc: "Direct coordination with DWTC, DEC, ADNEC, and civil defense.",
        badge: "Permits",
      },
      {
        title: "Complete Cost Transparency",
        desc: "Itemized turnkey bill of quantities with zero hidden fees.",
        badge: "Commercial",
      },
    ],
    metrics: [
      { label: "Design Turnaround", value: "48 Hours", detail: "Initial 3D Render Delivery" },
      { label: "Permit SLA", value: "100%", detail: "First-Time Venue Approvals" },
    ],
    techPills: ["3D Max & V-Ray", "AutoCAD Structural", "DEC/DWTC Compliance", "Bespoke Joinery Previz"],
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "In-House Fabrication",
    subtitle: "CNC Joinery, Steel Fabrication & AV Pre-Assembly",
    tagline: "Direct build in our dedicated in-house Dubai workshop with zero third-party outsourcing.",
    description:
      "Our in-house master carpenters, metal fabricators, painters, and AV technicians craft every element. We test-assemble critical structural joints, integrate Brompton LED panels, and conduct ISO 14001 and ISO 45001 safety checks before shipping.",
    icon: Cpu,
    image: "/images/prev/booth_1.webp",
    alt: "In-house joinery, carpentry and stand fabrication in Dubai workshop",
    deliverables: [
      {
        title: "In-House CNC & Timber Joinery",
        desc: "Millimeter-precision automated cutting, lamination, and spray finish.",
        badge: "Fabrication",
      },
      {
        title: "Structural Steel & Acrylic Craft",
        desc: "Custom metal sub-frames, staircases, and backlit acrylic displays.",
        badge: "Metalworking",
      },
      {
        title: "AV & Rigging Pre-Integration",
        desc: "Pre-wiring LED ribbons, power distribution, and dynamic lighting.",
        badge: "AV Systems",
      },
      {
        title: "Triple ISO Quality Audit",
        desc: "Pre-delivery inspection under ISO 9001, 14001, and 45001 standards.",
        badge: "Certified QA",
      },
    ],
    metrics: [
      { label: "Fabrication Accuracy", value: "±0.5mm", detail: "CNC Precision Standard" },
      { label: "ISO Safety Rating", value: "100%", detail: "Zero-Incident Workshop" },
    ],
    techPills: ["In-House Joinery Facility", "CNC 5-Axis Milling", "PU Spray Finishing", "Pre-Assembly QA"],
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Turnkey Live Execution",
    subtitle: "On-Site Build, 4K Broadcast & Flawless Handover",
    tagline: "Rapid on-site installation, concert-grade live operation, and comprehensive media coverage.",
    description:
      "Our logistics team delivers and installs your stand on schedule at the exhibition venue. We provide 24/7 on-site technical standby, live 4K multi-camera streaming, designer furniture placement, VIP gift management, and prompt post-show breakdown.",
    icon: Radio,
    image: "/images/prev/14.webp",
    alt: "Turnkey live event execution and exhibition stand handover at DWTC",
    deliverables: [
      {
        title: "On-Time Venue Handover",
        desc: "Punctual delivery 24 hours ahead of exhibition opening.",
        badge: "On-Time SLA",
      },
      {
        title: "Live AV & Lighting Show Calling",
        desc: "Dedicated technicians managing LED walls, acoustics, and stage cues.",
        badge: "Live Tech",
      },
      {
        title: "4K Media & PR Video Pack",
        desc: "High-resolution booth photography and broadcast-ready video reels.",
        badge: "Media Studio",
      },
      {
        title: "Green Strike & Asset Storage",
        desc: "Eco-friendly dismantling, material recycling, and secure storage.",
        badge: "ISO 14001",
      },
    ],
    metrics: [
      { label: "On-Time Handover", value: "100%", detail: "Strict Delivery SLA" },
      { label: "Client CSAT", value: "99.8%", detail: "Verified Event Success" },
    ],
    techPills: ["DWTC / DEC Load-In SLA", "4K Multi-Camera Live", "Same-Day PR Reels", "Eco-Friendly Strike"],
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineTrackRef = useRef<HTMLDivElement | null>(null);
  const pathBgRef = useRef<SVGPathElement | null>(null);
  const pathGlowRef = useRef<SVGPathElement | null>(null);
  const laserBeadRef = useRef<SVGCircleElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodePillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeTabPerStep, setActiveTabPerStep] = useState<Record<number, "deliverables" | "specs">>({
    0: "deliverables",
    1: "deliverables",
    2: "deliverables",
  });

  const { scrollTo } = useSmoothScroll();
  const filterId = useId();

  // ScrollTrigger & GSAP SVG Line Animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !timelineTrackRef.current) return;

      // 1. Intro header reveal
      gsap.set(".process-intro-el", { opacity: 0, y: 30 });
      gsap.to(".process-intro-el", {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // 2. Setup SVG dynamic draw line
      const pathGlow = pathGlowRef.current;
      const laserBead = laserBeadRef.current;

      if (pathGlow) {
        const pathLength = pathGlow.getTotalLength ? pathGlow.getTotalLength() : 1200;
        gsap.set(pathGlow, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        // Scrub the glowing SVG line dynamically as user scrolls down the timeline
        ScrollTrigger.create({
          trigger: timelineTrackRef.current,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            const drawLength = pathLength * (1 - progress);
            gsap.to(pathGlow, {
              strokeDashoffset: drawLength,
              duration: 0.1,
              ease: "none",
              overwrite: "auto",
            });

            // Move the laser bead along the path
            if (laserBead && pathGlow.getPointAtLength) {
              try {
                const currentDist = pathLength * progress;
                const point = pathGlow.getPointAtLength(currentDist);
                gsap.to(laserBead, {
                  attr: { cx: point.x, cy: point.y },
                  opacity: progress > 0.01 && progress < 0.99 ? 1 : 0.4,
                  duration: 0.1,
                  ease: "none",
                  overwrite: "auto",
                });
              } catch {
                // Ignore SVG measure edge-cases
              }
            }
          },
        });
      }

      // 3. Step Nodes: Illuminate and expand slightly as they reach the center of viewport
      stepRefs.current.forEach((stepEl, idx) => {
        if (!stepEl) return;

        ScrollTrigger.create({
          trigger: stepEl,
          start: "top 62%",
          end: "bottom 38%",
          onEnter: () => {
            setActiveStepIndex(idx);
          },
          onEnterBack: () => {
            setActiveStepIndex(idx);
          },
        });

        // Entrance animation for step card elements
        const cardElements = stepEl.querySelectorAll(".step-anim-target");
        gsap.fromTo(
          cardElements,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stepEl,
              start: "top 78%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handler to jump to a specific step
  const handleJumpToStep = (index: number) => {
    setActiveStepIndex(index);
    const targetStep = stepRefs.current[index];
    if (targetStep) {
      const topOffset = targetStep.getBoundingClientRect().top + window.scrollY - 100;
      scrollTo(topOffset, { duration: 1.1 });
    }
  };

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
    >
      {/* Ambient background glows for corporate luxury aesthetic */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.08),transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-2/3 -right-48 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.06),transparent_70%)] pointer-events-none"
      />

      {/* Intro block */}
      <div className="relative max-w-7xl mx-auto mb-16 sm:mb-24 text-center">
        <div className="process-intro-el inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-bold tracking-wider uppercase shadow-diffused-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#00A7F5] animate-pulse" />
          <span>The Execution Blueprint</span>
        </div>

        <h2 className="process-intro-el text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] max-w-3xl mx-auto">
          How It Works: <span className="text-gradient">Engineered to Perfection.</span>
        </h2>

        <p className="process-intro-el mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          A disciplined, 3-stage orchestration pipeline transforming executive ambition into high-impact,
          zero-failure live summits.
        </p>

        {/* Step quick-switcher navigation bar */}
        <div className="process-intro-el flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-8 p-1.5 max-w-xl mx-auto bg-slate-100/80 backdrop-blur-md rounded-full border border-slate-200 shadow-diffused-sm">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.id}
                onClick={() => handleJumpToStep(idx)}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-white text-[#003E95] shadow-diffused-md border border-[#00A7F5]/30 scale-102"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-[#003E95] to-[#00A7F5] text-white"
                      : "bg-slate-200 text-slate-700 group-hover:bg-slate-300"
                  }`}
                >
                  {step.stepNumber}
                </span>
                <span className="hidden xs:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Timeline Pipeline */}
      <div ref={timelineTrackRef} className="relative max-w-7xl mx-auto">
        {/* Glowing Central GSAP SVG Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-8 pointer-events-none hidden sm:block z-10">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 32 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Glow filter */}
              <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Dynamic Gradient */}
              <linearGradient id={`lineGrad-${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#003E95" />
                <stop offset="50%" stopColor="#00A7F5" />
                <stop offset="100%" stopColor="#92DCFF" />
              </linearGradient>
            </defs>

            {/* Background dashed track */}
            <path
              ref={pathBgRef}
              d="M 16 0 L 16 1000"
              stroke="rgba(0, 167, 245, 0.16)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />

            {/* Glowing active animated draw line */}
            <path
              ref={pathGlowRef}
              d="M 16 0 L 16 1000"
              stroke={`url(#lineGrad-${filterId})`}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter={`url(#glow-${filterId})`}
            />

            {/* Travelling laser bead */}
            <circle
              ref={laserBeadRef}
              cx="16"
              cy="0"
              r="6"
              fill="#FFFFFF"
              stroke="#00A7F5"
              strokeWidth="3"
              filter={`url(#glow-${filterId})`}
              className="transition-opacity duration-300"
            />
          </svg>
        </div>

        {/* 3 Step Pipeline Items */}
        <div className="space-y-24 sm:space-y-36">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStepIndex === idx;
            const isEven = idx % 2 === 1; // Alternating layout on desktop
            const currentTab = activeTabPerStep[idx] || "deliverables";

            return (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center transition-all duration-700 ${
                  isActive ? "opacity-100" : "opacity-75 hover:opacity-95"
                }`}
              >
                {/* Central Step Node Indicator (Pill/Circle) */}
                <div
                  className={`absolute left-6 md:left-1/2 top-10 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500 hidden sm:flex items-center justify-center`}
                >
                  <button
                    ref={(el) => {
                      nodePillRefs.current[idx] = el;
                    }}
                    onClick={() => handleJumpToStep(idx)}
                    aria-label={`Jump to ${step.title}`}
                    className={`relative flex items-center justify-center rounded-full transition-all duration-500 cursor-pointer ${
                      isActive
                        ? "w-14 h-14 bg-gradient-to-tr from-[#003E95] via-[#00A7F5] to-[#92DCFF] shadow-[0_0_30px_rgba(0,167,245,0.6)] scale-110 ring-4 ring-[#00A7F5]/20"
                        : "w-11 h-11 bg-white border-2 border-slate-300 shadow-diffused-md hover:border-[#00A7F5] hover:scale-105"
                    }`}
                  >
                    {/* Concentric pulsing aura when active */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-[#00A7F5]/30 animate-ping pointer-events-none" />
                    )}
                    <span
                      className={`font-black text-sm transition-colors ${
                        isActive ? "text-white drop-shadow-sm" : "text-slate-700"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                  </button>
                </div>

                {/* LEFT/RIGHT COLUMN 1: Storytelling, Deep Details & Deliverables */}
                <div
                  className={`step-anim-target ${
                    isEven ? "md:order-2 md:pl-8 lg:pl-12" : "md:order-1 md:pr-8 lg:pr-12"
                  }`}
                >
                  {/* Step Overline & Mobile Node Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#003E95] to-[#00A7F5] text-white text-xs font-black">
                      {step.stepNumber}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#003E95]/10 text-[#003E95] text-xs font-bold uppercase tracking-wider">
                      Phase {step.stepNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#00A7F5]" />
                      {step.subtitle}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-base sm:text-lg font-medium text-[#003E95] leading-snug">
                    {step.tagline}
                  </p>

                  <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Interactive Details Card with Elevated Glassmorphism */}
                  <div
                    className={`mt-6 rounded-3xl p-5 sm:p-6 transition-all duration-500 ${
                      isActive
                        ? "glass-card-elevated border-[#00A7F5]/40 shadow-glow"
                        : "glass-card border-slate-200/80 shadow-diffused-sm hover:border-[#00A7F5]/30"
                    }`}
                  >
                    {/* Sub-tab Navigation */}
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setActiveTabPerStep((prev) => ({ ...prev, [idx]: "deliverables" }))
                          }
                          className={`text-xs sm:text-sm font-bold pb-1 transition-all ${
                            currentTab === "deliverables"
                              ? "text-[#003E95] border-b-2 border-[#00A7F5]"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Key Deliverables
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          onClick={() =>
                            setActiveTabPerStep((prev) => ({ ...prev, [idx]: "specs" }))
                          }
                          className={`text-xs sm:text-sm font-bold pb-1 transition-all ${
                            currentTab === "specs"
                              ? "text-[#003E95] border-b-2 border-[#00A7F5]"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Technical Specs & Telemetry
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                        <Zap className="w-3.5 h-3.5 text-[#00A7F5]" />
                        <span>Live Stage Ready</span>
                      </div>
                    </div>

                    {/* Tab 1: Key Deliverables */}
                    {currentTab === "deliverables" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fadeIn">
                        {step.deliverables.map((item) => (
                          <div
                            key={item.title}
                            className="group/item flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 hover:bg-white border border-slate-200/60 hover:border-[#00A7F5]/30 transition-all duration-300"
                          >
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-[#00A7F5]/10 flex items-center justify-center text-[#003E95] shrink-0 group-hover/item:bg-[#003E95] group-hover/item:text-white transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#003E95] transition-colors">
                                  {item.title}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tab 2: Technical Specs & Telemetry */}
                    {currentTab === "specs" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-3">
                          {step.metrics.map((m) => (
                            <div
                              key={m.label}
                              className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80"
                            >
                              <div className="text-2xl font-black text-[#003E95] tracking-tight">
                                {m.value}
                              </div>
                              <div className="text-xs font-bold text-slate-800 mt-0.5">{m.label}</div>
                              <div className="text-[11px] text-slate-600 mt-0.5">{m.detail}</div>
                            </div>
                          ))}
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="pt-2">
                          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Infrastructure & Tooling
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {step.techPills.map((pill) => (
                              <span
                                key={pill}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs"
                              >
                                {pill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* LEFT/RIGHT COLUMN 2: Visual Card with Ambient Depth */}
                <div
                  className={`step-anim-target ${
                    isEven ? "md:order-1 md:pr-8 lg:pr-12" : "md:order-2 md:pl-8 lg:pl-12"
                  }`}
                >
                  <div
                    className={`relative rounded-3xl p-1 transition-all duration-700 ${
                      isActive
                        ? "bg-gradient-to-tr from-[#003E95] via-[#00A7F5] to-[#92DCFF] shadow-diffused-xl scale-[1.02]"
                        : "bg-slate-200 hover:bg-slate-300 shadow-diffused-md"
                    }`}
                  >
                    <div className="relative rounded-[22px] overflow-hidden aspect-[16/11] bg-slate-900">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 560px"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                      {/* Top floating badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                        <Icon className="w-3.5 h-3.5 text-[#00A7F5]" />
                        <span>{step.title}</span>
                      </div>

                      {/* Bottom stats overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-xs font-medium text-white/70 block mb-1">
                              Stage Milestone
                            </span>
                            <div className="text-lg sm:text-xl font-black text-white tracking-tight">
                              {step.subtitle}
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Block */}
      <div className="relative max-w-5xl mx-auto mt-28 sm:mt-36 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#003E95] via-[#002D6E] to-[#001D47] text-white shadow-diffused-xl overflow-hidden text-center">
        {/* Glow backdrop inside CTA */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.4),transparent_70%)] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(146,220,255,0.25),transparent_70%)] pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-4 text-[#92DCFF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Fail Production Guarantee</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Ready to Build an Unforgettable Stage Experience?
          </h3>

          <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
            Let&apos;s engineer your next corporate summit with precision, technological brilliance, and
            unrivaled craft.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("/brief")}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-gradient-to-r from-[#00A7F5] to-[#92DCFF] text-slate-950 hover:shadow-[0_0_30px_rgba(0,167,245,0.5)] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span>Build Your Stand Brief</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => scrollTo("/contact")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors cursor-pointer"
            >
              <span>Contact Dubai HQ</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
