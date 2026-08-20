"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Play, Sparkles, Award, Globe, Zap } from "lucide-react";
import ParticleRevealMask from "./hero/ParticleRevealMask";
import HeroImageStack from "./hero/HeroImageStack";
import HeroSideAccents from "./hero/HeroSideAccents";
import HeroImageLightbox, { type LightboxItem } from "./hero/HeroImageLightbox";
import BrushRingArc, { type BrushRingArcHandle } from "./hero/BrushRingArc";
import { FRONT_ARC_D, BACK_ARC_D } from "./hero/brushRingGeometry";
import { useSmoothScroll } from "./SmoothScroll";
import { useReveal } from "./RevealProvider";

const ENTRANCE_TARGETS = ".hero-eyebrow, .hero-split-word, .hero-subtitle, .hero-cta-group, .hero-proof-strip";

export default function HeroSection() {
  const { scrollTo } = useSmoothScroll();
  const { setRevealed } = useReveal();
  const heroRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const brushFrontRef = useRef<BrushRingArcHandle | null>(null);
  const brushBackRef = useRef<BrushRingArcHandle | null>(null);

  const [revealKey, setRevealKey] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  // Cinematic cursor-reactive gradient glow — position + angle both lerp
  // gently toward the pointer so the light never snaps.
  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;

    let targetX = 50;
    let targetY = 32;
    let targetAngle = 135;
    let curX = 50;
    let curY = 32;
    let curAngle = 135;
    let rafId = 0;

    const handleMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      targetX = relX * 100;
      targetY = relY * 100;
      targetAngle = 135 + (relX - 0.5) * 70 + (relY - 0.5) * 40;
    };

    const loop = () => {
      curX += (targetX - curX) * 0.045;
      curY += (targetY - curY) * 0.045;
      curAngle += (targetAngle - curAngle) * 0.03;
      glow.style.setProperty("--glow-x", `${curX.toFixed(2)}%`);
      glow.style.setProperty("--glow-y", `${curY.toFixed(2)}%`);
      glow.style.setProperty("--glow-angle", `${curAngle.toFixed(2)}deg`);
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll parallax on the headline + ambient glow as the user leaves the hero.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (!heroRef.current) return;
      gsap.to(headlineRef.current, {
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        y: -80,
        opacity: 0.5,
        ease: "none",
      });
      gsap.to(glowRef.current, {
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        opacity: 0.3,
        ease: "none",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Hides every piece of the page's entrance choreography — not just the
  // hero's own text/imagery, but the Navbar nodes and hero side accents too,
  // via their shared class hooks — so a replay resets the whole composition.
  const resetEntranceState = useCallback(() => {
    gsap.set(ENTRANCE_TARGETS, { opacity: 0, y: 30 });
    gsap.set(".hero-stack-card", { opacity: 0, filter: "blur(14px)" });
    gsap.set(".nav-entrance-node", { opacity: 0, y: -14, scale: 0.9 });
    gsap.set(".side-accent-card", { opacity: 0, y: 16, scale: 0.75 });
    setRevealed(false);
  }, [setRevealed]);

  useEffect(() => {
    resetEntranceState();
  }, [resetEntranceState]);

  // Fired once the particle mask finishes dissolving — the reveal continues
  // straight into the kinetic typography + image-stack + CTA stagger, and
  // pulls the Navbar nodes, side accents, and brush-stroke ring in with it.
  const handleRevealComplete = () => {
    setRevealed(true);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero-stack-card", { opacity: 1, filter: "blur(0px)", duration: 1.1, stagger: 0.14 })
      .add(() => {
        brushBackRef.current?.play();
        brushFrontRef.current?.play();
      }, "<0.2")
      .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.7 }, "-=0.9")
      .to(".hero-split-word", { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: "back.out(1.5)" }, "-=0.6")
      .to(".nav-entrance-node", { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.8, ease: "back.out(1.6)" }, "-=0.9")
      .to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
      .to(".hero-cta-group", { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
      .to(".side-accent-card", { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.9, ease: "back.out(1.4)" }, "-=0.6")
      .to(".hero-proof-strip", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5");
  };

  const handleReplay = () => {
    resetEntranceState();
    setRevealKey((k) => k + 1);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Cinematic dynamic background: primary -> tertiary glow that drifts with the cursor */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px circle at var(--glow-x, 50%) var(--glow-y, 32%), rgba(0,167,245,0.16), rgba(0,62,149,0.10) 45%, transparent 72%), linear-gradient(var(--glow-angle, 135deg), rgba(0,62,149,0.08), rgba(146,220,255,0.07))",
        }}
      />

      <ParticleRevealMask key={revealKey} onRevealComplete={handleRevealComplete} />

      <HeroSideAccents onOpen={setLightboxItem} />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        {/* Live-status eyebrow badge, centered above the headline */}
        <div className="hero-eyebrow flex items-center gap-2 px-4 py-2 mb-8 sm:mb-10 rounded-full backdrop-blur-md bg-white/70 border border-slate-200/70 shadow-diffused-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A7F5] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A7F5]" />
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600">
            Now Orchestrating <span className="text-gradient font-bold">2026</span> Global Summits
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
        </div>

        {/* Kinetic typography layered over/behind the glass image stack via mix-blend-mode */}
        <div className="relative w-full flex flex-col items-center">
          <h1
            ref={headlineRef}
            className="relative z-20 text-center font-black tracking-tight select-none text-glow-black"
          >
            <span className="hero-split-word block text-5xl sm:text-7xl lg:text-8xl leading-[0.95]">
              <span className="font-script tracking-normal text-white text-stroke-white">
                Creating
              </span>{" "}
              <span className="text-gradient text-stroke-white">IMPACT</span>
            </span>
            <span className="hero-split-word block text-5xl sm:text-7xl lg:text-8xl leading-[0.95]">
              <span className="text-gradient text-stroke-white">INSPIRING</span>{" "}
              <span className="font-script tracking-normal text-white text-stroke-white">
                Events
              </span>
            </span>
          </h1>

          <div className="relative z-10 -mt-16 sm:-mt-24 lg:-mt-32 w-full max-w-xl mx-auto">
            {/* Back strand of the rope — sits behind the cards */}
            <BrushRingArc
              ref={brushBackRef}
              resetKey={revealKey}
              d={BACK_ARC_D}
              className="absolute left-[-38%] right-[-38%] top-[30%] bottom-[30%] z-0 pointer-events-none"
              strokeWidth={34}
              shadowWidth={46}
              highlightWidth={7}
              dim
            />

            <HeroImageStack onOpen={setLightboxItem} />

            {/* Front strand of the rope — sits above the cards, completing the wrap */}
            <BrushRingArc
              ref={brushFrontRef}
              resetKey={revealKey}
              d={FRONT_ARC_D}
              className="absolute left-[-38%] right-[-38%] top-[30%] bottom-[30%] z-30 pointer-events-none"
              strokeWidth={38}
              shadowWidth={52}
              highlightWidth={8}
            />
          </div>
        </div>

        <p className="hero-subtitle max-w-2xl text-center text-base sm:text-lg text-slate-600 leading-relaxed mt-10 sm:mt-14 mb-8">
          We engineer award-winning spatial summits, sensory keynotes, and high-impact B2B brand worlds where kinetic light, 3D architecture, and human emotion converge.
        </p>

        <div className="hero-cta-group flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollTo("#portfolio", { offset: -60 })}
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full font-bold text-sm sm:text-base text-white overflow-hidden shadow-[0_16px_36px_-8px_rgba(0,62,149,0.35)] transition-all duration-300 hover:shadow-[0_24px_50px_-8px_rgba(0,167,245,0.5)] active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />
            <span className="relative z-10 tracking-wide">EXPERIENCE THE IMPACT</span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={handleReplay}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-sm text-slate-700 hover:text-slate-950 backdrop-blur-md bg-slate-100/70 hover:bg-white/90 border border-slate-200/80 hover:border-slate-300 transition-all duration-200 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#00A7F5]" />
            <span>Watch Showreel</span>
          </button>
        </div>

        <div className="hero-proof-strip w-full max-w-4xl mt-12 pt-6 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
              <span>500+</span>
              <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Global Summits Produced</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
              <span>99.8%</span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Enterprise Satisfaction</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
              <span>120+</span>
              <Globe className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-xs text-slate-500 font-medium">International Venues</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
              <span>$4.2B+</span>
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <span className="text-xs text-slate-500 font-medium">Client Pipeline Generated</span>
          </div>
        </div>
      </div>

      <HeroImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </section>
  );
}
