"use client";

import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

export interface BrushRingArcHandle {
  play: () => void;
}

interface BrushRingArcProps {
  resetKey: number;
  d: string;
  className: string;
  strokeWidth: number;
  shadowWidth: number;
  highlightWidth: number;
  dim?: boolean; // the back strand reads slightly hazier, as if further away
}

/**
 * Renders one half-arc of the brush ring (see brushRingGeometry) as a
 * layered gradient stroke that "draws" itself on via stroke-dashoffset.
 * Two instances — front and back — are placed on either side of the hero
 * image stack in the DOM/z-order to sell a rope wrapped around it.
 */
const BrushRingArc = forwardRef<BrushRingArcHandle, BrushRingArcProps>(function BrushRingArc(
  { resetKey, d, className, strokeWidth, shadowWidth, highlightWidth, dim = false },
  ref
) {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gradientRef = useRef<SVGLinearGradientElement | null>(null);
  const mainRef = useRef<SVGPathElement | null>(null);
  const shadowRef = useRef<SVGPathElement | null>(null);
  const highlightRef = useRef<SVGPathElement | null>(null);

  // The gradient angle orbits toward the cursor's position relative to the
  // ring, lerped for a smooth chase — both arcs share this exact logic and
  // an (identical) bounding box, so front/back stay in sync automatically.
  useEffect(() => {
    const svg = svgRef.current;
    const gradient = gradientRef.current;
    if (!svg || !gradient) return;

    let targetAngle = 135;
    let curAngle = 135;
    let rafId = 0;

    const handleMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      targetAngle = (Math.atan2(relY, relX) * 180) / Math.PI;
    };

    const loop = () => {
      let delta = targetAngle - curAngle;
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;
      curAngle += delta * 0.06;
      gradient.setAttribute("gradientTransform", `rotate(${curAngle.toFixed(2)} 0.5 0.5)`);
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const length = main.getTotalLength();
    // A round line-cap can still paint a stray dot at the dash boundary even
    // when it's mathematically offset out of view, so the path stays fully
    // hidden via opacity (not just dash math) until play() reveals it.
    gsap.set(main, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    gsap.set([shadowRef.current, highlightRef.current], { opacity: 0 });
  }, [resetKey]);

  useImperativeHandle(ref, () => ({
    play: () => {
      const tl = gsap.timeline();
      tl.set(mainRef.current, { opacity: 1 })
        .to(mainRef.current, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" })
        .to([shadowRef.current, highlightRef.current], { opacity: 1, duration: 0.7 }, "-=0.7");
    },
  }));

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 220"
      preserveAspectRatio="none"
      className={`${className} overflow-visible`}
      style={{ opacity: dim ? 0.65 : 1 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient ref={gradientRef} id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003E95" />
          <stop offset="55%" stopColor="#00A7F5" />
          <stop offset="100%" stopColor="#92DCFF" />
        </linearGradient>
      </defs>
      <path
        ref={shadowRef}
        d={d}
        fill="none"
        stroke="rgba(0,40,100,0.38)"
        strokeWidth={shadowWidth}
        strokeLinecap="round"
        style={{ filter: "blur(10px)" }}
        transform="translate(4,7)"
      />
      <path ref={mainRef} d={d} fill="none" stroke={`url(#${gradientId})`} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        ref={highlightRef}
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={highlightWidth}
        strokeLinecap="round"
        transform="translate(-3,-4)"
      />
    </svg>
  );
});

export default BrushRingArc;
