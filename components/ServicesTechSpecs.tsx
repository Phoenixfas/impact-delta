"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu,
  Palette,
  Radio,
  Cast,
  Smartphone,
  Layers,
  Sparkles,
  Server,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Sliders,
  ChevronRight,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

interface TechSpecItem {
  id: string;
  name: string;
  category: string;
  modelStandard: string;
  benchmark: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  statusBadge: string;
  telemetry: { label: string; value: string };
  specsList: string[];
}

interface CategoryGroup {
  id: string;
  title: string;
  shortLabel: string;
  icon: LucideIcon;
  description: string;
  badge: string;
  items: TechSpecItem[];
}

const TECH_CATEGORIES: CategoryGroup[] = [
  {
    id: "av-rigging",
    title: "Audio & Rigging Infrastructure",
    shortLabel: "A/V & Rigging",
    icon: Cpu,
    description: "Stadium-scale sound reinforcement, active beamsteering, and computerized kinetic motor hoists with real-time strain telemetry.",
    badge: "SUB-MS SYNC",
    items: [
      {
        id: "dbaudio-gsl",
        name: "d&b audiotechnik GSL/KSL Line Arrays",
        category: "Acoustics & Sound Reinforcement",
        modelStandard: "GSL8 / GSL12 / SL-SUB Systems",
        benchmark: "±1.5dB SPL Even Dispersion Across 50,000 Seats",
        description:
          "Full-bandwidth cardioid dispersion pattern preventing backstage low-frequency spill, driven by D80 DSP amplifiers with Dante AES67 redundant streaming.",
        tags: ["Cardioid Array", "ArrayProcessing DSP", "Dante / AES67", "150 dB Peak"],
        image: "/images/summit-keynote.jpg",
        imageAlt: "Stadium line array audio system over keynote arena",
        statusBadge: "ACTIVE STADIUM SPEC",
        telemetry: { label: "Peak SPL", value: "150 dB @ 1m" },
        specsList: [
          "ArrayProcessing FIR filters for micro-climatic humidity compensation",
          "Dual-redundant primary and secondary Dante network fallback",
          "ArrayCalc 3D simulation with acoustic raytracing verification",
        ],
      },
      {
        id: "kinesys-apex",
        name: "Kinesys Apex Variable Speed Hoists",
        category: "Kinetic Motor Automation",
        modelStandard: "Apex 500kg & 1250kg Variable Speed Hoists",
        benchmark: "0.001 m/s to 0.5 m/s Smooth Variable Velocity",
        description:
          "SIL3-certified variable speed chain hoists providing sub-millimeter positioning accuracy for dynamic kinetic LED walls and synchronized scenic arrays.",
        tags: ["SIL3 Certified", "Sub-mm Precision", "Load-Cell Telemetry", "E-Stop Matrix"],
        image: "/images/kinetic-installation.jpg",
        imageAlt: "Kinetic chandelier and motorized hoist rigging",
        statusBadge: "SIL3 CERTIFIED",
        telemetry: { label: "Positional Accuracy", value: "±0.5 mm" },
        specsList: [
          "Integrated load-cell sensors measuring dynamic cable tension in real time",
          "Dual independent brakes with zero backlash positioning",
          "Kinesys Vector software with 3D collision envelope detection",
        ],
      },
      {
        id: "digico-quantum",
        name: "DiGiCo Quantum 7 / 338 Consoles",
        category: "Digital Mixing Infrastructure",
        modelStandard: "Quantum 7 Engine with Mustard Processing",
        benchmark: "Sub-0.8ms End-to-End Processing Latency",
        description:
          "Dual-engine mixing consoles with redundant optical loops, delivering 256 input channels, 128 aux/sub busses, and FPGA-based Spice Rack native dynamic processors.",
        tags: ["Dual FPGA Engines", "Optocore Optical Loop", "256 Channels", "32-bit Preamps"],
        image: "/images/executive-pavilion.jpg",
        imageAlt: "Audio control console and optical network racks",
        statusBadge: "DUAL FPGA ENGINES",
        telemetry: { label: "Process Latency", value: "< 0.8 ms" },
        specsList: [
          "Optocore redundant fiber loop with automatic sub-millisecond switchover",
          "Mustard processing strip with analog vintage emulation on all channels",
          "Automated broadcast matrix downmix for simultaneous 5.1/Stereo livestreams",
        ],
      },
    ],
  },
  {
    id: "lighting-mapping",
    title: "3D Mapping & Stage Lighting",
    shortLabel: "Lighting & LED",
    icon: Palette,
    description: "16K Brompton LED processing, Unreal Engine 5 virtual production, and synchronized volumetric laser projection arrays.",
    badge: "16K CANVAS",
    items: [
      {
        id: "brompton-sx40",
        name: "Brompton Tessera SX40 8K Processors",
        category: "LED Video Processing",
        modelStandard: "Tessera SX40 & XD 10G Data Distribution",
        benchmark: "12-Bit 4:4:4 Processing at 144Hz Native Refresh",
        description:
          "Ultra-low latency LED video processors with dynamic calibration, HDR reproduction, and ShutterSync technology eliminating camera scan lines and moiré artifacts.",
        tags: ["Dynamic Calibration", "12-Bit HDR", "ShutterSync", "10G Optical XD"],
        image: "/images/prev/booth_1.webp",
        imageAlt: "High-resolution curved LED video wall",
        statusBadge: "BROADCAST CALIBRATED",
        telemetry: { label: "Color Depth", value: "12-Bit 4:4:4" },
        specsList: [
          "PureTone precision low-brightness grayscale reproduction",
          "3D LUT color management matched to broadcast camera sensors",
          "Redundant trunk connections with automatic loop-back failure recovery",
        ],
      },
      {
        id: "disguise-gx3",
        name: "disguise gx3 Real-Time Media Servers",
        category: "Generative & Previz Workstations",
        modelStandard: "gx3 Media Server with NVIDIA RTX A6000",
        benchmark: "16K 60FPS Uncompressed Playback & Notch VFX",
        description:
          "Enterprise media servers built for real-time generative visual graphics, Unreal Engine spatial integration, and sub-frame genlock synchronization.",
        tags: ["NVIDIA RTX A6000", "Notch VFX Native", "Unreal Engine 5", "Genlock Synced"],
        image: "/images/render2.webp",
        imageAlt: "Real-time generative 3D visual graphics on stage",
        statusBadge: "16K 60FPS GENLOCK",
        telemetry: { label: "GPU Power", value: "48GB VRAM Dual" },
        specsList: [
          "Active-Active hot backup with automated matrix video crossbar switches",
          "Real-time camera tracking integration with stYpe and Ncam systems",
          "Direct SMPTE ST 2110 IP video ingest and egress ports",
        ],
      },
      {
        id: "kvant-lasers",
        name: "Kvant Spectrum 30W Volumetric Lasers",
        category: "Laser Show Systems",
        modelStandard: "Spectrum 30 RGB High-Power Lasers",
        benchmark: "40,000 PPS Scanning Speed & Pangolin FB4 Core",
        description:
          "High-power full-color architectural laser systems with integrated optical scanners, emergency beam-shutter safety, and Pangolin Beyond network automation.",
        tags: ["Pangolin FB4", "40k PPS Scanners", "Active Safety E-Stop", "30W Pure Diode"],
        image: "/images/summit-keynote.jpg",
        imageAlt: "Volumetric laser show over stadium crowd",
        statusBadge: "FDA / CDRH COMPLIANT",
        telemetry: { label: "Beam Power", value: "30,000 mW RGB" },
        specsList: [
          "Integrated Pangolin FB4 MAX control interface on ArtNet/sACN",
          "Automated audience scanning safety lenses with PASS supervision",
          "Hermetically sealed optical compartments with IP65 weather rating",
        ],
      },
    ],
  },
  {
    id: "event-apps",
    title: "Custom Event Apps & Telemetry",
    shortLabel: "Apps & Telemetry",
    icon: Smartphone,
    description: "Ultra-low latency attendee companion apps, RFID badge access control, interactive keynote Q&A, and unified EOC dispatch dashboards.",
    badge: "ZERO LAG I/O",
    items: [
      {
        id: "rfid-access",
        name: "High-Density RFID Ingress & Access Hubs",
        category: "Access Control & Ingress Telemetry",
        modelStandard: "UHF Long-Range RFID Portals & NFC Badges",
        benchmark: "3,000 Attendees Scanned / Minute / Gate",
        description:
          "Fast-throughput contactless gate portals providing sub-second credential validation, VIP floor access alerts, and live spatial crowd density heatmaps.",
        tags: ["UHF RFID", "Sub-Second Ingress", "Live Heatmaps", "Encrypted Badges"],
        image: "/images/executive-pavilion.jpg",
        imageAlt: "RFID registration and summit badge check-in hub",
        statusBadge: "HIGH DENSITY INGRESS",
        telemetry: { label: "Scan Velocity", value: "< 0.3s / Gate" },
        specsList: [
          "Real-time crowd flow congestion alerts dispatched to EOC coordinators",
          "Encrypted cryptographic keys preventing badge duplication or cloning",
          "Offline edge-node local caching ensuring uninterrupted gate operation",
        ],
      },
      {
        id: "keynote-interactive",
        name: "Real-Time Keynote Interactivity Engine",
        category: "Audience Participation & Polling",
        modelStandard: "WebSocket Edge-Sync Cluster (50,000+ Concurrency)",
        benchmark: "< 50ms Live Poll Aggregation Across 50,000 Devices",
        description:
          "Ultra-low latency web and native polling engine rendering live attendee sentiment, word clouds, and moderated executive Q&A directly onto 16K stage LED screens.",
        tags: ["WebSocket Edge", "50k+ Concurrent", "< 50ms Latency", "16K Screen Push"],
        image: "/images/kinetic-installation.jpg",
        imageAlt: "Audience interactive voting graphics displayed on stage",
        statusBadge: "50K+ CONCURRENT",
        telemetry: { label: "Poll Sync Latency", value: "< 50 ms" },
        specsList: [
          "Global Anycast edge deployment with sub-50ms latency worldwide",
          "AI-assisted sentiment clustering and multi-language moderation filter",
          "Direct API push into disguise gx3 media servers for on-screen infographics",
        ],
      },
    ],
  },
  {
    id: "broadcast-streaming",
    title: "Live Broadcast & Remote Streaming",
    shortLabel: "Live Broadcast",
    icon: Cast,
    description: "4K HDR multi-camera flypacks, dual redundant C-band satellite uplinks, SRT/NDI studio routing, and instant PR asset mastering.",
    badge: "4K HDR UHD",
    items: [
      {
        id: "sony-broadcast-flypack",
        name: "Sony HDC-4300 4K HDR Camera Flypacks",
        category: "Camera Chains & Video Production",
        modelStandard: "Sony HDC-4300 with Canon 4K Box Lenses",
        benchmark: "4K UHD 120 FPS Native with BT.2020 Color Space",
        description:
          "Broadcast studio flypacks with three-phase optical fiber camera chains, super-motion slow motion, and Grass Valley Kayenne 4K production switchers.",
        tags: ["4K HDR BT.2020", "Canon 86x Box Lens", "Grass Valley Switcher", "12G-SDI / ST 2110"],
        image: "/images/summit-keynote.jpg",
        imageAlt: "Broadcast camera setup overlooking keynote arena",
        statusBadge: "BROADCAST 4K HDR",
        telemetry: { label: "Camera Sensor", value: "3x 2/3-inch 4K" },
        specsList: [
          "Dual SMPTE tactical fiber camera cables supporting distances up to 3,000m",
          "Uncompressed 12G-SDI and SMPTE ST 2110 optical signal architecture",
          "Real-time ISO recording across all camera angles onto redundant ProRes SSDs",
        ],
      },
      {
        id: "satellite-teleport",
        name: "Dual-Redundant C-Band Satellite Uplinks",
        category: "Global Transmission & Uplink",
        modelStandard: "Dual 2.4m Motorized C/Ku Auto-Acquire Antennas",
        benchmark: "99.9999% Transmission Availability (Rain-Fade Resistant)",
        description:
          "Dual-truck mobile satellite transmission hubs with primary and secondary space segment paths, coupled with bonded Teradek SRT and LiveU cellular backhaul.",
        tags: ["C/Ku Band Uplink", "Rain-Fade Redundant", "SRT Point-to-Point", "LiveU Bonded"],
        image: "/images/executive-pavilion.jpg",
        imageAlt: "Satellite broadcast transmission equipment and telemetry",
        statusBadge: "99.9999% TRANSMISSION",
        telemetry: { label: "Uplink Redundancy", value: "Dual Space Path" },
        specsList: [
          "Dual redundant high-power traveling-wave tube amplifiers (TWTAs)",
          "BISS-CA encrypted transport stream distribution to global broadcast affiliates",
          "Real-time carrier monitoring with automated teleport failover switches",
        ],
      },
    ],
  },
];

