"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Milestone,
  Sparkles,
  Award,
  Globe,
  Zap,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface TimelineEvent {
  year: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: { label: string; value: string };
  highlights: string[];
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "Founding",
    tag: "The In-House Atelier",
    title: "Establishing In-House Dubai Joinery",
    subtitle: "Eliminating third-party delays with dedicated CNC workshops",
    description:
      "Impact Makers Events was founded in Dubai with a dedicated in-house carpentry and fabrication facility, delivering bespoke exhibition stands with millimeter precision.",
    image: "/images/prev/booth_1.webp",
    stats: { label: "Workshop Scope", value: "100% In-House" },
    highlights: ["5-Axis CNC automated cutting", "Bespoke exhibition timber joinery", "Polyurethane spray booth"],
  },
  {
    year: "Expansion",
    tag: "Regional Footprint",
    title: "DEC, DWTC & Middle East Exhibitions",
    subtitle: "Delivering double-decker pavilions for leading global brands",
    description:
      "Scaled operations across premier regional exhibition venues including Dubai World Trade Centre, Dubai Exhibition Centre, and ADNEC, executing flagship aerospace, fintech, and tech builds.",
    image: "/images/executive-pavilion.jpg",
    stats: { label: "Major Builds", value: "350+ Stands" },
    highlights: ["Double-decker structural engineering", "Venue permit authority approvals", "Full VIP hospitality suites"],
  },
  {
    year: "Global Hubs",
    tag: "9 Countries",
    title: "International Cross-Border Operations",
    subtitle: "Active operational network spanning 4 continents",
    description:
      "Established active country hubs across the UAE, Poland, Portugal, Netherlands, USA, Germany, Singapore, Rwanda, and Ethiopia to support global touring corporate clients.",
    image: "/images/kinetic-installation.jpg",
    stats: { label: "Global Network", value: "9 Countries" },
    highlights: ["Unified European logistics", "Single-source international contract", "Consistent quality control"],
  },
  {
    year: "Certified",
    tag: "ISO Excellence",
    title: "Triple ISO Accreditations & Turnkey Mastery",
    subtitle: "ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018",
    description:
      "Awarded full Triple ISO certifications by Universal Registrars, uniting custom stand fabrication, large-scale event organizing, concert AV, space selling, and furniture rental under one roof.",
    image: "/images/summit-keynote.jpg",
    stats: { label: "ISO Accreditations", value: "3 Certifications" },
    highlights: ["ISO 9001 Quality Management", "ISO 14001 Environmental Management", "ISO 45001 Health & Safety"],
  },
];

export default function AboutTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Header reveal
      gsap.fromTo(
        ".timeline-header-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Milestone cards stagger reveal
      const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 78%",
            },
          }
        );
      });

      // Central timeline vertical line progress
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.4,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50/60"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.08),transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.06),transparent_70%)] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <div className="timeline-header-item inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-bold uppercase tracking-wider">
            <Milestone className="w-3.5 h-3.5 text-[#00A7F5]" />
            <span>The Evolution of Craft</span>
          </div>

          <h2 className="timeline-header-item text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.08]">
            A Decade of <span className="text-gradient">Relentless Innovation.</span>
          </h2>

          <p className="timeline-header-item mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From our early modular timber structures to automated kinetic robotics and global arena
            summits, explore our timeline of milestones.
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative">
          {/* Glowing Central Progress Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-slate-200 hidden sm:block">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-[#003E95] via-[#00A7F5] to-[#92DCFF]"
            />
          </div>

          {/* Timeline Events List */}
          <div className="space-y-16 sm:space-y-24">
            {TIMELINE_EVENTS.map((event, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={event.year}
                  className={`timeline-card relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
                    isEven ? "md:text-right" : ""
                  }`}
                >
                  {/* Center Year Badge */}
                  <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-[#00A7F5] shadow-diffused-md font-black text-xs text-[#003E95]">
                      {event.year}
                    </div>
                  </div>

                  {/* Column 1: Narrative & Details */}
                  <div className={`${isEven ? "md:order-2 md:pl-10" : "md:order-1 md:pr-10"}`}>
                    <div className={`flex items-center gap-2 mb-2 ${isEven ? "md:justify-end" : ""}`}>
                      <span className="px-2.5 py-1 rounded-md bg-[#003E95]/10 text-[#003E95] text-xs font-bold">
                        {event.tag}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#00A7F5]" />
                        {event.year}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#00A7F5]">{event.subtitle}</p>

                    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Milestone Highlights */}
                    <div className={`mt-5 flex flex-col gap-2 ${isEven ? "md:items-end" : ""}`}>
                      {event.highlights.map((item) => (
                        <div
                          key={item}
                          className={`flex items-center gap-2 text-xs font-medium text-slate-700 ${
                            isEven ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A7F5] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Visual Card */}
                  <div className={`${isEven ? "md:order-1 md:pr-10" : "md:order-2 md:pl-10"}`}>
                    <div className="relative rounded-3xl overflow-hidden glass-card-elevated p-2 border border-slate-200 shadow-diffused-lg">
                      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 500px"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {/* Floating Metric Pill */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-slate-950/75 backdrop-blur-md border border-white/15 text-white">
                          <span className="text-xs font-medium text-slate-300">
                            {event.stats.label}
                          </span>
                          <span className="text-xs font-black text-[#92DCFF]">
                            {event.stats.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Impact Summary Bar */}
        <div className="mt-24 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-diffused-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
              <span>500+</span>
              <Sparkles className="w-4 h-4 text-[#00A7F5]" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Stands & Summits Built</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
              <span>9 Hubs</span>
              <Globe className="w-4 h-4 text-[#003E95]" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Global Country Offices</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
              <span>100%</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Triple ISO Certified</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
              <span>99.8%</span>
              <Zap className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
