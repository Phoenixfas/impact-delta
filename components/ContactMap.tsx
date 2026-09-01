"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Sparkles,
  PhoneCall,
  Mail,
  ExternalLink,
  Compass,
} from "lucide-react";

const DUBAI_COORDS = {
  lat: 25.097,
  lng: 55.1717,
  address: "Tamem House Office Building, Al Thanyah First, Barsha Heights, Dubai, United Arab Emirates",
  shortAddress: "Tamem House, Barsha Heights, Dubai, UAE",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=25.0970,55.1717&destination_place_id=ChIJm3_uPcxwXz4Rq0n6-o7p7gQ",
  mapsSearchUrl: "https://www.google.com/maps/search/?api=1&query=25.0970,55.1717+(Tamem+House+Office+Building+Dubai)",
  phone: "+971 54 711 4951",
  email: "sales@impactmakersevents.com",
};

export default function ContactMap() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const directionsBtnRef = useRef<HTMLAnchorElement | null>(null);
  const copyBtnRef = useRef<HTMLButtonElement | null>(null);

  // Live Dubai Time & Status
  const [dubaiTime, setDubaiTime] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Live Dubai Timezone calculation (GST / UTC+4)
  useEffect(() => {
    const updateDubaiTime = () => {
      const now = new Date();
      try {
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dubai",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        setDubaiTime(timeFormatter.format(now));

        // Operating hours: Sun-Thu / Mon-Fri (08:30 - 18:30)
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dubai",
          hour: "numeric",
          minute: "numeric",
          weekday: "short",
          hour12: false,
        }).formatToParts(now);

        let hour = 0;
        let minute = 0;
        let weekday = "";
        parts.forEach((p) => {
          if (p.type === "hour") hour = parseInt(p.value, 10);
          if (p.type === "minute") minute = parseInt(p.value, 10);
          if (p.type === "weekday") weekday = p.value;
        });

        const decimalHour = hour + minute / 60;
        const isWeekend = weekday === "Sat" || weekday === "Sun";
        const open = !isWeekend && decimalHour >= 8.5 && decimalHour < 18.5;
        setIsOpen(open);
      } catch {
        setDubaiTime("10:00 AM");
        setIsOpen(true);
      }
    };

    updateDubaiTime();
    const interval = setInterval(updateDubaiTime, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Magnetic Hover on Action Buttons
  useEffect(() => {
    const buttons = [directionsBtnRef.current, copyBtnRef.current].filter(Boolean) as HTMLElement[];
    if (!buttons.length) return;

    const cleanupFns: (() => void)[] = [];

    buttons.forEach((btn) => {
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
        const radius = 70;

        if (dist < radius) {
          const pull = (1 - dist / radius) * 0.25;
          targetX = dx * pull;
          targetY = dy * pull;
        } else {
          targetX = 0;
          targetY = 0;
        }
      };

      const handlePointerLeave = () => {
        targetX = 0;
        targetY = 0;
      };

      const loop = () => {
        curX += (targetX - curX) * 0.15;
        curY += (targetY - curY) * 0.15;
        btn.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
        rafId = requestAnimationFrame(loop);
      };

      btn.addEventListener("pointermove", handlePointerMove, { passive: true });
      btn.addEventListener("pointerleave", handlePointerLeave);
      rafId = requestAnimationFrame(loop);

      cleanupFns.push(() => {
        btn.removeEventListener("pointermove", handlePointerMove);
        btn.removeEventListener("pointerleave", handlePointerLeave);
        cancelAnimationFrame(rafId);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  // Copy Address to Clipboard
  const handleCopyAddress = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(DUBAI_COORDS.address);
    }
    setIsCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact-map"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-sky-50 text-[#003E95] border border-sky-200/80 mb-3">
            <Compass className="w-3.5 h-3.5 text-[#00A7F5]" />
            <span>GLOBAL HUBS // MIDDLE EAST COMMAND</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Visit Our Regional Headquarters
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Situated in Barsha Heights, Dubai — our Middle East production hub orchestrates
            enterprise summit builds, stadium show control, and VIP executive events across the GCC.
          </p>
        </div>

        {/* Map Container Stage */}
        <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-slate-200/60 bg-slate-100">
          {/* Custom Styled Google Maps Embed */}
          <iframe
            title="Impact Makers Events Dubai Headquarters - Tamem House"
            src="https://maps.google.com/maps?q=25.0970,55.1717+(Tamem+House+Office+Building)&z=16&output=embed&hl=en"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[15%] contrast-[105%] saturate-[90%] brightness-[102%] transition-all duration-700 pointer-events-auto"
          />

          {/* Light-theme ambient scrim around edges for visual harmony */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/30 via-transparent to-white/20" />
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-slate-900/5 rounded-3xl" />

          {/* ================================================================ */}
          {/* OVERLAPPING FLOATING GLASSMORPHISM LOCATION DETAIL CARD          */}
          {/* ================================================================ */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-30 pointer-events-auto">
            <div className="rounded-3xl backdrop-blur-xl bg-white/90 border border-white/80 shadow-2xl shadow-slate-900/10 p-5 sm:p-7 transition-all duration-300 hover:bg-white/95">
              {/* Card Header & Status Indicator */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003E95]">
                    <Sparkles className="w-4 h-4 text-[#00A7F5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#003E95] block">
                      MIDDLE EAST REGIONAL HQ
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Dubai Operations Command
                    </h3>
                  </div>
                </div>

                {/* Real-Time Dubai Status Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold border ${
                    isOpen
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    }`}
                  />
                  <span>{isOpen ? "Open" : "After Hours"}</span>
                  <span className="text-slate-300 font-mono">·</span>
                  <span>{dubaiTime || "10:00 AM"}</span>
                </div>
              </div>

              {/* Address Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 mb-4">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-[#00A7F5] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">
                      Tameem House Office Building
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      Al Thanyah First, Barsha Heights (TECOM)
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      Dubai, United Arab Emirates
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Phone & Email Meta */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-mono">
                <a
                  href={`tel:${DUBAI_COORDS.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:text-[#003E95] hover:border-[#00A7F5]/50 transition-all truncate"
                >
                  <PhoneCall className="w-3 h-3 text-[#00A7F5] shrink-0" />
                  <span className="truncate">{DUBAI_COORDS.phone}</span>
                </a>
                <a
                  href={`mailto:${DUBAI_COORDS.email}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:text-[#003E95] hover:border-[#00A7F5]/50 transition-all truncate"
                >
                  <Mail className="w-3 h-3 text-[#00A7F5] shrink-0" />
                  <span className="truncate">{DUBAI_COORDS.email}</span>
                </a>
              </div>

              {/* Magnetic Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {/* Get Directions */}
                <a
                  ref={directionsBtnRef}
                  href={DUBAI_COORDS.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#003E95] to-[#00A7F5] hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-blue-900/15 will-change-transform"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                {/* Copy Address Button */}
                <button
                  ref={copyBtnRef}
                  onClick={handleCopyAddress}
                  title="Copy Full Address"
                  aria-label="Copy Full Address"
                  className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 will-change-transform ${
                    isCopied
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
