"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowDown,
  Layers,
  Compass,
  Zap,
  Globe2,
  Award,
  ChevronRight,
  Shield,
  Maximize2,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";
import { useReveal } from "./RevealProvider";
import HeroImageLightbox, { type LightboxItem } from "./hero/HeroImageLightbox";

const PREVIZ_LIGHTBOX_ITEM: LightboxItem = {
  src: "/images/prev/atss-1-landscape.webp",
  alt: "Flagship two-story double-decker exhibition pavilion engineered by Impact Makers Events",
  title: "Interactive Spatial Previz // Double-Decker Pavilion",
  description:
    "Where architectural form meets engineering rigor. Designed with organic structural curves, illuminated perimeter reveals, and an elevated VIP mezzanine lounge suite.",
};

export default function AboutHero() {
  const { scrollTo } = useSmoothScroll();
  const { setRevealed } = useReveal();

  const sectionRef = useRef<HTMLElement | null>(null);
  const ambientGlowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const visualCardRef = useRef<HTMLDivElement | null>(null);
  const magneticButtonRef = useRef<HTMLButtonElement | null>(null);
  const ringRef = useRef<SVGSVGElement | null>(null);

  // Mouse & 3D tilt coordinates
  const [isHoveringVisual, setIsHoveringVisual] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  // Activate global background reveal on mount
  useEffect(() => {
    setRevealed(true);
  }, [setRevealed]);

  // Dynamic ambient glow following mouse across the hero section
  useEffect(() => {
    const section = sectionRef.current;
    const glow = ambientGlowRef.current;
    if (!section || !glow) return;

    let targetX = 50;
    let targetY = 35;
    let curX = 50;
    let curY = 35;
    let rafId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      targetX = relX * 100;
      targetY = relY * 100;
    };

    const loop = () => {
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
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

  // 3D Tilt & Specular Dynamic Light reflection on Central Glass Visual Node
  useEffect(() => {
    const card = visualCardRef.current;
    if (!card) return;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let curTiltX = 0;
    let curTiltY = 0;
    let lightX = 50;
    let lightY = 50;
    let curLightX = 50;
    let curLightY = 50;
    let rafId = 0;

    const handleCardPointerMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = x / rect.width;
      const percentY = y / rect.height;

      // 3D rotation angles (-12 to +12 degrees)
      targetTiltX = (percentY - 0.5) * -16;
      targetTiltY = (percentX - 0.5) * 18;

      lightX = percentX * 100;
      lightY = percentY * 100;
    };

    const handleCardPointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      lightX = 50;
      lightY = 50;
      setIsHoveringVisual(false);
    };

    const handleCardPointerEnter = () => {
      setIsHoveringVisual(true);
    };

    const loop = () => {
      curTiltX += (targetTiltX - curTiltX) * 0.1;
      curTiltY += (targetTiltY - curTiltY) * 0.1;
      curLightX += (lightX - curLightX) * 0.12;
      curLightY += (lightY - curLightY) * 0.12;

      card.style.transform = `perspective(1100px) rotateX(${curTiltX.toFixed(2)}deg) rotateY(${curTiltY.toFixed(2)}deg) translateZ(10px)`;
      card.style.setProperty("--light-x", `${curLightX.toFixed(2)}%`);
      card.style.setProperty("--light-y", `${curLightY.toFixed(2)}%`);

      rafId = requestAnimationFrame(loop);
    };

    card.addEventListener("pointermove", handleCardPointerMove, { passive: true });
    card.addEventListener("pointerenter", handleCardPointerEnter);
    card.addEventListener("pointerleave", handleCardPointerLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      card.removeEventListener("pointermove", handleCardPointerMove);
      card.removeEventListener("pointerenter", handleCardPointerEnter);
      card.removeEventListener("pointerleave", handleCardPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Magnetic Physics for Scroll Indicator Button
  useEffect(() => {
    const btn = magneticButtonRef.current;
    if (!btn) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 130;

      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.38;
        targetX = dx * pull;
        targetY = dy * pull;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const loop = () => {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      btn.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // GSAP Entrance Choreography with Split-Text Reveal
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Master entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Initial states
      gsap.set(".about-eyebrow", { opacity: 0, y: 24, scale: 0.95 });
      gsap.set(".about-split-word", { opacity: 0, yPercent: 120, rotateX: 35 });
      gsap.set(".about-description", { opacity: 0, y: 30 });
      gsap.set(".about-metric-chip", { opacity: 0, scale: 0.85, y: 15 });
      gsap.set(".about-visual-node-wrap", { opacity: 0, y: 45, scale: 0.94 });
      gsap.set(".about-floating-badge", { opacity: 0, scale: 0.75, y: 20 });
      gsap.set(".about-scroll-indicator", { opacity: 0, y: 30 });

      // Animation sequence
      tl.to(".about-eyebrow", { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.6)" })
        .to(
          ".about-split-word",
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 1.15,
            stagger: 0.07,
            ease: "power4.out",
          },
          "-=0.5"
        )
        .to(
          ".about-description",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          ".nav-entrance-node",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: "back.out(1.6)",
          },
          "-=0.8"
        )
        .to(
          ".about-metric-chip",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.75,
            ease: "back.out(1.4)",
          },
          "-=0.6"
        )
        .to(
          ".about-visual-node-wrap",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          ".about-floating-badge",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.85,
            ease: "back.out(1.5)",
          },
          "-=0.7"
        )
        .to(
          ".about-scroll-indicator",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        );

      // Continuous subtle idle rotation for floating 3D ring
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          rotation: 360,
          duration: 32,
          repeat: -1,
          ease: "none",
        });
      }

      // Parallax scroll scrub as user departs the hero
      gsap.to(".about-headline-container", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -90,
        opacity: 0.35,
      });

      gsap.to(".about-visual-node-wrap", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        y: 60,
        scale: 0.95,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToTimeline = () => {
    scrollTo("#timeline", { offset: -60, duration: 1.2 });
  };

  return (
    <section
      id="about-hero"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-between pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-[#003E95] selection:text-white"
    >
      {/* Dynamic Cursor Reactive Ambient Glow */}
      <div
        ref={ambientGlowRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(1000px circle at var(--glow-x, 50%) var(--glow-y, 35%), rgba(0,167,245,0.14), rgba(0,62,149,0.08) 45%, transparent 72%), radial-gradient(800px circle at 80% 80%, rgba(146,220,255,0.12), transparent 60%)",
        }}
      />

      {/* Atmospheric Editorial Grid / Alignment Lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
      />

      {/* Ambient Top Light Flare */}
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#00A7F5]/15 via-[#92DCFF]/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10"
      />

      {/* =========================================================================
          MAIN EDITORIAL HERO CONTENT CONTAINER
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">

        {/* Top Editorial Eyebrow Badge */}
        <div className="about-eyebrow inline-flex items-center gap-2.5 px-4 py-2 mb-6 sm:mb-8 rounded-full backdrop-blur-md bg-white/80 border border-slate-200/80 shadow-diffused-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A7F5] opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#003E95]" />
          </span>
          <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-slate-700">
            Impact Makers Events <span className="text-slate-300 mx-1.5">•</span>
            <span className="text-gradient font-black">Connecting Businesses Worldwide</span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
        </div>

        {/* High-Impact Editorial Split Headline */}
        <div className="about-headline-container relative max-w-5xl mx-auto [perspective:1000px]">
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1.02] sm:leading-[0.98] select-none text-glow-black"
          >
            {/* First Line */}
            <div className="block overflow-hidden py-1">
              <span className="about-split-word inline-block mr-2 sm:mr-4 font-black">
                From Concept
              </span>
              <span className="about-split-word inline-block text-gradient">
                To Reality,
              </span>
            </div>

            {/* Second Line */}
            <div className="block overflow-hidden py-1">
              <span className="about-split-word inline-block mr-2 sm:mr-4 font-script text-white text-stroke-white tracking-normal font-normal text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
                Crafting
              </span>
              <span className="about-split-word inline-block text-gradient">
                Spaces That Bring
              </span>{" "}
              <span className="about-split-word inline-block font-black text-slate-900">
                Brands to Life.
              </span>
            </div>
          </h1>

          {/* Editorial Subtitle / Manifesto Intro */}
          <p className="about-description mt-6 sm:mt-8 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed">
            Headquartered in Dubai with operations across 9 countries,{" "}
            <span className="text-slate-900 font-semibold">Impact Makers Events L.L.C</span> is a premier exhibition stand builder, event management powerhouse, and audiovisual specialist. We deliver{" "}
            <span className="text-[#003E95] font-semibold">Triple ISO-certified excellence</span> from initial 3D design to turnkey on-site handover.
          </p>

          {/* Quick Pillar Micro-Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { icon: Compass, text: "In-House Workshop & CNC" },
              { icon: Shield, text: "Triple ISO (9001/14001/45001)" },
              { icon: Globe2, text: "9 Global Country Hubs" },
              { icon: Award, text: "Turnkey Event SLA" },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.text}
                  className="about-metric-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-md border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs hover:border-[#00A7F5]/40 hover:bg-white transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5 text-[#00A7F5]" />
                  <span>{pillar.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            CENTRAL INTERACTIVE VISUAL NODE (3D Glass Card with Refraction & Orbit)
            ========================================================================= */}
        <div className="about-visual-node-wrap relative w-full max-w-4xl mx-auto mt-12 sm:mt-16 px-4 sm:px-6 overflow-visible [perspective:1400px]">
          {/* Enhanced 3D Rotating Orbital Ring in background (Bigger & More Visible) */}
          <div className="absolute -inset-16 sm:-inset-28 md:-inset-36 pointer-events-none flex items-center justify-center -z-10">
            <svg
              ref={ringRef}
              viewBox="0 0 800 800"
              className="w-full h-full max-w-[880px] max-h-[880px] opacity-65 sm:opacity-85 transition-opacity duration-500"
            >
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#003E95" stopOpacity="0.9" />
                  <stop offset="35%" stopColor="#00A7F5" stopOpacity="1" />
                  <stop offset="70%" stopColor="#92DCFF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#003E95" stopOpacity="0.35" />
                </linearGradient>
                <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Orbit Track */}
              <circle
                cx="400"
                cy="400"
                r="340"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="3"
                strokeDasharray="16 20"
                filter="url(#ringGlow)"
              />

              {/* Inner Accent Arc */}
              <circle
                cx="400"
                cy="400"
                r="305"
                fill="none"
                stroke="rgba(0, 167, 245, 0.45)"
                strokeWidth="2"
                strokeDasharray="6 12"
              />

              {/* Tertiary Subtle Orbit */}
              <circle
                cx="400"
                cy="400"
                r="365"
                fill="none"
                stroke="rgba(146, 220, 255, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 16"
              />

              {/* Glowing Orbital Nodes */}
              <circle cx="740" cy="400" r="7" fill="#00A7F5" filter="url(#ringGlow)" />
              <circle cx="60" cy="400" r="6" fill="#92DCFF" filter="url(#ringGlow)" />
              <circle cx="400" cy="60" r="8" fill="#003E95" filter="url(#ringGlow)" />
              <circle cx="400" cy="740" r="6" fill="#00A7F5" filter="url(#ringGlow)" />
            </svg>
          </div>

          {/* Central 3D Interactive Tilt Card with Specular Light Reflection */}
          <div
            ref={visualCardRef}
            className="group relative rounded-3xl sm:rounded-[36px] p-2.5 sm:p-4 transition-shadow duration-500 will-change-transform shadow-diffused-xl border border-white/80 bg-white/50 backdrop-blur-xl hover:shadow-[0_30px_90px_-15px_rgba(0,62,149,0.22)] cursor-pointer overflow-visible"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Dynamic Specular Sheen Layer (Follows Mouse Coordinates) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-3xl sm:rounded-[36px]"
              style={{
                opacity: isHoveringVisual ? 0.9 : 0.45,
                background:
                  "radial-gradient(circle 380px at var(--light-x, 50%) var(--light-y, 50%), rgba(255,255,255,0.75) 0%, rgba(146,220,255,0.25) 35%, transparent 70%)",
              }}
            />

            {/* Inner Glass Frame */}
            <div className="relative rounded-2xl sm:rounded-[28px] overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-slate-950 border border-slate-200/40">
              {/* Architectural Double-Decker Pavilion Image */}
              <Image
                src="/images/prev/atss-1-landscape.webp"
                alt="Flagship two-story double-decker exhibition pavilion engineered by Impact Makers Events"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Multi-layered Cinematic Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-900/40 mix-blend-multiply" />
              <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(15,23,42,0.6)_100%]" />

              {/* Glass Frosted Grid Texture */}
              <div
                className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* In-Card Content: Header Badge & Status Indicator */}
              <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-diffused-sm">
                  <Layers className="w-3.5 h-3.5 text-[#00A7F5]" />
                  <span>Interactive Spatial Previz</span>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>3D STAGE ACTIVE</span>
                </div>
              </div>

              {/* In-Card Content: Center Brand Monogram & Interactive Pulse Button */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="relative flex items-center justify-center pointer-events-auto">
                  {/* Concentric expanding ripples on card hover */}
                  <span className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-white/20 animate-ping opacity-30 pointer-events-none" />
                  <span className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-[#00A7F5]/40 opacity-50 pointer-events-none" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxItem(PREVIZ_LIGHTBOX_ITEM);
                    }}
                    aria-label="Open fullscreen spatial previz view"
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-diffused-lg group-hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <Maximize2 className="w-6 h-6 text-white group-hover:text-[#92DCFF] transition-colors" />
                  </button>
                </div>
              </div>

              {/* In-Card Content: Bottom Narrative Bar */}
              <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20 text-left pointer-events-none">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                  <div>
                    <div className="text-[11px] font-mono tracking-widest text-[#92DCFF] uppercase">
                      STUDIO PHILOSOPHY // 2026 EDITION
                    </div>
                    <div className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                      Where Architectural Form Meets Human Emotion
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxItem(PREVIZ_LIGHTBOX_ITEM);
                    }}
                    className="pointer-events-auto flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/20 self-start sm:self-auto transition-all cursor-pointer"
                  >
                    <span>View Fullscreen Previz</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A7F5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Top-Right 3D Spec Pill */}
            <div className="about-floating-badge absolute -top-4 sm:-top-5 -right-1 sm:-right-4 z-40 flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl glass-card-elevated border border-white/95 shadow-diffused-lg pointer-events-none">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#003E95] to-[#00A7F5] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Triple ISO Certified</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">9001 • 14001 • 45001</div>
              </div>
            </div>

            {/* Floating Bottom-Left 3D Metric Pill */}
            <div className="about-floating-badge absolute -bottom-4 sm:-bottom-5 -left-1 sm:-left-4 z-40 flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl glass-card-elevated border border-white/95 shadow-diffused-lg pointer-events-none">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#00A7F5] to-[#92DCFF] flex items-center justify-center text-[#003E95] shrink-0 shadow-2xs font-black text-xs">
                9
              </div>
              <div className="text-left">
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Global Hubs</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">500+ Stands Built</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAGNETIC SMOOTH-SCROLL BUTTON / SCROLL INDICATOR
          ========================================================================= */}
      <div className="about-scroll-indicator relative z-20 mt-14 sm:mt-18 flex flex-col items-center">
        <button
          ref={magneticButtonRef}
          onClick={handleScrollToTimeline}
          aria-label="Scroll to narrative timeline"
          className="group relative flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full backdrop-blur-xl bg-white/80 hover:bg-white border border-slate-200/90 hover:border-[#00A7F5]/50 shadow-diffused-md hover:shadow-diffused-xl transition-all duration-300 cursor-pointer active:scale-95"
        >
          {/* Subtle Button Hover Glow Aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#003E95]/0 via-[#00A7F5]/10 to-[#92DCFF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Animated Bouncing Arrow Down Icon */}
          <div className="relative w-8 h-8 rounded-full bg-[#003E95]/10 group-hover:bg-[#003E95] text-[#003E95] group-hover:text-white flex items-center justify-center transition-colors duration-300">
            <ArrowDown className="w-4 h-4 animate-bounce group-hover:animate-none group-hover:translate-y-0.5 transition-transform duration-200" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#003E95] transition-colors">
              Explore Narrative Timeline
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Discover our milestones & vision (2014—2026)
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A7F5] group-hover:translate-x-0.5 transition-all duration-200" />
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <HeroImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </section>
  );
}
