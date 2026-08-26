"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Cpu,
  Palette,
  UtensilsCrossed,
  ShieldCheck,
  ArrowDown,
  Sparkles,
  Layers,
  Activity,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Globe2,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";
import { useReveal } from "./RevealProvider";

interface ServiceDomain {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  metrics: { label: string; value: string }[];
  features: string[];
  gradient: string;
  accentColor: string;
  badge: string;
}

const SERVICE_DOMAINS: ServiceDomain[] = [
  {
    id: "technical",
    category: "01 // AUTOMATION & SHOW CONTROL",
    title: "Technical Execution & Show Control",
    subtitle: "Stadium-Grade Audio, Kinetic Rigging & Volumetric Lighting",
    description:
      "Engineered with redundant fiber backbones, SMPTE timecode sync, and sub-millisecond show control logic. Zero-fail infrastructure designed for global enterprise summits.",
    icon: Cpu,
    metrics: [
      { label: "Uptime Reliability", value: "99.999%" },
      { label: "Timecode Drift", value: "< 0.1 ms" },
      { label: "Kinetic Axes", value: "128 Synchronized" },
    ],
    features: [
      "Redundant Primary & Secondary Media Servers",
      "Dynamic Volumetric Laser & LED Array Control",
      "Fail-Safe Power & Uninterruptible Distribution",
    ],
    gradient: "from-blue-600 via-sky-500 to-indigo-600",
    accentColor: "#003E95",
    badge: "ENGINEERING CORE",
  },
  {
    id: "spatial",
    category: "02 // IMMERSIVE ARCHITECTURE",
    title: "Spatial Design & Kinetic Media",
    subtitle: "Real-Time 3D Previsualization & Structural Motion Graphics",
    description:
      "Architectural staging meets digital craft. We transform static venues into living spatial environments featuring dynamic LED walls, 3D previz, and generative media art.",
    icon: Palette,
    metrics: [
      { label: "Previz Render Speed", value: "120 FPS" },
      { label: "LED Canvas Resolution", value: "16K Native" },
      { label: "Global Summit Builds", value: "450+" },
    ],
    features: [
      "Real-Time Unreal Engine Previsualization",
      "Modular Architectural LED Sculptures",
      "Generative Motion Graphics & Spatial Audio",
    ],
    gradient: "from-cyan-500 via-blue-500 to-teal-500",
    accentColor: "#00A7F5",
    badge: "CREATIVE ENGINE",
  },
  {
    id: "hospitality",
    category: "03 // EXECUTIVE GUEST EXPERIENCES",
    title: "Culinary & Executive Hospitality",
    subtitle: "High-Volume Haute Cuisine & VIP Summit Dinners",
    description:
      "Bespoke dining ecosystems that align with corporate brand narrative. From multi-tiered VIP galas to fast-throughput high-density keynotes, orchestrated to perfection.",
    icon: UtensilsCrossed,
    metrics: [
      { label: "Plated Capacity / Hr", value: "5,000+" },
      { label: "Michelin Partner Chefs", value: "18" },
      { label: "Guest Satisfaction", value: "99.4%" },
    ],
    features: [
      "Custom Curated Culinary Concepts & Mixology",
      "High-Speed Precision Executive Plating",
      "Dietary Architectural Protocol & Sourcing",
    ],
    gradient: "from-blue-500 via-indigo-600 to-sky-600",
    accentColor: "#3B82F6",
    badge: "HOSPITALITY",
  },
  {
    id: "logistics",
    category: "04 // COMMAND & SAFETY PROTOCOLS",
    title: "Logistics, Safety & Command Control",
    subtitle: "Global Freight Routing, Risk Mitigation & Air-Tight Compliance",
    description:
      "Complete operational governance. International customs clearance, structural safety certifications, emergency redundancies, and real-time command centers.",
    icon: ShieldCheck,
    metrics: [
      { label: "Countries Supported", value: "120+" },
      { label: "Safety Compliance", value: "ISO 45001" },
      { label: "Dispatch Response", value: "< 60 Sec" },
    ],
    features: [
      "Air & Maritime Global Freight Logistics",
      "Structural Engineering Safety Certifications",
      "Unified Event Operations Command Hub",
    ],
    gradient: "from-indigo-600 via-blue-600 to-cyan-600",
    accentColor: "#1E40AF",
    badge: "COMMAND CENTER",
  },
];

