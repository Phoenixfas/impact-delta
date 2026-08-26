"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowUpRight,
  Share2,
  Bookmark,
  Heart,
  Link2,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Layers,
  Cpu,
  Workflow,
  Leaf,
  FolderGit2,
  ShieldCheck,
  Quote,
  Flame,
  Info,
  Maximize2,
} from "lucide-react";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66A1.66 1.66 0 0 0 7.83 6.2z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { DetailedBlogPost, DETAILED_BLOG_POSTS } from "@/lib/blog-posts";
import { useSmoothScroll } from "./SmoothScroll";
import { useReveal } from "./RevealProvider";

interface ArticleDetailProps {
  post: DetailedBlogPost;
}

export default function ArticleDetail({ post }: ArticleDetailProps) {
  const { scrollTo } = useSmoothScroll();
  const { setRevealed } = useReveal();

  const articleContainerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const tocIndicatorRef = useRef<HTMLDivElement | null>(null);
  const tocContainerRef = useRef<HTMLDivElement | null>(null);
  const shareBarRef = useRef<HTMLDivElement | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);

  // Active section tracking state
  const [activeSectionId, setActiveSectionId] = useState<string>(
    post.sections[0]?.id || ""
  );
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [clapCount, setClapCount] = useState(142);
  const [hasClapped, setHasClapped] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Activate kinetic background
  useEffect(() => {
    setRevealed(true);
  }, [setRevealed]);

  // GSAP ScrollTrigger: Dynamic Reading Progress Bar
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const progressEl = progressBarRef.current;
    if (!progressEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: articleContainerRef.current,
        start: "top top+=80",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress));
          setReadingProgress(Math.round(progress * 100));
          gsap.to(progressEl, {
            scaleX: progress,
            transformOrigin: "left center",
            duration: 0.1,
            ease: "none",
          });
        },
      });

      // Track active section headers in Table of Contents
      post.sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top center+=100",
          end: "bottom center",
          onEnter: () => setActiveSectionId(section.id),
          onEnterBack: () => setActiveSectionId(section.id),
        });
      });
    });

    return () => ctx.revert();
  }, [post]);

  // GSAP: Animate TOC active indicator
  useEffect(() => {
    const activeLink = document.getElementById(`toc-link-${activeSectionId}`);
    const indicator = tocIndicatorRef.current;

    if (!activeLink || !indicator) return;

    const targetY = activeLink.offsetTop;
    const targetHeight = activeLink.offsetHeight;

    gsap.to(indicator, {
      y: targetY,
      height: targetHeight,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [activeSectionId]);

  // Copy URL to clipboard
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  // Social Share Handlers
  const handleShareLinkedIn = () => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareTwitter = () => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`"${post.title}" by ${post.author.name} via @ImpactB2B`);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Handle Clap Micro-interaction
  const handleClap = () => {
    setClapCount((prev) => prev + 1);
    setHasClapped(true);
    gsap.fromTo(
      ".clap-icon",
      { scale: 1.4, rotate: -15 },
      { scale: 1, rotate: 0, duration: 0.4, ease: "elastic.out(1.5, 0.4)" }
    );
  };

  // Related Posts Carousel Scrolling
  const handleCarouselScroll = (direction: "left" | "right") => {
    const track = carouselTrackRef.current;
    if (!track) return;
    const scrollAmount = track.clientWidth * 0.75;
    track.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const updateCarouselScrollState = () => {
    const track = carouselTrackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 10);
    setCanScrollRight(
      track.scrollLeft < track.scrollWidth - track.clientWidth - 10
    );
  };

  const relatedArticles = post.relatedSlugs
    .map((slug) => DETAILED_BLOG_POSTS[slug])
    .filter(Boolean);

  return (
    <div
      ref={articleContainerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-white via-slate-50/40 to-white text-slate-900 pt-28 sm:pt-36 pb-24"
    >
      {/* ========================================================= */}
      {/* 1. FLOATING READING PROGRESS BAR                          */}
      {/* ========================================================= */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-1 sm:h-1.5 bg-slate-200/40 backdrop-blur-md"
      >
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-indigo-600 will-change-transform scale-x-0 origin-left"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#003E95] px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Journal</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Journal</span>
            <span>/</span>
            <span className="text-[#003E95]">{post.categoryLabel}</span>
            <span>/</span>
            <span className="text-slate-600 truncate max-w-[240px]">
              {post.title}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. EDITORIAL ARTICLE HEADER                               */}
        {/* ========================================================= */}
        <header className="max-w-4xl mx-auto text-center mb-10 sm:mb-14">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#003E95] text-xs font-extrabold border border-blue-200/70">
              <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
              <span>{post.categoryLabel}</span>
            </span>

            {post.editorialBadge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                {post.editorialBadge}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readTime}</span>
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal mb-8">
            {post.subtitle}
          </p>

          {/* Author Card & Publish Date */}
          <div className="inline-flex items-center gap-4 p-2 pr-5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm">
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#00A7F5]/30 shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">
                {post.author.name}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {post.author.role} · Published {post.date}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Visual Card */}
        <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 mb-12 sm:mb-16 border border-slate-200/80 bg-slate-950">
          <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[560px]">
            <Image
              src={post.heroImage}
              alt={post.heroImageAlt}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            {/* Bottom image overlay specs */}
            {post.metrics && (
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl backdrop-blur-xl bg-slate-950/80 border border-white/20 text-white text-xs font-semibold shadow-lg">
                <span className="text-[#00A7F5] font-bold">
                  {post.metrics.label}:
                </span>
                <span>{post.metrics.value}</span>
              </div>
            )}
          </div>

          {post.caption && (
            <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200/80 text-xs text-slate-500 text-center font-medium">
              <span className="font-bold text-slate-700">Figure 1.1</span> — {post.caption}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 3. MAIN ARTICLE BODY + STICKY TABLE OF CONTENTS          */}
        {/* ========================================================= */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Article Content (8 Columns) */}
          <article className="lg:col-span-8 bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_10px_35px_rgba(0,62,149,0.04)]">
            {post.sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className={`scroll-mt-32 ${idx > 0 ? "mt-12 pt-10 border-t border-slate-100" : ""}`}
              >
                {section.level === 2 ? (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-5 leading-snug">
                    {section.title}
                  </h2>
                ) : (
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-4">
                    {section.title}
                  </h3>
                )}

                <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Callout Boxes (Blueprint, Quote, Telemetry) */}
                {section.callout && (
                  <div
                    className={`mt-6 p-5 sm:p-6 rounded-2xl border backdrop-blur-md ${
                      section.callout.type === "blueprint"
                        ? "bg-blue-50/80 border-blue-200/80 text-[#003E95]"
                        : section.callout.type === "telemetry"
                        ? "bg-slate-900 text-white border-slate-800 shadow-xl"
                        : "bg-sky-50/70 border-sky-200/70 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider mb-2">
                      {section.callout.type === "blueprint" && (
                        <>
                          <Workflow className="w-4 h-4 text-[#00A7F5]" />
                          <span>{section.callout.title || "Engineering Blueprint"}</span>
                        </>
                      )}
                      {section.callout.type === "telemetry" && (
                        <>
                          <Cpu className="w-4 h-4 text-[#00A7F5]" />
                          <span className="text-[#00A7F5]">
                            {section.callout.title || "Telemetry Telemetry Specs"}
                          </span>
                        </>
                      )}
                      {section.callout.type === "quote" && (
                        <>
                          <Quote className="w-4 h-4 text-[#003E95]" />
                          <span>Executive Perspective</span>
                        </>
                      )}
                    </div>

                    <p
                      className={`text-sm sm:text-base font-semibold leading-relaxed ${
                        section.callout.type === "telemetry"
                          ? "text-slate-200 font-mono text-xs sm:text-sm"
                          : "text-slate-800"
                      }`}
                    >
                      &ldquo;{section.callout.text}&rdquo;
                    </p>

                    {section.callout.meta && (
                      <p className="mt-2 text-xs text-slate-500 font-medium">
                        — {section.callout.meta}
                      </p>
                    )}
                  </div>
                )}
              </section>
            ))}

            {/* Article Tags Footer */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2">Topics:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Bio Box */}
            <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#003E95]/20 shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {post.author.name}
                  </h4>
                  <span className="text-xs font-semibold text-[#003E95] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Author
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1.5">
                  {post.author.role}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </article>

          {/* Sticky Table of Contents Sidebar (4 Columns) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <div
              ref={tocContainerRef}
              className="relative rounded-3xl backdrop-blur-xl bg-white/80 border border-slate-200/80 shadow-[0_12px_40px_rgba(0,62,149,0.06)] p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  <Layers className="w-3.5 h-3.5 text-[#00A7F5]" />
                  <span>Table of Contents</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#003E95]">
                  {readingProgress}%
                </span>
              </div>

              {/* Sections Navigation List with Left Border Track */}
              <nav className="relative pl-3 border-l-2 border-slate-100 space-y-1">
                {/* Sliding GSAP Active Indicator Line on Left Border Track */}
                <div
                  ref={tocIndicatorRef}
                  aria-hidden="true"
                  className="absolute -left-[2px] top-0 w-[2px] rounded-full bg-[#003E95] opacity-0 pointer-events-none will-change-transform z-10"
                />

                {post.sections.map((section) => {
                  const isActive = activeSectionId === section.id;
                  return (
                    <button
                      key={section.id}
                      id={`toc-link-${section.id}`}
                      onClick={() => scrollTo(`#${section.id}`, { offset: -100, duration: 1.1 })}
                      className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 block ${
                        isActive
                          ? "text-[#003E95] bg-blue-50/90 font-bold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      } ${section.level === 3 ? "pl-5 text-[11px]" : ""}`}
                    >
                      <span className="line-clamp-1">{section.title}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Reading Estimate Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Reading speed: ~200 wpm</span>
                <span className="text-[#003E95] font-bold">{post.readTime}</span>
              </div>
            </div>

            {/* Quick Share Widget in Sidebar */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 p-4 flex items-center justify-between shadow-2xs">
              <span className="text-xs font-bold text-slate-700">Share Dispatch:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleShareLinkedIn}
                  aria-label="Share on LinkedIn"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-[#003E95] text-slate-600 hover:text-white transition-colors"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleShareTwitter}
                  aria-label="Share on Twitter"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-sky-500 text-slate-600 hover:text-white transition-colors"
                >
                  <TwitterIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white transition-colors relative"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ========================================================= */}
        {/* 4. FLOATING MAGNETIC SOCIAL & SHARE BAR (BOTTOM PINNED)   */}
        {/* ========================================================= */}
        <div
          ref={shareBarRef}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-full backdrop-blur-2xl bg-white/90 border border-slate-200/80 shadow-[0_16px_40px_rgba(0,62,149,0.15)] px-4 py-2.5 flex items-center gap-2.5 sm:gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Claps Action */}
          <button
            onClick={handleClap}
            aria-label="Applaud dispatch"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all active:scale-95"
          >
            <Heart
              className={`clap-icon w-3.5 h-3.5 ${hasClapped ? "fill-rose-500" : ""}`}
            />
            <span>{clapCount}</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* LinkedIn */}
          <button
            onClick={handleShareLinkedIn}
            aria-label="Share on LinkedIn"
            className="p-2 rounded-full hover:bg-blue-50 text-slate-600 hover:text-[#003E95] transition-colors"
          >
            <LinkedInIcon className="w-4 h-4" />
          </button>

          {/* Twitter / X */}
          <button
            onClick={handleShareTwitter}
            aria-label="Share on Twitter"
            className="p-2 rounded-full hover:bg-sky-50 text-slate-600 hover:text-sky-500 transition-colors"
          >
            <TwitterIcon className="w-4 h-4" />
          </button>

          {/* Copy Link with Tooltip */}
          <button
            onClick={handleCopyLink}
            aria-label="Copy article link"
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}

            {isCopied && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap shadow-lg animate-in fade-in zoom-in-95">
                Copied Link!
              </span>
            )}
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            aria-label="Bookmark article"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#003E95] transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? "fill-[#003E95] text-[#003E95]" : ""
              }`}
            />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 5. RELATED POSTS CAROUSEL                                 */}
        {/* ========================================================= */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 sm:mt-28 pt-12 border-t border-slate-200/80">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#003E95]">
                  Continued Reading
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Related Architecture Dispatches
                </h3>
              </div>

              {/* Carousel Scroll Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCarouselScroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll related articles left"
                  className="p-2.5 rounded-full bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCarouselScroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll related articles right"
                  className="p-2.5 rounded-full bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Carousel Horizontal Scroll Track */}
            <div
              ref={carouselTrackRef}
              onScroll={updateCarouselScrollState}
              className="flex items-stretch gap-6 overflow-x-auto no-scrollbar pb-6 scroll-smooth snap-x snap-mandatory"
            >
              {relatedArticles.map((relPost) => (
                <Link
                  key={relPost.slug}
                  href={`/blog/${relPost.slug}`}
                  className="group relative flex-none w-[300px] sm:w-[360px] snap-start rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-md hover:shadow-xl hover:border-[#00A7F5]/40 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative w-full h-44 overflow-hidden bg-slate-900">
                    <Image
                      src={relPost.heroImage}
                      alt={relPost.heroImageAlt}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full backdrop-blur-md bg-white/90 text-slate-900 text-[11px] font-bold">
                      {relPost.categoryLabel}
                    </span>
                    <span className="absolute bottom-3 right-3 text-white/90 text-xs font-medium backdrop-blur-md bg-slate-950/60 px-2 py-0.5 rounded-full">
                      {relPost.readTime}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#003E95] transition-colors leading-snug line-clamp-2 mb-2">
                        {relPost.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {relPost.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#003E95]">
                      <span>Read Masterclass</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
