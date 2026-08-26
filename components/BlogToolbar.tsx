"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import {
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Cpu,
  Workflow,
  Leaf,
  FolderGit2,
  BrainCircuit,
  Check,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

export interface BlogCategory {
  id: string;
  label: string;
  count: number;
  icon?: React.ElementType;
}

export const DEFAULT_BLOG_CATEGORIES: BlogCategory[] = [
  { id: "all", label: "All Insights", count: 48, icon: Layers },
  { id: "event-tech", label: "Event Tech", count: 16, icon: Cpu },
  { id: "production-strategy", label: "Production Strategy", count: 12, icon: Workflow },
  { id: "sustainable-events", label: "Sustainable Events", count: 8, icon: Leaf },
  { id: "case-studies", label: "Case Studies", count: 12, icon: FolderGit2 },
];

export interface BlogToolbarProps {
  categories?: BlogCategory[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalResultsCount?: number;
  filteredResultsCount?: number;
  sortBy?: "latest" | "popular" | "read-time";
  onSortChange?: (sort: "latest" | "popular" | "read-time") => void;
}

export default function BlogToolbar({
  categories = DEFAULT_BLOG_CATEGORIES,
  activeCategory: controlledActiveCategory,
  onCategoryChange,
  searchQuery: controlledSearchQuery,
  onSearchChange,
  totalResultsCount = 48,
  filteredResultsCount,
  sortBy: controlledSortBy,
  onSortChange,
}: BlogToolbarProps) {
  // Internal fallback state if uncontrolled
  const [internalCategory, setInternalCategory] = useState("all");
  const [internalSearch, setInternalSearch] = useState("");
  const [internalSort, setInternalSort] = useState<"latest" | "popular" | "read-time">("latest");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const activeCategory = controlledActiveCategory ?? internalCategory;
  const searchQuery = controlledSearchQuery ?? internalSearch;
  const sortBy = controlledSortBy ?? internalSort;

  const currentCount =
    filteredResultsCount !== undefined
      ? filteredResultsCount
      : activeCategory === "all"
      ? totalResultsCount
      : categories.find((c) => c.id === activeCategory)?.count ?? totalResultsCount;

  // Refs for GSAP sliding pill indicator
  const toolbarContainerRef = useRef<HTMLDivElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const slidingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);

