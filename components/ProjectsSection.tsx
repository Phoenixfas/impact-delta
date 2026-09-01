"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  MoveHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  year: string;
  location: string;
  scale: string;
  image: string;
  alt: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  overview: string;
  challenge: string;
  solution: string;
  highlights: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: "airbus-aerospace-pavilion",
    title: "Airbus Next-Gen Aviation Pavilion",
    subtitle: "Custom 3D Double-Decker Exhibition Pavilion & VIP Sky Lounge",
    client: "Airbus",
    category: "Custom Stand Fabrication",
    year: "2025",
    location: "Dubai Airshow & DEC, UAE",
    scale: "1,200 m² Footprint • Double-Decker",
    image: "/images/prev/booth_1.webp",
    alt: "Airbus custom double-decker exhibition stand built by Impact Makers Events",
    tags: ["Double-Decker", "In-House Joinery", "VIP Sky Lounge", "Acoustic Suites"],
    metrics: [
      { label: "Pavilion Area", value: "1,200 m²" },
      { label: "B2B Delegations", value: "45+" },
      { label: "ISO Safety", value: "100%" },
      { label: "Turnaround", value: "Turnkey" },
    ],
    overview:
      "A flagship double-decker aerospace pavilion engineered for Airbus. Impact Makers Events executed full in-house joinery, structural steel engineering, holographic model displays, and confidential C-suite meeting suites under ISO 9001 and ISO 45001 compliance.",
    challenge:
      "Constructing a complex multi-level structure with heavy cantilevered viewing platforms within strict venue load-in timelines.",
    solution:
      "Utilized prefabricated modular steel framing pre-engineered in our in-house workshop, coupled with rapid-assembly acoustic glass partitions and designer furniture suites.",
    highlights: [
      "Certified structural engineering with double-decker flight-deck viewing platform",
      "Integrated 4K LED video ribbon wall showcasing next-gen commercial aviation",
      "Executive hospitality lounge furnished with bespoke Scandinavian seating",
    ],
  },
  {
    id: "bloomberg-cnbc-media-lounge",
    title: "Bloomberg & CNBC Broadcast Studio",
    subtitle: "Acoustically Isolated Glass Broadcast Hub & Media Lounge",
    client: "Bloomberg & CNBC",
    category: "AV & Broadcast Production",
    year: "2025",
    location: "Madinat Jumeirah & DWTC, Dubai",
    scale: "50+ Global Broadcasters",
    image: "/images/summit-keynote.jpg",
    alt: "Live television media broadcast studio and conference stage",
    tags: ["4K Livestream", "Acoustic Glass", "Concert AV", "Live Media Hub"],
    metrics: [
      { label: "Live Hours", value: "48 Hrs" },
      { label: "Global Feed", value: "4K HDR" },
      { label: "Audio SLA", value: "Zero Noise" },
      { label: "Interviews", value: "120+" },
    ],
    overview:
      "A high-fidelity broadcast studio and media pavilion built for live global television transmission during premier MENA economic summits.",
    challenge:
      "Achieving flawless studio-grade acoustic isolation inside a bustling convention environment without sacrificing visual elegance.",
    solution:
      "Engineered floating dual-layer acoustic walls, broadcast-calibrated 5600K key lighting, and redundant fiber-optic video transmission backbones.",
    highlights: [
      "Custom acoustic isolation achieving -42dB ambient noise attenuation",
      "Multi-camera 4K UHD flypack control matrix with instant media package mastering",
      "Turnkey VIP green rooms with branded executive gift sets",
    ],
  },
  {
    id: "adcb-banking-experience",
    title: "ADCB Future of Banking Pavilion",
    subtitle: "Immersive Curved LED Walls & Interactive Financial Tech",
    client: "Abu Dhabi Commercial Bank (ADCB)",
    category: "Event Management & Fabrication",
    year: "2024",
    location: "ADNEC & DWTC, UAE",
    scale: "850 m² Interactive Stand",
    image: "/images/render2.webp",
    alt: "Futuristic digital banking exhibition stand with curved LED surfaces",
    tags: ["Curved LED", "Interactive Kiosks", "VIP Protocol", "Digital Displays"],
    metrics: [
      { label: "Booth Visitors", value: "45,000+" },
      { label: "Interactive Touch", value: "12 Pods" },
      { label: "CSAT Score", value: "99.8%" },
      { label: "Lead Capture", value: "6,200+" },
    ],
    overview:
      "An interactive architectural showcase highlighting digital wealth management, biometric banking kiosks, and high-level corporate networking for ADCB.",
    challenge:
      "Seamlessly integrating high-brightness curved LED walls with high-traffic physical touchpoints and executive consultation pods.",
    solution:
      "Fabricated seamless organic timber structures clad with custom-radius Brompton-controlled LED tiles and integrated touchless gesture interfaces.",
    highlights: [
      "Seamless curved architectural archway with synchronized ambient LED backlighting",
      "Private VIP investor lounge with Knoll executive furniture and smart hospitality",
      "100% turnkey delivery from 3D conceptualization to on-site event operations",
    ],
  },
  {
    id: "universal-postal-congress",
    title: "Universal Postal Congress & Global Summit",
    subtitle: "International Congress Organizing & Arena Stage Production",
    client: "Universal Postal Union & Government Partners",
    category: "Event Organizing & Congresses",
    year: "2024",
    location: "Dubai Exhibition Centre (DEC), UAE",
    scale: "192 Member Nations • 5,000 Delegates",
    image: "/images/executive-pavilion.jpg",
    alt: "Large scale international congress plenary hall and delegate seating",
    tags: ["Congress Organizing", "Plenary Rigging", "Simultaneous Translation", "DEC Venue"],
    metrics: [
      { label: "Nations Represented", value: "192" },
      { label: "Plenary Delegates", value: "5,000" },
      { label: "Languages", value: "8 Live" },
      { label: "Zero Downtime", value: "100%" },
    ],
    overview:
      "End-to-end event organization, venue operations, delegate registration, plenary stage architecture, and VIP protocol for a premier international government congress.",
    challenge:
      "Managing complex diplomatic protocol, multi-language simultaneous audio systems, and high-security delegate routing across multi-hall DEC spaces.",
    solution:
      "Deployed comprehensive event operations hub (EOC) with digital badge access control, concert line array acoustics, and master Run of Show choreography.",
    highlights: [
      "Full plenary hall build with 360° sightline acoustics and digital voting matrix",
      "Turnkey exhibition space selling and sponsorship management for trade exhibitors",
      "Executive gala dinner staging with bespoke branding and delegate gift packaging",
    ],
  },
  {
    id: "redbull-sports-activation",
    title: "Red Bull High-Energy Brand Experience",
    subtitle: "Kinetic Stage Trussing & Volumetric Dynamic Lighting",
    client: "Red Bull",
    category: "Brand Activation & AV",
    year: "2024",
    location: "Yas Marina & Dubai, UAE",
    scale: "15,000+ Attendees",
    image: "/images/kinetic-installation.jpg",
    alt: "Dynamic kinetic lighting and high-energy brand stage installation",
    tags: ["Kinetic Trussing", "Concert AV", "Experiential Activation", "Live Show"],
    metrics: [
      { label: "Peak Audience", value: "15,000+" },
      { label: "Kinetic Axes", value: "64" },
      { label: "Audio Output", value: "140 dB Clean" },
      { label: "Social Reach", value: "5.4M" },
    ],
    overview:
      "An adrenaline-charged brand activation combining computerized kinetic lighting, stadium-grade line arrays, and custom experiential sports challenge structures.",
    challenge:
      "Engineering outdoor concert-grade rigging and high-velocity kinetic hoists resilient to open-air coastal conditions.",
    solution:
      "Utilized weatherized IP65 architectural laser systems, certified heavy-duty truss ground supports, and high-impact custom merchandise distribution.",
    highlights: [
      "Synchronized motorized kinetic LED arrays shifting in harmony with live DJ sets",
      "Turnkey custom fabrication of branded interactive spectator kiosks",
      "Comprehensive photography and 4K drone cinematography media package",
    ],
  },
  {
    id: "samsung-tech-pavilion",
    title: "Samsung & GISEC Tech Pavilion",
    subtitle: "Next-Gen Enterprise Security & Holographic Display Stand",
    client: "Samsung & Enterprise Partners",
    category: "Stand Fabrication & AV",
    year: "2024",
    location: "Dubai World Trade Centre (DWTC)",
    scale: "600 m² Tech Stand",
    image: "/images/prev/booth_2.webp",
    alt: "Exhibition stand with interactive digital screens at DWTC",
    tags: ["DWTC Build", "Hologram Pods", "Furniture Rental", "CNC Millwork"],
    metrics: [
      { label: "Qualified Leads", value: "4,800+" },
      { label: "Dwell Time", value: "16.4 min" },
      { label: "Fabrication Time", value: "7 Days" },
      { label: "Sustainability", value: "ISO 14001" },
    ],
    overview:
      "A sleek, minimalist enterprise security pavilion featuring ultra-high resolution LED ribbons, transparent display showcases, and luxury executive meeting suites.",
    challenge:
      "Maximizing open floor flow and product demo stations within a compact high-density trade show hall.",
    solution:
      "Designed an airy open-concept booth with elevated ceiling rigging, hidden power conduits, and Corbusier designer lounge seating.",
    highlights: [
      "High-precision CNC-milled acrylic and lacquered timber finishes",
      "Interactive holographic demonstration pods with real-time cybersecurity telemetry",
      "Turnkey designer furniture rental including Tolix barstools and glass coffee tables",
    ],
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragPillRef = useRef<HTMLDivElement | null>(null);
  const dragPillSetter = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag interaction physics state
  const dragStartRef = useRef({ x: 0, y: 0, scrollY: 0, time: 0 });
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  const { lenis, scrollTo } = useSmoothScroll();

  // 1. GSAP Pinning & Horizontal Scroll Scrub
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const pinWrap = pinWrapRef.current;
      const track = trackRef.current;

      if (!section || !pinWrap || !track) return;

      // Intro header reveal
      gsap.set(".projects-header-item", { opacity: 0, y: 28 });
      gsap.to(".projects-header-item", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      // Calculate total horizontal travel distance
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(trackWidth - viewportWidth + 96);
      };

      const horizontalTween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top",
          end: () => `+=${track.scrollWidth * 0.95}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const rawIdx = self.progress * (PROJECTS.length - 1);
            const currIdx = Math.min(PROJECTS.length - 1, Math.round(rawIdx));
            setActiveIndex(currIdx);
          },
          onRefresh: (self) => {
            scrollTriggerInstanceRef.current = self;
          },
        },
      });

      // Parallax effect on card images during horizontal motion
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const img = card.querySelector(".project-img-inner");
        if (!img) return;

        gsap.fromTo(
          img,
          { xPercent: 8 },
          {
            xPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Cursor follow for floating drag badge
  useEffect(() => {
    if (!dragPillRef.current) return;
    dragPillSetter.current = {
      x: gsap.quickTo(dragPillRef.current, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(dragPillRef.current, "y", { duration: 0.35, ease: "power3.out" }),
    };
  }, []);

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Update floating drag badge position relative to container
    if (pinWrapRef.current && dragPillSetter.current) {
      const rect = pinWrapRef.current.getBoundingClientRect();
      dragPillSetter.current.x(e.clientX - rect.left);
      dragPillSetter.current.y(e.clientY - rect.top);
    }

    // Handle drag gesture panning
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 6) {
      hasDraggedRef.current = true;
      setIsDragging(true);
    }

    // Convert horizontal drag movement to page vertical scroll offset
    if (hasDraggedRef.current) {
      const sensitivity = 2.4;
      const targetScroll = dragStartRef.current.scrollY - deltaX * sensitivity;
      if (lenis) {
        lenis.scrollTo(targetScroll, { immediate: true });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "auto" });
      }
    }
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle primary button / touch
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollY: window.scrollY,
      time: Date.now(),
    };
  };

  const handleTrackPointerUp = () => {
    isPointerDownRef.current = false;
    setTimeout(() => {
      setIsDragging(false);
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleCardClick = (project: ProjectItem) => {
    if (hasDraggedRef.current || isDragging) return;
    setSelectedProject(project);
    lenis?.stop();
  };

  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
    lenis?.start();
  }, [lenis]);

  const navigateProject = useCallback((targetIdx: number) => {
    const clamped = Math.max(0, Math.min(PROJECTS.length - 1, targetIdx));
    const st = scrollTriggerInstanceRef.current;
    if (!st) return;

    const targetProgress = clamped / (PROJECTS.length - 1);
    const targetScroll = st.start + (st.end - st.start) * targetProgress;

    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.1 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [lenis]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        closeProjectModal();
        return;
      }

      if (!selectedProject && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;

        if (!isInView) return;

        if (e.key === "ArrowRight") {
          navigateProject(activeIndex + 1);
        } else if (e.key === "ArrowLeft") {
          navigateProject(activeIndex - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, activeIndex, closeProjectModal, navigateProject]);

  // Specular 3D glare per card
  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      role="region"
      aria-label="Latest Developments and Featured Projects"
      className="relative w-full bg-[#FAFBFD] overflow-hidden text-slate-900"
    >
      {/* Ambient background glow orbs */}
      <div
        aria-hidden="true"
        className="absolute top-10 right-10 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(0,167,245,0.07),transparent_70%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-10 w-[580px] h-[580px] rounded-full bg-[radial-gradient(circle,rgba(0,62,149,0.06),transparent_70%)] pointer-events-none"
      />

      {/* Main Pinned Viewport Container */}
      <div
        ref={pinWrapRef}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerUp}
        onPointerCancel={handleTrackPointerUp}
        className={`relative w-full min-h-screen flex flex-col justify-between py-10 sm:py-12 px-4 sm:px-8 lg:px-12 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* TOP: Header Bar & Navigation Controls */}
        <div className="relative max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div>
            <div className="projects-header-item inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00A7F5]/10 border border-[#00A7F5]/25 text-[#003E95] text-xs font-semibold tracking-wide mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
              <span>Latest Developments / Work</span>
            </div>
            <h2 className="projects-header-item text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.08]">
              Engineered for <span className="text-gradient">Grand Stages.</span>
            </h2>
          </div>

          {/* Stepper & Prev/Next Action Buttons */}
          <div className="projects-header-item flex items-center gap-4 sm:gap-6 self-start md:self-end">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                0{activeIndex + 1}
              </span>
              <span className="text-sm font-bold text-slate-400">/ 0{PROJECTS.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateProject(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                className="w-11 h-11 rounded-full flex items-center justify-center border border-slate-200 bg-white shadow-diffused-sm hover:border-[#00A7F5] hover:text-[#003E95] hover:shadow-diffused-md active:scale-95 transition-all duration-200 disabled:opacity-35 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateProject(activeIndex + 1)}
                disabled={activeIndex === PROJECTS.length - 1}
                aria-label="Next project"
                className="w-11 h-11 rounded-full flex items-center justify-center border border-slate-200 bg-white shadow-diffused-sm hover:border-[#00A7F5] hover:text-[#003E95] hover:shadow-diffused-md active:scale-95 transition-all duration-200 disabled:opacity-35 disabled:pointer-events-none"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE: Horizontal Projects Track */}
        <div className="relative w-full my-auto py-4 overflow-visible">
          <div
            ref={trackRef}
            role="list"
            className="flex items-center gap-6 sm:gap-8 lg:gap-10 w-max pl-2 sm:pl-4 pr-16 sm:pr-24 will-change-transform"
          >
            {PROJECTS.map((project, i) => {
              const isActive = activeIndex === i;

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  role="listitem"
                  aria-label={`${project.title} - ${project.category}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(project);
                    }
                  }}
                  onClick={() => handleCardClick(project)}
                  onPointerMove={handleCardPointerMove}
                  className={`group relative flex flex-col justify-between w-[320px] sm:w-[420px] lg:w-[460px] h-[520px] sm:h-[560px] rounded-[32px] bg-white border transition-all duration-500 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7F5] ${
                    isActive
                      ? "border-[#00A7F5]/40 shadow-diffused-xl scale-[1.01]"
                      : "border-slate-200/90 shadow-diffused-lg hover:border-slate-300 hover:shadow-diffused-xl"
                  }`}
                >
                  {/* Specular Glare Layer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                    style={{
                      background:
                        "radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(0, 167, 245, 0.08), transparent 70%)",
                    }}
                  />

                  {/* Top Image Preview Container */}
                  <div className="relative w-full h-[54%] overflow-hidden bg-slate-100">
                    <div className="project-img-inner absolute -inset-x-[12%] -inset-y-[8%] will-change-transform">
                      <Image
                        src={project.image}
                        alt={project.alt}
                        fill
                        sizes="(max-width: 768px) 340px, 480px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                    </div>

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-black/30 pointer-events-none" />

                    {/* Floating Glass Badges */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md bg-white/80 border border-white/70 text-slate-900 shadow-diffused-sm">
                        {project.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/40 border border-white/20 text-white">
                        {project.year}
                      </span>
                    </div>

                    {/* Bottom Metadata Bar in Image */}
                    <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-between text-white/90 text-xs font-medium z-10">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#92DCFF]" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#92DCFF]" />
                        <span>{project.scale}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Content Body */}
                  <div className="relative p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#00A7F5] mb-1.5">
                        {project.client}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#003E95] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Tags & Action Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003E95] group-hover:text-[#00A7F5] transition-colors">
                        <span>Explore</span>
                        <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#003E95] group-hover:text-white flex items-center justify-center transition-all duration-300">
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM: Scrub Progress Bar & Drag Instruction */}
        <div className="relative max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 z-10">
          {/* Scroll / Swipe indicator */}
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
            <MoveHorizontal className="w-4 h-4 text-[#00A7F5] animate-pulse" />
            <span>Scroll vertically or drag horizontally to navigate</span>
          </div>

          {/* Interactive Progress Line */}
          <div className="w-full sm:w-64 h-1.5 bg-slate-200/90 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#92DCFF] rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${Math.max(12, scrollProgress * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Floating cursor drag hint pill (desktop pointer only) */}
        <div
          ref={dragPillRef}
          aria-hidden="true"
          className="hidden lg:block absolute top-0 left-0 z-30 pointer-events-none opacity-0 transition-opacity duration-300"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-diffused-lg border border-white/20">
            <MoveHorizontal className="w-3.5 h-3.5 text-[#92DCFF]" />
            <span>Drag / Scroll</span>
          </div>
        </div>
      </div>

      {/* Case Study Deep Dive Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/60 backdrop-blur-md animate-[fadeIn_0.25s_ease-out]"
          onClick={closeProjectModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[32px] shadow-diffused-xl border border-slate-200/90 animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] focus:outline-none"
            tabIndex={-1}
          >
            {/* Modal Header Media */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 bg-slate-900">
              <Image
                src={selectedProject.image}
                alt={selectedProject.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/20" />

              {/* Close Button */}
              <button
                onClick={closeProjectModal}
                aria-label="Close project modal"
                className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Titles in Hero */}
              <div className="absolute bottom-6 inset-x-6 sm:inset-x-8 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00A7F5]/80 backdrop-blur-md text-white">
                    {selectedProject.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white/90">
                    {selectedProject.year} • {selectedProject.location}
                  </span>
                </div>
                <h3
                  id="case-study-title"
                  className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight"
                >
                  {selectedProject.title}
                </h3>
                <p className="text-sm sm:text-base text-white/80 mt-1">{selectedProject.subtitle}</p>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                {selectedProject.metrics.map((metric) => (
                  <div key={metric.label} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-black text-[#003E95] tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-0.5">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Narrative Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00A7F5] mb-2">Project Brief</h4>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">{selectedProject.overview}</p>
              </div>

              {/* Challenge & Engineered Solution */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <h5 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    The Challenge
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.challenge}</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <h5 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00A7F5]" />
                    Engineered Solution
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.solution}</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00A7F5] mb-3">Key Innovations</h4>
                <div className="space-y-2.5">
                  {selectedProject.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-[#00A7F5]/10 text-[#003E95] flex items-center justify-center shrink-0 mt-0.5">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Call to Action */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 font-medium">
                  Client: <strong className="text-slate-800">{selectedProject.client}</strong>
                </div>

                <button
                  onClick={() => {
                    closeProjectModal();
                    scrollTo("#contact", { offset: -60 });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#003E95] to-[#00A7F5] hover:opacity-95 shadow-diffused-md transition-all active:scale-95"
                >
                  <span>Request Similar Production</span>
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
