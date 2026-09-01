"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowDown,
  ArrowUpRight,
  Clock,
  BookOpen,
  Layers,
  Compass,
  TrendingUp,
  Flame,
  CheckCircle2,
  Calendar,
  Share2,
  Bookmark,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";
import { useReveal } from "./RevealProvider";

export default function BlogHero() {
  const { scrollTo } = useSmoothScroll();
  const { setRevealed } = useReveal();

  const sectionRef = useRef<HTMLElement | null>(null);
  const ambientGlowRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const magneticScrollRef = useRef<HTMLButtonElement | null>(null);

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Activate background reveal
  useEffect(() => {
    setRevealed(true);
  }, [setRevealed]);

  // Dynamic ambient glow following mouse movement across the hero section
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

  // 3D Depth Tilt Effect on Featured Spotlight Card with Specular Glare Tracking
  useEffect(() => {
    const card = cardRef.current;
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

      // Realistic 3D angles
      targetTiltX = (percentY - 0.5) * -12;
      targetTiltY = (percentX - 0.5) * 14;

      lightX = percentX * 100;
      lightY = percentY * 100;
    };

    const handleCardPointerEnter = () => {
      setIsCardHovered(true);
    };

    const handleCardPointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      lightX = 50;
      lightY = 50;
      setIsCardHovered(false);
    };

    const loop = () => {
      curTiltX += (targetTiltX - curTiltX) * 0.1;
      curTiltY += (targetTiltY - curTiltY) * 0.1;
      curLightX += (lightX - curLightX) * 0.12;
      curLightY += (lightY - curLightY) * 0.12;

      card.style.transform = `perspective(1200px) rotateX(${curTiltX.toFixed(2)}deg) rotateY(${curTiltY.toFixed(2)}deg) translateZ(8px)`;
      card.style.setProperty("--glare-x", `${curLightX.toFixed(2)}%`);
      card.style.setProperty("--glare-y", `${curLightY.toFixed(2)}%`);

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

  // Magnetic Scroll Indicator Button physics
  useEffect(() => {
    const btn = magneticScrollRef.current;
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
      const radius = 120;

      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.35;
        targetX = dx * pull;
        targetY = dy * pull;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const loop = () => {
      curX += (targetX - curX) * 0.15;
      curY += (targetY - curY) * 0.15;
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

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Initial positions
      gsap.set(".blog-masthead", { opacity: 0, y: 20, scale: 0.96 });
      gsap.set(".blog-split-word", { opacity: 0, yPercent: 120, rotateX: 30 });
      gsap.set(".blog-subhead", { opacity: 0, y: 25 });
      gsap.set(".blog-meta-pill", { opacity: 0, scale: 0.88, y: 15 });
      gsap.set(".blog-spotlight-wrap", { opacity: 0, y: 50, scale: 0.95 });
      gsap.set(".blog-filter-bar", { opacity: 0, y: 25 });
      gsap.set(".blog-scroll-prompt", { opacity: 0, y: 20 });

      // Master choreography timeline
      tl.to(".blog-masthead", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.5)",
      })
        .to(
          ".blog-split-word",
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 1.1,
            stagger: 0.05,
            ease: "power4.out",
          },
          "-=0.5"
        )
        .to(
          ".blog-subhead",
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
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
          ".blog-meta-pill",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.7,
            ease: "back.out(1.4)",
          },
          "-=0.6"
        )
        .to(
          ".blog-spotlight-wrap",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.15,
            ease: "power4.out",
          },
          "-=0.6"
        )
        .to(
          ".blog-filter-bar",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          ".blog-scroll-prompt",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineLine1 = ["Insights,", "Innovations", "&"];
  const headlineLine2 = ["The", "Future", "of", "Event"];
  const headlineLine3 = ["Architecture."];

  return (
    <section
      ref={sectionRef}
      id="blog-hero"
      className="relative w-full min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white"
    >
      {/* Ambient Light-Theme Dynamic Kinetic Glow Background */}
      <div
        ref={ambientGlowRef}
        aria-hidden="true"
        style={
          {
            "--glow-x": "50%",
            "--glow-y": "30%",
          } as React.CSSProperties
        }
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000"
      >
        {/* Cursor tracking radiant orb */}
        <div
          className="absolute w-[850px] h-[850px] rounded-full blur-[140px] opacity-40 transition-transform duration-700 ease-out"
          style={{
            left: "var(--glow-x)",
            top: "var(--glow-y)",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(0, 167, 245, 0.22) 0%, rgba(0, 62, 149, 0.12) 45%, transparent 75%)",
          }}
        />

        {/* Secondary warm accent atmospheric orb */}
        <div className="absolute top-[18%] right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-sky-200/40 via-blue-100/30 to-indigo-100/20 blur-[130px] -z-10 animate-pulse [animation-duration:8s]" />

        {/* Subtle architectural grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #003E95 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* ========================================================= */}
        {/* 1. HIGH-IMPACT EDITORIAL MASTHEAD                         */}
        {/* ========================================================= */}
        <div className="blog-masthead flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_16px_rgba(0,62,149,0.06)] text-xs font-semibold text-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A7F5] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#003E95]" />
            </span>
            <span className="tracking-widest uppercase text-[11px] text-[#003E95] font-bold">
              Impact Journal
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Vol. 04 · Q3 2026</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-sm text-[11px] font-medium text-slate-600 border border-slate-200/60">
            <Sparkles className="w-3 h-3 text-[#00A7F5]" />
            <span>Curated by Impact Spatial & Engineering Labs</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. GSAP SPLIT-TEXT REVEAL HEADLINE                       */}
        {/* ========================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] sm:leading-[1.06]">
            {/* Line 1 */}
            <span className="block overflow-hidden py-1">
              {headlineLine1.map((word, idx) => (
                <span
                  key={`w1-${idx}`}
                  className="blog-split-word inline-block mr-2.5 sm:mr-3.5 will-change-transform bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 bg-clip-text text-transparent"
                >
                  {word}
                </span>
              ))}
            </span>

            {/* Line 2 */}
            <span className="block overflow-hidden py-1">
              {headlineLine2.map((word, idx) => (
                <span
                  key={`w2-${idx}`}
                  className="blog-split-word inline-block mr-2.5 sm:mr-3.5 will-change-transform text-slate-900"
                >
                  {word}
                </span>
              ))}
            </span>

            {/* Line 3 with Vibrant Gradient */}
            <span className="block overflow-hidden py-1">
              {headlineLine3.map((word, idx) => (
                <span
                  key={`w3-${idx}`}
                  className="blog-split-word inline-block will-change-transform bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#3B82F6] bg-clip-text text-transparent font-black"
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Subhead / Editorial Manifesto */}
          <p className="blog-subhead mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Technical dispatches on kinetic engineering, volumetric staging, spatial acoustics,
            and zero-fail show control architected for world-stage corporate summits.
          </p>

          {/* Telemetry Metric Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
            <span className="blog-meta-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50/80 text-[#003E95] border border-blue-200/70">
              <TrendingUp className="w-3 h-3 text-[#00A7F5]" />
              <span>48 Masterclasses</span>
            </span>
            <span className="blog-meta-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100/90 text-slate-700 border border-slate-200/80">
              <BookOpen className="w-3 h-3 text-slate-500" />
              <span>18 Global Contributors</span>
            </span>
            <span className="blog-meta-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50/80 text-sky-800 border border-sky-200/70">
              <CheckCircle2 className="w-3 h-3 text-sky-500" />
              <span>Peer-Reviewed Engineering</span>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. OVERSIZED FEATURED SPOTLIGHT ARTICLE CARD (3D DEPTH)  */}
        {/* ========================================================= */}
        <div className="blog-spotlight-wrap w-full mt-4 mb-10 [perspective:1400px]">
          <div
            ref={cardRef}
            style={
              {
                transformStyle: "preserve-3d",
                "--glare-x": "50%",
                "--glare-y": "50%",
              } as React.CSSProperties
            }
            className="group relative w-full rounded-3xl backdrop-blur-xl bg-white/80 border border-white/90 shadow-[0_24px_70px_-15px_rgba(0,62,149,0.12),0_10px_30px_-10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_36px_90px_-20px_rgba(0,167,245,0.22),0_15px_40px_-10px_rgba(0,62,149,0.08)] cursor-pointer"
          >
            {/* Dynamic Specular Glass Glare Overlay */}
            <div
              className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
              style={{
                opacity: isCardHovered ? 0.35 : 0,
                background: `radial-gradient(circle 500px at var(--glare-x) var(--glare-y), rgba(255, 255, 255, 0.95), transparent 70%)`,
              }}
            />

            {/* Subtle Gradient Accent Rim */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-white/90 via-[#00A7F5]/20 to-transparent pointer-events-none" />

            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                {/* Left Column: Visual Media with Dynamic Zoom */}
              <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] overflow-hidden bg-slate-950">
                <Image
                  src="/images/prev/booth_1.webp"
                  alt="Custom double-decker exhibition stand built at Dubai World Trade Centre"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:brightness-105"
                />

                {/* Ambient vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/20 lg:to-slate-950/70" />

                {/* Floating Glass Tags on Image */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-wrap items-center gap-2 [transform:translateZ(30px)]">
                  {/* Dynamic Glass Tag: Editor's Pick */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-white/85 text-slate-900 text-xs font-bold shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-white/60">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Featured Guide</span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md bg-slate-900/70 text-white text-[11px] font-semibold border border-white/20">
                    <Layers className="w-3 h-3 text-[#00A7F5]" />
                    <span>DWTC / DEC Blueprint</span>
                  </div>
                </div>

                {/* Bottom Overlay Info on Mobile */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white/90 text-xs [transform:translateZ(25px)] lg:hidden">
                  <span className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <Clock className="w-3 h-3 text-[#00A7F5]" /> 8 Min Read
                  </span>
                  <span className="bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    August 2026
                  </span>
                </div>
              </div>

              {/* Right Column: Editorial Details & Author Context */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between backdrop-blur-xl bg-white/90 lg:bg-white/70">
                <div className="[transform:translateZ(20px)]">
                  {/* Category & Reading Time Indicator */}
                  <div className="flex items-center justify-between gap-3 text-xs mb-3.5">
                    <span className="uppercase tracking-widest font-extrabold text-[#003E95] text-[11px] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      Stand Fabrication & Compliance
                    </span>
                    <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-medium text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#00A7F5]" />
                      <span>8 Min Read</span>
                      <span className="text-slate-300">•</span>
                      <span>Aug 24, 2026</span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-slate-900 leading-tight tracking-tight group-hover:text-[#003E95] transition-colors duration-300 mb-3">
                    Navigating DWTC & DEC Stand Guidelines 2026: The Comprehensive Builder&apos;s Guide
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6 line-clamp-3 lg:line-clamp-4">
                    A complete operational roadmap for exhibition organizers and corporate exhibitors: height restrictions, double-decker structural approvals, and Dubai Civil Defense compliance.
                  </p>
                </div>

                {/* Footer Section: Author Avatar + Interaction CTA */}
                <div className="pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 [transform:translateZ(30px)]">
                  {/* Author Avatar & Credential */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#00A7F5]/30 ring-offset-2 shrink-0 bg-slate-200">
                      <Image
                        src="/images/team/marcus-chen.jpg"
                        alt="Tariq Al-Mansoor - Managing Director"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#003E95] transition-colors">
                        Tariq Al-Mansoor
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Managing Director & Founder
                      </div>
                    </div>
                  </div>

                  {/* Read Article Button with Magnetic Arrow Micro-interaction */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBookmarked(!isBookmarked);
                      }}
                      aria-label="Bookmark article"
                      className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#003E95] transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked ? "fill-[#003E95] text-[#003E95]" : ""
                        }`}
                      />
                    </button>

                    <Link
                      href="/blog/navigating-dwtc-dec-stand-guidelines"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 group-hover:bg-[#003E95] text-white text-xs font-semibold transition-all duration-300 shadow-md group-hover:shadow-[0_10px_25px_rgba(0,62,149,0.3)]"
                    >
                      <span>Read Masterclass</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. MAGNETIC SCROLL PROMPT LEADING TO TOOLBAR             */}
        {/* ========================================================= */}
        <div className="blog-scroll-prompt w-full flex items-center justify-center pt-2">
          <button
            ref={magneticScrollRef}
            onClick={() => scrollTo("#blog-toolbar", { offset: -90, duration: 1.2 })}
            aria-label="Scroll to blog filter toolbar and publication stream"
            className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#00A7F5]/40 text-slate-700 hover:text-[#003E95] transition-all duration-300 text-xs font-semibold"
          >
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#003E95] group-hover:text-white transition-colors duration-300">
              <ArrowDown className="w-3 h-3 transition-transform duration-300 group-hover:translate-y-0.5" />
            </div>
            <span>Explore Publication Stream & Filter Articles</span>
          </button>
        </div>
      </div>
    </section>
  );
}
