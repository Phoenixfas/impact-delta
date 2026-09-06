"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Play, X } from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface Stat {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 500, decimals: 0, suffix: "+", label: "Stands & Summits Built" },
  { value: 9, decimals: 0, suffix: " Hubs", label: "Global Country Footprint" },
  { value: 100, decimals: 0, suffix: "%", label: "Triple ISO Certified" },
  { value: 99.8, decimals: 1, suffix: "%", label: "Client Satisfaction" },
];

// Placeholder embed until a real showreel file/link is wired in — Big Buck
// Bunny is the standard neutral, rights-free "this is a placeholder" video
// used across web-dev demos.
const PLACEHOLDER_YOUTUBE_ID = "coBQwwvDVZM";

function formatStat(value: number, decimals: number, suffix: string) {
  const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return `${rounded}${suffix}`;
}

/**
 * Cinematic showreel preview that morphs into a fullscreen video lightbox
 * via GSAP Flip — the same DOM node just gets different layout classes
 * (compact card vs. fixed-fullscreen) applied around a React state flip,
 * and Flip.from() smooths the jump between the two captured rects (size,
 * position, and border-radius) instead of letting it snap.
 */
export default function ShowreelSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const posterWrapRef = useRef<HTMLDivElement | null>(null);
  const cursorBadgeRef = useRef<HTMLDivElement | null>(null);
  const cursorSetters = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  // Mounted only once the Flip "grow" animation finishes, and unmounted
  // immediately on close — so the video never visibly stretches/squashes
  // mid-morph, and the static poster is what's shown during the transition.
  const [showVideo, setShowVideo] = useState(false);

  const { lenis } = useSmoothScroll();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);
    const ctx = gsap.context(() => {
      // Sequenced reveal: heading, then the card, then the stats cascade in —
      // rather than everything fading in as one flat block.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      tl.set(".showreel-heading", { opacity: 0, y: 28 })
        .set(".showreel-card-wrap", { opacity: 0, y: 40, scale: 0.95 })
        .set(".showreel-stat", { opacity: 0, y: 20 })
        .to(".showreel-heading", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(
          ".showreel-card-wrap",
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        )
        .to(
          ".showreel-stat",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
          "-=0.45"
        );

      // Slightly exaggerated parallax drift on the poster — bled well
      // beyond the card's edges so the translate never exposes a gap.
      gsap.to(posterWrapRef.current, {
        yPercent: 22,
        scale: 1.18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      STATS.forEach((stat, i) => {
        const el = valueRefs.current[i];
        if (!el) return;
        const counter = { value: 0 };
        gsap.to(counter, {
          value: stat.value,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".showreel-stats", start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = formatStat(counter.value, stat.decimals, stat.suffix);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Custom cursor badge chase, local to the card (not the whole page).
  useEffect(() => {
    if (!cursorBadgeRef.current) return;
    cursorSetters.current = {
      x: gsap.quickTo(cursorBadgeRef.current, "x", { duration: 0.4, ease: "power3.out" }),
      y: gsap.quickTo(cursorBadgeRef.current, "y", { duration: 0.4, ease: "power3.out" }),
    };
  }, []);

  // Runs after React has committed the new (open/closed) layout classes,
  // so Flip.from can read the real post-change rect and animate from the
  // rect captured just before setIsOpen() in the click handlers below.
  useLayoutEffect(() => {
    if (!flipStateRef.current || !containerRef.current) return;
    const state = flipStateRef.current;
    flipStateRef.current = null;

    Flip.from(state, {
      duration: 0.85,
      ease: "power4.inOut",
      scale: true,
      props: "borderRadius",
      onComplete: () => {
        if (isOpen) setShowVideo(true);
      },
    });
  }, [isOpen]);

  const openShowreel = () => {
    if (!containerRef.current) return;
    flipStateRef.current = Flip.getState(containerRef.current, { props: "borderRadius" });
    lenis?.stop();
    setIsOpen(true);
  };

  const closeShowreel = () => {
    if (!containerRef.current) return;
    flipStateRef.current = Flip.getState(containerRef.current, { props: "borderRadius" });
    setShowVideo(false);
    lenis?.start();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeShowreel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorSetters.current?.x(e.clientX - rect.left);
    cursorSetters.current?.y(e.clientY - rect.top);
  };

  return (
    <section
      id="showreel"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="showreel-heading relative max-w-5xl mx-auto mb-10 lg:mb-14 text-center">
        <span className="inline-block px-3 py-1 mb-5 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-semibold tracking-wide">
          Cinematic Production Showcase
        </span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
          Watch Our Productions <span className="text-gradient">Come To Life.</span>
        </h2>
      </div>

      {/* Fixed-height placeholder preserves layout space in the section even
          once containerRef switches to `fixed` (removed from normal flow). */}
      <div className="showreel-card-wrap relative max-w-5xl mx-auto aspect-video mb-10 lg:mb-14">
        <div
          ref={containerRef}
          onClick={!isOpen ? openShowreel : undefined}
          onPointerMove={handleCardMove}
          className={
            isOpen
              ? "fixed inset-0 z-[100] rounded-none overflow-hidden bg-black"
              : "group absolute inset-0 rounded-[32px] overflow-hidden shadow-diffused-xl showreel-hover-none cursor-pointer"
          }
        >
          <div ref={posterWrapRef} className="absolute -inset-y-[24%] inset-x-0">
            <Image
              src="/images/prev/atss-1-landscape.webp"
              alt="Impact Makers Events cinematic showreel — luxury exhibition stand fabrication and concert stagecraft"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${showVideo ? "opacity-0" : "opacity-100"
                }`}
            />
          </div>

          {isOpen && showVideo && (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${PLACEHOLDER_YOUTUBE_ID}?autoplay=1&controls=0&loop=1&mute=1&rel=0`}
              title="Showreel placeholder video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Ambient lighting overlays */}
          {!showVideo && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent pointer-events-none" />
          )}
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.35),transparent_70%)] blur-2xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.35),transparent_70%)] blur-2xl pointer-events-none"
          />

          {!isOpen && (
            <>
              {/* Center play affordance, compact state */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-diffused-lg">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Custom cursor badge — outer div is what gsap.quickTo moves,
                  inner div owns both the static -50%/-50% centering transform
                  (so it never fights the quickTo x/y for the same property)
                  and the group-hover opacity, so it's driven by the browser's
                  own live :hover state rather than a React flag that can go
                  stale across the Flip layout swap. */}
              <div ref={cursorBadgeRef} className="absolute top-0 left-0 z-10 pointer-events-none">
                <div className="-translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-diffused-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Play className="w-3.5 h-3.5 text-[#003E95] fill-[#003E95]" />
                  <span className="text-xs font-bold text-slate-900 tracking-wide">PLAY</span>
                </div>
              </div>
            </>
          )}

          {isOpen && (
            <button
              onClick={closeShowreel}
              aria-label="Close showreel"
              className="absolute top-6 right-6 z-10 flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="showreel-stats relative max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="showreel-stat glass-card rounded-2xl px-4 py-5 text-center">
            <div
              className="text-2xl sm:text-3xl font-black text-slate-900"
              ref={(el) => {
                valueRefs.current[i] = el;
              }}
            >
              {formatStat(0, stat.decimals, stat.suffix)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