// Offset for floating preview card relative to cursor
const FLOAT_OFFSET_X = 28;
const FLOAT_OFFSET_Y = -180;

export default function ServicesTechSpecs() {
  const { scrollTo } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabsListRef = useRef<HTMLDivElement | null>(null);
  const matrixContainerRef = useRef<HTMLDivElement | null>(null);
  const floatingTooltipRef = useRef<HTMLDivElement | null>(null);
  const floatSetters = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const [activeTabId, setActiveTabId] = useState<string>("av-rigging");
  const [hoveredSpecItem, setHoveredSpecItem] = useState<TechSpecItem | null>(null);

  // Setup GSAP quickTo for ultra-smooth spring physics cursor tracking
  useEffect(() => {
    if (!floatingTooltipRef.current) return;

    floatSetters.current = {
      x: gsap.quickTo(floatingTooltipRef.current, "x", {
        duration: 0.45,
        ease: "power3.out",
      }),
      y: gsap.quickTo(floatingTooltipRef.current, "y", {
        duration: 0.45,
        ease: "power3.out",
      }),
    };
  }, []);

  // Entrance animation for header and tabs
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".techspecs-intro",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate items on tab switch without page refresh
  const handleTabChange = (categoryId: string) => {
    if (activeTabId === categoryId) return;

    // Fade out slightly and stagger in new items
    if (matrixContainerRef.current) {
      gsap.fromTo(
        matrixContainerRef.current.children,
        { opacity: 0, y: 18, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }

    setActiveTabId(categoryId);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => {
    if (floatSetters.current) {
      floatSetters.current.x(e.clientX + FLOAT_OFFSET_X);
      floatSetters.current.y(e.clientY + FLOAT_OFFSET_Y);
    }
  };

  const handleSpecMouseEnter = (spec: TechSpecItem, e: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => {
    setHoveredSpecItem(spec);

    if (floatingTooltipRef.current) {
      gsap.set(floatingTooltipRef.current, {
        x: e.clientX + FLOAT_OFFSET_X,
        y: e.clientY + FLOAT_OFFSET_Y,
      });
      gsap.to(floatingTooltipRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  };

  const handleSpecMouseLeave = () => {
    setHoveredSpecItem(null);
    if (floatingTooltipRef.current) {
      gsap.to(floatingTooltipRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.25,
        ease: "power3.in",
      });
    }
  };

  const currentCategory = TECH_CATEGORIES.find((c) => c.id === activeTabId) || TECH_CATEGORIES[0];
  const CategoryIcon = currentCategory.icon;

  return (
    <section
      id="services-specs"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative w-full py-24 sm:py-36 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 overflow-hidden"
    >
      {/* Background Architectural Patterns */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      <div className="pointer-events-none absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-bl from-[#00A7F5]/10 via-transparent to-transparent blur-3xl" />

      {/* =========================================================================
          FLOATING CURSOR-TRACKING PREVIEW TOOLTIP
          ========================================================================= */}
      <div
        ref={floatingTooltipRef}
        className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 scale-90 w-80 rounded-2xl bg-slate-950/95 backdrop-blur-xl text-white border border-slate-700 shadow-2xl p-4 hidden lg:block overflow-hidden transition-[opacity,transform]"
        style={{ willChange: "transform, opacity" }}
      >
        {hoveredSpecItem && (
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10">
              <Image
                src={hoveredSpecItem.image}
                alt={hoveredSpecItem.imageAlt}
                fill
                sizes="320px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-white">
                <span className="bg-[#003E95]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold">
                  {hoveredSpecItem.statusBadge}
                </span>
                <span className="text-[#00A7F5] font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Live
                </span>
              </div>
            </div>

            {/* Title & Telemetry */}
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                HARDWARE BENCHMARK
              </div>
              <div className="text-xs font-bold text-white leading-tight">
                {hoveredSpecItem.name}
              </div>
              <div className="text-[11px] font-mono text-[#00A7F5] font-semibold mt-1">
                {hoveredSpecItem.benchmark}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="techspecs-intro max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 rounded-full bg-[#003E95]/10 border border-[#003E95]/20 text-[#003E95] text-xs font-bold tracking-wider uppercase">
            <Server className="w-3.5 h-3.5 text-[#00A7F5]" />
            <span>INFRASTRUCTURE & TECHNICAL RIGGING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.06] mb-6">
            Enterprise Rigging & <span className="text-gradient">Hardware Matrix.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Transparent technical capabilities engineered for maximum reliability. Hover across items to inspect hardware blueprints, deployment telemetry, and verified performance benchmarks.
          </p>
        </div>

        {/* =========================================================================
            INTERACTIVE CATEGORY FILTER TABS
            ========================================================================= */}
        <div
          ref={tabsListRef}
          className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none pb-4 mb-10 border-b border-slate-200"
        >
          {TECH_CATEGORIES.map((cat) => {
            const IconEl = cat.icon;
            const isActive = activeTabId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat.id)}
                className={`relative px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 select-none min-w-max cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-diffused-md scale-[1.02]"
                    : "bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/60"
                }`}
              >
                <IconEl
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#00A7F5]" : "text-slate-400"
                  }`}
                />
                <span>{cat.shortLabel}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/15 text-[#00A7F5]"
                      : "bg-slate-200/80 text-slate-500"
                  }`}
                >
                  {cat.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Category Description Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#003E95] text-white flex items-center justify-center shadow-diffused-sm">
              <CategoryIcon className="w-5 h-5 text-[#00A7F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentCategory.title}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#00A7F5]/15 text-[#003E95] text-[10px] font-extrabold uppercase">
                  {currentCategory.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {currentCategory.description}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 min-w-max">
            <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" /> Hover item for live visual preview
          </div>
        </div>

        {/* =========================================================================
            TECHNICAL SPECIFICATION MATRIX (INTERACTIVE HOVER-LIST)
            ========================================================================= */}
        <div
          ref={matrixContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {currentCategory.items.map((spec) => (
            <div
              key={spec.id}
              onMouseEnter={(e) => handleSpecMouseEnter(spec, e)}
              onMouseLeave={handleSpecMouseLeave}
              className="group relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-diffused-sm hover:shadow-diffused-xl hover:border-[#00A7F5]/50 transition-all duration-300 flex flex-col justify-between cursor-default overflow-hidden"
            >
              {/* Card Header & Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#003E95] bg-[#003E95]/10 px-2.5 py-1 rounded-md">
                    {spec.category}
                  </span>
                  <div className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {spec.telemetry.label}: <span className="text-slate-900">{spec.telemetry.value}</span>
                  </div>
                </div>

                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1 group-hover:text-[#003E95] transition-colors">
                  {spec.name}
                </h4>

                <div className="text-xs font-mono font-semibold text-slate-500 mb-3">
                  STANDARD: {spec.modelStandard}
                </div>

                {/* Benchmark Highlight */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    PERFORMANCE BENCHMARK
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                    {spec.benchmark}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {spec.description}
                </p>

                {/* Specs List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 mb-4">
                  {spec.specsList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {spec.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => scrollTo("#contact")}
                  aria-label={`Inquire about ${spec.name}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#003E95] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================================
            GLOBAL CERTIFICATIONS & INFRASTRUCTURE SLA BANNER
            ========================================================================= */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/15">
              <ShieldCheck className="w-8 h-8 text-[#00A7F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00A7F5] uppercase">
                  ENTERPRISE INFRASTRUCTURE STANDARDS
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  100% CERTIFIED
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                ISO 45001 • SMPTE ST 2110 • PE-Stamped Structural Rigs • Tier-3 Power
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Every piece of hardware in our inventory is maintained under strict aerospace-grade lifecycle auditing, with routine optical recalibration and certified load-testing.
              </p>
            </div>
          </div>

          <button
            onClick={() => scrollTo("#contact")}
            className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-[#00A7F5] hover:bg-[#0088CC] text-white text-xs font-bold shadow-glow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>Request Full Equipment Rider</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
