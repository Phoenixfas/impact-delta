"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Flame,
  Mail,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Check,
  Clock,
  Eye,
  X,
  Layers,
  Send,
  Lock,
} from "lucide-react";

interface TrendingArticle {
  rank: string;
  title: string;
  category: string;
  views: string;
  readTime: string;
  author: string;
}

const TRENDING_ARTICLES: TrendingArticle[] = [
  {
    rank: "01",
    title: "The Architecture of Awe: Designing Stadium-Scale Kinetic Stages for 100,000 Attendees",
    category: "Spatial Architecture",
    views: "9.8k reads",
    readTime: "8 min read",
    author: "Marcus Chen",
  },
  {
    rank: "02",
    title: "Kinetic Truss Rigging: Redundant Fiber Backbones for 360° Volumetric Stages",
    category: "Event Tech",
    views: "7.4k reads",
    readTime: "6 min read",
    author: "Marcus Chen",
  },
  {
    rank: "03",
    title: "Real-Time Unreal Engine Previz: Slashing On-Site Build Revisions by 74%",
    category: "Spatial Design",
    views: "6.1k reads",
    readTime: "7 min read",
    author: "Elena Vance",
  },
  {
    rank: "04",
    title: "Haute Cuisine at Scale: Michelin-Caliber Dinners for 5,000 Keynote Guests",
    category: "Hospitality",
    views: "5.5k reads",
    readTime: "5 min read",
    author: "Aurelia Dubois",
  },
  {
    rank: "05",
    title: "Circular Event Architecture: 100% Recyclable Multi-Story Pavilions",
    category: "Sustainability",
    views: "4.9k reads",
    readTime: "6 min read",
    author: "Siddharth Patel",
  },
];

const PREFERENCE_TOPICS = [
  "Show Automation & Rigging",
  "Spatial Architecture",
  "Executive Hospitality",
  "Sustainable Infrastructure",
];

