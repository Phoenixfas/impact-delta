"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu,
  Palette,
  UtensilsCrossed,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  Zap,
  Activity,
  Sliders,
  Radio,
  Server,
  Globe2,
  Box,
  Flame,
  ChevronRight,
  Maximize2,
  type LucideIcon,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

export interface ServiceGridItem {
  id: string;
  category: string;
  title: string;
  tagline: string;
  shortDescription: string;
  icon: LucideIcon;
  colSpan: string; // e.g. "lg:col-span-7"
  image: string;
  imageAlt: string;
  badge: string;
  metric: { value: string; label: string };
  accentColor: string;
  subDeliverables: string[];
  drawerData: {
    heroOverview: string;
    workflows: { step: string; title: string; description: string }[];
    equipmentSpecs: { category: string; items: string[] }[];
    caseStudies: { title: string; venue: string; scale: string; highlight: string }[];
    deliverablesChecklist: string[];
    slaGuarantee: string;
  };
}

const SERVICES_DATA: ServiceGridItem[] = [
  {
    id: "technical-av",
    category: "01 // INFRASTRUCTURE & SHOW CONTROL",
    title: "Technical & A/V Execution",
    tagline: "Synchronized DMX, SMPTE Timecode & Sub-Millisecond Rigging",
    shortDescription:
      "Engineered for stadium-scale keynotes with zero-fail redundancy, active acoustic beamsteering, and synchronized kinetic volumetric lighting arrays.",
    icon: Cpu,
    colSpan: "lg:col-span-7",
    image: "/images/summit-keynote.jpg",
    imageAlt: "Stadium-scale keynote light show with synchronized kinetic volumetric arrays",
    badge: "ENGINEERING CORE",
    metric: { value: "0.0ms", label: "Failover Latency" },
    accentColor: "#003E95",
    subDeliverables: [
      "Dual-redundant optical SMPTE media server racks",
      "Kinesys motorized kinetic hoist automation arrays",
      "Beam-steering Line Array Sound Reinforcement",
      "Sub-millisecond DMX/ArtNet volumetric show control",
    ],
    drawerData: {
      heroOverview:
        "Our technical execution practice is architected like mission-critical aerospace infrastructure. Every audio packet, pixel buffer, and kinetic motor cue operates on synchronized optical backbones with 100% hot-standby redundancy.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Optical Infrastructure & Signal Routing",
          description:
            "Deployment of multi-channel tactical fiber rings with automatic failover switches, isolating audio, video, and show control networks on dedicated VLANs.",
        },
        {
          step: "PHASE 02",
          title: "Acoustic Modeling & Beamforming Calibration",
          description:
            "3D finite-element sound pressure simulation of the arena geometry to achieve ±1.5dB SPL consistency across all 50,000 attendee seats.",
        },
        {
          step: "PHASE 03",
          title: "SMPTE Choreography & Dry-Run Rehearsals",
          description:
            "Timecode-locked dry runs synchronizing kinetic motion rigs, volumetric laser projectors, and keynote speaker cues with microsecond fidelity.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Show Control & Media Servers",
          items: [
            "disguise gx3 & vx4+ Media Servers (16K uncompressed)",
            "grandMA3 Full-Size & Light DMX Consoles",
            "Brainstorm SR-112 SMPTE Timecode Generators",
          ],
        },
        {
          category: "Acoustics & Audio Reinforcement",
          items: [
            "d&b audiotechnik SL-Series (GSL/KSL) Line Arrays",
            "DiGiCo Quantum 7 & Quantum 338 Digital Consoles",
            "Shure Axient Digital Wireless Microphone Systems with ShowLink",
          ],
        },
        {
          category: "Kinetic Rigging & Volumetrics",
          items: [
            "Kinesys Apex Variable Speed Motor Hoists",
            "Kvant Spectrum 30W RGB Volumetric Show Lasers",
            "Tyler Truss GT & Tomcat Heavy-Duty Structural Rigging",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Global Enterprise AI Keynote Summit",
          venue: "SAP Center // San Jose, CA",
          scale: "18,500 In-Person Attendees // 1.2M Livestream",
          highlight: "Zero audio dropouts across 74 keynote presentations with 3D volumetric laser reveals.",
        },
        {
          title: "Next-Gen EV Worldwide Launch",
          venue: "ExCeL Arena // London, UK",
          scale: "12,000 Attendees // 64 Kinetic LED Hoists",
          highlight: "360-degree kinetic vehicle reveal with sub-frame synchronized LED motion graphics.",
        },
      ],
      deliverablesChecklist: [
        "Complete 3D CAD Rigging & Load-Calculation Schematics",
        "Redundant Audio/Video Signal Flow Diagrams & IP Tables",
        "Full SMPTE Cue Sheets & Master Timecode Timeline",
        "On-site Lead Engineer & 24/7 Redundant Tech Crew",
        "Post-Event Telemetry & Audio Log Archive",
      ],
      slaGuarantee: "99.999% Show Uptime SLA with 0.0ms Optical Failover Guarantee",
    },
  },
  {
    id: "production-logistics",
    category: "02 // COMMAND & GLOBAL OPERATIONS",
    title: "Event Production & Logistics",
    tagline: "Air-Tight Freight, Permitting, Crowd Flow & Incident Command",
    shortDescription:
      "Global turnkey masterplanning handling international customs, venue structural permitting, VIP security protocols, and 24/7 command operations.",
    icon: ShieldCheck,
    colSpan: "lg:col-span-5",
    image: "/images/executive-pavilion.jpg",
    imageAlt: "Executive summit pavilion atrium with VIP logistics command",
    badge: "COMMAND CENTER",
    metric: { value: "120+", label: "Countries Supported" },
    accentColor: "#1E40AF",
    subDeliverables: [
      "End-to-end ATA Carnet & international air freight logistics",
      "Local municipal structural & fire safety permitting",
      "Unified Event Operations Center (EOC) telemetry hub",
      "Dynamic high-density attendee crowd flow management",
    ],
    drawerData: {
      heroOverview:
        "Flawless production demands rigorous operational discipline. We manage international supply chains, municipal compliance, site coordination, and executive protection protocols so your team experiences zero operational friction.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Logistics Masterplanning & ATA Carnet Filing",
          description:
            "Complete customs clearance and air/sea freight routing for mission-critical hardware across multiple international borders simultaneously.",
        },
        {
          step: "PHASE 02",
          title: "Municipal Permitting & Structural Engineering",
          description:
            "Securing certified PE stamped load approvals, local fire marshal permits, and ingress/egress safety clearances ahead of build-out.",
        },
        {
          step: "PHASE 03",
          title: "Unified Command Center Operations",
          description:
            "Central dispatch monitoring live radio comms, schedule run-of-show cues, load-in timelines, and weather telemetry with real-time escalation protocols.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Operations & Communications",
          items: [
            "Riedel Bolero Wireless Intercom Systems (300+ Beltpacks)",
            "Motorola MOTOTRBO Digital Two-Way Radio Networks",
            "Live GPS Freight Tracking & Climate-Controlled Cargo Containers",
          ],
        },
        {
          category: "Site Management & Safety",
          items: [
            "Structural Load-Cell Telemetry & Wind Anemometer Sensors",
            "Emergency Fail-Safe Backup Power Generators (Twin-Pack Synchronized)",
            "High-Capacity Turnstile & RFID Badge Ingress Systems",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Transatlantic Financial Leadership Summit",
          venue: "Palais des Congrès // Paris & Singapore Dual-Hub",
          scale: "8,200 Delegates // 42 Cargo Air Pallets",
          highlight: "Seamless customs transit in 48 hours with zero schedule delays across continents.",
        },
      ],
      deliverablesChecklist: [
        "Comprehensive Master Production Schedule (Minute-by-Minute)",
        "Certified Structural & Fire Marshall Safety Submissions",
        "Freight Tracking Dashboard & Manifests",
        "Radio Comms Channel Matrix & Call Sheets",
        "Incident Command & Evacuation Playbooks",
      ],
      slaGuarantee: "Guaranteed On-Time Strike & Load-In with 100% Regulatory Compliance",
    },
  },
  {
    id: "creative-media",
    category: "03 // SPATIAL MEDIA & GENERATIVE ART",
    title: "Creative & Media Design",
    tagline: "Unreal Engine 5 Previz, Generative Motion & Spatial Scenography",
    shortDescription:
      "Transforming physical spaces into kinetic brand worlds with 16K custom LED geometry, interactive motion capture, and real-time visual engines.",
    icon: Palette,
    colSpan: "lg:col-span-5",
    image: "/images/prev/booth_1.webp",
    imageAlt: "Exhibition design with warm kinetic lighting and 3D media screens",
    badge: "CREATIVE ENGINE",
    metric: { value: "16K", label: "Native LED Canvas" },
    accentColor: "#00A7F5",
    subDeliverables: [
      "Real-time Unreal Engine 5 spatial twin previsualization",
      "16K generative key art & motion brand packages",
      "Dynamic interactive sensor-driven stage surfaces",
      "Bespoke spatial soundscapes & keynote audio branding",
    ],
    drawerData: {
      heroOverview:
        "Where digital artistry converges with physical architecture. We design visual identity systems, motion graphics, and generative canvases that captivate audiences and elevate executive storytelling.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Digital Twin Spatial Previz (UE5)",
          description:
            "Building 1:1 photorealistic digital twins of the event venue, allowing stakeholders to review stage sightlines and lighting cues virtually months in advance.",
        },
        {
          step: "PHASE 02",
          title: "Generative Content & Keynote Motion Design",
          description:
            "Crafting custom 16K visual assets, keynote speaker walk-up stingers, kinetic stage backdrops, and interactive generative visual packages.",
        },
        {
          step: "PHASE 03",
          title: "On-Site Pixel Mapping & Color Calibration",
          description:
            "Direct calibration with spectrophotometers across all LED panels, ensuring pristine Rec.709/DCI-P3 color accuracy for broadcast cameras.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Real-Time Render Engines",
          items: [
            "Unreal Engine 5.4 Virtual Production Workstations",
            "Notch VFX Real-Time Generative Motion Graphics",
            "TouchDesigner Interactive Sensor Processing Servers",
          ],
        },
        {
          category: "Display Technology & Pixel Processors",
          items: [
            "Brompton SX40 4K/8K LED Video Processors",
            "ROE Visual Black Pearl BP2V2 & Ruby High-Nits LED Panels",
            "Barco UDX-4K40 High-Lumen Laser Projectors",
          ],
        },
      ],
      caseStudies: [
        {
          title: "SaaS Enterprise Visionary Gala",
          venue: "Masonic Auditorium // San Francisco, CA",
          scale: "4,500 Attendees // 280-degree Curved LED Canvas",
          highlight: "Generative audio-reactive visuals rendered live at 60 FPS across 14 million physical pixels.",
        },
      ],
      deliverablesChecklist: [
        "Interactive 3D Virtual Previz Environment (Browser & VR Accessible)",
        "Master 16K Keynote Video Package (Apple ProRes 4444 XQ)",
        "Broadcast Color-Matched LED Canvas LUTs",
        "Spatial Audio Stems & Keynote Walk-Up Jingles",
        "Content Media Playback Schedule & Backup Drive Clones",
      ],
      slaGuarantee: "100% Broadcast Color Fidelity & Native Frame-Rate Lock",
    },
  },
  {
    id: "culinary-hospitality",
    category: "04 // EXECUTIVE HOSPITALITY & GASTRONOMY",
    title: "Hospitality & Guest Experience",
    tagline: "Michelin-Partner Haute Cuisine & High-Throughput Executive Catering",
    shortDescription:
      "Bespoke dining ecosystems built for high-density enterprise summits. From multi-course VIP private dining to rapid-service culinary pavilions.",
    icon: UtensilsCrossed,
    colSpan: "lg:col-span-7",
    image: "/images/kinetic-installation.jpg",
    imageAlt: "Gala dinner installation with kinetic chandelier ambiance",
    badge: "HOSPITALITY",
    metric: { value: "5,000+", label: "Plates / Hour" },
    accentColor: "#3B82F6",
    subDeliverables: [
      "Curated menus by Michelin-starred culinary partners",
      "High-speed precision staging for 5,000+ guest covers",
      "Executive VIP lounges with sommelier-led mixology",
      "Sustainable zero-waste sourcing & allergen protocol",
    ],
    drawerData: {
      heroOverview:
        "Gastronomy as an extension of brand prestige. We engineer culinary operations with the precision of a high-end restaurant group, delivering culinary memories at stadium scale without compromises in temperature or presentation.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Concept Design & Menu Prototyping",
          description:
            "Collaborative tasting sessions with Michelin-starred partner chefs to design menus aligned with event themes, VIP dietary preferences, and regional culinary culture.",
        },
        {
          step: "PHASE 02",
          title: "Satellite Kitchen Architecture & Cold-Chain Prep",
          description:
            "Construction of temporary commercial-grade satellite induction kitchens adjacent to the ballroom to ensure sub-2-minute plating-to-table service.",
        },
        {
          step: "PHASE 03",
          title: "Synchronized Service Choreography",
          description:
            "Dedicated brigade service with radio-synchronized team captains executing simultaneous synchronized drops across hundreds of banquet tables.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Kitchen & Staging Technology",
          items: [
            "Rational iCombi Pro Commercial Combi Ovens",
            "Blast Chillers & Mobile Cold-Chain Holding Units",
            "Custom Induction Plating Lines with Precision Heat Lamps",
          ],
        },
        {
          category: "Service Ware & Lounge Furniture",
          items: [
            "Bespoke Artisan Stoneware & Schott Zwiesel Crystal Stemware",
            "Modular VIP Lounge Bars & Custom Nitrogen Cocktail Stations",
            "Zero-Waste Biodegradable Backstage Crew Catering Ware",
          ],
        },
      ],
      caseStudies: [
        {
          title: "World Tech Founders Global Gala",
          venue: "Bellagio Grand Ballroom // Las Vegas, NV",
          scale: "3,800 VIP Guests // 4-Course Synchronized Plated Service",
          highlight: "Entire ballroom served simultaneously in under 6 minutes per course with 99.7% satisfaction rating.",
        },
      ],
      deliverablesChecklist: [
        "Executive Tasting Menus & Sommelier Wine Pairing Guides",
        "Dietary & Allergen Matrix (Halal, Kosher, Vegan, Gluten-Free)",
        "Satellite Kitchen Floorplans & Utility Schematics",
        "Front-of-House Service Choreography Timetable",
        "Full Sustainability & Food Waste Recovery Report",
      ],
      slaGuarantee: "Hot Food Served at &gt;65°C / Cold at &lt;4°C with 100% Dietary Accuracy",
    },
  },
];

