"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { LightboxItem } from "./HeroImageLightbox";

interface StackImage {
  src: string;
  alt: string;
  label: string;
  description: string;
}

const IMAGES: StackImage[] = [
  {
    src: "/images/prev/14.webp",
    alt: "Illuminated luxury exhibition stand with halo lighting and live coffee bar",
    label: "Illuminated Stage",
    description: "Curved portal architecture with perimeter under-glow and synchronized ambient lighting.",
  },
  {
    src: "/images/prev/11.webp",
    alt: "Illuminated archway exhibition pavilion with designer seating and elevated deck",
    label: "Spatial Architecture",
    description: "Custom geometric woodwork, integrated LED media screens, and VIP delegate hospitality.",
  },
  {
    src: "/images/prev/atss-1-landscape.webp",
    alt: "Two-story double-decker exhibition pavilion engineered by Impact Makers Events",
    label: "Double-Decker Pavilion",
    description: "Multi-level architectural pavilion with organic curved contours and VIP mezzanine lounge.",
  },
];

// Fanned resting transform + cursor-tilt intensity for each layer, back to front.
const LAYERS = [
  { x: -78, y: 26, z: -40, rotate: -8, scale: 0.88, tilt: 5 },
  { x: 46, y: -22, z: 30, rotate: 3, scale: 1, tilt: 9 },
  { x: 108, y: 58, z: 0, rotate: 10, scale: 0.84, tilt: 13 },
];

interface HeroImageStackProps {
  onOpen: (item: LightboxItem) => void;
}

export default function HeroImageStack({ onOpen }: HeroImageStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Resting fan-out position + cursor-driven 3D tilt per card.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        x: LAYERS[i].x,
        y: LAYERS[i].y,
        z: LAYERS[i].z,
        rotation: LAYERS[i].rotate,
        scale: LAYERS[i].scale,
      });
    });

    const tiltSetters = cardRefs.current.map((el) =>
      el
        ? {
          rx: gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" }),
          ry: gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" }),
        }
        : null
    );

    const handleMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      tiltSetters.forEach((setter, i) => {
        if (!setter) return;
        const intensity = LAYERS[i].tilt;
        setter.ry(relX * intensity);
        setter.rx(-relY * intensity);
      });
    };

    const handleLeave = () => {
      tiltSetters.forEach((setter) => {
        setter?.rx(0);
        setter?.ry(0);
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    container.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  // Scroll-scrubbed parallax drift, layered on top of the resting transform above.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: `+=${70 + i * 45}`,
          scale: `-=${0.05 + i * 0.01}`,
          ease: "none",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Continuous idle float, entirely on a separate inner element from the
  // one the resting fan pose / cursor tilt / scroll parallax / hover-focus
  // above all animate — so it composes visually but can never fight them
  // for control of the same transform property.
  useEffect(() => {
    const tweens = floatRefs.current.map((el, i) => {
      if (!el) return null;
      return gsap.to(el, {
        y: i % 2 === 0 ? -16 : -11,
        scale: 1.015,
        duration: 2.8 + i * 0.4,
        delay: i * 0.35,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      tweens.forEach((tween) => tween?.kill());
    };
  }, []);

  // Hovering a card lifts it forward and above its siblings, which recede.
  const focusCard = (index: number | null) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const isFocused = index === i;
      el.style.zIndex = isFocused ? "40" : String(10 + i);
      gsap.to(el, {
        scale: index === null ? LAYERS[i].scale : isFocused ? LAYERS[i].scale * 1.07 : LAYERS[i].scale * 0.94,
        z: isFocused ? LAYERS[i].z + 90 : LAYERS[i].z,
        opacity: index === null || isFocused ? 1 : 0.72,
        duration: 0.5,
        ease: "power3.out",
      });
    });
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${mx.toFixed(1)}%`);
    e.currentTarget.style.setProperty("--my", `${my.toFixed(1)}%`);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto aspect-[4/5]"
      style={{ perspective: "1400px" }}
    >
      {IMAGES.map((img, i) => (
        <div
          key={img.src}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onPointerEnter={() => focusCard(i)}
          onPointerLeave={() => focusCard(null)}
          onPointerMove={handleCardPointerMove}
          onClick={() => onOpen({ src: img.src, alt: img.alt, title: img.label, description: img.description })}
          className="hero-stack-card group absolute inset-[9%] rounded-[28px] overflow-hidden glass-card shadow-diffused-xl cursor-pointer"
          style={{ zIndex: 10 + i }}
        >
          <div
            ref={(el) => {
              floatRefs.current[i] = el;
            }}
            className="absolute -inset-y-[8%] inset-x-0"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1400px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-white/5" />

          {/* Cursor-following specular glare */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.35), transparent 60%)",
            }}
          />

          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full backdrop-blur-md bg-white/15 border border-white/25 text-white text-xs font-semibold w-fit">
                {img.label}
              </span>
              <span className="flex items-center gap-1 text-white text-xs font-semibold opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0">
                View Project
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-white/85 text-[11px] leading-snug max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
              {img.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