export default function BlogNewsletter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);
  const successModalRef = useRef<HTMLDivElement | null>(null);
  const checkmarkRef = useRef<SVGSVGElement | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "Show Automation & Rigging",
    "Spatial Architecture",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [inputError, setInputError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Magnetic Button Physics with GSAP quickTo
  useEffect(() => {
    const btn = magneticBtnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power2.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power2.out" });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxRadius = 110;

      if (dist < maxRadius) {
        const pull = (1 - dist / maxRadius) * 16;
        xTo((dx / dist) * pull);
        yTo((dy / dist) * pull);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    btn.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      btn.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isSubmitted]);

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Handle Newsletter Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setInputError("Please enter a valid work email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate network submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEmail(email);
      setIsSubmitted(true);
      setEmail("");
    }, 600);
  };

  // GSAP: Animate Success Modal Reveal when isSubmitted changes to true
  useEffect(() => {
    if (!isSubmitted || !successModalRef.current) return;

    const modal = successModalRef.current;
    const checkmark = checkmarkRef.current;

    const tl = gsap.timeline();

    // Fade in modal backdrop with scale & back ease
    tl.fromTo(
      modal,
      { opacity: 0, scale: 0.88, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.7)" }
    );

    // Animate checkmark icon pop
    if (checkmark) {
      tl.fromTo(
        checkmark,
        { scale: 0, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" },
        "-=0.3"
      );
    }
  }, [isSubmitted]);

  // Section Entrance Animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      gsap.fromTo(
        [leftCardRef.current, rightCardRef.current],
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog-newsletter"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[130px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-sky-100/40 blur-[120px]" />
      </div>

      {/* Dual-Column Bento Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* ========================================================= */}
        {/* LEFT BENTO CARD: TOP 5 TRENDING DISPATCHES               */}
        {/* ========================================================= */}
        <div
          ref={leftCardRef}
          className="lg:col-span-6 rounded-3xl backdrop-blur-xl bg-white/80 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,62,149,0.06),0_4px_16px_rgba(0,0,0,0.02)] p-6 sm:p-8 flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,167,245,0.12)]"
        >
          <div>
            {/* Header with Flame Badge */}
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    Trending This Week
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Most-read architectural masterclasses
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#003E95] text-[11px] font-bold border border-blue-200/60">
                <TrendingUp className="w-3 h-3 text-[#00A7F5]" />
                <span>Live Feed</span>
              </span>
            </div>

            {/* Top 5 Articles List */}
            <div className="space-y-3.5">
              {TRENDING_ARTICLES.map((article) => (
                <div
                  key={article.rank}
                  className="group relative flex items-start gap-3.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-white/60 hover:bg-white border border-transparent hover:border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {/* Dynamic Numerical Rank Indicator */}
                  <span className="shrink-0 text-xl sm:text-2xl font-black tracking-tight text-slate-300 group-hover:text-[#003E95] transition-colors duration-300 select-none font-mono">
                    {article.rank}
                  </span>

                  {/* Article Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#003E95] transition-colors leading-snug line-clamp-2 mb-1.5">
                      {article.title}
                    </h4>

                    <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-medium">
                      <span className="text-[#003E95] font-semibold">
                        {article.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        {article.views}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Hover Slide Arrow */}
                  <div className="shrink-0 pt-1 text-slate-400 group-hover:text-[#00A7F5] transition-colors">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Curated by Impact Editorial Board</span>
            <span className="text-[#003E95] font-bold">Updated Hourly</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT BENTO CARD: INTERACTIVE NEWSLETTER SUBSCRIPTION     */}
        {/* ========================================================= */}
        <div
          ref={rightCardRef}
          className="lg:col-span-6 relative rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/90 via-slate-50/80 to-white/90 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,62,149,0.06),0_4px_16px_rgba(0,0,0,0.02)] p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Top Gradient Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-indigo-600" />

          {/* Success State Glass Modal Overlay (GSAP Animated) */}
          {isSubmitted && (
            <div
              ref={successModalRef}
              className="absolute inset-0 z-30 backdrop-blur-2xl bg-white/95 p-6 sm:p-8 flex flex-col items-center justify-center text-center rounded-3xl"
            >
              {/* Animated Glowing Checkmark Icon */}
              <div className="relative w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <svg
                  ref={checkmarkRef}
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/70 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Subscription Confirmed
              </span>

              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                Welcome to Impact Journal
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
                We&apos;ve dispatched your welcome dossier &amp; Issue 04 blueprint to{" "}
                <span className="font-bold text-slate-900 underline">{submittedEmail}</span>.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#003E95] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          <div>
            {/* Header & Social Proof Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 text-[#003E95] text-xs font-bold border border-blue-200/70">
                <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
                <span>Impact Executive Dispatch</span>
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>14,200+ Event Leaders</span>
              </div>
            </div>

            {/* Newsletter Title & Manifesto */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2.5">
              Engineering Masterclasses in Your Inbox.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
              Zero noise. Bi-weekly deep dives into stadium show control, kinetic volumetric
              rigging, and zero-fail executive summit logistics.
            </p>

            {/* Interactive Topic Selectors */}
            <div className="mb-6">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                Customize Topic Preferences:
              </label>
              <div className="flex flex-wrap gap-2">
                {PREFERENCE_TOPICS.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        isSelected
                          ? "bg-[#003E95] text-white shadow-2xs"
                          : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                          isSelected ? "bg-white/20 text-white" : "border border-slate-300"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                      <span>{topic}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="relative">
                <div
                  className={`relative flex items-center rounded-2xl bg-white border transition-all duration-300 shadow-2xs ${
                    inputError
                      ? "border-rose-500 ring-4 ring-rose-500/10"
                      : isFocused
                      ? "border-[#00A7F5] ring-4 ring-[#00A7F5]/15 shadow-sm"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="pl-4 pr-2 text-slate-400">
                    <Mail
                      className={`w-4 h-4 transition-colors ${
                        isFocused ? "text-[#003E95]" : "text-slate-400"
                      }`}
                    />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (inputError) setInputError("");
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your corporate work email..."
                    className="w-full py-3.5 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                {inputError && (
                  <p className="mt-1.5 text-[11px] font-semibold text-rose-600 pl-2">
                    {inputError}
                  </p>
                )}
              </div>

              {/* Magnetic CTA Button */}
              <button
                ref={magneticBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-[#003E95] text-white text-xs sm:text-sm font-bold shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 cursor-pointer will-change-transform active:scale-[0.99]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Subscribe to Insights</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Form Privacy Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Strict Enterprise Confidentiality
            </span>
            <span>Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
