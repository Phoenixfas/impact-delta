"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Layers,
  Zap,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface StoryChapter {
  id: string;
  chapterNumber: string;
  year: string;
  category: string;
  title: string;
  quote: string;
  paragraphs: string[];
  image: string;
  alt: string;
  icon: LucideIcon;
  badge: string;
  metric: { value: string; label: string };
  radii: number[];
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "chapter-01",
    chapterNumber: "01",
    year: "2014 — 2017",
    category: "The Genesis",
    title: "Dismantling the PowerPoint Monolith",
    quote: "“A corporate keynote should never feel like a lecture. It should possess the atmospheric weight of monumentality.”",
    paragraphs: [
      "In 2014, the B2B event industry was trapped in a cycle of predictable repetition: flat projection screens, sterile fluorescent ballroom lighting, and linear bullet-point slide decks that drained the life from multi-billion-dollar enterprise announcements.",
      "We founded Impact B2B on a singular contrarian principle: executive leaders don't just need a stage — they need a sacred space of collective focus. We fused architectural joinery, 3D volumetric LED walls, and theatrical lighting cues to transform conventional auditoriums into immersive spatial cathedrals.",
      "Our earliest projects challenged every established convention. We replaced static podiums with kinetic geometric stages that physically altered sightlines throughout keynote speeches, proving that spatial innovation directly drives attendee engagement and retention.",
    ],
    image: "/images/prev/booth_1.webp",
    alt: "Early modular architectural stage build with warm kinetic lighting",
    icon: BookOpen,
    badge: "Architectural Foundations",
    metric: { value: "100%", label: "Custom Fabricated Stages" },
    radii: [42, 58, 65, 35, 30, 70, 45, 55],
  },
  {
    id: "chapter-02",
    chapterNumber: "02",
    year: "2018 — 2021",
    category: "Technical Evolution",
    title: "The Symphony of Sub-Millisecond Sync",
    quote: "“True immersion happens when lighting, acoustic physics, and motion operate as a unified biological organism.”",
    paragraphs: [
      "As enterprise technology expanded exponentially, so did our ambition. We realized that monumental physical stagecraft reached its zenith only when coupled with uncompromising technological precision.",
      "We developed our proprietary SMPTE timecode pipeline, synchronizing 500+ robotic lighting fixtures, optical video matrices, and spatial raytracing acoustic arrays down to the microsecond. When a CEO stepped into the focal zone, the entire room shifted atmosphere in absolute synchronicity.",
      "During this era, we scaled our multi-continent footprint, delivering simultaneous multi-hub keynotes linked via broadcast-grade satellite uplinks and zero-latency optical networks across Dubai, London, Singapore, and San Francisco.",
    ],
    image: "/images/kinetic-installation.jpg",
    alt: "Automated kinetic light installations reacting in real time",
    icon: Zap,
    badge: "Timecode Automation",
    metric: { value: "0.0ms", label: "Sync Cue Latency" },
    radii: [60, 40, 30, 70, 68, 32, 70, 30],
  },
  {
    id: "chapter-03",
    chapterNumber: "03",
    year: "2022 — 2024",
    category: "Sensory Mastery",
    title: "Engineering the Emotional Horizon",
    quote: "“Technology is merely the wire; human reverence is the current that illuminates the room.”",
    paragraphs: [
      "With scale came deeper artistic discipline. We recognized that the most advanced laser projection or kinetic winches mean nothing if the audience does not feel a genuine emotional heartbeat.",
      "We assembled an interdisciplinary collective of acousticians, industrial designers, choreographers, and creative coders. Every keynote began with audience journey mapping — engineering the sensory cadence from morning arrival to climactic product unveilings.",
      "We introduced real-time spatial heatmaps and biometric telemetry into our post-show debriefs, proving that intentional architectural tension and emotional pacing created a 99.8% executive satisfaction rating across hundreds of Fortune 500 summits.",
    ],
    image: "/images/executive-pavilion.jpg",
    alt: "Global executive audience immersed in spatial summit pavilion",
    icon: HeartHandshake,
    badge: "Emotional Cadence",
    metric: { value: "99.8%", label: "Executive Retention Score" },
    radii: [35, 65, 55, 45, 40, 60, 30, 70],
  },
  {
    id: "chapter-04",
    chapterNumber: "04",
    year: "2025 — 2026+",
    category: "The Next Era",
    title: "Architecting Autonomous Brand Worlds",
    quote: "“We are not simply building stages for tomorrow — we are sculpting the future memory of global enterprise.”",
    paragraphs: [
      "Today, Impact B2B stands as the premier global atelier for monumental live experiences. We combine real-time Unreal Engine 5 spatial digital twins with generative kinetic lighting meshes that react dynamically to presenter energy and audience sentiment.",
      "Our bespoke builds have generated over $4.2B in pipeline impact for enterprise visionaries worldwide. Yet despite our global scale across 120+ international venues, our founding ethos remains unchanged: every joint, beam, photon, and acoustic reflection is crafted with radical human obsession.",
      "As we architect the next generation of global summits, we invite forward-thinking enterprises to step beyond ordinary events and join us in sculpting unforgettable historical moments.",
    ],
    image: "/images/summit-keynote.jpg",
    alt: "Futuristic stadium keynote arena with volumetric lighting architecture",
    icon: Globe2,
    badge: "Next-Gen Previz",
    metric: { value: "$4.2B+", label: "Client Pipeline Generated" },
    radii: [50, 50, 40, 60, 55, 45, 65, 35],
  },
];

