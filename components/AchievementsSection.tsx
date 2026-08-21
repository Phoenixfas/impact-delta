"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarDays, Star, TrendingUp, Users, type LucideIcon } from "lucide-react";

interface Metric {
  icon: LucideIcon;
  label: string;
  description: string;
  target: number;
  decimals: number;
  suffix: string;
  size: "large" | "small";
  image: string;
  alt: string;
}

const METRICS: Metric[] = [
  {
    icon: CalendarDays,
    label: "Global Summits Organized",
    description: "Award-winning productions delivered across five continents since 2014 — every one engineered, not templated.",
    target: 500,
    decimals: 0,
    suffix: "+",
    size: "large",
    image: "/images/summit-keynote.jpg",
    alt: "Stadium-scale keynote light show",
  },
  {
    icon: Users,
    label: "Attendees Reached",
    description: "Enterprise audiences, on-site and streamed.",
    target: 2.4,
    decimals: 1,
    suffix: "M+",
    size: "small",
    image: "/images/executive-pavilion.jpg",
    alt: "Executive summit pavilion atrium",
  },
  {
    icon: Star,
    label: "Client Satisfaction",
    description: "Rated across post-event enterprise surveys.",
    target: 98.7,
    decimals: 1,
    suffix: "%",
    size: "small",
    image: "/images/prev/booth_2.webp",
    alt: "Client exhibition booth on a busy trade show floor",
  },
];

function formatMetric(value: number, decimals: number, suffix: string) {
  const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return `${rounded}${suffix}`;
}

const TILT_INTENSITY = 7;

/**
 * 2026-style bento grid: one dominant stat cell plus two secondary cells,
 * each with a soft gradient border + ambient inner shadow, a count-up
 * triggered once by ScrollTrigger, and a cursor-following 3D tilt on hover.
 */
export default function AchievementsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltSetters = useRef<({ rx: gsap.QuickToFunc; ry: gsap.QuickToFunc } | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Count-up counters, each triggered once as its own card enters view.
      METRICS.forEach((metric, i) => {
        const el = valueRefs.current[i];
        const card = cardRefs.current[i];
        if (!el || !card) return;

        const counter = { value: 0 };
        gsap.to(counter, {
          value: metric.target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = formatMetric(counter.value, metric.decimals, metric.suffix);
          },
        });
      });

      // Bento cards pop into place, staggered, as the grid enters view.
      gsap.set(".bento-card-border", { opacity: 0, y: 56, scale: 0.92 });
      gsap.to(".bento-card-border", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        stagger: 0.16,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: gridRef.current, start: "top 88%" },
      });

      // Parallax drift on each card's photo, independent per card so the
      // large and small cells don't move in lockstep.
      imageRefs.current.forEach((imgEl, i) => {
        const card = cardRefs.current[i];
        if (!imgEl || !card) return;
        gsap.to(imgEl, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-following 3D tilt per card, matching the hero image-stack's tilt idiom.
  useEffect(() => {
    tiltSetters.current = cardRefs.current.map((el) =>
      el
        ? {
            rx: gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3.out" }),
            ry: gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3.out" }),
          }
        : null
    );
  }, []);

  const handleCardMove = (e: React.PointerEvent<HTMLDivElement>, i: number) => {
    const el = cardRefs.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    tiltSetters.current[i]?.ry(relX * TILT_INTENSITY);
    tiltSetters.current[i]?.rx(-relY * TILT_INTENSITY);

    el.style.setProperty("--mx", `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
  };

  const handleCardLeave = (i: number) => {
    tiltSetters.current[i]?.rx(0);
    tiltSetters.current[i]?.ry(0);
  };

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: "var(--gradient-corporate)" }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_70%)] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto mb-10 lg:mb-12 text-center">
        <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide">
          Track Record
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-[1.05] max-w-2xl mx-auto">
          Proven At a Scale <span className="text-gradient-light">Few Can Match.</span>
        </h2>
      </div>

      <div
        ref={gridRef}
        className="relative max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 lg:gap-5"
        style={{ perspective: "1600px" }}
      >
        {METRICS.map((metric, i) => {
          const Icon = metric.icon;
          const isLarge = metric.size === "large";
          return (
            <div
              key={metric.label}
              className={`bento-card-border ${isLarge ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1 lg:row-span-1"}`}
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onPointerMove={(e) => handleCardMove(e, i)}
                onPointerLeave={() => handleCardLeave(i)}
                className={`bento-card-inner group relative h-full overflow-hidden cursor-default will-change-transform ${
                  isLarge ? "p-6 sm:p-8 min-h-[220px] lg:min-h-[320px]" : "p-5 sm:p-6 min-h-[150px]"
                }`}
              >
                {/* Photo background, given vertical bleed so the scroll-linked parallax below never reveals an edge */}
                <div
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute -inset-y-[12%] inset-x-0"
                >
                  <Image
                    src={metric.image}
                    alt={metric.alt}
                    fill
                    sizes={isLarge ? "(max-width: 1024px) 100vw, 800px" : "(max-width: 1024px) 100vw, 420px"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Dark scrim so the text stays readable over any photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/55 to-slate-950/25" />

                {/* Cursor-following specular glare, matching the hero image-stack's treatment */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.14), transparent 65%)",
                  }}
                />

                <div
                  className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#003E95] to-[#00A7F5] text-white shrink-0 ring-1 ring-white/25 ${
                    isLarge ? "w-12 h-12 mb-4" : "w-10 h-10 mb-3"
                  }`}
                >
                  <Icon className={isLarge ? "w-6 h-6" : "w-5 h-5"} />
                </div>

                <div
                  className={`relative font-black text-white tracking-tight leading-none mb-2 flex items-baseline gap-1 ${
                    isLarge ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
                  }`}
                >
                  <span
                    ref={(el) => {
                      valueRefs.current[i] = el;
                    }}
                  >
                    {formatMetric(0, metric.decimals, metric.suffix)}
                  </span>
                  {isLarge && <TrendingUp className="w-6 h-6 text-[#92DCFF] mb-1" />}
                </div>

                <div className={`relative font-bold text-white ${isLarge ? "text-lg mb-2" : "text-sm mb-1.5"}`}>
                  {metric.label}
                </div>
                <p className={`relative text-white/70 leading-relaxed ${isLarge ? "text-sm max-w-sm" : "text-xs"}`}>
                  {metric.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
