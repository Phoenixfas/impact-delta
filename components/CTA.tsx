"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  Sparkles,
  Calculator,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  X,
  Send,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  ariaLabel?: string;
}

/**
 * Magnetic button wrapper that smoothly pulls toward the pointer
 * within its interactive boundary using GSAP quickTo.
 */
function MagneticButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  ariaLabel,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    xTo.current = gsap.quickTo(el, "x", { duration: 0.35, ease: "power2.out" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.35, ease: "power2.out" });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);
      const maxDist = 120;

      if (dist < maxDist) {
        const pull = (1 - dist / maxDist) * 18;
        xTo.current?.((dx / dist) * pull);
        yTo.current?.((dy / dist) * pull);
      }
    };

    const handlePointerLeave = () => {
      xTo.current?.(0);
      yTo.current?.(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center font-semibold rounded-full select-none transition-shadow duration-300 will-change-transform ${
        variant === "primary"
          ? "px-8 py-4 sm:px-10 sm:py-5 text-sm sm:text-base text-white shadow-[0_16px_36px_-8px_rgba(0,62,149,0.5)] hover:shadow-[0_24px_48px_-6px_rgba(0,167,245,0.6)] overflow-hidden group cursor-pointer"
          : "px-8 py-4 sm:px-10 sm:py-5 text-sm sm:text-base text-slate-800 bg-white/80 hover:bg-white border border-slate-200/90 shadow-diffused-md hover:shadow-diffused-lg hover:border-[#00A7F5]/50 group cursor-pointer"
      } ${className}`}
    >
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />
      )}
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
  );
}

export default function CTA() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const orb1Ref = useRef<HTMLDivElement | null>(null);
  const orb2Ref = useRef<HTMLDivElement | null>(null);
  const orb3Ref = useRef<HTMLDivElement | null>(null);

  const [activeModal, setActiveModal] = useState<"book" | "quote" | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [eventCategory, setEventCategory] = useState("Global Keynote Summit");
  const [guestCount, setGuestCount] = useState("1,000 - 5,000");
  const [budgetTier, setBudgetTier] = useState("$250k - $500k");

  const { lenis } = useSmoothScroll();

  const openModal = (type: "book" | "quote") => {
    setFormSubmitted(false);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormSubmitted(false);
  };

  // Handle modal Lenis scroll lock
  useEffect(() => {
    if (activeModal) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [activeModal, lenis]);

  // Entrance reveals and animated gradient mesh physics
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Scroll reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.set(".cta-badge", { opacity: 0, y: 20 })
        .set(".cta-heading", { opacity: 0, y: 32 })
        .set(".cta-desc", { opacity: 0, y: 24 })
        .set(".cta-actions", { opacity: 0, scale: 0.94 })
        .set(".cta-pill", { opacity: 0, y: 16 })
        .to(".cta-badge", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(".cta-heading", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .to(".cta-desc", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .to(".cta-actions", { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" }, "-=0.4")
        .to(".cta-pill", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.5");

      // Continuous animated floating gradient orbs
      if (orb1Ref.current && orb2Ref.current && orb3Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 40,
          y: -30,
          scale: 1.15,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(orb2Ref.current, {
          x: -50,
          y: 35,
          scale: 1.2,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });

        gsap.to(orb3Ref.current, {
          x: 30,
          y: 40,
          scale: 1.1,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 overflow-hidden"
    >
      {/* Full-width Interactive Card Shell */}
      <div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        className="relative w-full rounded-3xl sm:rounded-[36px] p-8 sm:p-14 lg:p-20 overflow-hidden border border-white/60 bg-gradient-to-b from-white/95 via-slate-50/90 to-white/95 backdrop-blur-2xl shadow-diffused-xl group/card"
      >
        {/* Animated Dynamic Gradient Mesh Blobs (Background) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(#003E95 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Glowing gradient orbs */}
          <div
            ref={orb1Ref}
            className="absolute -top-24 -left-20 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-br from-[#00A7F5]/25 via-[#92DCFF]/20 to-transparent blur-3xl"
          />
          <div
            ref={orb2Ref}
            className="absolute -bottom-32 -right-24 w-96 h-96 sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-tl from-[#003E95]/20 via-[#00A7F5]/20 to-transparent blur-3xl"
          />
          <div
            ref={orb3Ref}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-gradient-to-r from-[#92DCFF]/15 via-[#00A7F5]/10 to-transparent blur-3xl"
          />

          {/* Mouse follower glow spot on the card */}
          <div
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 167, 245, 0.12), transparent 70%)`,
            }}
          />
        </div>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="cta-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF4FF] border border-[#92DCFF]/50 text-[#003E95] text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#00A7F5] animate-pulse" />
            <span>Scale Your Next Experience</span>
          </div>

          {/* Bold Headline Typography */}
          <h2 className="cta-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-6">
            Ready to engineer an{" "}
            <span className="text-gradient">unforgettable summit</span>?
          </h2>

          {/* Descriptive Body */}
          <p className="cta-desc text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-10 sm:mb-12">
            Join the world&apos;s leading brands in redefining executive experiences. From concept simulation to 24/7 live show ops, we deliver zero-fail execution.
          </p>

          {/* Dual Magnetic Action Buttons */}
          <div className="cta-actions flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none mb-12 sm:mb-16">
            <MagneticButton
              onClick={() => openModal("book")}
              variant="primary"
              ariaLabel="Book event consultation"
              className="w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
              <span>Book Event</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </MagneticButton>

            <MagneticButton
              onClick={() => openModal("quote")}
              variant="secondary"
              ariaLabel="Get immediate custom quote"
              className="w-full sm:w-auto"
            >
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-[#003E95]" />
              <span>Get Quote</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </div>

          {/* Proof / SLA Badges Strip */}
          <div className="w-full pt-8 sm:pt-10 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="cta-pill flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#EBF4FF] flex items-center justify-center text-[#003E95] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">24-Hour Response</p>
                <p className="text-[11px] text-slate-500">Dedicated executive producer</p>
              </div>
            </div>

            <div className="cta-pill flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#EBF4FF] flex items-center justify-center text-[#00A7F5] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">3D Spatial Blueprint</p>
                <p className="text-[11px] text-slate-500">Zero-commitment concept preview</p>
              </div>
            </div>

            <div className="cta-pill flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#EBF4FF] flex items-center justify-center text-[#003E95] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">99.98% Live SLA</p>
                <p className="text-[11px] text-slate-500">Redundant broadcast infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal (Book Event / Get Quote) */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-slate-900/60 animate-[lightbox-fade_0.3s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden animate-[lightbox-scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              aria-label="Close dialog"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              /* Success State */
              <div className="flex flex-col items-center text-center py-10 px-4">
                <div className="w-16 h-16 rounded-full bg-[#EBF4FF] text-[#003E95] flex items-center justify-center mb-6 shadow-glow">
                  <CheckCircle2 className="w-8 h-8 text-[#00A7F5]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Request Dispatched
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mb-8">
                  Our executive production desk has received your brief. A principal director will respond within 24 hours with a custom blueprint.
                </p>
                <button
                  onClick={closeModal}
                  className="px-8 py-3 rounded-full bg-[#003E95] text-white text-sm font-semibold hover:bg-[#002D6E] transition-colors cursor-pointer"
                >
                  Return to Site
                </button>
              </div>
            ) : (
              /* Form State */
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FF] text-[#003E95] text-xs font-semibold uppercase tracking-wider mb-2">
                    {activeModal === "book" ? "Direct Summit Booking" : "Instant Proposal & Estimate"}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {activeModal === "book" ? "Schedule Your Event Consultation" : "Build Your Custom Quote"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Direct access to our senior spatial designers and technical directors.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Alex Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003E95] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Corporate Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="alex@enterprise.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003E95] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company / Organization
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Apex Technologies"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003E95] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Event Format
                      </label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#003E95] focus:bg-white transition-all"
                      >
                        <option>Global Keynote Summit</option>
                        <option>Executive Leadership Retreat</option>
                        <option>Product Reveal & Stage</option>
                        <option>Multi-City Roadshow</option>
                        <option>Hybrid Broadcast Experience</option>
                      </select>
                    </div>
                  </div>

                  {activeModal === "quote" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Estimated Attendees
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#003E95] focus:bg-white transition-all"
                        >
                          <option>Under 500 Guests</option>
                          <option>500 - 1,000 Guests</option>
                          <option>1,000 - 5,000 Guests</option>
                          <option>5,000+ Stadium / Multi-Hall</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Budget Range
                        </label>
                        <select
                          value={budgetTier}
                          onChange={(e) => setBudgetTier(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#003E95] focus:bg-white transition-all"
                        >
                          <option>$100k - $250k</option>
                          <option>$250k - $500k</option>
                          <option>$500k - $1M</option>
                          <option>$1M+ Flagship Tier</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Event Objectives & Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your summit dates, target city, vision, or spatial AV expectations..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003E95] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] hover:bg-right text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-diffused-md hover:shadow-diffused-lg transition-all duration-500 active:scale-[0.99] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry for Immediate Review</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
