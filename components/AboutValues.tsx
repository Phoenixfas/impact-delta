"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Cpu,
  Compass,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Radio,
  Sliders,
  Maximize2,
  type LucideIcon,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface BentoPillar {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  icon: LucideIcon;
  colSpan: string;
  metric: { value: string; label: string };
  badge: string;
  image?: string;
  bullets: string[];
  accentColor: string;
}

const PILLARS: BentoPillar[] = [
  {
    id: "precision",
    title: "Technical Precision",
    subtitle: "Sub-Millisecond Symphony",
    category: "01 // Infrastructure",
    description:
      "Every photon, acoustic impulse, and scenic cue is locked to SMPTE timecode down to the microsecond — eliminating human hesitation and single points of failure.",
    icon: Cpu,
    colSpan: "lg:col-span-7",
    metric: { value: "0.0ms", label: "Failover Latency" },
    badge: "SMPTE / Timecode Sync",
    image: "/images/kinetic-installation.jpg",
    bullets: [
      "Dual-redundant optical media servers",
      "SMPTE frame-accurate cue choreography",
      "Automated acoustic raytracing simulation",
    ],
    accentColor: "#00A7F5",
  },
  {
    id: "audacity",
    title: "Creative Audacity",
    subtitle: "Radical Spatial Architecture",
    category: "02 // Design",
    description:
      "We refuse the monotony of flat projection. We architect volumetric 3D environments, kinetic sculptures, and dynamic sightlines that transform passive viewers into awestruck participants.",
    icon: Compass,
    colSpan: "lg:col-span-5",
    metric: { value: "100%", label: "Bespoke Stagecraft" },
    badge: "Unreal Engine 5 Previz",
    image: "/images/summit-keynote.jpg",
    bullets: [
      "Photorealistic 3D arena previz",
      "Kinetic geometric rigging matrices",
      "Dynamic volumetric LED integration",
    ],
    accentColor: "#003E95",
  },
  {
    id: "hospitality",
    title: "Unmatched Hospitality",
    subtitle: "Executive Reverence & Care",
    category: "03 // Human Core",
    description:
      "Grandeur is hollow without empathy. From white-glove speaker green-rooms to sensory crowd flow, every human touchpoint is choreographed with unhurried warmth.",
    icon: HeartHandshake,
    colSpan: "lg:col-span-4",
    metric: { value: "99.8%", label: "Executive CSAT" },
    badge: "White-Glove Concierge",
    bullets: [
      "Dedicated keynote speaker concierge",
      "Acoustically tuned VIP green-rooms",
      "Frictionless executive arrival pathways",
    ],
    accentColor: "#00A7F5",
  },
  {
    id: "sustainability",
    title: "Sustainable Execution",
    subtitle: "Circular Engineering",
    category: "04 // Stewardship",
    description:
      "Monumental summits without monumental waste. We utilize 100% modular aluminum truss systems, energy-dense LED arrays, and zero-landfill material recycling.",
    icon: Leaf,
    colSpan: "lg:col-span-4",
    metric: { value: "85%+", label: "Reusable Components" },
    badge: "Zero-Landfill Protocol",
    bullets: [
      "100% modular reusable aluminum joinery",
      "High-efficiency low-draw LED lighting",
      "Post-summit material lifecycle tracing",
    ],
    accentColor: "#10B981",
  },
  {
    id: "redundancy",
    title: "Zero-Fail Redundancy",
    subtitle: "Mission-Critical Assurance",
    category: "05 // Reliability",
    description:
      "Dual-fed generator grids, live-standby video matrices, and battle-tested emergency protocols guarantee the live moment never drops — no matter the scale.",
    icon: ShieldCheck,
    colSpan: "lg:col-span-4",
    metric: { value: "10x", label: "Structural Safety Factor" },
    badge: "Dual-Grid Power Backup",
    bullets: [
      "Hot-swappable backup video routing",
      "Isolated dual-UPS power distribution",
      "24/7 veteran master show callers",
    ],
    accentColor: "#003E95",
  },
];

