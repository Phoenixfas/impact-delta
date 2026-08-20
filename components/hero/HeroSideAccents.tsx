"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Activity, Maximize2 } from "lucide-react";
import type { LightboxItem } from "./HeroImageLightbox";

interface PhotoAccent {
  kind: "photo";
  src: string;
  alt: string;
  tag: string;
  stat: string;
}

interface OrbitAccent {
  kind: "orbit";
  label: string;
  stat: string;
}

type AccentData = (PhotoAccent | OrbitAccent) & {
  side: "left" | "right";
  topPercent: number;
  baseRotate: number;
};

const ACCENTS: AccentData[] = [
  {
    kind: "photo",
    src: "/images/summit-keynote.jpg",
    alt: "Stadium-scale keynote light show",
    tag: "Global AI Summit",
    stat: "16,500 Seats",
    side: "left",
    topPercent: 16,
    baseRotate: -7,
  },
  {
    kind: "photo",
    src: "/images/kinetic-installation.jpg",
    alt: "Kinetic chandelier gala installation",
    tag: "Luxury Gala",
    stat: "400 Kinetic Prisms",
    side: "left",
    topPercent: 58,
    baseRotate: 5,
  },
  {
    kind: "photo",
    src: "/images/executive-pavilion.jpg",
    alt: "Executive summit pavilion atrium",
    tag: "Executive Pavilion",
    stat: "120+ Countries",
    side: "right",
    topPercent: 18,
    baseRotate: 6,
  },
  {
    kind: "orbit",
    label: "Live Global Ops",
    stat: "24/7 Show Control",
    side: "right",
    topPercent: 60,
    baseRotate: -3,
  },
];

interface CardState {
  baseX: number;
  baseY: number;
  rotCur: number;
  scaleCur: number;
}

/**
 * Fills the wide hero gutters with rotated, physically-reactive cards —
 * live-project photo tiles and an animated "live ops" orbit widget — that
 * idle-drift, straighten and lift on hover, and pull toward the cursor.
 */
interface HeroSideAccentsProps {
  onOpen: (item: LightboxItem) => void;
}

export default function HeroSideAccents({ onOpen }: HeroSideAccentsProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stateRef = useRef<CardState[]>(
    ACCENTS.map((a) => ({ baseX: 0, baseY: 0, rotCur: a.baseRotate, scaleCur: 1 }))
  );
  const hoveredRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const prevTransform = el.style.transform;
        el.style.transform = "none";
        const rect = el.getBoundingClientRect();
        stateRef.current[i].baseX = rect.left + rect.width / 2;
        stateRef.current[i].baseY = rect.top + rect.height / 2;
        el.style.transform = prevTransform;
      });
    };

    measure();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measure, 150);
    };

    const mouse = { x: -2000, y: -2000 };
    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const start = performance.now();
    let rafId = 0;

    const loop = (now: number) => {
      const t = (now - start) / 1000;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const accent = ACCENTS[i];
        const state = stateRef.current[i];
        const isHovered = hoveredRef.current === i;

        const bobY = Math.sin(t * 0.6 + i * 1.3) * 9;
        const wobble = Math.sin(t * 0.4 + i * 2.1) * 3;

        const dx = mouse.x - state.baseX;
        const dy = mouse.y - (state.baseY + bobY);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const radius = 210;
        const maxPull = 18;

        let pullX = 0;
        let pullY = 0;
        if (dist < radius) {
          const strength = 1 - dist / radius;
          pullX = (dx / dist) * maxPull * strength;
          pullY = (dy / dist) * maxPull * strength;
        }

        const targetRotate = isHovered ? 0 : accent.baseRotate + wobble;
        state.rotCur += (targetRotate - state.rotCur) * 0.07;

        const targetScale = isHovered ? 1.1 : 1;
        state.scaleCur += (targetScale - state.scaleCur) * 0.12;

        el.style.transform = `translate3d(${pullX.toFixed(2)}px, ${(bobY + pullY).toFixed(2)}px, 0) rotate(${state.rotCur.toFixed(2)}deg) scale(${state.scaleCur.toFixed(3)})`;
        el.style.zIndex = isHovered ? "30" : "10";
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className="absolute inset-0 hidden xl:block pointer-events-none z-0" aria-hidden="true">
      {ACCENTS.map((accent, i) => (
        <div
          key={accent.kind === "photo" ? accent.tag : accent.label}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onPointerEnter={() => {
            hoveredRef.current = i;
          }}
          onPointerLeave={() => {
            hoveredRef.current = null;
          }}
          className={`group absolute w-40 pointer-events-auto will-change-transform ${
            accent.side === "left" ? "left-4 2xl:left-10" : "right-4 2xl:right-10"
          }`}
          style={{ top: `${accent.topPercent}%` }}
        >
          {accent.kind === "photo" ? (
            <div
              onClick={() =>
                onOpen({ src: accent.src, alt: accent.alt, title: accent.tag, description: accent.stat })
              }
              className="side-accent-card p-2 pb-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-diffused-lg group-hover:shadow-diffused-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-900">
                <Image
                  src={accent.src}
                  alt={accent.alt}
                  fill
                  sizes="160px"
                  className="object-cover grayscale-[60%] group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00A7F5] shadow-[0_0_0_2px_rgba(255,255,255,0.8)]" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md bg-white/25 border border-white/40 text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </span>
              </div>
              <div className="pt-2 px-1">
                <div className="text-xs font-bold text-slate-800 leading-tight">{accent.tag}</div>
                <div className="text-[10px] text-slate-500 font-medium">{accent.stat}</div>
              </div>
              {/* Decorative corner tape accent */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3.5 rounded-sm bg-[#00A7F5]/25 border border-white/40 -rotate-2" />
            </div>
          ) : (
            <div className="side-accent-card flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-diffused-lg group-hover:shadow-diffused-xl transition-shadow duration-300">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_9s_linear_infinite]">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,167,245,0.28)" strokeWidth="1.5" strokeDasharray="3 7" />
                  <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(0,62,149,0.18)" strokeWidth="1.5" />
                  <line x1="50" y1="50" x2="50" y2="6" stroke="#00A7F5" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#003E95] to-[#00A7F5] text-white">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#00A7F5] animate-ping" />
                <span className="absolute bottom-2 left-0 w-1.5 h-1.5 rounded-full bg-[#003E95]" />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-800 leading-tight">{accent.label}</div>
                <div className="text-[10px] text-slate-500 font-medium">{accent.stat}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