export default function ServicesHero() {
  const { scrollTo } = useSmoothScroll();
  const { setRevealed } = useReveal();

  const sectionRef = useRef<HTMLElement | null>(null);
  const ambientGlowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const visualStageRef = useRef<HTMLDivElement | null>(null);
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);

  const [activeDomainIndex, setActiveDomainIndex] = useState(0);
  const [isHoveringStage, setIsHoveringStage] = useState(false);

  // Activate background reveal on mount
  useEffect(() => {
    setRevealed(true);
  }, [setRevealed]);

  // Staggered GSAP split-text headline animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate top badge and metadata overline
      gsap.fromTo(
        ".hero-badge-elem",
        { opacity: 0, y: -16, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );

      // Stagger split text words in main headline
      const headlineWords = headlineRef.current?.querySelectorAll(".split-word");
      if (headlineWords && headlineWords.length > 0) {
        gsap.fromTo(
          headlineWords,
          { opacity: 0, y: 42, rotateX: -20, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.0,
            stagger: 0.04,
            ease: "power4.out",
            delay: 0.25,
          }
        );
      }

      // Animate subtitle description & CTA row
      gsap.fromTo(
        ".hero-desc-elem",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.6 }
      );

      // Animate the visual stage container
      gsap.fromTo(
        visualStageRef.current,
        { opacity: 0, y: 35, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out", delay: 0.45 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Ambient mouse light-glow tracking across hero
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
      targetX = relX * 100;
      targetY = relY * 100;
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

  // Interactive 3D tilt transformation on the Visual Stage Card as mouse moves across it
  useEffect(() => {
    const stage = visualStageRef.current;
    if (!stage) return;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let curTiltX = 0;
    let curTiltY = 0;
    let targetLightX = 50;
    let targetLightY = 50;
    let curLightX = 50;
    let curLightY = 50;
    let rafId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      // Max tilt angle (degrees)
      const maxTilt = 8;
      targetTiltX = (0.5 - relY) * maxTilt;
      targetTiltY = (relX - 0.5) * maxTilt;

      targetLightX = relX * 100;
      targetLightY = relY * 100;
    };

    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      targetLightX = 50;
      targetLightY = 50;
      setIsHoveringStage(false);
    };

    const handlePointerEnter = () => {
      setIsHoveringStage(true);
    };

    const animateStage = () => {
      curTiltX += (targetTiltX - curTiltX) * 0.08;
      curTiltY += (targetTiltY - curTiltY) * 0.08;
      curLightX += (targetLightX - curLightX) * 0.08;
      curLightY += (targetLightY - curLightY) * 0.08;

      if (stage) {
        stage.style.transform = `perspective(1200px) rotateX(${curTiltX.toFixed(
          2
        )}deg) rotateY(${curTiltY.toFixed(2)}deg) translateZ(0px)`;
        stage.style.setProperty("--light-x", `${curLightX.toFixed(2)}%`);
        stage.style.setProperty("--light-y", `${curLightY.toFixed(2)}%`);
      }

      rafId = requestAnimationFrame(animateStage);
    };

    stage.addEventListener("pointermove", handlePointerMove, { passive: true });
    stage.addEventListener("pointerleave", handlePointerLeave);
    stage.addEventListener("pointerenter", handlePointerEnter);
    rafId = requestAnimationFrame(animateStage);

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      stage.removeEventListener("pointerenter", handlePointerEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Magnetic Scroll-Down Anchor physics
  useEffect(() => {
    const btn = magneticBtnRef.current;
    if (!btn) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;
    const maxPull = 18;
    const radius = 220;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        const factor = Math.pow(1 - dist / radius, 1.2);
        targetX = (dx / radius) * maxPull * factor * 1.5;
        targetY = (dy / radius) * maxPull * factor * 1.5;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const loop = () => {
      curX += (targetX - curX) * 0.1;
      curY += (targetY - curY) * 0.1;

      btn.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0px)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleWindowMouseMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const activeDomain = SERVICE_DOMAINS[activeDomainIndex];
  const ActiveIcon = activeDomain.icon;

  // Split headline text into words for staggered GSAP reveal
  const headlineText = "End-to-End Event Execution & Technical Mastery";
  const words = headlineText.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[92vh] pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden  text-slate-900 flex flex-col justify-between"
    >
      {/* Dynamic Cursor-Tracking Ambient Background Glow */}
      <div
        ref={ambientGlowRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-70 transition-opacity duration-700"
        style={{
          background: `radial-gradient(750px circle at var(--glow-x, 50%) var(--glow-y, 35%), rgba(0, 167, 245, 0.12), rgba(0, 62, 149, 0.06) 40%, transparent 80%)`,
        }}
      />

      {/* Light Architectural Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Decorative Top Accent Lines */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between">
        {/* Top Meta Header & Staggered Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-12 sm:mb-16">
          {/* Left Column: Category Badge & Headline */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill Badge */}
            <div className="hero-badge-elem inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#00A7F5]/30 shadow-diffused-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A7F5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#003E95]"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-[#003E95]">
                ENTERPRISE CAPABILITIES & ARCHITECTURE
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-500">SERVICES OVERVIEW</span>
            </div>

            {/* GSAP Staggered Split-Text Headline */}
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.04] mb-6 select-none"
              style={{ perspective: "1000px" }}
            >
              {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.26em] pb-1">
                  <span
                    className={`split-word inline-block ${word === "Technical" || word === "Mastery"
                        ? "text-gradient drop-shadow-sm"
                        : ""
                      }`}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subheadline & Value Statement */}
            <p className="hero-desc-elem text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              From stadium-scale show control and kinetic volumetric rigging to bespoke VIP culinary programs and zero-fail international logistics—we engineer spatial experiences that redefine enterprise benchmarks.
            </p>
          </div>

          {/* Right Column: Dynamic Status Telemetry Card */}
          <div className="hero-desc-elem lg:col-span-5 flex flex-col justify-end lg:pl-6">
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-diffused-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00A7F5]/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#003E95]/10 text-[#003E95]">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      SYSTEM STATUS
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Zero-Fail Production SLA
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  ACTIVE 100%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400">GLOBAL VENUES</div>
                  <div className="text-lg font-black text-slate-900">120+</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400">MAX ATTENDEES</div>
                  <div className="text-lg font-black text-slate-900">50,000+</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400">LATENCY TIME</div>
                  <div className="text-lg font-black text-slate-900">&lt; 0.1ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 3D Visual Stage & Floating Category Ribbon */}
        <div className="w-full mt-4 mb-10">
          <div
            ref={visualStageRef}
            className="relative w-full rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-diffused-xl overflow-hidden transition-shadow duration-500"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: isHoveringStage
                ? "0 30px 60px -12px rgba(15, 23, 42, 0.12), 0 12px 30px -4px rgba(0, 167, 245, 0.15)"
                : undefined,
            }}
          >
            {/* Interactive Light Reflection Sheen overlay tracking mouse inside card */}
            <div
              className="pointer-events-none absolute inset-0 z-20 opacity-40 transition-opacity duration-300"
              style={{
                background: `radial-gradient(600px circle at var(--light-x, 50%) var(--light-y, 50%), rgba(255,255,255,0.8), transparent 70%)`,
              }}
            />

            {/* Top Interactive Category Ribbon Bar */}
            <div className="relative z-10 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#003E95]" /> DOMAIN SELECTOR:
                </span>

                {SERVICE_DOMAINS.map((domain, index) => {
                  const IconComponent = domain.icon;
                  const isActive = activeDomainIndex === index;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => setActiveDomainIndex(index)}
                      className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2.5 select-none ${isActive
                          ? "bg-slate-900 text-white shadow-diffused-sm scale-[1.02]"
                          : "bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
                        }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 transition-colors ${isActive ? "text-[#00A7F5]" : "text-slate-400"
                          }`}
                      />
                      <span>{domain.title.split("&")[0].trim()}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A7F5] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400 min-w-max">
                <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" /> Move cursor over stage for 3D depth
              </div>
            </div>

            {/* Main Stage Content Display */}
            <div className="relative z-10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Active Domain Narrative & Specs */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-md bg-[#003E95]/10 text-[#003E95] text-xs font-extrabold tracking-wider uppercase">
                      {activeDomain.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                      {activeDomain.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {activeDomain.title}
                  </h3>

                  <p className="text-sm sm:text-base font-semibold text-[#003E95] mt-1.5 mb-4">
                    {activeDomain.subtitle}
                  </p>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {activeDomain.description}
                  </p>
                </div>

                {/* Live Spec Checklist */}
                <div className="space-y-2.5 pt-2">
                  {activeDomain.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                      <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Key Telemetry Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                  {activeDomain.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {m.label}
                      </div>
                      <div className="text-base sm:text-xl font-black text-slate-900 mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Floating 3D Graphic Canvas Visualization */}
              <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[320px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
                {/* Dynamic Background Glow Graphic */}
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#00A7F5]/30 to-[#003E95]/40 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/30 blur-3xl pointer-events-none" />

                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Top Card Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20">
                      <ActiveIcon className="w-6 h-6 text-[#00A7F5]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                        REAL-TIME STAGE DISPLAY
                      </div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {activeDomain.title.split("&")[0]}
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-mono">
                    VOLUMETRIC v4.2
                  </span>
                </div>

                {/* Central Visual Graphic Representation */}
                <div className="relative z-10 my-6 py-6 border-y border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#003E95] to-[#00A7F5] p-0.5 shadow-glow-blue animate-pulse">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                        <ActiveIcon className="w-9 h-9 text-[#00A7F5]" />
                      </div>
                    </div>
                    {/* Orbiting Tech Rings */}
                    <div className="absolute inset-0 -m-3 border border-[#00A7F5]/40 rounded-3xl animate-spin [animation-duration:12s]" />
                  </div>

                  <div className="text-xs font-mono text-slate-300 tracking-wide mt-2">
                    HARDWARE SYNC: <span className="text-[#00A7F5] font-bold">100% LOCKSTEP</span>
                  </div>
                </div>

                {/* Bottom Card Interactive Indicator */}
                <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00A7F5]" />
                    <span>Dynamic Stage Physics Active</span>
                  </div>
                  <button
                    onClick={() => scrollTo("#services-grid")}
                    className="flex items-center gap-1.5 text-white hover:text-[#00A7F5] transition-colors"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Micro-Interactions & Magnetic Scroll Anchor */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-200/80">
          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-diffused-sm">
              <Globe2 className="w-4 h-4 text-[#003E95]" />
              <span>Global Summit Support</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-diffused-sm">
              <Layers className="w-4 h-4 text-[#00A7F5]" />
              <span>Full-Stack Execution</span>
            </div>
          </div>

          {/* Magnetic Scroll-Down Anchor Button */}
          <div className="relative flex items-center justify-center">
            <button
              ref={magneticBtnRef}
              onClick={() => scrollTo("#services-grid")}
              aria-label="Scroll down to services grid"
              className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-300 shadow-diffused-lg hover:shadow-glow-blue transition-all duration-300 cursor-pointer"
            >
              {/* Rotating Circular Text SVG Ring */}
              <svg
                className="absolute inset-0 w-full h-full animate-spin [animation-duration:14s] pointer-events-none p-1"
                viewBox="0 0 100 100"
              >
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[9px] font-bold uppercase fill-slate-500 tracking-[0.2em]">
                  <textPath href="#circlePath" startOffset="0%">
                    • DISCOVER SERVICES • EXPLORE GRID
                  </textPath>
                </text>
              </svg>

              {/* Central Arrow Icon */}
              <div className="relative z-10 w-9 h-9 rounded-full bg-[#003E95] text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00A7F5] transition-all duration-300">
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
