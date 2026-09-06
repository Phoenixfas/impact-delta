"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useSmoothScroll } from "../SmoothScroll";

export interface LightboxItem {
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface HeroImageLightboxProps {
  item: LightboxItem | null;
  onClose: () => void;
}

/**
 * Slightly-fullscreen image viewer shared by the center image-stack cards
 * and the floating photo accents — a large framed view of the same image
 * with its caption overlaid in the bottom-left corner, echoing the card's
 * own bottom-scrim treatment rather than introducing a new visual language.
 */
export default function HeroImageLightbox({ item, onClose }: HeroImageLightboxProps) {
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!item) return;

    lenis?.stop();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      lenis?.start();
      window.removeEventListener("keydown", handleKey);
    };
  }, [item, lenis, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 md:p-12"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md animate-[lightbox-fade_0.35s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full h-full max-w-5xl max-h-[88vh] rounded-[28px] overflow-hidden shadow-diffused-xl border border-white/20 animate-[lightbox-scale-in_0.45s_cubic-bezier(0.16,1,0.3,1)]">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          quality={95}
          sizes="(max-width: 768px) 100vw, 1920px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

        <button
          onClick={onClose}
          aria-label="Close image viewer"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md bg-white/80 hover:bg-white border border-white/60 shadow-diffused-md text-slate-700 hover:text-[#003E95] transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm glass-card-elevated rounded-2xl p-5">
          <span className="inline-block px-3 py-1 mb-2 rounded-full bg-[#00A7F5]/15 border border-[#00A7F5]/25 text-[#003E95] text-xs font-semibold">
            {item.title}
          </span>
          <p className="text-slate-700 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
