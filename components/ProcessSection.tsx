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
    title: "Vision & Strategy",
    subtitle: "Discovery, Spatial Blueprint & Narrative Architecture",
    tagline: "Aligning executive goals, sensory engineering, and audience journey mapping.",
    description:
      "We begin by deconstructing your core summit objectives into an immersive spatial blueprint. Through 3D spatial simulations, acoustic modeling, and minute-by-minute narrative architecture, we establish a zero-risk conceptual foundation.",
    icon: Compass,
    image: "/images/summit-keynote.jpg",
    alt: "Strategic keynote stadium stage design and lighting blueprint",
    deliverables: [
      {
        title: "Master Run of Show (ROS)",
        desc: "Precision millisecond-timed cue choreography & speaker flow.",
        badge: "Choreography",
      },
      {
        title: "3D Spatial & Stage Previz",
        desc: "Photorealistic CAD/Unreal walkthroughs of arena sightlines.",
        badge: "Visual Previz",
      },
      {
        title: "Audience Journey Mapping",
        desc: "Engineered touchpoints from registration to keynote immersion.",
        badge: "UX Design",
      },
      {
        title: "Technical Feasibility Scope",
        desc: "Complete structural load calculations & power redundancy maps.",
        badge: "Engineering",
      },
    ],
    metrics: [
      { label: "Rapid Concept Turnaround", value: "48h", detail: "Full 3D Stage Prototype" },
      { label: "Scope Precision", value: "100%", detail: "Zero Unplanned Add-Ons" },
    ],
    techPills: ["3D Spatial Previz", "Unreal Engine 5", "Acoustic Raytracing", "ROS Choreography"],
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Seamless Execution",
    subtitle: "Precision Fabrication, Timecode Sync & Rigging",
    tagline: "Where ruthless technical discipline meets flawless live show calling.",
    description:
      "Our in-house master riggers, lighting designers, and technical directors build and stress-test every component. With dual-redundant power, SMPTE timecode automation, and cue-to-cue rehearsals, we ensure zero single point of failure.",
    icon: Cpu,
    image: "/images/kinetic-installation.jpg",
    alt: "Kinetic lighting and automated show control execution",
    deliverables: [
      {
        title: "SMPTE / Timecode Show Control",
        desc: "Automated synchronization of kinetic lighting, audio & visual cues.",
        badge: "Automation",
      },
      {
        title: "Dual-Redundant AV Infrastructure",
        desc: "Live-standby video servers and optical fiber routing matrix.",
        badge: "Fail-Safe",
      },
      {
        title: "Full-Dress Cue Stress Testing",
        desc: "Multiple simulated power cuts and failover transition drills.",
        badge: "Quality Assurance",
      },
      {
        title: "Veteran Live Stage Calling",
        desc: "Dedicated show director directing camera, audio & cue transitions.",
        badge: "Show Calling",
      },
    ],
    metrics: [
      { label: "Failover Latency", value: "0.0ms", detail: "Seamless Auto-Switching" },
      { label: "Rigging Safety Rating", value: "10x", detail: "Exceeds Industry Standards" },
    ],
    techPills: ["Disguise d3 Media Servers", "SMPTE Timecode", "GrandMA3 Consoles", "Dual-Fed Power"],
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Impact & Delivery",
    subtitle: "4K Live Broadcast, Global Resonance & Real-Time Telemetry",
    tagline: "Igniting the room, captivating millions, and measuring pure audience ROI.",
    description:
      "The lights drop, the stage ignites, and your message commands the global room. We capture live telemetry, stream in ultra-low latency 4K HDR across continents, and provide executive post-summit ROI intelligence within hours.",
    icon: Radio,
    image: "/images/executive-pavilion.jpg",
    alt: "Global executive audience summit impact and broadcast delivery",
    deliverables: [
      {
        title: "4K HDR Global Multi-Feed",
        desc: "Broadcast-grade satellite and ultra-low-latency web streaming.",
        badge: "Live Broadcast",
      },
      {
        title: "Real-Time Audience Telemetry",
        desc: "Live spatial heatmaps, session engagement & sentiment scoring.",
        badge: "Telemetry",
      },
      {
        title: "Same-Day Executive Media Pack",
        desc: "Polished 4K keynote highlight clips ready for global press distribution.",
        badge: "PR Media",
      },
      {
        title: "Comprehensive Post-Mortem & ROI",
        desc: "Audience analytics, engagement index & master asset archive.",
        badge: "Analytics",
      },
    ],
    metrics: [
      { label: "Audience Satisfaction", value: "99.8%", detail: "Enterprise Survey Score" },
      { label: "Global Reach", value: "120+", detail: "Countries Streamed Simultaneously" },
    ],
    techPills: ["4K HDR Satellite Uplink", "Real-Time Telemetry", "NDI/Dante Audio", "Instant PR Pipeline"],
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
              onClick={() => scrollTo("#contact", { offset: -60 })}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-gradient-to-r from-[#00A7F5] to-[#92DCFF] text-slate-950 hover:shadow-[0_0_30px_rgba(0,167,245,0.5)] transition-all duration-300 active:scale-95"
            >
              <span>Initiate Your Blueprint</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => scrollTo("#showreel", { offset: -60 })}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
            >
              <span>Watch Live Showreel</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
