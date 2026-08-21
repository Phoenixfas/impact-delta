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
    id: "apex-world-forum",
    title: "Apex World Forum 2025",
    subtitle: "360° Immersive Arena & Volumetric Stage Lighting",
    client: "Global Tech Alliance",
    category: "Keynote & Arena Production",
    year: "2025",
    location: "Geneva, Switzerland",
    scale: "35,000+ In-Person • 1.8M Streamed",
    image: "/images/summit-keynote.jpg",
    alt: "Stadium-scale keynote light show and curved LED arena stage",
    tags: ["Arena Architecture", "Volumetric AV", "Live Broadcast", "Zero-Latency Cues"],
    metrics: [
      { label: "Live Audience", value: "35K+" },
      { label: "Global Reach", value: "1.8M" },
      { label: "Uptime Score", value: "99.99%" },
      { label: "Satisfaction", value: "99.2%" },
    ],
    overview:
      "A flagship international summit convening global leaders across technology, policy, and enterprise innovation. Impact B2B engineered a seamless 360-degree cylindrical stage with synchronized spatial lighting and real-time generative visual backdrops.",
    challenge:
      "Transforming a 40,000-seat multi-purpose stadium into an intimate yet grand keynote theatre with uncompromising acoustics and zero visual dead zones.",
    solution:
      "Engineered an omnidirectional truss grid with 480 intelligent moving heads, custom ultra-fine pitch LED ribbons, and multi-channel spatial audio calibrated specifically to the venue's acoustic signature.",
    highlights: [
      "Custom 64-channel spatial sound field eliminating echoes",
      "Dynamic real-time translation broadcast in 14 languages",
      "Carbon-neutral power distribution utilizing on-site green microgrids",
    ],
  },
  {
    id: "fintech-horizon-atrium",
    title: "Global FinTech Horizon",
    subtitle: "Multi-Tier Executive Atrium & Spatial Networking",
    client: "Horizon Financial Group",
    category: "Executive Summit",
    year: "2024",
    location: "Singapore",
    scale: "12,000 Delegates • 40+ Nations",
    image: "/images/executive-pavilion.jpg",
    alt: "Modern multi-tiered executive summit pavilion atrium",
    tags: ["Bespoke Atrium", "Smart Badge Mesh", "VIP Lounges", "Kinetic Partitions"],
    metrics: [
      { label: "Delegates", value: "12,000" },
      { label: "B2B Meetings", value: "4,200+" },
      { label: "Net Promoter", value: "+88 NPS" },
      { label: "Media Outlets", value: "140+" },
    ],
    overview:
      "An ultra-premium executive congress featuring bespoke tiered pavilions, smart contactless networking zones, and an ethereal central atrium designed for spontaneous deal-making.",
    challenge:
      "Seamlessly routing high-profile dignitaries and C-suite executives between confidential boardrooms, press hubs, and open networking floors without friction.",
    solution:
      "Created acoustic micro-zones separated by kinetic glass dividers and lush architectural biophilic sound baffles, coupled with smart location-aware delegate wayfinding.",
    highlights: [
      "Intelligent BLE beacon integration for automated VIP lounge access",
      "Dual-layered acoustic attenuation isolating sensitive conversations",
      "Precision-crafted architectural millwork built in modular reusable sections",
    ],
  },
  {
    id: "luminary-gala-installation",
    title: "Luminary Gala & Awards",
    subtitle: "Dynamic Kinetic Chandelier & Real-Time Generative Audio",
    client: "Global Innovation Institute",
    category: "Experiential Gala",
    year: "2024",
    location: "London, United Kingdom",
    scale: "2,500 VIP Guests • Historic Venue",
    image: "/images/kinetic-installation.jpg",
    alt: "Kinetic chandelier suspended over a gala dinner installation",
    tags: ["Kinetic Sculpture", "Generative Visuals", "Fine Dining AV", "DMX Winches"],
    metrics: [
      { label: "Kinetic Nodes", value: "240" },
      { label: "Custom Cues", value: "1,200+" },
      { label: "Press Coverage", value: "450+ Articles" },
      { label: "Award Won", value: "Best Gala '24" },
    ],
    overview:
      "An unforgettable annual awards gala bringing together industry pioneers under an undulating canopy of 240 synchronized kinetic light spheres programmed to react to live musical performances.",
    challenge:
      "Suspending heavy kinetic winches and complex control hardware in a Grade I listed historic venue without drilling or modifying any structural elements.",
    solution:
      "Designed a self-supporting, distributed ground-supported aluminum arch truss system cloaked in matte black acoustic velvet, virtually disappearing against the darkness of the hall.",
    highlights: [
      "Millimeter-precision DMX winch choreographies synced to live orchestra cues",
      "Bespoke multi-course culinary lighting synchronized with wine pairings",
      "Zero structural impact on heritage building fabric certified by city engineers",
    ],
  },
  {
    id: "nextgen-ai-pavilion",
    title: "NextGen AI Expo Pavilion",
    subtitle: "Sculptural Exhibition Architecture & Interactive Holograms",
    client: "DeepTech Ventures",
    category: "Brand Exhibition Build",
    year: "2024",
    location: "San Francisco, USA",
    scale: "2,000 m² Custom Footprint",
    image: "/images/prev/booth_1.webp",
    alt: "Detail of a large-scale exhibition build with warm kinetic lighting",
    tags: ["Custom Millwork", "Interactive Domes", "Holographic Displays", "Modular Design"],
    metrics: [
      { label: "Booth Visits", value: "68,000" },
      { label: "Demo Dwell Time", value: "14.2 min" },
      { label: "Leads Captured", value: "8,900+" },
      { label: "Design Award", value: "Gold Stand" },
    ],
    overview:
      "A flagship technology pavilion designed to make abstract artificial intelligence tangible through tactile physical computing, volumetric light tunnels, and transparent holographic interaction pods.",
    challenge:
      "Capturing unmatched delegate attention on a saturated exhibition floor while conveying complex deep tech capabilities simply and memorably.",
    solution:
      "Designed a bold parametric shell with integrated ambient light tubes that pulse with human proximity, drawing attendees into intuitive interactive product pods.",
    highlights: [
      "Custom curved acoustic alcoves for distraction-free 1-on-1 demos",
      "Modular flat-pack engineered construction reused across 4 global trade stops",
      "Integrated touchless gesture-controlled holographic display pedestals",
    ],
  },
  {
    id: "aerospace-leaders-summit",
    title: "AeroSpace Tech Summit",
    subtitle: "Modular High-Tech Brand Pavilion & Live Broadcast Studio",
    client: "Orbital Systems Consortium",
    category: "Brand Pavilion & Studio",
    year: "2024",
    location: "Tokyo, Japan",
    scale: "8,500 Attendees • Hybrid Broadcast",
    image: "/images/prev/booth_2.webp",
    alt: "Client exhibition booth on a busy trade show floor with interactive screens",
    tags: ["Hybrid Broadcast", "Acoustic Isolation", "Cleanroom Finish", "Dynamic Signage"],
    metrics: [
      { label: "Keynote Views", value: "2.1M" },
      { label: "Broadcast Time", value: "36 Hours" },
      { label: "Press Interviews", value: "120+" },
      { label: "VIP Attendance", value: "98%" },
    ],
    overview:
      "A high-precision aerospace pavilion combining an ultra-clean modular brand experience with a glass-walled live broadcast television studio operating continuously throughout the 3-day congress.",
    challenge:
      "Executing studio-grade sound isolation inside an active convention hall while maintaining 360-degree glass transparency for external spectators.",
    solution:
      "Engineered a floating double-glazed acoustic glass box with silent ventilation and broadcast-calibrated 5600K balanced lighting.",
    highlights: [
      "Broadcast studio capable of 4K HDR live satellite and web feeds",
      "Seamless cleanroom finish with hidden cable raceways and concealed climate control",
      "Interactive 3D planetary projection table for interactive mission simulations",
    ],
  },
  {
    id: "nexus-global-showcase",
    title: "Nexus Global Showcase",
    subtitle: "Precision Modular Brand Dome & VIP Lounge",
    client: "Nexus Enterprise Systems",
    category: "Modular Architecture",
    year: "2023",
    location: "Dubai, UAE",
    scale: "1,500 m² VIP Dome",
    image: "/images/render2.webp",
    alt: "Architectural 3D render of a futuristic exhibition stand with curved blue accents",
    tags: ["Geodesic Structure", "Curved Facades", "VIP Hospitality", "Smart Lighting"],
    metrics: [
      { label: "VIP Guests", value: "3,400" },
      { label: "Deal Volume", value: "$420M+" },
      { label: "Assembly Time", value: "48 Hours" },
      { label: "Reusability", value: "100%" },
    ],
    overview:
      "A state-of-the-art modular brand dome featuring aerodynamic swept contours, luminous corporate cobalt accents, and a private second-story VIP boardroom overlooking the main exhibition floor.",
    challenge:
      "Achieving swift 48-hour on-site assembly with zero compromises on luxury architectural finishes and structural stability.",
    solution:
      "Utilized interlocking aerospace-grade aluminum rib framing pre-fitted with integrated power, fiber optic networking, and diffused LED channels.",
    highlights: [
      "Patented quick-lock structural joints reducing build time by 60%",
      "Integrated climate-controlled second-floor hospitality skybox",
      "Sculptural curved backlit fins creating an unmistakable silhouette from across the hall",
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
