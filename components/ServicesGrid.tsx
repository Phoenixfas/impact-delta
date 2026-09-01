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
    id: "stand-fabrication",
    category: "01 // IN-HOUSE FABRICATION & BUILD",
    title: "Custom Exhibition Stand Fabrication",
    tagline: "In-House 5-Axis CNC Joinery, Structural Steel & Double-Decker Pavilions",
    shortDescription:
      "Engineered in our dedicated Dubai carpentry and metalworking facility. We deliver bespoke exhibition stands, custom kiosks, and multi-story pavilions with zero subcontractor dependency.",
    icon: Layers,
    colSpan: "lg:col-span-7",
    image: "/images/prev/booth_1.webp",
    imageAlt: "Custom exhibition stand fabrication in Dubai by Impact Makers Events",
    badge: "IN-HOUSE WORKSHOP",
    metric: { value: "±0.5mm", label: "CNC Tolerance" },
    accentColor: "#003E95",
    subDeliverables: [
      "5-Axis CNC routing, automated timber joinery & carpentry",
      "Structural steel engineering for double-decker pavilions",
      "Polyurethane spray finishing & architectural acrylics",
      "DWTC, DEC & ADNEC venue permit compliance & fire safety",
    ],
    drawerData: {
      heroOverview:
        "Our in-house Dubai fabrication facility eliminates the quality compromises and delays of third-party subcontractors. We control every millimeter of timber milling, steel welding, and high-gloss paint finishing.",
      workflows: [
        {
          step: "PHASE 01",
          title: "3D Design & Structural Engineering",
          description:
            "Photorealistic 360° 3D Max/V-Ray rendering, structural engineering stress tests for double-decker loads, and DWTC/DEC permit filings.",
        },
        {
          step: "PHASE 02",
          title: "In-House Workshop Fabrication",
          description:
            "Automated 5-axis CNC timber cutting, steel frame welding, acrylic thermoforming, and multi-layer polyurethane spray booth finishing.",
        },
        {
          step: "PHASE 03",
          title: "Turnkey On-Site Assembly & Handover",
          description:
            "Pre-build fit checks in workshop followed by rapid 48-hour on-site load-in, electrical wiring, lighting integration, and spotless handover.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Workshop Machinery & Tooling",
          items: [
            "Biesse Rover 5-Axis Industrial CNC Router",
            "Pressurized Downdraft Polyurethane Paint Spray Booth",
            "MIG/TIG Certified Structural Steel Welding Stations",
          ],
        },
        {
          category: "Materials & Structural Systems",
          items: [
            "Class 1 Fire-Retardant Marine Plywood & MDF",
            "Engineered Structural Steel Box Sections for Double-Deckers",
            "High-Durability Architectural Laminates & Acrylic Diffusers",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Airbus Double-Decker Aerospace Pavilion",
          venue: "Dubai Airshow // DWC Dubai",
          scale: "450 m² Double-Decker // 100% In-House Workshop Build",
          highlight: "Delivered 24 hours ahead of schedule with zero snag items and VIP lounge suites.",
        },
        {
          title: "ADCB Digital Banking Pavilion",
          venue: "Fintech Surge // Dubai World Trade Centre (DWTC)",
          scale: "280 m² Custom Stand // Curved Acrylic LED Integration",
          highlight: "Seamless architectural finish with illuminated kinetic arches and private meeting pods.",
        },
      ],
      deliverablesChecklist: [
        "Photorealistic 3D Stand Renders & Technical CAD Blueprints",
        "Structural Engineering Load Certificates (PE Stamped)",
        "Venue Electrical, Water & Rigging Permit Approvals",
        "Dedicated Workshop Project Manager on Site 24/7",
        "Turnkey Dismantle, Green Strike & Recycling Documentation",
      ],
      slaGuarantee: "100% On-Time Turnkey Handover with ISO 9001 Quality SLA",
    },
  },
  {
    id: "event-management",
    category: "02 // CORPORATE EVENT OPERATIONS",
    title: "Corporate Event Management",
    tagline: "Gala Dinners, Product Reveals, Brand Activations & Executive Summits",
    shortDescription:
      "End-to-end turnkey event management. We handle venue sourcing, thematic stage design, audio-visual technical direction, catering coordination, and on-site run of show.",
    icon: Sparkles,
    colSpan: "lg:col-span-5",
    image: "/images/executive-pavilion.jpg",
    imageAlt: "Corporate event management and executive gala setup in Dubai",
    badge: "EVENT MANAGEMENT",
    metric: { value: "99.8%", label: "Client CSAT" },
    accentColor: "#00A7F5",
    subDeliverables: [
      "Turnkey end-to-end event planning & thematic concepting",
      "Executive run of show choreography & master show calling",
      "VIP delegate concierge, green-rooms & registration systems",
      "Stage set design, ambient lighting & live entertainment curation",
    ],
    drawerData: {
      heroOverview:
        "From high-stakes product launches to prestigious corporate gala dinners, our event producers deliver flawless experiences where creative storytelling meets surgical operational discipline.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Thematic Ideation & Budget Structuring",
          description:
            "Establishing the creative vision, spatial layouts, attendee journey mapping, and milestone budget allocations.",
        },
        {
          step: "PHASE 02",
          title: "Production Sourcing & Vendor Integration",
          description:
            "Coordinating stage set fabrication, technical AV riders, luxury hospitality, and entertainment rehearsals.",
        },
        {
          step: "PHASE 03",
          title: "Live On-Site Show Orchestration",
          description:
            "Master show caller and stage managers driving minute-by-minute cue execution with zero room for error.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Operations & Communications",
          items: [
            "Riedel Bolero Wireless Intercom Matrices",
            "Digital Run-of-Show Clocks & Stage Confidence Monitors",
            "Contactless RFID / QR VIP Registration Kiosks",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Red Bull High-Octane Kinetic Brand Activation",
          venue: "Dubai Autodrome // Dubai",
          scale: "3,500 Attendees // Live Action Stunt Stage",
          highlight: "360-degree immersive brand experience with interactive simulator pods and kinetic lighting.",
        },
      ],
      deliverablesChecklist: [
        "Minute-by-Minute Master Run of Show Document",
        "VIP Protocol & Executive Seating Architecture",
        "Complete Event Operations & Risk Management Playbook",
        "Post-Event Media Highlights & Attendee Telemetry Report",
      ],
      slaGuarantee: "Zero-Fail Live Execution SLA with Dedicated Executive Producer",
    },
  },
  {
    id: "event-organizing",
    category: "03 // CONGRESSES & TRADE SHOWS",
    title: "International Event Organizing",
    tagline: "Large-Scale Congresses, B2B Trade Shows & Diplomatic Summits",
    shortDescription:
      "Comprehensive event organizing for international associations, governments, and commercial trade show organizers across DEC, DWTC, ADNEC, and global hubs.",
    icon: Globe2,
    colSpan: "lg:col-span-5",
    image: "/images/kinetic-installation.jpg",
    imageAlt: "International congress and trade show organizing in Dubai",
    badge: "GLOBAL CONGRESS",
    metric: { value: "250K+", label: "Delegates Hosted" },
    accentColor: "#1E40AF",
    subDeliverables: [
      "Multi-hall floor plan design & exhibitor grid zoning",
      "Government ministerial protocol & diplomatic security",
      "International delegate ticketing & accreditation portals",
      "Simultaneous multilingual interpretation & plenary staging",
    ],
    drawerData: {
      heroOverview:
        "Impact Makers Events organizes complex international congresses hosting ministerial delegations and thousands of international trade visitors with seamless protocol and technical precision.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Master Floorplan Architecture & Zoning",
          description:
            "Designing exhibition halls, plenary auditoriums, bilateral meeting suites, and press centers compliant with venue safety.",
        },
        {
          step: "PHASE 02",
          title: "Diplomatic Protocol & Security Clearances",
          description:
            "Liaising with government security, police authorities, and venue management for VIP motorcades and high-security access.",
        },
        {
          step: "PHASE 03",
          title: "Full Congress Delivery & Multi-Track Operations",
          description:
            "Simultaneous management of up to 12 parallel conference tracks, live voting sessions, and exhibition floor logistics.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Congress Systems",
          items: [
            "Bosch DCN Next Generation Wireless Conference Mic Systems",
            "Multi-Channel Infrared Simultaneous Interpretation (8+ Languages)",
            "Automated Delegate Badge Printing & Access Control Turnstiles",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Universal Postal Congress Ministerial Assembly",
          venue: "Dubai Exhibition Centre (DEC) // Expo City Dubai",
          scale: "192 Member Nations // 14-Day Diplomatic Congress",
          highlight: "Flawless plenary management, secure bilateral voting suites, and 100% protocol compliance.",
        },
      ],
      deliverablesChecklist: [
        "Complete Congress Masterplan & Multi-Track Schedule",
        "Diplomatic Protocol & Bilateral Room Booking Matrix",
        "Accreditation Badge Systems & Security Clearances",
        "Post-Congress Proceedings & Official Media Documentation",
      ],
      slaGuarantee: "100% Diplomatic Protocol Compliance & Zero-Downtime Interpretation",
    },
  },
  {
    id: "av-lighting",
    category: "04 // CONCERT AV & STAGE LIGHTING",
    title: "Sound & Audiovisual Systems Services",
    tagline: "Curved 4K LED Video Walls, Line Array Sound & DMX Stage Lighting",
    shortDescription:
      "Turnkey broadcast-grade audiovisual rental and technical installation. Ultra-fine pitch LED ribbon walls, concert-grade acoustic arrays, robotic stage lighting, and projection mapping.",
    icon: Cpu,
    colSpan: "lg:col-span-7",
    image: "/images/summit-keynote.jpg",
    imageAlt: "Concert-grade AV, stage lighting and 4K LED video displays",
    badge: "CONCERT AV",
    metric: { value: "15,000 m²", label: "LED Wall Stock" },
    accentColor: "#003E95",
    subDeliverables: [
      "Ultra-fine pitch indoor & outdoor curved LED video displays",
      "Concert-grade L-Acoustics & d&b audiotechnik line array sound",
      "Robotic DMX beam, spot & wash stage lighting rigs",
      "Architectural 3D projection mapping & media server arrays",
    ],
    drawerData: {
      heroOverview:
        "We own and deploy an extensive inventory of concert-grade audiovisual systems. From immersive curved LED video ribbons to crystal-clear stadium acoustics, we deliver unmatched sensory impact.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Acoustic Simulation & Optical Mapping",
          description:
            "3D sound mapping using Soundvision/EASE to ensure uniform SPL coverage, paired with pixel-accurate LED canvas sizing.",
        },
        {
          step: "PHASE 02",
          title: "Rigging, Trussing & Redundant Fiber Cabling",
          description:
            "Certified structural rigging with load-monitored electric chain hoists and dual-redundant optical fiber signal rings.",
        },
        {
          step: "PHASE 03",
          title: "Timecode Calibration & Show Execution",
          description:
            "SMPTE timecode lock between lighting cues, video playback, and live speaker microphones for zero-latency impact.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Display & Media Servers",
          items: [
            "ROE Visual BP2V2 & Ruby 2.6mm/1.9mm Fine-Pitch LED Panels",
            "Brompton SX40 4K LED Video Processors",
            "disguise vx4+ & Barco Event Master E2 Gen 2 Screen Management",
          ],
        },
        {
          category: "Audio & Stage Lighting",
          items: [
            "d&b audiotechnik KSL/V-Series Line Array Systems",
            "DiGiCo Quantum 338 & SD12 Digital Mixing Consoles",
            "Robe BMFL, MegaPointe & Claypaky Sharpy Moving Lights",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Bloomberg & CNBC Broadcast Studio Stage",
          venue: "Madinat Jumeirah // Dubai",
          scale: "Live Global Financial Broadcast // 4K Curved LED Ribbon",
          highlight: "Pristine Rec.709 color calibration with zero flicker under high-speed studio broadcast cameras.",
        },
      ],
      deliverablesChecklist: [
        "Acoustic SPL Distribution Heatmaps & Coverage Reports",
        "Complete 3D Rigging Load Calculations (PE Certified)",
        "Redundant Signal Flow Diagrams & Master IP Tables",
        "On-Site Senior Audio & Video Engineers During Entire Event",
      ],
      slaGuarantee: "99.999% AV Uptime SLA with Hot-Swappable Backup Systems",
    },
  },
  {
    id: "videography-photography",
    category: "05 // 4K BROADCAST & MEDIA",
    title: "Photography & Videography Services",
    tagline: "4K Multi-Camera Livestreaming, Corporate Media Production & PR Masters",
    shortDescription:
      "Broadcast-grade media production. 4K HDR multi-camera livestream flypacks, cinematic aftermovies, high-resolution stand photo documentation, and rapid PR media packages.",
    icon: Activity,
    colSpan: "lg:col-span-7",
    image: "/images/prev/booth_1.webp",
    imageAlt: "4K videography and photography for exhibitions and summits",
    badge: "4K BROADCAST",
    metric: { value: "30 Min", label: "Fast PR Reel Delivery" },
    accentColor: "#00A7F5",
    subDeliverables: [
      "4K HDR multi-camera live broadcast & multi-platform streaming",
      "Cinema-grade drone & gimbal exhibition hall footage",
      "Instant PR highlight reels & social media cutdowns",
      "High-resolution architectural exhibition stand photography",
    ],
    drawerData: {
      heroOverview:
        "Capture every angle of your exhibition presence and keynote moments. Our broadcast team operates cinema-grade camera packages and mobile editing suites delivering fast-turnaround PR content.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Shot List & Broadcast Architecture",
          description:
            "Pre-event shot planning, multi-camera positioning, fiber run planning, and satellite uplink configurations.",
        },
        {
          step: "PHASE 02",
          title: "Live 4K Capture & Switching",
          description:
            "Live multi-camera vision mixing with graphic overlays, lower-thirds, and synchronized clean audio feeds.",
        },
        {
          step: "PHASE 03",
          title: "Rapid On-Site Post-Production",
          description:
            "Dedicated on-site editors generating 60-second social highlight reels and master press packages within 30 minutes of keynote conclusion.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Cameras & Optics",
          items: [
            "Sony FX9 & FX6 Cinema Line 4K Cameras",
            "Blackmagic URSA Broadcast G2 4K Live Chains",
            "DJI Ronin 4D & DJI Inspire 3 Cinema Drones",
          ],
        },
        {
          category: "Broadcast & Livestream",
          items: [
            "Blackmagic ATEM Constellation 8K Vision Switcher",
            "LiveU LU800 Multi-Cam 5G Cellular Transmission Units",
            "AJA Ki Pro Ultra 12G Multi-Channel 4K Master Recorders",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Samsung Tech Pavilion Global Unveil",
          venue: "Dubai World Trade Centre (DWTC) // Dubai",
          scale: "2.4M Live Enterprise Viewers Across 120 Countries",
          highlight: "Flawless multi-camera 4K livestream with sub-second global transmission latency.",
        },
      ],
      deliverablesChecklist: [
        "Uncompressed 4K Master Video Archives (ProRes 422 HQ)",
        "Same-Day High-Resolution Curated Photo Gallery",
        "Social-Ready Vertical (9:16) & Widescreen (16:9) Video Cuts",
        "Full Livestream Recording & Raw Multi-Track Audio Stems",
      ],
      slaGuarantee: "Same-Day Press Delivery with Full Commercial Copyright Clearance",
    },
  },
  {
    id: "space-selling",
    category: "06 // COMMERCIAL MONETIZATION",
    title: "Exhibition Space Selling Services",
    tagline: "Floor Plan Monetization, Exhibitor Recruitment & Sponsorship Packaging",
    shortDescription:
      "Strategic commercial consulting for trade show organizers. We recruit international exhibitors, package high-yield sponsorships, and maximize square-meter revenue.",
    icon: ShieldCheck,
    colSpan: "lg:col-span-5",
    image: "/images/executive-pavilion.jpg",
    imageAlt: "Exhibition space selling and trade show monetization",
    badge: "SPACE MONETIZATION",
    metric: { value: "150K m²", label: "Floor Space Sold" },
    accentColor: "#1E40AF",
    subDeliverables: [
      "Commercial floor plan grid optimization & pricing strategy",
      "Global B2B exhibitor acquisition & country pavilion sales",
      "High-value sponsorship tier creation & monetization",
      "Exhibitor onboarding, manual approvals & booth coordination",
    ],
    drawerData: {
      heroOverview:
        "Maximize the commercial yield of your exhibition hall. We leverage an extensive international network of trade promotion councils, multinational enterprises, and industry bodies to fill floor plans rapidly.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Floorplan Valuation & Yield Modeling",
          description:
            "Categorizing exhibition zones, premium island locations, and sponsorship asset pricing for maximum revenue.",
        },
        {
          step: "PHASE 02",
          title: "International Exhibitor Acquisition",
          description:
            "Direct outreach across our network in Europe, the GCC, Asia, and the Americas to secure anchor pavilion bookings.",
        },
        {
          step: "PHASE 03",
          title: "Exhibitor Service & Contract Fulfillment",
          description:
            "Full-cycle exhibitor support from contract signing and payment processing to technical service orders.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Commercial CRM & Floorplan Software",
          items: [
            "Expocad Interactive 3D Floorplan Management Systems",
            "Enterprise Exhibitor Portal & Digital Contract Signing",
            "Live Space Occupancy & Revenue Tracking Telemetry",
          ],
        },
      ],
      caseStudies: [
        {
          title: "International Industrial & Energy Expo",
          venue: "Abu Dhabi National Exhibition Centre (ADNEC)",
          scale: "25,000 m² Exhibition Floor // 450+ Exhibitors",
          highlight: "Achieved 98% floor space occupancy and exceeded sponsorship revenue targets by 40%.",
        },
      ],
      deliverablesChecklist: [
        "Comprehensive Space Monetization Strategy Document",
        "Digital Interactive Floorplan with Real-Time Booking Status",
        "Sponsorship Pitch Deck & Contract Templates",
        "Weekly Exhibitor Pipeline & Commercial Revenue Reports",
      ],
      slaGuarantee: "Guaranteed High-Yield Occupancy & Verified Exhibitor Acquisition SLA",
    },
  },
  {
    id: "branding-gifts",
    category: "07 // CORPORATE BRANDING & MERCHANDISE",
    title: "Gifts & Corporate Branding Services",
    tagline: "Luxury Executive Gift Sets, Roll-Up Banners & Premium Merchandise",
    shortDescription:
      "Complete brand physicalization. Luxury corporate gift sets for VIP delegates, teardrop flags, roll-up banners, sustainable exhibition giveaways, and executive gift packaging.",
    icon: Sparkles,
    colSpan: "lg:col-span-5",
    image: "/images/kinetic-installation.jpg",
    imageAlt: "Luxury corporate gifts and event branding collateral",
    badge: "VIP BRANDING",
    metric: { value: "50,000+", label: "VIP Gifts Delivered" },
    accentColor: "#00A7F5",
    subDeliverables: [
      "Custom executive leather, crystal & tech VIP gift sets",
      "High-definition roll-up banners, pop-ups & teardrop flags",
      "Eco-friendly sustainable tote bags, lanyards & badge holders",
      "Precision UV printing, laser engraving & debossed leather branding",
    ],
    drawerData: {
      heroOverview:
        "Leave an indelible impression long after the exhibition ends. We design, customize, and produce premium corporate gifts and graphic collateral that reflect your organization's caliber.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Gift Curation & Prototype Sampling",
          description:
            "Selecting premium items aligned with brand aesthetics, creating digital mockups, and delivering physical prototypes for executive sign-off.",
        },
        {
          step: "PHASE 02",
          title: "Precision In-House Customization",
          description:
            "Laser engraving, blind debossing, gold foil stamping, and high-definition UV color printing.",
        },
        {
          step: "PHASE 03",
          title: "Luxury Packaging & On-Site Handover",
          description:
            "Custom-molded presentation boxes, satin lining, and organized delivery directly to VIP suites or exhibition stands.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Customization & Finishing Machinery",
          items: [
            "Industrial Fiber Laser Engraving & Marking Systems",
            "Mimaki High-Resolution Flatbed UV Color Printers",
            "Hydraulic Hot-Foil Stamping & Blind Debossing Presses",
          ],
        },
      ],
      caseStudies: [
        {
          title: "GCC Ministerial Summit VIP Executive Kit",
          venue: "Ritz-Carlton Dubai // Dubai",
          scale: "1,200 Bespoke Leather & Smart Tech Gift Sets",
          highlight: "Custom engraved presentation boxes delivered with 100% precision and zero defect rate.",
        },
      ],
      deliverablesChecklist: [
        "Physical Material Sample Box & Digital Brand Mockups",
        "Individual Protective Packaging & Presentation Bags",
        "Direct Delivery to Stand / Hotel Suite with Manifest Verification",
      ],
      slaGuarantee: "Zero-Defect Quality Guarantee with Precision Brand Pantones",
    },
  },
  {
    id: "furniture-rental",
    category: "08 // DESIGNER EVENT FURNITURE",
    title: "Designer Event Furniture Rental",
    tagline: "Scandinavian Armchairs, Corbusier Sofas, Tolix Barstools & Coffee Tables",
    shortDescription:
      "Elevate your exhibition booth or VIP lounge. Extensive inventory of luxury Scandinavian armchairs, Corbusier leather sofas, Tolix barstools, wire tables, and LED illuminated counters.",
    icon: Box,
    colSpan: "lg:col-span-7",
    image: "/images/prev/booth_1.webp",
    imageAlt: "Designer event furniture rental in Dubai by Impact Makers Events",
    badge: "LUXURY RENTALS",
    metric: { value: "2,500+", label: "Furniture Catalog Items" },
    accentColor: "#003E95",
    subDeliverables: [
      "Scandinavian lounge armchairs & velvet accent seating",
      "Le Corbusier LC2 & LC3 style luxury leather sofas",
      "Industrial Tolix barstools & high-top cocktail tables",
      "Geometric wire coffee tables, reception desks & display plinths",
    ],
    drawerData: {
      heroOverview:
        "Transform an empty booth into an inviting, high-converting executive salon. Our designer furniture rental inventory features immaculate, high-end pieces tailored specifically for Dubai exhibitions.",
      workflows: [
        {
          step: "PHASE 01",
          title: "Furniture Layout & Moodboard Curation",
          description:
            "Matching furniture aesthetics with your brand palette, creating 3D layout floorplans for optimal delegate flow and meeting comfort.",
        },
        {
          step: "PHASE 02",
          title: "Inspection, Protective Wrapping & Logistics",
          description:
            "Every piece is steam-cleaned, inspected for zero blemishes, padded in protective transit blankets, and dispatched.",
        },
        {
          step: "PHASE 03",
          title: "On-Site Placement & Post-Show Collection",
          description:
            "Placement exactly to CAD coordinates ahead of show opening, with full collection post-event.",
        },
      ],
      equipmentSpecs: [
        {
          category: "Featured Designer Seating Collections",
          items: [
            "Le Corbusier Style LC2 & LC3 1-Seater, 2-Seater & 3-Seater Sofas",
            "Scandinavian Minimalist Velvet & Oak Lounge Armchairs",
            "Original Style Tolix High Barstools (Matte Black, Gunmetal, Brushed Copper)",
            "Eames Style DSW & DSR Ergonomic Conference Chairs",
          ],
        },
        {
          category: "Tables, Counters & Accessories",
          items: [
            "Geometric Black & Gold Wire Mesh Coffee Tables",
            "White Marble Top Cocktail High-Tables & Bar High-Tops",
            "Illuminated Acrylic Reception Desks & Display Plinths",
          ],
        },
      ],
      caseStudies: [
        {
          title: "Fintech Summit VIP Investor Lounge",
          venue: "Dubai World Trade Centre (DWTC) // Dubai",
          scale: "120 Lounge Sets // 60 High-Top Bar Configurations",
          highlight: "Created an ultra-exclusive lounge atmosphere resulting in 300+ closed investor meetings.",
        },
      ],
      deliverablesChecklist: [
        "Interactive 3D Furniture Placement Blueprint",
        "Steam-Cleaned & Pristine Protective Delivery Guarantee",
        "On-Site Setup & Post-Event Collection Service",
      ],
      slaGuarantee: "Pristine Condition Guarantee with On-Site Replacement Buffer",
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
