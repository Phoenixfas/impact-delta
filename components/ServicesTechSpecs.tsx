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
    id: "workshop-machinery",
    title: "In-House Workshop & CNC Machinery",
    shortLabel: "Workshop & CNC",
    icon: Layers,
    description: "Industrial 5-axis CNC timber routers, structural steel welding bays, and pressurized polyurethane spray booths in Dubai.",
    badge: "±0.5MM PRECISION",
    items: [
      {
        id: "biesse-cnc",
        name: "Biesse Rover 5-Axis Industrial CNC Router",
        category: "Automated Timber Milling",
        modelStandard: "Rover A 5-Axis CNC Processing Center",
        benchmark: "±0.5mm Repeatable Cutting Accuracy Across Sheet Timber",
        description:
          "High-speed 5-axis computer numerical control router for intricate 3D organic curves, acrylic fretwork, and modular exhibition joinery.",
        tags: ["5-Axis CNC", "±0.5mm Precision", "3D Curved Milling", "Rapid Joinery"],
        image: "/images/prev/booth_1.webp",
        imageAlt: "In-house 5-axis CNC timber milling for exhibition stands",
        statusBadge: "ACTIVE WORKSHOP ASSET",
        telemetry: { label: "Tolerance", value: "±0.5 mm" },
        specsList: [
          "5-axis continuous interpolation for organic architectural waves",
          "Automated tool-changer with 18 high-precision diamond bits",
          "Direct CAD/CAM integration with 3D Max and SolidWorks",
        ],
      },
      {
        id: "spray-booth",
        name: "Pressurized Downdraft Polyurethane Spray Booth",
        category: "Paint & Surface Finishing",
        modelStandard: "Heated Downdraft Cleanroom Spray Facility",
        benchmark: "Pristine High-Gloss & Matte Polyurethane Finishes",
        description:
          "Dust-free climate-controlled paint facility applying multi-coat polyurethane primers, custom Pantone color matches, and satin clear-coats.",
        tags: ["Cleanroom Booth", "Exact Pantone Match", "High-Gloss PU", "Dust-Free"],
        image: "/images/render2.webp",
        imageAlt: "Exhibition stand paint and polyurethane spray booth finishing",
        statusBadge: "CLEANROOM FINISH",
        telemetry: { label: "Drying Cycle", value: "Heated Cure" },
        specsList: [
          "Micro-filtered positive air pressure preventing dust contamination",
          "Spectrophotometer color calibration matching corporate Pantones",
          "Class 1 fire-retardant clear-coat sealers certified for DWTC/DEC",
        ],
      },
      {
        id: "steel-welding",
        name: "Structural Steel Welding & Double-Decker Bays",
        category: "Structural Engineering",
        modelStandard: "MIG/TIG Certified Structural Steel Fabrication",
        benchmark: "PE-Stamped Load Bearing Capacity for Double-Decker Mezzanines",
        description:
          "Certified structural steel and truss fabrication for multi-story exhibition stands, cantilevered VIP viewing decks, and overhead bridge spans.",
        tags: ["MIG/TIG Certified", "Double-Decker Steel", "PE Stamped", "Heavy Duty"],
        image: "/images/kinetic-installation.jpg",
        imageAlt: "Structural steel fabrication for double-decker exhibition booths",
        statusBadge: "PE STAMPED RATED",
        telemetry: { label: "Load Capacity", value: "5.0 kN/m²" },
        specsList: [
          "Certified structural welders complying with BS/EN and UAE building codes",
          "Modular bolt-together steel subframes for rapid 48-hour on-site assembly",
          "Independent structural load testing and ultrasonic weld inspections",
        ],
      },
    ],
  },
  {
    id: "av-rigging",
    title: "Concert Audiovisual & Curved 4K LED",
    shortLabel: "AV & 4K LED",
    icon: Cpu,
    description: "Curved 4K LED ribbon walls, Brompton video processing, d&b line arrays, and DMX robotic stage lighting.",
    badge: "15,000 M² LED",
    items: [
      {
        id: "brompton-sx40",
        name: "Curved 4K LED Video Ribbon & Brompton SX40",
        category: "Fine-Pitch LED Displays",
        modelStandard: "ROE Visual BP2V2 2.6mm & Brompton Tessera SX40",
        benchmark: "12-Bit 4:4:4 Processing with Zero Moiré on 4K Broadcasts",
        description:
          "Ultra-fine pitch curved indoor LED video displays delivering true HDR color depth, high refresh rates, and seamless convex/concave curves.",
        tags: ["2.6mm Fine Pitch", "Brompton SX40", "Curved Concave/Convex", "HDR Color"],
        image: "/images/summit-keynote.jpg",
        imageAlt: "Curved 4K LED video wall installation at Dubai exhibition",
        statusBadge: "BROADCAST CALIBRATED",
        telemetry: { label: "Pixel Pitch", value: "2.6 mm Fine" },
        specsList: [
          "Dynamic calibration with 12-bit grayscale depth for deep blacks",
          "ShutterSync camera lock eliminating flicker under broadcast lenses",
          "Modular magnetic curving brackets supporting organic wave displays",
        ],
      },
      {
        id: "dbaudio-linearray",
        name: "d&b audiotechnik KSL & V-Series Line Arrays",
        category: "Concert Acoustics & Audio",
        modelStandard: "d&b KSL8 / KSL12 & D80 DSP Digital Amps",
        benchmark: "Cardioid Acoustic Dispersion with ±1.5dB Sound Uniformity",
        description:
          "Premium concert-grade line array sound reinforcement for large exhibition arenas, plenary auditoriums, and gala ballrooms.",
        tags: ["Cardioid Array", "D80 DSP Amps", "Dante Network", "100% Clean Audio"],
        image: "/images/executive-pavilion.jpg",
        imageAlt: "Concert line array audio system for enterprise summits",
        statusBadge: "ACTIVE STADIUM SPEC",
        telemetry: { label: "Peak SPL", value: "145 dB" },
        specsList: [
          "ArrayProcessing FIR filters compensating for room humidity and distance",
          "Full cardioid dispersion eliminating stage and backstage echo reflections",
          "Redundant optical Dante AES67 audio streams with instant fallback",
        ],
      },
      {
        id: "robe-lighting",
        name: "Robe & Claypaky Robotic Stage Lighting Rigs",
        category: "DMX Stage & Ambient Lighting",
        modelStandard: "Robe BMFL, MegaPointe & grandMA3 Consoles",
        benchmark: "Sub-Millisecond DMX Timecode Choreography",
        description:
          "Robotic moving heads, architectural profile spots, and warm LED wash fixtures programmed on grandMA3 control surfaces.",
        tags: ["grandMA3 Control", "Robe BMFL", "DMX Moving Heads", "RGBW Architectural"],
        image: "/images/kinetic-installation.jpg",
        imageAlt: "Robotic stage lighting and DMX light show for product reveals",
        statusBadge: "DMX MASTER CONTROL",
        telemetry: { label: "Control Consoles", value: "grandMA3 Full" },
        specsList: [
          "Wireless DMX / ArtNet distribution across multi-universe rigs",
          "High CRI (>95) architectural daylight spots for VIP product displays",
          "Automated timecode cues synchronizing lighting changes with video reveal",
        ],
      },
    ],
  },
  {
    id: "broadcast-congress",
    title: "4K Broadcast, Livestream & Congress Audio",
    shortLabel: "Broadcast & Congress",
    icon: Radio,
    description: "4K multi-camera livestream flypacks, Bosch simultaneous interpretation in 8+ languages, and cinema-grade optics.",
    badge: "8+ LANGUAGES",
    items: [
      {
        id: "sony-4k-flypack",
        name: "Sony FX9 / FX6 4K Multi-Camera Flypacks",
        category: "4K Video & Livestreaming",
        modelStandard: "Sony Cinema Line 4K Chains & ATEM Constellation",
        benchmark: "4K HDR Multi-Camera Broadcast with Sub-Second Global Uplink",
        description:
          "Complete mobile broadcast control suite with multi-camera 4K switching, lower-thirds overlays, instant replay, and multi-channel master SSD recording.",
        tags: ["Sony FX9 4K", "ATEM 8K Switcher", "LiveU 5G Uplink", "Instant PR Reel"],
        image: "/images/summit-keynote.jpg",
        imageAlt: "4K live broadcast and multi-camera production suite",
        statusBadge: "4K HDR BROADCAST",
        telemetry: { label: "Stream Quality", value: "4K 60FPS" },
        specsList: [
          "Uncompressed 12G-SDI optical camera chains with tally and talkback",
          "LiveU bonded cellular and dedicated fiber uplink for global platforms",
          "Dedicated on-site edit suite delivering highlight reels in 30 minutes",
        ],
      },
      {
        id: "bosch-interpretation",
        name: "Bosch DCN Wireless Simultaneous Interpretation",
        category: "Diplomatic Congress Systems",
        modelStandard: "Bosch DCN Next Generation Wireless & IR Radiators",
        benchmark: "Crystal-Clear Multilingual Audio Across 8+ Live Language Channels",
        description:
          "Diplomatic-grade conference microphone and simultaneous interpretation systems for international government congresses and bilateral ministerial talks.",
        tags: ["Bosch DCN", "8+ Languages", "Encrypted IR", "Diplomatic Protocol"],
        image: "/images/executive-pavilion.jpg",
        imageAlt: "Bosch simultaneous interpretation headsets and congress microphones",
        statusBadge: "DIPLOMATIC SPEC",
        telemetry: { label: "Language Tracks", value: "Up to 32 Ch" },
        specsList: [
          "Encrypted infrared audio transmission preventing signal eavesdropping",
          "Acoustically isolated interpreter booths compliant with ISO 2603",
          "Automated chairperson priority control and digital delegate voting units",
        ],
      },
    ],
  },
  {
    id: "furniture-catalog",
    title: "Designer Event Furniture & Lounge Styling",
    shortLabel: "Designer Furniture",
    icon: Sparkles,
    description: "Scandinavian lounge armchairs, Le Corbusier leather sofas, Tolix barstools, and gold geometric wire coffee tables.",
    badge: "2,500+ PCS",
    items: [
      {
        id: "corbusier-seating",
        name: "Le Corbusier Style LC2 & LC3 Leather Sofas",
        category: "VIP Executive Seating",
        modelStandard: "LC2 & LC3 1-Seater, 2-Seater & 3-Seater Sofas",
        benchmark: "Immaculate Premium Italian Leather with Polished Chrome Frames",
        description:
          "Iconic modern luxury sofas in premium black, white, and cognac leather, providing an upscale executive atmosphere for meeting suites and VIP pavilions.",
        tags: ["Corbusier Style", "Italian Leather", "Chrome Frame", "VIP Lounge"],
        image: "/images/prev/booth_1.webp",
        imageAlt: "Designer Le Corbusier style leather sofas for exhibition booths",
        statusBadge: "PREMIUM LEATHER",
        telemetry: { label: "Stock Units", value: "350+ Sofas" },
        specsList: [
          "Pristine condition guarantee with steam-cleaning prior to every deployment",
          "Available in single-seat armchairs, 2-seater love seats, and 3-seater sofas",
          "Pairs with matching chrome, glass, and white marble coffee tables",
        ],
      },
      {
        id: "scandinavian-armchairs",
        name: "Scandinavian Minimalist Lounge Armchairs",
        category: "Designer Lounge Armchairs",
        modelStandard: "Curved Oak & Velvet / Bouclé Accent Armchairs",
        benchmark: "Contemporary Nordic Design with Ergonomic Executive Comfort",
        description:
          "Curated designer armchairs featuring natural oak legs, curved contours, and stain-resistant velvet/bouclé upholstery in neutral grey, forest green, and navy.",
        tags: ["Scandinavian Design", "Velvet / Bouclé", "Natural Oak", "Ergonomic"],
        image: "/images/executive-pavilion.jpg",
        imageAlt: "Scandinavian designer armchairs and event lounge seating",
        statusBadge: "NORDIC MINIMALISM",
        telemetry: { label: "Catalog Colors", value: "6 Colorways" },
        specsList: [
          "Ergonomic curved backrest for relaxed multi-hour business meetings",
          "Stain-resistant commercial fabric with fire-retardant foam core",
          "Matched with geometric wire coffee tables and accent lighting",
        ],
      },
      {
        id: "tolix-barstools",
        name: "Industrial Tolix Barstools & Cocktail High-Tops",
        category: "High-Top Bar Seating",
        modelStandard: "Tolix Style 76cm Steel Barstools with Wooden Seats",
        benchmark: "Heavy-Duty Powder-Coated Steel (Matte Black, Gunmetal, Brushed Copper)",
        description:
          "Sleek barstools and cocktail high-tables ideal for stand hospitality counters, networking cocktail hours, and interactive demo zones.",
        tags: ["Tolix Style", "Matte Black / Copper", "Solid Wood Seat", "Cocktail Height"],
        image: "/images/kinetic-installation.jpg",
        imageAlt: "Tolix style barstools and cocktail high-top tables",
        statusBadge: "HIGH-TRAFFIC SPEC",
        telemetry: { label: "Total Inventory", value: "800+ Stools" },
        specsList: [
          "Durable powder-coated finish resistant to scratches and heavy foot traffic",
          "Solid dark-walnut wooden seat top with ergonomic footrest crossbars",
          "Pairs with matching round and square marble/matte black bar tables",
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
                  TRIPLE ISO CERTIFIED ACCREDITATIONS
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  UNIVERSAL REGISTRARS
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                ISO 9001:2015 (Quality) • ISO 14001:2015 (Environment) • ISO 45001:2018 (Safety)
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Impact Makers Events L.L.C is audited and certified across booth fabrication, event organizing, sound & audiovisual systems, gifts & branding, videography/photography, and furniture rentals.
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