  // Handle category change
  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      if (onCategoryChange) {
        onCategoryChange(categoryId);
      } else {
        setInternalCategory(categoryId);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("blog:state-change", {
            detail: { category: categoryId, search: searchQuery, sort: sortBy },
          })
        );
      }
    },
    [onCategoryChange, searchQuery, sortBy]
  );

  // Handle search input change
  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (onSearchChange) {
        onSearchChange(val);
      } else {
        setInternalSearch(val);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("blog:state-change", {
            detail: { category: activeCategory, search: val, sort: sortBy },
          })
        );
      }
    },
    [onSearchChange, activeCategory, sortBy]
  );

  // Handle search clear
  const handleClearSearch = useCallback(() => {
    if (onSearchChange) {
      onSearchChange("");
    } else {
      setInternalSearch("");
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("blog:state-change", {
          detail: { category: activeCategory, search: "", sort: sortBy },
        })
      );
    }
    searchInputRef.current?.focus();
  }, [onSearchChange, activeCategory, sortBy]);

  // Handle Sort Change
  const handleSortSelect = useCallback(
    (newSort: "latest" | "popular" | "read-time") => {
      if (onSortChange) {
        onSortChange(newSort);
      } else {
        setInternalSort(newSort);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("blog:state-change", {
            detail: { category: activeCategory, search: searchQuery, sort: newSort },
          })
        );
      }
      setIsSortOpen(false);
    },
    [onSortChange, activeCategory, searchQuery]
  );

  // Listen for external filter updates (e.g. clicking tag badges in BlogGrid)
  useEffect(() => {
    const handleExternalFilter = (e: Event) => {
      const customEvent = e as CustomEvent<{ category?: string; search?: string; sort?: "latest" | "popular" | "read-time" }>;
      if (!customEvent.detail) return;
      if (customEvent.detail.category !== undefined) {
        setInternalCategory(customEvent.detail.category);
        if (onCategoryChange) onCategoryChange(customEvent.detail.category);
      }
      if (customEvent.detail.search !== undefined) {
        setInternalSearch(customEvent.detail.search);
        if (onSearchChange) onSearchChange(customEvent.detail.search);
      }
      if (customEvent.detail.sort !== undefined) {
        setInternalSort(customEvent.detail.sort);
        if (onSortChange) onSortChange(customEvent.detail.sort);
      }
    };

    window.addEventListener("blog:set-filter", handleExternalFilter);
    return () => window.removeEventListener("blog:set-filter", handleExternalFilter);
  }, [onCategoryChange, onSearchChange, onSortChange]);

  // GSAP: Animate the sliding indicator pill following the active category
  useEffect(() => {
    const navContainer = navContainerRef.current;
    const indicator = slidingIndicatorRef.current;
    const activeButton = buttonRefs.current.get(activeCategory);

    if (!navContainer || !indicator || !activeButton) return;

    const navRect = navContainer.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();

    const targetX = btnRect.left - navRect.left;
    const targetWidth = btnRect.width;
    const targetHeight = btnRect.height;
    const targetY = btnRect.top - navRect.top;

    gsap.to(indicator, {
      x: targetX,
      y: targetY,
      width: targetWidth,
      height: targetHeight,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });

    // Auto-scroll parent container horizontally if button is off-screen on mobile
    const scrollLeft = navContainer.scrollLeft;
    const containerWidth = navContainer.clientWidth;
    const btnLeftRelative = activeButton.offsetLeft;
    const btnRightRelative = btnLeftRelative + activeButton.offsetWidth;

    if (btnLeftRelative < scrollLeft) {
      navContainer.scrollTo({ left: btnLeftRelative - 16, behavior: "smooth" });
    } else if (btnRightRelative > scrollLeft + containerWidth) {
      navContainer.scrollTo({
        left: btnRightRelative - containerWidth + 16,
        behavior: "smooth",
      });
    }
  }, [activeCategory, categories]);

  // Keyboard shortcut listener (Cmd/Ctrl + K or '/') to quickly focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial Entrance Animation for Toolbar
  useEffect(() => {
    if (!toolbarContainerRef.current) return;

    gsap.fromTo(
      toolbarContainerRef.current,
      { opacity: 0, y: 18, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.1,
      }
    );
  }, []);

  return (
    <section
      id="blog-toolbar"
      ref={toolbarContainerRef}
      className="sticky top-20 sm:top-24 z-40 w-full px-3 sm:px-6 lg:px-8 xl:px-10 my-2 sm:my-4 transition-all duration-300"
    >
      {/* Main Glass Bar Container - Full Width */}
      <div className="relative w-full rounded-2xl lg:rounded-full backdrop-blur-xl bg-white/85 border border-slate-200/80 shadow-[0_12px_40px_-10px_rgba(0,62,149,0.08),0_4px_16px_rgba(0,0,0,0.02)] p-2 sm:p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 transition-shadow duration-300 hover:shadow-[0_16px_45px_-8px_rgba(0,167,245,0.15)]">
        {/* Subtle dynamic top border highlight */}
        <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00A7F5]/30 to-transparent pointer-events-none" />

        {/* 1. Category Navigation with Sliding GSAP Pill */}
        <div className="relative flex-1 min-w-0">
          <div
            ref={navContainerRef}
            className="relative flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 rounded-xl sm:rounded-full bg-slate-100/70 border border-slate-200/50"
          >
            {/* GSAP Sliding Indicator Pill */}
            <div
              ref={slidingIndicatorRef}
              aria-hidden="true"
              className="absolute top-0 left-0 rounded-lg sm:rounded-full bg-[#003E95] shadow-[0_4px_14px_rgba(0,62,149,0.32)] pointer-events-none opacity-0 will-change-transform z-0"
              style={{ height: "36px" }}
            />

            {/* Category Buttons */}
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  ref={(el) => {
                    if (el) buttonRefs.current.set(cat.id, el);
                    else buttonRefs.current.delete(cat.id);
                  }}
                  onClick={() => handleCategoryClick(cat.id)}
                  aria-pressed={isActive}
                  className={`relative z-10 shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg sm:rounded-full text-xs font-bold transition-colors duration-200 select-none ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive ? "text-[#00A7F5]" : "text-slate-400"
                      }`}
                    />
                  )}
                  <span>{cat.label}</span>

                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/80 text-slate-500 border border-slate-200/70"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Search Input & Sort Controls Clustered */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Real-Time Inline Search Input */}
          <div
            className={`relative flex-1 sm:w-72 lg:w-80 flex items-center rounded-xl sm:rounded-full bg-slate-50 border transition-all duration-300 ${
              isSearchFocused
                ? "bg-white border-[#00A7F5] shadow-[0_0_0_4px_rgba(0,167,245,0.12)]"
                : "border-slate-200/80 hover:border-slate-300 hover:bg-white/80"
            }`}
          >
            <div className="pl-3.5 pr-2 pointer-events-none text-slate-400 flex items-center justify-center">
              <Search
                className={`w-4 h-4 transition-colors ${
                  isSearchFocused ? "text-[#003E95]" : "text-slate-400"
                }`}
              />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search insights, tech & blueprints..."
              className="w-full py-2 sm:py-2.5 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
            />

            {/* Clear Button or Keyboard Shortcut Hint */}
            <div className="pr-3 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={handleClearSearch}
                  aria-label="Clear search input"
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                  <span className="text-[9px]">⌘</span>K
                </kbd>
              )}
            </div>
          </div>

          {/* Sort Dropdown Selector */}
          <div ref={sortDropdownRef} className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              aria-expanded={isSortOpen}
              aria-label="Sort options"
              className="h-9 sm:h-10 px-3 rounded-xl sm:rounded-full bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-slate-300 flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-2xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">
                {sortBy === "latest"
                  ? "Latest"
                  : sortBy === "popular"
                  ? "Most Popular"
                  : "Read Time"}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_12px_32px_rgba(0,62,149,0.12)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sort Articles
                </div>
                {(
                  [
                    { id: "latest", label: "Latest Dispatches" },
                    { id: "popular", label: "Most Popular" },
                    { id: "read-time", label: "Shortest Read Time" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSortSelect(opt.id)}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#003E95] flex items-center justify-between transition-colors"
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#003E95]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Search & Filter Live Summary Banner (when searching or filtering) */}
      {(searchQuery || activeCategory !== "all") && (
        <div className="mt-2.5 px-4 py-2 rounded-xl bg-blue-50/90 backdrop-blur-md border border-blue-200/70 flex items-center justify-between gap-3 text-xs text-[#003E95] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold">Active Filter:</span>
            {activeCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#003E95] border border-blue-200 font-semibold text-[11px] shadow-2xs">
                {categories.find((c) => c.id === activeCategory)?.label}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-blue-200 font-semibold text-[11px] shadow-2xs">
                &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            <span className="text-slate-500 font-medium ml-1">
              ({currentCount} {currentCount === 1 ? "article" : "articles"} found)
            </span>
          </div>

          <button
            onClick={() => {
              handleCategoryClick("all");
              handleClearSearch();
            }}
            className="text-[11px] font-bold text-[#003E95] hover:text-[#00A7F5] underline underline-offset-2 shrink-0 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
