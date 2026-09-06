"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Clock,
  ArrowUpRight,
  Bookmark,
  Sparkles,
  Tag,
  Share2,
  ChevronRight,
  ChevronLeft,
  Search,
  FilterX,
  Layers,
  Cpu,
  Workflow,
  Leaf,
  FolderGit2,
  User,
  Flame,
  Calendar,
} from "lucide-react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  tags: string[];
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  imageAlt: string;
  featured?: boolean;
  editorialBadge?: string;
  metrics?: { label: string; value: string };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "navigating-dwtc-dec-stand-guidelines",
    title: "Navigating DWTC & DEC Stand Guidelines 2026: The Comprehensive Builder's Guide",
    excerpt:
      "A complete operational roadmap for exhibition organizers and corporate exhibitors: height restrictions, double-decker structural approvals, and Dubai Civil Defense compliance.",
    category: "exhibition-stands",
    categoryLabel: "Stand Fabrication",
    categoryColor: "blue",
    tags: ["DWTC Guidelines", "DEC Dubai", "Double-Decker", "Civil Defense", "Stand Fabrication"],
    readTime: "8 Min Read",
    date: "Aug 24, 2026",
    author: {
      name: "Tariq Al-Mansoor",
      role: "Managing Director & Founder",
      avatar: "/images/team/marcus-chen.jpg",
    },
    image: "/images/prev/atss-1-landscape.webp",
    imageAlt: "Custom double-decker exhibition stand built at Dubai World Trade Centre",
    featured: true,
    editorialBadge: "EXHIBITION GUIDE // 2026",
    metrics: { label: "Approval Rate", value: "100%" },
  },
  {
    id: "post-2",
    slug: "in-house-cnc-joinery-vs-subcontracting",
    title: "Why In-House CNC Joinery Outperforms Subcontracted Stand Building in Dubai",
    excerpt:
      "A deep dive into manufacturing control, sub-millimeter tolerances, custom paint finishes, and eliminating the hidden 35% middleman surcharge.",
    category: "exhibition-stands",
    categoryLabel: "Stand Fabrication",
    categoryColor: "blue",
    tags: ["CNC Milling", "In-House Workshop", "Timber Joinery", "Polyurethane Paint"],
    readTime: "7 Min Read",
    date: "Aug 20, 2026",
    author: {
      name: "Viktor Kowalski",
      role: "Director of In-House Fabrication",
      avatar: "/images/team/marcus-chen.jpg",
    },
    image: "/images/prev/04_portrait.webp",
    imageAlt: "Vertical architectural view of custom exhibition stand joinery and venue rigging in Dubai",
    featured: false,
    editorialBadge: "MANUFACTURING LAB",
    metrics: { label: "Tolerance", value: "±0.5mm" },
  },
  {
    id: "post-3",
    slug: "triple-iso-standards-in-event-management",
    title: "Triple ISO Standards in Event Management: Quality, Sustainability & Safety",
    excerpt:
      "How ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certifications by Universal Registrars protect corporate investments at world-class events.",
    category: "event-management",
    categoryLabel: "Event Management",
    categoryColor: "emerald",
    tags: ["ISO 9001", "ISO 14001", "ISO 45001", "Universal Registrars", "Quality SLA"],
    readTime: "6 Min Read",
    date: "Aug 15, 2026",
    author: {
      name: "Tariq Al-Mansoor",
      role: "Managing Director & Founder",
      avatar: "/images/team/marcus-chen.jpg",
    },
    image: "/images/prev/08_portrait.webp",
    imageAlt: "Corporate summit hall operating under strict ISO quality and safety protocols",
    featured: false,
    editorialBadge: "GOVERNANCE & STANDARDS",
    metrics: { label: "ISO Accreditations", value: "3x Certified" },
  },
  {
    id: "post-4",
    slug: "curved-4k-led-and-concert-sound-in-pavilions",
    title: "Integrating Curved 4K LED Ribbons & Concert Audio into B2B Pavilions",
    excerpt:
      "Transforming exhibition booths into immersive brand theaters with fine-pitch 2.6mm LED, Brompton Tessera processing, and cardioid beamforming acoustics.",
    category: "event-tech",
    categoryLabel: "Audiovisual & Tech",
    categoryColor: "sky",
    tags: ["Curved LED", "Brompton SX40", "d&b Line Arrays", "AV Systems"],
    readTime: "7 Min Read",
    date: "Aug 10, 2026",
    author: {
      name: "Jean-Paul Laurent",
      role: "Head of Audiovisual Systems",
      avatar: "/images/team/marcus-chen.jpg",
    },
    image: "/images/prev/14.webp",
    imageAlt: "Curved 4K LED video ribbon wall on exhibition stand",
    featured: false,
    editorialBadge: "AV ENGINEERING",
    metrics: { label: "Pixel Pitch", value: "2.6mm" },
  },
  {
    id: "post-5",
    slug: "the-architecture-of-awe",
    title: "The Architecture of Awe: Engineering High-Impact B2B Pavilions & Congress Arenas",
    excerpt:
      "How spatial design, in-house joinery, and synchronous audiovisuals bring global brand narratives to life across 9 countries.",
    category: "spatial",
    categoryLabel: "Spatial Architecture",
    categoryColor: "blue",
    tags: ["Brand Activation", "Spatial Architecture", "Exhibition Stands", "Turnkey Delivery"],
    readTime: "8 Min Read",
    date: "Aug 02, 2026",
    author: {
      name: "Tariq Al-Mansoor",
      role: "Managing Director & Founder",
      avatar: "/images/team/marcus-chen.jpg",
    },
    image: "/images/prev/6_portrait45.webp",
    imageAlt: "Spatial exhibition pavilion architecture with illuminated entrance arch and VIP seating",
    featured: true,
    editorialBadge: "COVER STORY // VOL. 04",
    metrics: { label: "Global Hubs", value: "9 Countries" },
  },
  {
    id: "post-6",
    slug: "diplomatic-protocol-in-international-congresses",
    title: "Diplomatic Protocol & Operational Command in International Congresses",
    excerpt:
      "Managing ministerial VIP ingress, multilingual simultaneous interpretation, and airtight security at world congresses.",
    category: "event-organizing",
    categoryLabel: "Event Organizing",
    categoryColor: "indigo",
    tags: ["Congress Organizing", "Diplomatic Protocol", "Simultaneous Interpretation", "VIP Security"],
    readTime: "6 Min Read",
    date: "Jul 28, 2026",
    author: {
      name: "Amira Benali",
      role: "Head of Event Protocol & Operations",
      avatar: "/images/team/aurelia-dubois.jpg",
    },
    image: "/images/prev/04.webp",
    imageAlt: "Diplomatic congress plenary hall with simultaneous interpretation headsets",
    featured: false,
    editorialBadge: "CONGRESS PROTOCOL",
    metrics: { label: "Languages", value: "8+ Live" },
  },
  {
    id: "post-7",
    slug: "exhibition-space-selling-playbook",
    title: "Exhibition Space Selling: Monetizing Floor Plans & Global Sponsor Packaging",
    excerpt:
      "Strategic methodologies for exhibition organizers to recruit premium international exhibitors, optimize booth yield, and maximize sponsorship revenue.",
    category: "commercial",
    categoryLabel: "Space Selling",
    categoryColor: "amber",
    tags: ["Space Selling", "Floor Plan Monetization", "Sponsorship Packaging", "Exhibitor Recruitment"],
    readTime: "7 Min Read",
    date: "Jul 18, 2026",
    author: {
      name: "Marcus Sterling",
      role: "Commercial Director",
      avatar: "/images/team/marcus-chen.jpg",
    },
    image: "/images/prev/booth_2.webp",
    imageAlt: "Exhibition floor plan sales and commercial pavilion layout",
    featured: false,
    editorialBadge: "COMMERCIAL PLAYBOOK",
    metrics: { label: "Floor Plan Yield", value: "+40%" },
  },
];