export default function AboutValues() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollTo } = useSmoothScroll();

  // Timecode live ticking state for technical precision card
  const [timecode, setTimecode] = useState("00:42:19:08");

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      const f = String(Math.floor((d.getMilliseconds() / 1000) * 30)).padStart(2, "0");
      setTimecode(`${h}:${m}:${s}:${f}`);
    }, 33);
    return () => clearInterval(timer);
  }, []);

  // 3D Tilt and Cursor-Tracking Glowing Spot
  useEffect(() => {
    const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);

    cards.forEach((card) => {
      let targetRotX = 0;
      let targetRotY = 0;
      let curRotX = 0;
      let curRotY = 0;
      let targetGlowX = 50;
      let targetGlowY = 50;
      let curGlowX = 50;
      let curGlowY = 50;
      let isHovered = false;
      let rafId = 0;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;

        // 3D tilt angles (-8deg to +8deg)
        targetRotX = (py - 0.5) * -14;
        targetRotY = (px - 0.5) * 14;

        targetGlowX = px * 100;
        targetGlowY = py * 100;
      };

      const handlePointerEnter = () => {
        isHovered = true;
      };

      const handlePointerLeave = () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetGlowX = 50;
        targetGlowY = 50;
      };

      const loop = () => {
        curRotX += (targetRotX - curRotX) * 0.12;
        curRotY += (targetRotY - curRotY) * 0.12;
        curGlowX += (targetGlowX - curGlowX) * 0.15;
        curGlowY += (targetGlowY - curGlowY) * 0.15;

        card.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale3d(${
          isHovered ? 1.015 : 1
        }, ${isHovered ? 1.015 : 1}, 1)`;
        card.style.setProperty("--glow-x", `${curGlowX.toFixed(2)}%`);
        card.style.setProperty("--glow-y", `${curGlowY.toFixed(2)}%`);

        rafId = requestAnimationFrame(loop);
      };

      card.addEventListener("pointermove", handlePointerMove, { passive: true });
      card.addEventListener("pointerenter", handlePointerEnter);
      card.addEventListener("pointerleave", handlePointerLeave);
      rafId = requestAnimationFrame(loop);

      return () => {
        card.removeEventListener("pointermove", handlePointerMove);
        card.removeEventListener("pointerenter", handlePointerEnter);
        card.removeEventListener("pointerleave", handlePointerLeave);
        cancelAnimationFrame(rafId);
      };
    });
  }, []);

  // GSAP ScrollTrigger Entrance
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Header entrance
      gsap.fromTo(
        ".values-intro-el",
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

      // Bento cards staggered pop-in
      gsap.fromTo(
        ".bento-pillar-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bento-pillars-grid",
            start: "top 78%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="values"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-slate-50/50 selection:bg-[#003E95] selection:text-white"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-48 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.08),transparent_70%)] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -left-48 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.06),transparent_70%)] pointer-events-none -z-10"
      />

      {/* Atmospheric Micro Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.025] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      <div className="relative max-w-7xl mx-auto">
        {/* =========================================================================
            SECTION HEADER
            ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="values-intro-el inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
            <span>The Impact Code of Craft</span>
          </div>

          <h2 className="values-intro-el text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
            Built on Five <span className="text-gradient">Uncompromising Pillars.</span>
          </h2>

          <p className="values-intro-el mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Our guiding philosophy unites razor-sharp technical discipline with empathetic human
            storytelling. Every production decision is rooted in these standards.
          </p>
        </div>

        {/* =========================================================================
            2026 ASYMMETRIC BENTO GRID
            ========================================================================= */}
        <div className="bento-pillars-grid grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isLarge = pillar.colSpan.includes("7") || pillar.colSpan.includes("5");

            return (
              <div
                key={pillar.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`bento-pillar-card ${pillar.colSpan} group relative rounded-3xl p-6 sm:p-8 bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-100/60 hover:shadow-2xl hover:border-[#00A7F5]/40 transition-[border-color,box-shadow] duration-500 will-change-transform flex flex-col justify-between overflow-hidden cursor-pointer`}
              >
                {/* Dynamic Ambient Glowing Spot Tracking Cursor */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(0,167,245,0.14), rgba(0,62,149,0.05) 45%, transparent 75%)",
                  }}
                />

                {/* Subtle Specular Card Border Glint */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-inset ring-[#00A7F5]/25"
                />

                {/* Top Card Header */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#003E95] to-[#00A7F5] flex items-center justify-center text-white shadow-diffused-sm group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#003E95] uppercase block">
                          {pillar.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {pillar.badge}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {pillar.metric.value}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {pillar.metric.label}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-[#003E95] transition-colors">
                    {pillar.title}
                  </h3>
                  <div className="text-sm font-bold text-[#00A7F5] mb-3">{pillar.subtitle}</div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                {/* Card Visual / Interactive Media Body */}
                {pillar.id === "precision" && (
                  <div className="relative z-10 mt-6 pt-5 border-t border-slate-200/70">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 text-white font-mono text-xs shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="text-slate-400">SMPTE TC:</span>
                        <span className="text-emerald-400 font-bold">{timecode}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        29.97 FPS SYNCED
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {pillar.bullets.map((b) => (
                        <div
                          key={b}
                          className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A7F5] shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pillar.id === "audacity" && (
                  <div className="relative z-10 mt-6 pt-5 border-t border-slate-200/70">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 shadow-md">
                      <Image
                        src="/images/summit-keynote.jpg"
                        alt="Unreal Engine 5 stage previz render"
                        fill
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#92DCFF]" />
                          Spatial Arena Volumetrics
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono">
                          UE5 PREVIZ
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {pillar.id !== "precision" && pillar.id !== "audacity" && (
                  <div className="relative z-10 mt-6 pt-5 border-t border-slate-200/70">
                    <div className="space-y-2">
                      {pillar.bullets.map((b) => (
                        <div
                          key={b}
                          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A7F5] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Card Interactive Indicator */}
                <div className="relative z-10 mt-6 pt-4 flex items-center justify-between text-xs font-bold text-[#003E95] group-hover:text-[#00A7F5] transition-colors">
                  <span>Explore Protocol</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Values Banner */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#003E95] via-[#002D6E] to-[#001D47] text-white shadow-diffused-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#92DCFF] text-xs font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-[#00A7F5]" />
              <span>Production Guarantee</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              We Don&apos;t Leave Success to Chance.
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
              Every summit is backed by full redundancy, rigorous timecode stress-tests, and veteran
              live show directors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => scrollTo("#timeline", { offset: -60 })}
              className="px-7 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-[#00A7F5] to-[#92DCFF] text-slate-950 hover:shadow-glow transition-all duration-300 active:scale-95"
            >
              <span>Explore Milestones</span>
            </button>
            <button
              onClick={() => scrollTo("#contact", { offset: -60 })}
              className="px-6 py-3.5 rounded-full font-semibold text-sm text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <span>Request Technical Scope</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
