"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useSmoothScroll } from "./SmoothScroll";
import Image from "next/image";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

type NodeKey = "logo" | "menu" | "cta";
const NODE_KEYS: NodeKey[] = ["logo", "menu", "cta"];

// Attraction radius + max drift (px) each node is allowed to pull toward the cursor.
const NODE_CONFIG: Record<NodeKey, { radius: number; maxPull: number }> = {
  logo: { radius: 240, maxPull: 16 },
  menu: { radius: 220, maxPull: 14 },
  cta: { radius: 300, maxPull: 24 },
};

// Triangle loop connecting the three floating nodes into a shifting constellation.
const LINK_PAIRS: [NodeKey, NodeKey][] = [
  ["logo", "menu"],
  ["menu", "cta"],
  ["cta", "logo"],
];

interface NodePhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

function createPhysics(): NodePhysics {
  return { x: 0, y: 0, vx: 0, vy: 0, baseX: 0, baseY: 0 };
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOverlayRef = useRef<HTMLDivElement | null>(null);
  const isFirstMenuRender = useRef(true);

  // Circular-mask reveal: the fullscreen menu grows from an invisible dot
  // at the center of the screen to cover it entirely, and shrinks back down
  // the same way on close, instead of just popping in/out.
  useEffect(() => {
    const el = menuOverlayRef.current;
    if (!el) return;

    if (isFirstMenuRender.current) {
      isFirstMenuRender.current = false;
      return;
    }

    if (menuOpen) {
      el.style.visibility = "visible";
      gsap.fromTo(
        el,
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(100% at 50% 50%)", duration: 0.85, ease: "power3.inOut" }
      );
    } else {
      gsap.to(el, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => {
          el.style.visibility = "hidden";
        },
      });
    }
  }, [menuOpen]);

  // When loaded directly on any route other than "/" (where HeroSection's particle mask choreographs entrance),
  // ensure the navbar entrance nodes smoothly animate into their visible state.
  useEffect(() => {
    if (pathname !== "/") {
      gsap.to(".nav-entrance-node", {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: "back.out(1.6)",
        delay: 0.1,
      });
    }
  }, [pathname]);

  const logoRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  const physics = useRef<Record<NodeKey, NodePhysics>>({
    logo: createPhysics(),
    menu: createPhysics(),
    cta: createPhysics(),
  });

  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Gravity physics loop: nodes drift toward the cursor within their radius,
  // spring back to rest otherwise, and the constellation lines follow them.
  useEffect(() => {
    const nodeEls: Record<NodeKey, HTMLDivElement | null> = {
      logo: logoRef.current,
      menu: menuRef.current,
      cta: ctaRef.current,
    };

    const measure = () => {
      NODE_KEYS.forEach((key) => {
        const el = nodeEls[key];
        if (!el) return;
        const prevTransform = el.style.transform;
        el.style.transform = "none";
        const rect = el.getBoundingClientRect();
        physics.current[key].baseX = rect.left + rect.width / 2;
        physics.current[key].baseY = rect.top + rect.height / 2;
        el.style.transform = prevTransform;
      });
    };

    measure();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measure, 150);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const stiffness = 0.12;
    const damping = 0.8;
    let rafId = 0;

    const loop = () => {
      const mouse = mouseRef.current;

      NODE_KEYS.forEach((key) => {
        const el = nodeEls[key];
        const p = physics.current[key];
        if (!el) return;

        const { radius, maxPull } = NODE_CONFIG[key];
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        let targetX = 0;
        let targetY = 0;
        if (dist < radius) {
          const strength = 1 - dist / radius;
          targetX = (dx / dist) * maxPull * strength;
          targetY = (dy / dist) * maxPull * strength;
        }

        p.vx = (p.vx + (targetX - p.x) * stiffness) * damping;
        p.vy = (p.vy + (targetY - p.y) * stiffness) * damping;
        p.x += p.vx;
        p.y += p.vy;

        el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`;
      });

      LINK_PAIRS.forEach(([a, b], i) => {
        const line = lineRefs.current[i];
        if (!line) return;
        const pa = physics.current[a];
        const pb = physics.current[b];
        const x1 = pa.baseX + pa.x;
        const y1 = pa.baseY + pa.y;
        const x2 = pb.baseX + pb.x;
        const y2 = pb.baseY + pb.y;

        line.setAttribute("x1", x1.toFixed(1));
        line.setAttribute("y1", y1.toFixed(1));
        line.setAttribute("x2", x2.toFixed(1));
        line.setAttribute("y2", y2.toFixed(1));

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const proximity = Math.max(0, 1 - Math.hypot(mouse.x - midX, mouse.y - midY) / 260);
        const alpha = 0.08 + proximity * 0.32;
        line.setAttribute("stroke", `rgba(0, 167, 245, ${alpha.toFixed(3)})`);
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);

    if (href.startsWith("/")) {
      if (pathname === href) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(href);
      }
      return;
    }

    if (href.startsWith("#")) {
      if (pathname !== "/") {
        router.push(`/${href}`);
      } else {
        scrollTo(href, { offset: -60, duration: 1.2 });
      }
    }
  };

  return (
    <>
      {/* Constellation thread lines connecting the floating nodes */}
      <svg aria-hidden="true" className="fixed inset-0 z-40 pointer-events-none w-full h-full">
        {LINK_PAIRS.map(([a, b], i) => (
          <line
            key={`${a}-${b}`}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            x1={0}
            y1={0}
            x2={0}
            y2={0}
            stroke="rgba(0, 167, 245, 0.08)"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Top-Left: Logo */}
      <div ref={logoRef} className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 will-change-transform">
        <button
          onClick={() => handleNavClick("#hero")}
          className="nav-entrance-node group flex items-center gap-2.5 duration-300"
        >
          <div className={`relative w-20 h-20 sm:w-25 sm:h-25 flex items-center justify-center rounded-full overflow-hidden `}>
            <Image src={"/logo_t_lightGrad.svg"} alt="logo" width={200} height={200} className="absolute w-full h-full object-contain animate-[spin_7s_linear_infinite_reverse]" />
            <Image src={"/logo_g_lightGrad.svg"} alt="logo" width={200} height={200} className="w-full h-full object-contain" />
          </div>
        </button>
      </div>

      {/* Top-Right: Menu Trigger + Magnetic CTA, clustered */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3">
        <div ref={menuRef} className="will-change-transform">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="nav-entrance-node flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/75 border border-white/60 shadow-diffused-md hover:shadow-diffused-lg hover:border-[#00A7F5]/40 text-slate-700 hover:text-[#003E95] transition-all duration-300"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div ref={ctaRef} className="will-change-transform">
          <button
            onClick={() => handleNavClick("#contact")}
            className="nav-entrance-node group relative inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white overflow-hidden shadow-[0_16px_36px_-8px_rgba(0,62,149,0.4)] hover:shadow-[0_20px_44px_-8px_rgba(0,167,245,0.5)] transition-shadow duration-300 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />
            <span className="relative z-10">Request Proposal</span>
            <ArrowUpRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Fullscreen menu overlay, opened from the bottom-left node — always
          mounted so the closing circle-mask animation can play out, rather
          than the overlay being yanked from the DOM instantly. */}
      <div
        ref={menuOverlayRef}
        aria-hidden={!menuOpen}
        style={{ clipPath: "circle(0% at 50% 50%)", visibility: "hidden" }}
        className="fixed inset-0 z-[45] flex items-center justify-center backdrop-blur-2xl bg-white/80"
      >
        <nav className="flex flex-col items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              tabIndex={menuOpen ? 0 : -1}
              className="text-3xl sm:text-5xl font-extrabold text-slate-800 hover:text-[#003E95] tracking-tight transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
