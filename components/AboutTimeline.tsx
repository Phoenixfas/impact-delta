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
    year: "2014",
    tag: "The Genesis",
    title: "Founding the Spatial Architecture Studio",
    subtitle: "Rethinking corporate conventions with physical stagecraft",
    description:
      "Impact B2B was founded with a single radical thesis: corporate events shouldn't feel like sterile lectures — they should evoke the sensory grandeur of monumental theatrical architecture.",
    image: "/images/prev/booth_1.webp",
    stats: { label: "Inaugural Summit", value: "1,200 Attendees" },
    highlights: ["First custom kinetic stage build", "Real-time LED mapping", "Zero failover incident record"],
  },
  {
    year: "2018",
    tag: "Global Footprint",
    title: "International Arenas & Multi-Hub Broadcasts",
    subtitle: "Synchronizing audiences across continents in real time",
    description:
      "Expanded operations across EMEA, APAC, and the Americas, delivering simultaneous multi-hub summits with millisecond-synced optical timecode and broadcast-grade satellite feeds.",
    image: "/images/executive-pavilion.jpg",
    stats: { label: "Global Reach", value: "45+ Countries" },
    highlights: ["Multi-city SMPTE timecode sync", "Dual-redundant server matrix", "Tier-1 enterprise adoption"],
  },
  {
    year: "2022",
    tag: "The Kinetic Lab",
    title: "Autonomous Light Kinetics & Spatial Audio",
    subtitle: "Pioneering interactive audience-responsive environments",
    description:
      "Established the in-house Kinetic Engineering Lab, developing proprietary robotic winches, spatial raytracing acoustic arrays, and interactive lighting grids that react to keynote tempo.",
    image: "/images/kinetic-installation.jpg",
    stats: { label: "Robotic Winches", value: "500+ Nodes" },
    highlights: ["Custom mechanical winch design", "Acoustic spatial simulation", "Industry innovation award"],
  },
  {
    year: "2026",
    tag: "The Modern Era",
    title: "Sensory Brand Worlds & Real-Time Telemetry",
    subtitle: "Next-generation B2B summits with measurable emotional ROI",
    description:
      "Today, Impact B2B architects global flagship events for Fortune 100 leaders, combining cinematic stage previz in Unreal Engine with real-time biometric and audience telemetry analytics.",
    image: "/images/summit-keynote.jpg",
    stats: { label: "Enterprise Valuation", value: "$4.2B+ Pipeline" },
    highlights: ["Unreal Engine 5 stage previz", "Real-time spatial heatmaps", "500+ summits delivered"],
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
              <span>12+</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Years of Craft</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
              <span>500+</span>
              <Sparkles className="w-4 h-4 text-[#00A7F5]" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Summits Produced</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
              <span>120+</span>
              <Globe className="w-4 h-4 text-[#003E95]" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">International Venues</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
              <span>0.0ms</span>
              <Zap className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Failover Latency</div>
          </div>
        </div>
      </div>
    </section>
  );
}
