"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Gem, Globe2, HeartHandshake, ShieldCheck, type LucideIcon } from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface MissionPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

const MISSION_POINTS: MissionPoint[] = [
  {
    icon: Gem,
    title: "In-House CNC Fabrication",
    description: "Fully equipped in-house carpentry, joinery, and structural steel workshop delivering millimeter-accurate bespoke exhibition stands.",
  },
  {
    icon: ShieldCheck,
    title: "Triple ISO Certified",
    description: "Internationally accredited under ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 for total quality, sustainability, and safety.",
  },
  {
    icon: Globe2,
    title: "Global 9-Country Presence",
    description: "Seamless execution across UAE, Poland, Portugal, Netherlands, USA, Germany, Singapore, Rwanda, and Ethiopia.",
  },
  {
    icon: HeartHandshake,
    title: "Turnkey Event Ecosystem",
    description: "End-to-end integration across custom stand building, AV & lighting, furniture rental, space monetization, and VIP gifting.",
  },
];

// Two sets of 8 border-radius percentages (top-left/top-right/bottom-right/
// bottom-left, horizontal then vertical) — border-radius draws smooth
// curves rather than the straight edges a clip-path polygon would, so
// interpolating between these two reads as a soft, liquid blob morph
// instead of a faceted/angular one.
const REST_RADII = [68, 32, 70, 30, 30, 70, 32, 68];
const MORPH_RADII = [18, 82, 28, 72, 78, 22, 85, 15];

function buildBlobRadius(t: number) {
  const clamped = Math.min(Math.max(t, 0), 1);
  const r = REST_RADII.map((rest, i) => rest + (MORPH_RADII[i] - rest) * clamped);
  return `${r[0]}% ${r[1]}% ${r[2]}% ${r[3]}% / ${r[4]}% ${r[5]}% ${r[6]}% ${r[7]}%`;
}

