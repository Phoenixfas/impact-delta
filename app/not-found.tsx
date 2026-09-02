"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Home,
  ArrowRight,
  Search,
  Compass,
  Layers,
  Sparkles,
  PhoneCall,
  FileText,
  Radio,
  MapPin,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Building2,
  Globe,
  MessageSquare,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageViewportRef = useRef<HTMLDivElement | null>(null);
  const cardStackRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const number404Ref = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // GSAP Entrance Choreography
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial states
      gsap.set(".stage-reveal-item", {
        opacity: 0,
        y: 28,
      });

      gsap.set(".stage-card-3d", {
        opacity: 0,
        scale: 0.88,
        rotateX: 18,
        rotateY: -15,
      });

      gsap.set(".stage-spotlight-beam", {
        opacity: 0,
        scale: 0.6,
      });

      // Sequence
      tl.to(".stage-spotlight-beam", {
        opacity: 0.85,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
      })
        .to(
          ".stage-card-3d",
          {
            opacity: 1,
            scale: 1,
            rotateX: 6,
            rotateY: -6,
            duration: 1.1,
            ease: "back.out(1.4)",
          },
          "-=0.8"
        )
        .to(
          ".stage-reveal-item",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
          },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Interactive 3D Perspective & Spotlight Mouse Physics
  useEffect(() => {
    const stage = stageViewportRef.current;
    const cardStack = cardStackRef.current;
    const spotlight = spotlightRef.current;
    const number404 = number404Ref.current;

    if (!stage || !cardStack) return;

    // Quick setters for silky 60fps interpolation
    const setRotateX = gsap.quickTo(cardStack, "rotationX", { duration: 0.5, ease: "power2.out" });
    const setRotateY = gsap.quickTo(cardStack, "rotationY", { duration: 0.5, ease: "power2.out" });
    const setSpotlightX = spotlight ? gsap.quickTo(spotlight, "x", { duration: 0.4, ease: "power2.out" }) : null;
    const setSpotlightY = spotlight ? gsap.quickTo(spotlight, "y", { duration: 0.4, ease: "power2.out" }) : null;
    const setNumX = number404 ? gsap.quickTo(number404, "x", { duration: 0.6, ease: "power2.out" }) : null;
    const setNumY = number404 ? gsap.quickTo(number404, "y", { duration: 0.6, ease: "power2.out" }) : null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1; // -1 to 1
      const normY = (y / rect.height) * 2 - 1; // -1 to 1

      // Subtle 3D tilt
      setRotateX(-normY * 16);
      setRotateY(normX * 20);

      // Spotlight movement
      if (setSpotlightX && setSpotlightY) {
        setSpotlightX(normX * 120);
        setSpotlightY(normY * 90);
      }

      // Parallax on kinetic 404 text
      if (setNumX && setNumY) {
        setNumX(normX * 24);
        setNumY(normY * 18);
      }
    };

    const handleMouseLeave = () => {
      setRotateX(4);
      setRotateY(-4);
      if (setSpotlightX && setSpotlightY) {
        setSpotlightX(0);
        setSpotlightY(0);
      }
      if (setNumX && setNumY) {
        setNumX(0);
        setNumY(0);
      }
    };

    stage.addEventListener("mousemove", handleMouseMove);
    stage.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      stage.removeEventListener("mousemove", handleMouseMove);
      stage.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const quickNavLinks = [
    {
      title: "8 Core Profile Services",
      subtitle: "Stand Fabrication, AV, Organizing & Furniture",
      href: "/services",
      icon: Layers,
      tag: "In-House Workshop",
    },
    {
      title: "Stand Brief Wizard",
      subtitle: "Interactive 3D Booth Specification Builder",
      href: "/brief",
      icon: Sparkles,
      tag: "Planner",
      badge: "Instant Scope",
    },
    {
      title: "Dubai HQ & 9 Global Hubs",
      subtitle: "Tamem House, Barsha Heights · +971 54 711 4951",
      href: "/contact",
      icon: PhoneCall,
      tag: "Direct RFP Desk",
    },
    {
      title: "Impact Makers Journal",
      subtitle: "DWTC & DEC Stand Guidelines & Tech Guides",
      href: "/blog",
      icon: FileText,
      tag: "Knowledge Base",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden selection:bg-[#003E95] selection:text-white"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[580px] bg-gradient-to-b from-[#00A7F5]/20 via-[#003E95]/12 to-transparent blur-3xl rounded-full -z-10" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-[#92DCFF]/20 blur-3xl rounded-full -z-10" />
      <div className="pointer-events-none absolute top-1/3 left-10 w-80 h-80 bg-[#003E95]/10 blur-3xl rounded-full -z-10" />

      {/* Subtle Architectural Stage Blueprint Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #003E95 1px, transparent 1px),
            linear-gradient(to bottom, #003E95 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow / Live Stage Status Badge */}
        <div className="stage-reveal-item inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md mb-8 group hover:border-[#00A7F5]/40 transition-all duration-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-700">
            Sector 404 // Venue Telemetry
          </span>
          <span className="w-px h-3 bg-slate-200" />
          <span className="text-[11px] font-mono text-[#003E95] font-medium flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#00A7F5] animate-pulse" />
            Unassigned Coordinate
          </span>
        </div>

        {/* 3D Kinetic Visual Stage Container */}
        <div
          ref={stageViewportRef}
          className="relative w-full max-w-2xl h-64 sm:h-76 md:h-84 flex items-center justify-center my-2 cursor-grab active:cursor-grabbing select-none"
          style={{ perspective: 1200 }}
        >
          {/* Spotlight Effect Vector Light Beam */}
          <div
            ref={spotlightRef}
            className="stage-spotlight-beam pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#00A7F5]/25 via-[#92DCFF]/15 to-transparent blur-2xl"
          />

          {/* Floating 3D Perspective Glass Card Stack */}
          <div
            ref={cardStackRef}
            className="stage-card-3d relative w-[300px] sm:w-[460px] md:w-[520px] h-[190px] sm:h-[220px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/80 bg-gradient-to-br from-white/95 via-white/85 to-slate-50/70 shadow-2xl backdrop-blur-xl transition-shadow duration-300"
            style={{
              transformStyle: "preserve-3d",
              boxShadow:
                "0 25px 60px -15px rgba(0, 62, 149, 0.12), 0 0 35px -5px rgba(0, 167, 245, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            {/* Top Bar of the Stage Card */}
            <div
              className="flex items-center justify-between"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono font-medium text-slate-500 ml-1">
                  IMPACT MAKERS // STAGE-COORD
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-[10px] font-mono text-slate-600">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                TRIPLE ISO CERTIFIED
              </div>
            </div>

            {/* Kinetic 404 Typography with Stage Grid Behind */}
            <div
              ref={number404Ref}
              className="relative flex items-center justify-center my-auto"
              style={{ transform: "translateZ(60px)" }}
            >
              <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#003E95] via-[#00A7F5] to-[#92DCFF] drop-shadow-sm select-none font-sans">
                404
              </div>

              {/* Floating Blueprint Stamp */}
              <div className="absolute right-4 sm:right-10 -bottom-2 px-2.5 py-1 rounded-md bg-[#003E95]/10 border border-[#003E95]/20 text-[#003E95] font-mono text-[10px] font-bold tracking-wider uppercase rotate-[-8deg] backdrop-blur-xs">
                UNBUILT PAVILION
              </div>
            </div>

            {/* Bottom Metadata Bar */}
            <div
              className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60"
              style={{ transform: "translateZ(25px)" }}
            >
              <span className="flex items-center gap-1 text-slate-600">
                <Compass className="w-3.5 h-3.5 text-[#00A7F5]" />
                TAMEM HOUSE DUBAI HQ
              </span>
              <span className="text-[#003E95] font-semibold">DEC / DWTC COMPLIANT</span>
            </div>

            {/* Ambient Corner Rigging Accents */}
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00A7F5]/40 rounded-tr-md pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00A7F5]/40 rounded-bl-md pointer-events-none" />
          </div>
        </div>

        {/* Primary Headline & Narrative Copy */}
        <div className="max-w-3xl mx-auto space-y-4 mt-4 mb-8">
          <h1 className="stage-reveal-item text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            404 — Exhibition Space Not Found
          </h1>
          <p className="stage-reveal-item text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            The event pavilion, exhibition stand, or resource you are looking for has either concluded,
            moved to a new hall, or hasn&apos;t been fabricated yet. Let’s guide you back to the main stage.
          </p>
        </div>

        {/* Search Bar Integration */}
        <div className="stage-reveal-item w-full max-w-xl mx-auto mb-10">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center group shadow-diffused-md rounded-2xl bg-white/90 border border-slate-200/90 focus-within:border-[#003E95] focus-within:ring-4 focus-within:ring-[#00A7F5]/15 backdrop-blur-xl transition-all duration-300 p-1.5"
          >
            <div className="pl-3.5 pr-2 text-slate-400 group-focus-within:text-[#003E95] transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search custom stand fabrication, AV rental, or guides..."
              className="w-full py-2.5 px-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden font-normal"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#003E95] to-[#00A7F5] text-white text-xs font-semibold hover:opacity-95 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-400">Popular:</span>
            {[
              { label: "Stand Fabrication", query: "stand fabrication" },
              { label: "Event Organizing", query: "event organizing" },
              { label: "Curved 4K LED & AV", query: "audiovisual" },
              { label: "DWTC Guidelines", query: "dwtc" },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setSearchQuery(chip.query);
                  router.push(`/blog?search=${encodeURIComponent(chip.query)}`);
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-[#003E95]/10 hover:text-[#003E95] border border-slate-200/70 transition-all text-[11px] font-medium cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Magnetic CTA */}
        <div className="stage-reveal-item flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#003E95] via-[#0051BE] to-[#00A7F5] text-white font-semibold text-sm shadow-xl shadow-[#003E95]/20 hover:shadow-2xl hover:shadow-[#00A7F5]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Return to Main Stage (Home)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/brief"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/80 hover:bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:border-[#00A7F5]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-[#00A7F5]" />
            <span>Build a Stand Brief</span>
          </Link>

          <a
            href="https://wa.me/971547114951"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 font-semibold text-sm shadow-xs hover:-translate-y-0.5 transition-all duration-300"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Operations</span>
          </a>
        </div>

        {/* Quick Navigation Matrix Cards */}
        <div className="stage-reveal-item w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Direct Sector Waypoints
            </span>
            <span className="text-xs text-slate-400 font-medium">4 Core Pillars</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {quickNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white/75 hover:bg-white/95 border border-slate-200/80 hover:border-[#00A7F5]/50 shadow-xs hover:shadow-lg hover:shadow-[#003E95]/5 hover:-translate-y-1 transition-all duration-300 text-left backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-[#003E95]/10 group-hover:text-[#003E95] text-slate-700 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      {link.badge ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#003E95] text-white">
                          {link.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 font-medium uppercase">
                          {link.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#003E95] transition-colors line-clamp-1">
                      {link.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{link.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-[#00A7F5] mt-4 pt-2.5 border-t border-slate-100 transition-colors">
                    <span>Navigate</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stage Emergency Support Footer Callout */}
        <div className="stage-reveal-item mt-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80 max-w-2xl w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#003E95]/10 text-[#003E95] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Are you an exhibitor or organizer with an urgent inquiry?
              </p>
              <p className="text-[11px] text-slate-500">
                Our operations team at Tamem House Dubai HQ and across 9 global hubs is on standby 24/7.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#003E95] text-white text-xs font-medium transition-colors shrink-0 shadow-xs"
          >
            <span>RFP Desk</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