export default function ServicesGrid() {
  const { lenis, scrollTo } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceGridItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<"workflow" | "specs" | "caseStudies" | "deliverables">("workflow");

  // GSAP scroll entrance animation for the cards
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-grid-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".bento-card-item",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bento-grid-container",
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Card cursor spotlight & 3D tilt interaction
  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const card = cardsRef.current[index];
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const relX = x / rect.width;
      const relY = y / rect.height;

      // Update spotlight position
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // 3D subtle tilt
      const maxTilt = 4;
      const tiltX = (0.5 - relY) * maxTilt;
      const tiltY = (relX - 0.5) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(
        2
      )}deg) translateY(-4px)`;
    },
    []
  );

  const handleCardMouseLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  }, []);

  // Drawer open / close handlers with Lenis scroll lock
  const openDrawer = (service: ServiceGridItem) => {
    setSelectedService(service);
    setDrawerTab("workflow");
    lenis?.stop();
  };

  const closeDrawer = useCallback(() => {
    setSelectedService(null);
    lenis?.start();
  }, [lenis]);

  // Handle escape key for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedService) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedService, closeDrawer]);

  return (
    <section
      id="services-grid"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden text-slate-900"
    >
      {/* Background Architectural Accent Lines */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-[#00A7F5]/5 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="services-grid-header max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#003E95]/10 border border-[#003E95]/20 text-[#003E95] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
            <span>DISCIPLINES & CAPABILITIES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
            Engineered Excellence. <span className="text-gradient">Every Discipline.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Explore our four core event production pillars. Each discipline operates with dedicated engineering teams, redundancy matrices, and transparent technical deliverables.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="bento-grid-container grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {SERVICES_DATA.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                className={`bento-card-item ${service.colSpan} group relative rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-lg shadow-slate-100/50 hover:shadow-diffused-xl hover:border-[#00A7F5]/40 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-default`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Dynamic Cursor Spotlight Radial Glow */}
                <div
                  className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 167, 245, 0.08), transparent 70%)`,
                  }}
                />

                {/* Top Bar of the Card */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-diffused-sm group-hover:scale-105 group-hover:bg-[#003E95] transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-[#00A7F5]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 block">
                        {service.category}
                      </span>
                      <span className="text-xs font-bold text-[#003E95]">{service.badge}</span>
                    </div>
                  </div>

                  {/* Key Metric Badge */}
                  <div className="text-right bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      {service.metric.label}
                    </div>
                    <div className="text-sm font-black text-slate-900">{service.metric.value}</div>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div className="relative z-10 mb-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 group-hover:text-[#003E95] transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
                    {service.tagline}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Visual Image Banner with Gradient Mask */}
                <div className="relative z-10 w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-6 border border-slate-100 group/img">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-mono text-[11px] tracking-wide text-slate-200 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      SPEC // {service.id.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#00A7F5]">
                      <Zap className="w-3.5 h-3.5" /> Telemetry Ready
                    </span>
                  </div>
                </div>

                {/* Expandable Sub-deliverables Micro-list */}
                <div className="relative z-10 pt-4 border-t border-slate-100 mb-6 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    CORE SUB-DELIVERABLES:
                  </span>
                  {service.subDeliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A7F5] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Button */}
                <div className="relative z-10 pt-2 flex items-center justify-between">
                  <button
                    onClick={() => openDrawer(service)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#003E95] text-white text-xs font-bold shadow-diffused-sm hover:shadow-glow-blue transition-all duration-300 cursor-pointer group/btn"
                  >
                    <span>Explore Deliverables</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => openDrawer(service)}
                    className="text-xs font-semibold text-slate-500 hover:text-[#003E95] transition-colors flex items-center gap-1"
                  >
                    <span>Specs & Workflow</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE SLIDE-OVER DRAWER (MODAL DETAIL VIEW)
          ========================================================================= */}
      {selectedService && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={selectedService.title}
        >
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-[fadeIn_0.3s_ease-out]"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Slide-Over Drawer Container */}
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-[slideLeft_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Drawer Header */}
            <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-diffused-sm">
                  {React.createElement(selectedService.icon, {
                    className: "w-6 h-6 text-[#00A7F5]",
                  })}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#003E95] bg-[#003E95]/10 px-2 py-0.5 rounded-md">
                      {selectedService.category}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {selectedService.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {selectedService.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {selectedService.tagline}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeDrawer}
                aria-label="Close drawer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Interactive Tab Navigation */}
            <div className="px-6 sm:px-8 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setDrawerTab("workflow")}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all select-none min-w-max ${
                  drawerTab === "workflow"
                    ? "border-[#003E95] text-[#003E95]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Execution Workflow
              </button>
              <button
                onClick={() => setDrawerTab("specs")}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all select-none min-w-max ${
                  drawerTab === "specs"
                    ? "border-[#003E95] text-[#003E95]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Hardware & Tech Specs
              </button>
              <button
                onClick={() => setDrawerTab("caseStudies")}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all select-none min-w-max ${
                  drawerTab === "caseStudies"
                    ? "border-[#003E95] text-[#003E95]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Case Benchmarks
              </button>
              <button
                onClick={() => setDrawerTab("deliverables")}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all select-none min-w-max ${
                  drawerTab === "deliverables"
                    ? "border-[#003E95] text-[#003E95]"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Scope & SLA
              </button>
            </div>

            {/* Drawer Body Scroll Area */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
              {/* Overview Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#003E95]" /> DISCIPLINE OVERVIEW
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedService.drawerData.heroOverview}
                </p>
              </div>

              {/* TAB 1: WORKFLOW */}
              {drawerTab === "workflow" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    PHASED EXECUTION METHODOLOGY
                  </h4>
                  <div className="space-y-3">
                    {selectedService.drawerData.workflows.map((wf, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200/80 hover:border-[#00A7F5]/50 transition-colors bg-white"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold text-[#003E95] bg-[#003E95]/10 px-2 py-0.5 rounded">
                            {wf.step}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{wf.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-1 mt-1">
                          {wf.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SPECS */}
              {drawerTab === "specs" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    APPROVED ENTERPRISE HARDWARE & SYSTEMS
                  </h4>
                  <div className="space-y-4">
                    {selectedService.drawerData.equipmentSpecs.map((spec, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                          <Server className="w-3.5 h-3.5 text-[#003E95]" />
                          <span>{spec.category}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {spec.items.map((item, itemIdx) => (
                            <li
                              key={itemIdx}
                              className="text-xs font-mono text-slate-600 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00A7F5]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CASE STUDIES */}
              {drawerTab === "caseStudies" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    VALIDATED PRODUCTION BENCHMARKS
                  </h4>
                  <div className="space-y-4">
                    {selectedService.drawerData.caseStudies.map((cs, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-black text-white">{cs.title}</h5>
                          <span className="text-[10px] font-mono text-[#00A7F5] bg-white/10 px-2 py-0.5 rounded">
                            {cs.scale.split("//")[0]}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                          <Globe2 className="w-3.5 h-3.5 text-[#00A7F5]" />
                          <span>{cs.venue}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-2.5">
                          {cs.highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DELIVERABLES & SLA */}
              {drawerTab === "deliverables" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    SCOPE MATRIX & SLA GUARANTEE
                  </h4>
                  
                  {/* SLA Box */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <div className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 text-emerald-800 mb-1">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span>CONTRACTUAL SLA GUARANTEE</span>
                    </div>
                    <div className="text-xs font-semibold">
                      {selectedService.drawerData.slaGuarantee}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-900">Included Scope Deliverables:</div>
                    {selectedService.drawerData.deliverablesChecklist.map((deliv, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-6 border-t border-slate-200 bg-slate-50/90 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                Ready to scope <span className="font-bold text-slate-900">{selectedService.title}</span>?
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    closeDrawer();
                    scrollTo("#contact");
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-bold shadow-diffused-sm hover:shadow-glow-blue transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Request Scope Proposal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