function buildCustomBlobRadius(r: number[]) {
  return `${r[0]}% ${r[1]}% ${r[2]}% ${r[3]}% / ${r[4]}% ${r[5]}% ${r[6]}% ${r[7]}%`;
}

export default function AboutStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const morphImageWrapRef = useRef<HTMLDivElement | null>(null);
  const chapterBlockRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !containerRef.current || !leftColRef.current) return;

      // 1. Intro Header Entrance
      gsap.fromTo(
        ".story-intro-el",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // 2. Desktop GSAP Pinning for Left Column
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top+=110",
          end: "bottom bottom",
          pin: leftColRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });

      // 3. Chapter Paragraph Text Highlight and Left-Side Synchronization
      chapterBlockRefs.current.forEach((blockEl, idx) => {
        if (!blockEl) return;

        const paragraphs = blockEl.querySelectorAll(".story-paragraph");
        const chapterQuote = blockEl.querySelector(".chapter-quote");

        // Initial muted state
        gsap.set(paragraphs, { opacity: 0.32, y: 10 });
        if (chapterQuote) gsap.set(chapterQuote, { opacity: 0.4 });

        ScrollTrigger.create({
          trigger: blockEl,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => {
            setActiveChapterIndex(idx);
            highlightChapter(idx);
          },
          onEnterBack: () => {
            setActiveChapterIndex(idx);
            highlightChapter(idx);
          },
        });

        function highlightChapter(activeIdx: number) {
          chapterBlockRefs.current.forEach((otherBlock, otherIdx) => {
            if (!otherBlock) return;
            const isCurrent = otherIdx === activeIdx;
            const otherParagraphs = otherBlock.querySelectorAll(".story-paragraph");
            const otherQuote = otherBlock.querySelector(".chapter-quote");
            const otherPill = otherBlock.querySelector(".chapter-num-pill");

            gsap.to(otherParagraphs, {
              opacity: isCurrent ? 1 : 0.28,
              y: isCurrent ? 0 : 6,
              duration: 0.5,
              stagger: isCurrent ? 0.06 : 0,
              ease: "power2.out",
            });

            if (otherQuote) {
              gsap.to(otherQuote, {
                opacity: isCurrent ? 1 : 0.35,
                scale: isCurrent ? 1 : 0.98,
                duration: 0.5,
                ease: "power2.out",
              });
            }

            if (otherPill) {
              gsap.to(otherPill, {
                scale: isCurrent ? 1.05 : 1,
                borderColor: isCurrent ? "rgba(0, 167, 245, 0.6)" : "rgba(226, 232, 240, 0.8)",
                duration: 0.4,
              });
            }
          });

          // Smoothly morph the left image frame radius
          if (morphImageWrapRef.current) {
            const radii = STORY_CHAPTERS[activeIdx]?.radii || STORY_CHAPTERS[0].radii;
            gsap.to(morphImageWrapRef.current, {
              borderRadius: buildCustomBlobRadius(radii),
              duration: 1.1,
              ease: "power3.out",
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentChapter = STORY_CHAPTERS[activeChapterIndex] || STORY_CHAPTERS[0];

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-white selection:bg-[#003E95] selection:text-white"
    >
      {/* Ambient background glows for corporate luxury aesthetic */}
      <div
        aria-hidden="true"
        className="absolute top-1/6 -left-48 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.07),transparent_70%)] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-2/3 -right-48 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.06),transparent_70%)] pointer-events-none -z-10"
      />

      {/* Atmospheric Micro Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.025] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* =========================================================================
          SECTION HEADER
          ========================================================================= */}
      <div className="relative max-w-7xl mx-auto mb-20 sm:mb-28 text-left">
        <div className="story-intro-el inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
          <span>Brand Story & Evolution</span>
        </div>

        <h2 className="story-intro-el text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05] max-w-3xl">
          From Modest Blueprints to <span className="text-gradient">Global Spectacle.</span>
        </h2>

        <p className="story-intro-el mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          Follow the architectural and technical journey of how Impact B2B transformed the enterprise
          stage into an instrument of profound human belief.
        </p>
      </div>

      {/* =========================================================================
          DUAL-COLUMN SCROLLTRIGGER STORY SETUP
          ========================================================================= */}
      <div
        ref={containerRef}
        className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start overflow-visible"
      >
        {/* =======================================================================
            LEFT COLUMN: Pinned Sticky Visual Frame with Morphing Shapes
            ======================================================================= */}
        <div
          ref={leftColRef}
          className="lg:col-span-5 will-change-transform z-20 flex flex-col items-center lg:items-start overflow-visible"
        >
          {/* Main Visual Unit */}
          <div className="relative w-full max-w-md lg:max-w-none overflow-visible">
            {/* Top Chapter Status Bar */}
            <div className="flex items-center justify-between gap-3 mb-3.5 w-full px-1">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-diffused-sm">
                <Layers className="w-3.5 h-3.5 text-[#00A7F5]" />
                <span>{currentChapter.badge}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800 text-xs font-mono font-bold shadow-2xs">
                {currentChapter.year}
              </div>
            </div>

            {/* Morphing Outer Glass Frame (Strictly frames photo, leaving overlays unclipped) */}
            <div
              ref={morphImageWrapRef}
              className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden glass-card-elevated p-2.5 border border-white/90 shadow-diffused-xl transition-[border-radius] duration-700 ease-out"
              style={{
                borderRadius: buildCustomBlobRadius(STORY_CHAPTERS[0].radii),
              }}
            >
              {/* Layered Chapter Images with Cross-Fade */}
              <div className="relative w-full h-full rounded-[inherit] overflow-hidden bg-slate-950">
                {STORY_CHAPTERS.map((chapter, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <div
                      key={chapter.id}
                      className={`absolute inset-0 transition-all duration-1000 ease-out ${
                        isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={chapter.image}
                        alt={chapter.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-cover"
                        priority={idx === 0}
                      />

                      {/* Cinematic Lighting Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Chapter Info Card (Cleanly layered beneath/over the photo frame, no corner clipping) */}
            <div className="mt-4 w-full p-4.5 sm:p-5 rounded-3xl glass-card-elevated border border-slate-200/90 shadow-diffused-md text-slate-900 bg-white/90 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono tracking-widest text-[#003E95] font-bold uppercase">
                    PHASE {currentChapter.chapterNumber} {"//"} {currentChapter.category}
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">
                    {currentChapter.title}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-black text-[#00A7F5]">
                    {currentChapter.metric.value}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {currentChapter.metric.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Corner Spec Pill */}
            <div className="absolute -bottom-3 -right-2 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-card-elevated border border-white/95 shadow-diffused-lg z-30 pointer-events-none">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#003E95] to-[#00A7F5] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-black text-slate-900">Zero-Fail Production</div>
                <div className="text-[9px] text-slate-500 font-medium">10+ Years Flawless Run</div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RIGHT COLUMN: Long-Form Scrolling Narrative Chapters
            ======================================================================= */}
        <div className="lg:col-span-7 space-y-28 sm:space-y-40 pt-4 lg:pt-0">
          {STORY_CHAPTERS.map((chapter, idx) => {
            const isActive = activeChapterIndex === idx;
            const Icon = chapter.icon;

            return (
              <div
                key={chapter.id}
                ref={(el) => {
                  chapterBlockRefs.current[idx] = el;
                }}
                className={`relative transition-all duration-500 ${
                  isActive ? "opacity-100" : "opacity-75"
                }`}
              >
                {/* Chapter Metadata Header Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`chapter-num-pill flex items-center justify-center w-10 h-10 rounded-2xl font-black text-sm transition-all duration-300 border ${
                      isActive
                        ? "bg-gradient-to-tr from-[#003E95] to-[#00A7F5] text-white shadow-glow border-transparent scale-105"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {chapter.chapterNumber}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-wider uppercase text-[#003E95] flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-[#00A7F5]" />
                      Chapter {chapter.chapterNumber} • {chapter.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-medium">
                      Epoch: {chapter.year}
                    </span>
                  </div>
                </div>

                {/* Chapter Title */}
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug mb-6">
                  {chapter.title}
                </h3>

                {/* Chapter Highlight Quote */}
                <blockquote className="chapter-quote relative pl-5 py-2 my-6 border-l-3 border-[#00A7F5] bg-blue-50/40 rounded-r-2xl text-base sm:text-lg font-semibold text-[#003E95] italic leading-relaxed transition-all duration-300">
                  {chapter.quote}
                </blockquote>

                {/* Long-Form Scrolling Narrative Paragraphs */}
                <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {chapter.paragraphs.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="story-paragraph transition-all duration-300 will-change-transform"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Chapter Bottom Stat Strip */}
                <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-[#00A7F5]" />
                    <span>Focus Milestone: {chapter.badge}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003E95] hover:text-[#00A7F5] transition-colors">
                    <span>Explore Milestone</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bridge Callout */}
      <div className="relative max-w-5xl mx-auto mt-28 sm:mt-40 p-8 sm:p-12 rounded-3xl glass-card-elevated border border-slate-200/80 shadow-diffused-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003E95]/10 text-[#003E95] text-xs font-bold uppercase tracking-wider mb-4">
          <Globe2 className="w-3.5 h-3.5 text-[#00A7F5]" />
          <span>The Next Chapter Awaits</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Ready to Write Your Brand’s Next Stage Milestone?
        </h3>

        <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
          From blueprint architecture to live broadcast telemetry, let’s co-create an unforgettable
          experience for your enterprise summit.
        </p>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={() => scrollTo("#contact", { offset: -60 })}
            className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white overflow-hidden shadow-diffused-md transition-all duration-300 hover:shadow-glow active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />
            <span className="relative z-10">Initiate Dialogue</span>
            <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            onClick={() => scrollTo("#timeline", { offset: -60 })}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all duration-200"
          >
            <span>View Full Timeline</span>
          </button>
        </div>
      </div>
    </section>
  );
}
