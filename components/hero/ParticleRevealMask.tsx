"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ParticleRevealMaskProps {
  onProgress?: (progress: number) => void;
  onRevealComplete?: () => void;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface LatticeParticle {
  originX: number;
  originY: number;
  dirX: number;
  dirY: number;
  size: number;
  stagger: number;
  shape: "diamond" | "dot";
  color: RGB;
}

interface LatticeLink {
  a: number;
  b: number;
}

const PALETTE: RGB[] = [
  { r: 0, g: 62, b: 149 }, // --primary
  { r: 0, g: 167, b: 245 }, // --secondary
  { r: 146, g: 220, b: 255 }, // --tertiary
];

function smoothstep(t: number) {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

/**
 * Renders a dense crystalline particle lattice that seeds in, links itself
 * into a geometric mesh, then bursts outward and dissolves — acting as an
 * animated mask that reveals the hero content mounted beneath it.
 */
export default function ParticleRevealMask({ onProgress, onRevealComplete }: ParticleRevealMaskProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [done, setDone] = useState(false);

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onRevealComplete);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onRevealComplete;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: LatticeParticle[] = [];
    let links: LatticeLink[] = [];
    let burstDistance = 0;

    const buildLattice = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const centerX = width / 2;
      const centerY = height * 0.42;
      burstDistance = Math.max(width, height) * 0.55;

      const spacing = Math.max(44, Math.min(62, Math.floor(width / 26)));
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      particles = [];
      const grid: number[][] = [];

      for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
          const originX = (i - 0.5) * spacing + (Math.random() - 0.5) * 6;
          const originY = (j - 0.5) * spacing + (Math.random() - 0.5) * 6;
          const dx = originX - centerX;
          const dy = originY - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          particles.push({
            originX,
            originY,
            dirX: dx / dist,
            dirY: dy / dist,
            size: Math.random() * 1.5 + 1,
            stagger: Math.min(0.5, (dist / Math.max(width, height)) * 0.55 + Math.random() * 0.14),
            shape: Math.random() > 0.6 ? "diamond" : "dot",
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          });
          grid[i][j] = particles.length - 1;
        }
      }

      links = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (i + 1 < cols) links.push({ a: grid[i][j], b: grid[i + 1][j] });
          if (j + 1 < rows) links.push({ a: grid[i][j], b: grid[i][j + 1] });
        }
      }
    };

    buildLattice();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(buildLattice, 150);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, width, height);

      // Global dissolve fades the whole canvas out over the final stretch,
      // letting the real hero content underneath take over.
      const dissolve = 1 - smoothstep((progress - 0.8) / 0.2);
      if (dissolve <= 0.002) return;

      ctx.lineWidth = 1;
      for (const link of links) {
        const a = particles[link.a];
        const b = particles[link.b];
        const linkT = Math.min(
          smoothstep((progress - a.stagger * 0.4 - 0.06) / 0.28),
          smoothstep((progress - b.stagger * 0.4 - 0.06) / 0.28)
        );
        const fade = 1 - smoothstep((progress - 0.6) / 0.32);
        const alpha = linkT * fade * 0.22 * dissolve;
        if (alpha <= 0.003) continue;
        ctx.strokeStyle = `rgba(0, 167, 245, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.originX, a.originY);
        ctx.lineTo(b.originX, b.originY);
        ctx.stroke();
      }

      for (const p of particles) {
        const local = Math.min(Math.max((progress - p.stagger * 0.35) / (1 - p.stagger * 0.35), 0), 1);
        if (local <= 0) continue;

        const seedT = smoothstep(local / 0.55);
        const burstT = smoothstep((local - 0.6) / 0.4);

        const x = p.originX + p.dirX * burstT * burstT * burstDistance;
        const y = p.originY + p.dirY * burstT * burstT * burstDistance;
        const size = (p.size + burstT * p.size * 2.4) * seedT;
        const alpha = seedT * (1 - burstT) * dissolve * 0.85;

        if (alpha <= 0.01 || size <= 0.05) continue;

        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        if (p.shape === "diamond") {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        } else {
          ctx.arc(x, y, size / 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const progressState = { value: 0 };
    const tween = gsap.to(progressState, {
      value: 1,
      duration: 2.4,
      delay: 0.1,
      ease: "power1.inOut",
      onUpdate: () => {
        draw(progressState.value);
        onProgressRef.current?.(progressState.value);
      },
      onComplete: () => {
        onCompleteRef.current?.();
        setDone(true);
      },
    });

    return () => {
      tween.kill();
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  if (done) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-40 pointer-events-none"
    />
  );
}