/**
 * Asymmetrical editorial "About Us" narrative: a morphing image on the left,
 * a pinned sequence of brand-mission cards on the right. The border-radius
 * blob morph is driven by two independently-tweened plain numbers (scroll
 * progress + hover boost) that are combined in one render function — so
 * scroll and hover can both influence the shape without fighting over
 * control of the same DOM style property.
 */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapRef = useRef<HTMLDivElement | null>(null);
  const imageMaskRef = useRef<HTMLDivElement | null>(null);
  const imageInnerRef = useRef<HTMLDivElement | null>(null);
  const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const morphState = useRef({ scrollT: 0, hoverT: 0 });
  const { scrollTo } = useSmoothScroll();

  const renderClip = () => {
    const el = imageMaskRef.current;
    if (!el) return;
    const combined = Math.min(1, morphState.current.scrollT + morphState.current.hoverT * 0.6);
    el.style.borderRadius = buildBlobRadius(combined);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Intro block (eyebrow/heading/paragraph) sits above the pinned row in
      // normal scroll flow, so it just gets a simple one-shot fade-up as it
      // enters view.
      gsap.set(".about-intro", { opacity: 0, y: 24 });
      gsap.to(".about-intro", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      // Image border-radius blob morph, driven purely by scroll progress through the section.
      gsap.to(morphState.current, {
        scrollT: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          end: "bottom 10%",
          scrub: true,
        },
        onUpdate: renderClip,
      });

      // Subtle parallax drift on the image itself, independent of the mask shape.
      gsap.to(imageInnerRef.current, {
        yPercent: -8,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Pinned narrative: mission cards highlight one at a time as the user
      // scrolls through the pin's extended scroll distance.
      const points = pointRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (points.length && pinWrapRef.current) {
        let lastIndex = -1;
        ScrollTrigger.create({
          trigger: pinWrapRef.current,
          start: "top top+=90",
          end: () => `+=${points.length * 420}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const idx = Math.min(points.length - 1, Math.floor(self.progress * points.length));
            if (idx === lastIndex) return;
            lastIndex = idx;
            points.forEach((el, i) => {
              gsap.to(el, {
                opacity: i === idx ? 1 : 0.4,
                scale: i === idx ? 1 : 0.96,
                borderColor: i === idx ? "rgba(0,167,245,0.45)" : "rgba(226,232,240,0.8)",
                duration: 0.5,
                ease: "power2.out",
              });
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic pull on the "Explore Our Story" callout.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 120;

      if (dist < radius) {
        const strength = (1 - dist / radius) * 0.4;
        targetX = dx * strength;
        targetY = dy * strength;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const loop = () => {
      curX += (targetX - curX) * 0.15;
      curY += (targetY - curY) * 0.15;
      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleImageEnter = () => {
    gsap.to(morphState.current, { hoverT: 1, duration: 0.7, ease: "power3.out", onUpdate: renderClip });
  };

  const handleImageLeave = () => {
    gsap.to(morphState.current, { hoverT: 0, duration: 0.7, ease: "power3.out", onUpdate: renderClip });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient corner wash, echoing the hero's palette without a hard section seam */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.10),transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-40 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.08),transparent_70%)] pointer-events-none"
      />

      {/* Intro block: full-width, NOT pinned — kept separate from the row
          below so the pinned content only ever has to fit one viewport tall. */}
      <div className="about-intro relative max-w-7xl mx-auto mb-16 lg:mb-24">
        <span className="inline-block px-3 py-1 mb-5 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-semibold tracking-wide">
          About Impact Makers Events
        </span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05] mb-6 max-w-2xl">
          We Don&apos;t Just Build Stands.{" "}
          <span className="text-gradient">We Craft Spaces That Bring Brands to Life.</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
          From concept to reality — delivering bespoke exhibition stand fabrication, international congress organizing, and turnkey technical production across Dubai and worldwide.
        </p>
      </div>

      <div
        ref={pinWrapRef}
        className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1fr] gap-16 lg:gap-20 items-center"
      >
        {/* LEFT: interactive morphing image, height-capped so the row it
            shares with the pinned mission cards never exceeds one viewport. */}
        <div className="relative">
          <div
            ref={imageMaskRef}
            onPointerEnter={handleImageEnter}
            onPointerLeave={handleImageLeave}
            className="relative w-auto h-[min(74vh,640px)] aspect-[4/5] mx-auto lg:mx-0 overflow-hidden shadow-diffused-xl cursor-pointer"
            style={{ borderRadius: buildBlobRadius(0) }}
          >
            <div ref={imageInnerRef} className="absolute -inset-y-[6%] inset-x-0">
              <Image
                src="/images/prev/booth_1.webp"
                alt="Detail of custom exhibition stand fabrication by Impact Makers Events"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
          </div>

          {/* Floating caption chip, bottom-left */}
          <div className="absolute -bottom-6 left-6 sm:left-10 glass-card-elevated rounded-2xl px-5 py-4 max-w-[220px]">
            <div className="text-2xl font-black text-slate-900">ISO</div>
            <div className="text-xs text-slate-500 font-medium">9001 • 14001 • 45001 Certified Quality</div>
          </div>
        </div>

        {/* RIGHT: layered glass mission cards, sequentially highlighted by the pin above */}
        <div className="relative">
          <div className="space-y-4">
            {MISSION_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  ref={(el) => {
                    pointRefs.current[i] = el;
                  }}
                  className="glass-card-subtle rounded-2xl p-5 flex items-start gap-4 border border-slate-200/80"
                  style={{ opacity: i === 0 ? 1 : 0.4, transform: i === 0 ? "scale(1)" : "scale(0.96)" }}
                >
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#003E95] to-[#00A7F5] text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-1">{point.title}</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            ref={ctaRef}
            onClick={() => scrollTo("/about")}
            className="about-shimmer group inline-flex items-center gap-2 mt-10 text-base font-bold will-change-transform cursor-pointer"
          >
            <span className="about-shimmer-text">Discover Our Full Story</span>
            <ArrowUpRight className="w-4 h-4 text-[#00A7F5] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