const ITEMS_PER_PAGE = 6;

interface BlogGridProps {
  initialPosts?: BlogPost[];
}

export default function BlogGrid({ initialPosts }: BlogGridProps = {}) {
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<Map<string, HTMLElement>>(new Map());

  const [posts, setPosts] = useState<BlogPost[]>(
    initialPosts && initialPosts.length > 0 ? initialPosts : BLOG_POSTS
  );

  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "read-time">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Keep posts synced with server or fetch from API
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
    } else {
      fetch("/api/blog")
        .then((res) => res.json())
        .then((data) => {
          if (data.posts && data.posts.length > 0) {
            const mapped: BlogPost[] = data.posts.map((p: any) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              categoryLabel: p.category,
              categoryColor: p.category.toLowerCase().includes("event")
                ? "emerald"
                : p.category.toLowerCase().includes("av")
                ? "indigo"
                : p.category.toLowerCase().includes("guideline") || p.category.toLowerCase().includes("dwtc")
                ? "amber"
                : "blue",
              tags: Array.isArray(p.tags) ? p.tags : [p.category],
              readTime: p.readingTime || "6 Min Read",
              date: new Date(p.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              author: {
                name: p.author?.name || "Tariq Al-Mansoor",
                role: p.author?.role === "ADMIN" ? "Managing Director & Founder" : "Senior Event Director",
                avatar: "/images/team/marcus-chen.jpg",
              },
              image: p.coverImage || "/images/prev/booth_1.webp",
              imageAlt: p.title,
              featured: false,
              editorialBadge: p.category?.toUpperCase(),
            }));
            setPosts(mapped);
          }
        })
        .catch((err) => console.error("Failed to fetch posts in BlogGrid:", err));
    }
  }, [initialPosts]);

  // Listen for filter state broadcasts from BlogToolbar or Tag badges
  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        category?: string;
        search?: string;
        sort?: "latest" | "popular" | "read-time";
      }>;
      if (!customEvent.detail) return;

      if (customEvent.detail.category !== undefined) {
        setActiveCategory(customEvent.detail.category);
        setCurrentPage(1);
      }
      if (customEvent.detail.search !== undefined) {
        setSearchQuery(customEvent.detail.search);
        setCurrentPage(1);
      }
      if (customEvent.detail.sort !== undefined) {
        setSortBy(customEvent.detail.sort);
      }
    };

    window.addEventListener("blog:state-change", handleStateChange);
    return () => window.removeEventListener("blog:state-change", handleStateChange);
  }, []);

  // Filter and Sort Blog Posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Category Filter
    if (activeCategory !== "all") {
      result = result.filter((post) => {
        const catNorm = post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const actNorm = activeCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return (
          post.category === activeCategory ||
          catNorm === actNorm ||
          catNorm.includes(actNorm) ||
          actNorm.includes(catNorm)
        );
      });
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(q);
        const excerptMatch = post.excerpt.toLowerCase().includes(q);
        const authorMatch = post.author.name.toLowerCase().includes(q);
        const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(q));
        const categoryMatch = post.categoryLabel.toLowerCase().includes(q);
        return titleMatch || excerptMatch || authorMatch || tagMatch || categoryMatch;
      });
    }

    // Sorting
    if (sortBy === "popular") {
      // Sort with featured first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === "read-time") {
      // Parse minutes
      result.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Dynamic Cursor-Following Glowing Spotlight Effect on Cards
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  // Interactive Tag Filter Click
  const handleTagClick = useCallback((tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery(tag);
    setCurrentPage(1);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("blog:set-filter", {
          detail: { search: tag },
        })
      );
      // Smooth scroll to top of toolbar
      const toolbar = document.getElementById("blog-toolbar");
      if (toolbar) {
        toolbar.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  // Toggle Bookmark
  const toggleBookmark = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // GSAP: Staggered Entrance Animation whenever paginatedPosts or filters change
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = Array.from(cardsRef.current.values()).filter(Boolean);
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 32,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.07,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform,opacity",
      }
    );
  }, [paginatedPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll back to toolbar
    const toolbar = document.getElementById("blog-toolbar");
    if (toolbar) {
      toolbar.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="blog-grid"
      ref={gridContainerRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Editorial Grid Header / Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Engineering Dispatches & Blueprints</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#003E95] font-bold border border-blue-200/60">
              {filteredPosts.length} {filteredPosts.length === 1 ? "Article" : "Articles"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Peer-reviewed architectural case studies, show automation standards, and live production telemetry.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{paginatedPosts.length}</span> of{" "}
          <span className="font-bold text-slate-800">{filteredPosts.length}</span> results
        </div>
      </div>

      {/* Main Asymmetrical 3-Column Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginatedPosts.map((post, idx) => {
            const isSpanTwo = post.featured && idx === 0;
            const isPortrait = post.image.includes("_portrait");
            const isBookmarked = bookmarkedIds.has(post.id);

            return (
              <article
                key={post.id}
                ref={(el) => {
                  if (el) cardsRef.current.set(post.id, el);
                  else cardsRef.current.delete(post.id);
                }}
                onMouseMove={handleCardMouseMove}
                style={
                  {
                    "--mouse-x": "50%",
                    "--mouse-y": "50%",
                  } as React.CSSProperties
                }
                className={`group relative flex flex-col justify-between rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-[#00A7F5]/40 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden cursor-pointer ${
                  isSpanTwo ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                {/* Glowing Cursor-Following Spotlight Highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  style={{
                    background: `radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), rgba(0, 167, 245, 0.12), transparent 70%)`,
                  }}
                />

                {/* Subtle top edge gradient reflection */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00A7F5]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Image Container with Hover Scale */}
                <div
                  className={`relative w-full overflow-hidden bg-slate-900 ${
                    isPortrait ? "h-64 sm:h-76" : isSpanTwo ? "h-64 sm:h-80" : "h-52 sm:h-60"
                  }`}
                >
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes={
                      isSpanTwo
                        ? "(max-width: 768px) 100vw, 66vw"
                        : "(max-width: 768px) 100vw, 33vw"
                    }
                    className={`object-cover ${isPortrait ? "object-top" : "object-center"} transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105`}
                  />

                  {/* Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                  {/* Top Floating Glass Badges on Image */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md bg-white/90 text-slate-900 text-xs font-bold shadow-sm border border-white/60">
                      {post.category === "event-tech" && <Cpu className="w-3 h-3 text-[#003E95]" />}
                      {post.category === "production-strategy" && (
                        <Workflow className="w-3 h-3 text-indigo-600" />
                      )}
                      {post.category === "sustainable-events" && (
                        <Leaf className="w-3 h-3 text-emerald-600" />
                      )}
                      {post.category === "case-studies" && (
                        <FolderGit2 className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{post.categoryLabel}</span>
                    </span>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => toggleBookmark(post.id, e)}
                      aria-label="Bookmark article"
                      className="p-2 rounded-full backdrop-blur-md bg-slate-900/60 hover:bg-white text-white hover:text-[#003E95] border border-white/20 hover:border-white transition-all duration-300"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          isBookmarked ? "fill-white hover:fill-[#003E95]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom Image Stats / Telemetry Pill */}
                  {post.metrics && (
                    <div className="absolute bottom-3 left-4 z-20 inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md bg-slate-950/70 border border-white/15 text-white text-[11px] font-semibold">
                      <span className="text-[#00A7F5]">{post.metrics.label}:</span>
                      <span>{post.metrics.value}</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 text-white/90 text-xs font-medium backdrop-blur-md bg-slate-950/60 px-2.5 py-1 rounded-full border border-white/15">
                    <Clock className="w-3 h-3 text-[#00A7F5]" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="relative z-20 p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Editorial Badge & Date */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2.5">
                      {post.editorialBadge ? (
                        <span className="text-[10px] font-extrabold tracking-wider text-[#003E95] uppercase">
                          {post.editorialBadge}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500">
                          {post.date}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>

                    {/* Post Title */}
                    <Link href={`/blog/${post.slug || "the-architecture-of-awe"}`}>
                      <h3
                        className={`font-extrabold text-slate-900 tracking-tight group-hover:text-[#003E95] transition-colors duration-300 leading-snug mb-2.5 ${
                          isSpanTwo ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                        }`}
                      >
                        {post.title}
                      </h3>
                    </Link>

                    {/* Post Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Interactive Tag Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-5">
                      {post.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => handleTagClick(tag, e)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100/80 hover:bg-[#003E95] text-slate-600 hover:text-white border border-slate-200/60 hover:border-[#003E95] transition-all duration-200"
                        >
                          <Tag className="w-2.5 h-2.5 opacity-60" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Author Info & CTA Micro-Interaction */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 bg-slate-100">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {post.author.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate font-medium">
                          {post.author.role}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.slug || "the-architecture-of-awe"}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#003E95] group-hover:text-[#00A7F5] transition-colors shrink-0"
                    >
                      <span>Read Dispatch</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty Search / Filter State */
        <div className="w-full py-16 px-6 text-center rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200/80 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#003E95] flex items-center justify-center mb-4">
            <FilterX className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Dispatches Matched Your Criteria
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            We couldn&apos;t find any articles matching &ldquo;{searchQuery || activeCategory}&rdquo;. Try clearing your filters or searching for terms like <em>Rigging</em>, <em>SMPTE</em>, or <em>Previz</em>.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("blog:set-filter", {
                    detail: { category: "all", search: "" },
                  })
                );
              }
            }}
            className="px-5 py-2.5 rounded-full bg-[#003E95] hover:bg-[#00A7F5] text-white text-xs font-bold shadow-md transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls with GSAP Transition */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Number Pills */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
