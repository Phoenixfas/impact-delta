"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Layers,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  Globe2,
  FileText,
  MessageCircle,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ElementType;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "response-timeline",
    category: "DISPATCH & SLA",
    question: "What are your standard response timelines for RFP submissions?",
    answer:
      "All general inquiries and RFP briefs receive immediate automated encryption confirmation. A dedicated senior production director performs technical triage within 4 business hours, delivering an initial feasibility review and scheduling discovery within 24 hours.",
    icon: Clock,
  },
  {
    id: "onsite-meetings",
    category: "CONSULTING & SITE VISITS",
    question: "How do we request an on-site venue walkthrough or technical survey?",
    answer:
      "We dispatch certified spatial and structural engineers for on-site laser scanning, rigging load audits, and power infrastructure surveys globally across Geneva, London, New York, Singapore, and Dubai. Simply submit your event venue and preferred date in the contact form.",
    icon: MapPin,
  },
  {
    id: "emergency-support",
    category: "SHOW CONTROL & REDUNDANCY",
    question: "Do you provide 24/7 on-site emergency technical support during live events?",
    answer:
      "Yes. Every enterprise summit deployment includes dedicated show-control engineers, hot-swap primary/secondary media servers, zero-latency SMPTE timecode sync, and continuous telemetry monitoring to guarantee 99.999% live uptime.",
    icon: Zap,
  },
  {
    id: "nda-confidentiality",
    category: "GOVERNANCE & SECURITY",
    question: "Can we submit proprietary 3D CAD schematics and stage designs under NDA?",
    answer:
      "Absolutely. All transmitted briefs, CAD models, executive keynote scripts, and preliminary budgets are strictly protected under institutional mutual NDA standards. We can execute your enterprise NDA or provide our standard mutual confidentiality agreement.",
    icon: ShieldCheck,
  },
  {
    id: "international-freight",
    category: "GLOBAL LOGISTICS",
    question: "What international freight and customs clearance capabilities do you handle?",
    answer:
      "We operate air and maritime bonded freight logistics with full ATA Carnet compliance across 120+ countries. Our operations command manages customs clearance, hazardous materials certifications, and tarmac-to-rigging transport seamlessly.",
    icon: Globe2,
  },
  {
    id: "stand-brief-engine",
    category: "ESTIMATION & PREVIZ",
    question: "How does your interactive Stand Brief builder calculate preliminary estimates?",
    answer:
      "Our Stand Brief tool uses real-time spatial sizing formulas, modular LED tile pixel densities, kinetic automation axes, and regional fabrication labor indices to generate instant, itemized preliminary scopes before full architectural blueprinting.",
    icon: FileText,
  },
];

export default function ContactFAQ() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const magneticCtaRef = useRef<HTMLAnchorElement | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["response-timeline"]));
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Magnetic hover state on Stand Brief CTA button
  useEffect(() => {
    const btn = magneticCtaRef.current;
    if (!btn) return;

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
      const radius = 80;

      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.28;
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
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      btn.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    btn.addEventListener("pointermove", handlePointerMove, { passive: true });
    btn.addEventListener("pointerleave", handlePointerLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      btn.removeEventListener("pointermove", handlePointerMove);
      btn.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleItem = (id: string) => {
    const isOpen = openIds.has(id);
    const contentEl = contentRefs.current[id];

    if (contentEl) {
      if (isOpen) {
        // Closing animation with GSAP
        gsap.to(contentEl, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            setOpenIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          },
        });
      } else {
        // Opening animation with GSAP
        setOpenIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });

        // Use requestAnimationFrame so React has mounted the open DOM
        requestAnimationFrame(() => {
          gsap.fromTo(
            contentEl,
            { height: 0, opacity: 0 },
            {
              height: "auto",
              opacity: 1,
              duration: 0.45,
              ease: "power3.out",
            }
          );
        });
      }
    } else {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (isOpen) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-faq"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* ================================================================== */}
        {/* 1. TOP BANNER: STAND BRIEF BUILDER ROUTING HIGHLIGHT               */}
        {/* ================================================================== */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-r from-blue-50/95 via-sky-50/80 to-indigo-50/95 border border-[#00A7F5]/35 shadow-xl shadow-blue-900/5 p-6 sm:p-8 md:p-10 transition-all hover:border-[#00A7F5]/60 group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-gradient-to-bl from-[#00A7F5]/15 via-[#003E95]/5 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-white/90 text-[#003E95] border border-[#00A7F5]/30 shadow-2xs mb-3.5">
                <Layers className="w-3.5 h-3.5 text-[#00A7F5]" />
                <span>BESPOKE EXHIBITION & KEYNOTE STAGING</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                Need a bespoke exhibition stand quote?
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                Use our interactive Stand Brief tool for instant scoped estimates. Configure 3D dimensions,
                volumetric LED rigging, and turnkey GCC/global logistics with real-time budget telemetry.
              </p>

              {/* Value Pills */}
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-700">
                <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A7F5]" />
                  3D Previz Simulation
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Instant Scoped Estimates
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Turnkey Global Build
                </span>
              </div>
            </div>

            {/* Magnetic CTA Button */}
            <div className="flex items-center shrink-0">
              <Link
                ref={magneticCtaRef}
                href="/stand-brief"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-lg shadow-blue-900/20 active:scale-95 group/btn cursor-pointer will-change-transform"
              >
                <span>Launch Stand Brief Builder</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2. ACCORDION HEADER & 2-COLUMN FAQ GRID                            */}
        {/* ================================================================== */}
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-blue-50 text-[#003E95] border border-blue-200/80 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#00A7F5]" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              General Inquiries & Engagement Protocols
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Common questions regarding enterprise engagement timelines, confidentiality standards, and live event show-control governance.
            </p>
          </div>

          {/* 2-Column FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openIds.has(item.id);
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl backdrop-blur-md transition-all duration-300 border overflow-hidden ${
                    isOpen
                      ? "bg-white/95 border-[#00A7F5]/50 shadow-md shadow-slate-100"
                      : "bg-white/80 border-slate-200/80 shadow-xs hover:border-slate-300 hover:bg-white/90"
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 mt-0.5 ${
                          isOpen
                            ? "bg-blue-50 text-[#003E95] border border-blue-200"
                            : "bg-slate-50 text-slate-500 border border-slate-200 group-hover:text-[#003E95] group-hover:bg-blue-50/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#003E95] mb-1">
                          {item.category}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#003E95] transition-colors">
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    {/* Chevron Icon with GSAP/CSS smooth rotation */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-[#003E95] text-white rotate-180"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Animated Content Body */}
                  <div
                    ref={(el) => {
                      contentRefs.current[item.id] = el;
                    }}
                    style={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                    }}
                  >
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed pl-16 border-t border-slate-100/80">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Assistance Advisory */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl backdrop-blur-md bg-white/70 border border-slate-200/70 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#003E95] shrink-0">
                <MessageCircle className="w-4 h-4 text-[#00A7F5]" />
              </div>
              <div className="text-xs text-slate-600">
                Have a specialized technical question not listed here? Our show control directors are ready to assist.
              </div>
            </div>

            <a
              href="mailto:inquire@impact-delta.com?subject=Specialized%20Technical%20Inquiry%20%E2%80%94%20Impact%20B2B"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#003E95] hover:text-[#00A7F5] transition-colors shrink-0"
            >
              <span>Contact Engineering Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
