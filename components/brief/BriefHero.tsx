"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";
import { useReveal } from "@/components/RevealProvider";

export default function BriefHero() {
  const { setRevealed } = useReveal();
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Activate global background reveal on mount
  useEffect(() => {
    setRevealed(true);
  }, [setRevealed]);

  // GSAP Entrance Reveal for Brief Hero
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".brief-hero-badge",
        { opacity: 0, y: 16, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1 }
      )
        .fromTo(
          ".brief-hero-title",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.35"
        )
        .fromTo(
          ".brief-hero-desc",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
      {/* Badge */}
      <div className="brief-hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs mb-4">
        <span className="w-2 h-2 rounded-full bg-[#00A7F5] animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#003E95] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
          Exhibition & Summit Engineering
        </span>
      </div>

      {/* Title */}
      <h1 className="brief-hero-title text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
        Stand Brief <span className="text-gradient">Wizard</span>
      </h1>

      {/* Description */}
      <p className="brief-hero-desc mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
        Submit your exhibition booth dimensions, design language, AV requirements,
        and timeline for custom 3D architectural rendering and production scoping.
      </p>
    </div>
  );
}
