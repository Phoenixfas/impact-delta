"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Palette, ShieldCheck, UtensilsCrossed, type LucideIcon } from "lucide-react";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: Cpu,
    title: "Technical Execution",
    description: "Show control, rigging, and AV engineered to run without a flicker of doubt.",
    image: "/images/summit-keynote.jpg",
    alt: "Stadium-scale keynote light show",
  },
  {
    icon: UtensilsCrossed,
    title: "Food & Beverage",
    description: "Culinary programs built to match the ambition of the room around them.",
    image: "/images/kinetic-installation.jpg",
    alt: "Kinetic chandelier gala installation",
  },
  {
    icon: Palette,
    title: "Creative & Media",
    description: "Brand worlds, motion design, and spatial storytelling from concept to strike.",
    image: "/images/prev/booth_1.webp",
    alt: "Detail of a large-scale exhibition build with warm kinetic lighting",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Logistics",
    description: "Redundant systems and permitting handled so nothing is left to chance.",
    image: "/images/executive-pavilion.jpg",
    alt: "Executive summit pavilion atrium",
  },
];

// Offset so the floating preview sits up-and-right of the cursor rather
// than directly under it, where it would just get covered by the pointer.
const FLOAT_OFFSET_X = 36;
const FLOAT_OFFSET_Y = -170;

/**
 * Event Support & Services: a sleek typography list on the left, each row
 * hover-triggering a cursor-following image preview (fixed-positioned,
 * chased via gsap.quickTo) that crossfades between services, plus a
 * spring-eased underline sweeping in under the hovered title.
 */
export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const underlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const floatSetters = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);

  // The anchored preview panel on the right auto-cycles through services
  // whenever the user isn't actively hovering the list, so the right side
  // stays alive on its own rather than sitting static until interacted with.
  const displayIndex = activeIndex ?? autoIndex;

  useEffect(() => {
    if (activeIndex !== null) return;
    const id = setInterval(() => {
      setAutoIndex((i) => (i + 1) % SERVICES.length);
    }, 3500);
    return () => clearInterval(id);
  }, [activeIndex]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(".services-intro, .services-aside", { opacity: 0, y: 24 });
      gsap.to(".services-intro, .services-aside", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.set(".service-row", { opacity: 0, y: 24 });
      gsap.to(".service-row", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: listRef.current, start: "top 85%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!floatingRef.current) return;
    floatSetters.current = {
      x: gsap.quickTo(floatingRef.current, "x", { duration: 0.55, ease: "power3.out" }),
      y: gsap.quickTo(floatingRef.current, "y", { duration: 0.55, ease: "power3.out" }),
    };
  }, []);

  const handleListMove = (e: React.PointerEvent<HTMLDivElement>) => {
    floatSetters.current?.x(e.clientX + FLOAT_OFFSET_X);
    floatSetters.current?.y(e.clientY + FLOAT_OFFSET_Y);
  };

  const handleItemEnter = (i: number, e: React.PointerEvent<HTMLDivElement>) => {
    setActiveIndex(i);
    setHoveredIndex(i);

    gsap.to(underlineRefs.current[i], { scaleX: 1, duration: 0.7, ease: "elastic.out(1, 0.55)" });

    if (floatingRef.current) {
      // Snap instantly to the cursor the first frame it appears, so it
      // never flashes at a stale position before the chase tween catches up.
      gsap.set(floatingRef.current, { x: e.clientX + FLOAT_OFFSET_X, y: e.clientY + FLOAT_OFFSET_Y });
      gsap.to(floatingRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    }
  };

  const handleItemLeave = (i: number) => {
    setHoveredIndex((current) => (current === i ? null : current));
    gsap.to(underlineRefs.current[i], { scaleX: 0, duration: 0.4, ease: "power3.in" });
  };

  const handleListLeave = () => {
    setActiveIndex(null);
    setHoveredIndex(null);
    gsap.to(floatingRef.current, { opacity: 0, scale: 0.92, duration: 0.35, ease: "power3.in" });
  };

  return (
    <section
      id="services-grid"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
    >
      <div className="services-intro relative max-w-7xl mx-auto mb-14 lg:mb-20">
        <span className="inline-block px-3 py-1 mb-5 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-semibold tracking-wide">
          Event Support & Services
        </span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05] max-w-2xl">
          Every Discipline, <span className="text-gradient">Under One Roof.</span>
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20">
        {/* LEFT: sleek typography list */}
        <div ref={listRef} onPointerMove={handleListMove} onPointerLeave={handleListLeave}>
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
            return (
              <div
                key={service.title}
                onPointerEnter={(e) => handleItemEnter(i, e)}
                onPointerLeave={() => handleItemLeave(i)}
                className={`service-row group relative flex items-center gap-6 py-7 sm:py-8 border-b border-slate-200 cursor-pointer transition-opacity duration-300 ${
                  isDimmed ? "opacity-40" : "opacity-100"
                }`}
              >
                <span className="text-sm font-bold text-[#00A7F5] tabular-nums shrink-0">0{i + 1}</span>

                <div className="flex-1 min-w-0">
                  <div className="relative inline-block">
                    <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {service.title}
                    </h3>
                    <span
                      ref={(el) => {
                        underlineRefs.current[i] = el;
                      }}
                      className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#003E95] to-[#00A7F5]"
                    />
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-md">{service.description}</p>
                </div>

                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 text-slate-400 shrink-0 transition-all duration-300 group-hover:border-[#00A7F5]/40 group-hover:text-[#003E95] group-hover:translate-x-1">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: anchored preview panel that auto-cycles when idle and
            syncs to whatever's hovered on the left — plus supporting copy,
            so this column stays alive on its own instead of sitting static. */}
        <div className="services-aside relative flex flex-col justify-center">
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
            From the first rigging point to the last plated course, every discipline is run in-house — so
            nothing gets lost in a handoff between vendors.
          </p>

          <div className="bento-card-border mb-8">
            <div className="bento-card-inner relative aspect-[4/5] max-h-[420px] overflow-hidden">
              {SERVICES.map((service, i) => (
                <div
                  key={service.title}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    displayIndex === i ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className={`object-cover ${displayIndex === i ? "services-ken-burns" : ""}`}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center gap-1.5 mb-3">
                  {SERVICES.map((service, i) => (
                    <span
                      key={service.title}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        displayIndex === i ? "w-8 bg-white" : "w-3 bg-white/35"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-lg font-black text-white tracking-tight mb-1">
                  {SERVICES[displayIndex].title}
                </div>
                <p className="text-sm text-white/75 leading-relaxed max-w-xs">
                  {SERVICES[displayIndex].description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-black text-slate-900">12+</div>
              <div className="text-xs text-slate-500 font-medium">In-House Disciplines</div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">0</div>
              <div className="text-xs text-slate-500 font-medium">Third-Party Handoffs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating cursor-tracked preview, fixed to the viewport so its
          position math stays simple (raw clientX/clientY, no rect offsets) */}
      <div
        ref={floatingRef}
        aria-hidden="true"
        className="hidden sm:block fixed top-0 left-0 z-40 w-64 h-80 rounded-[24px] overflow-hidden shadow-diffused-xl pointer-events-none opacity-0"
        style={{ transform: "scale(0.92)" }}
      >
        {SERVICES.map((service, i) => (
          <div
            key={service.title}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              activeIndex === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={service.image} alt={service.alt} fill sizes="256px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}
