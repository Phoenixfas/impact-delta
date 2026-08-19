"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  color: string;
}

interface AmbientNode {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: { r: number; g: number; b: number };
  baseAlpha: number;
  phase: number;
  phaseSpeed: number;
}

interface FloatingDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
}

export default function KineticBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse & Pointer Physics
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      speed: 0,
      isHovered: false,
      radius: 180,
    };

    // Ambient floating colored fluid orbs
    let ambientNodes: AmbientNode[] = [];
    // Interactive elastic grid particles
    let gridParticles: Particle[] = [];
    // Ambient micro dust specks
    let dustParticles: FloatingDust[] = [];

    const initScene = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // 1. Initialize Ambient Liquid Glow Blobs (Corporate Blue, Vibrant Sky, Soft Cyan)
      ambientNodes = [
        {
          x: width * 0.25,
          y: height * 0.3,
          radius: Math.max(width, height) * 0.4,
          vx: 0.25,
          vy: 0.18,
          color: { r: 0, g: 62, b: 149 }, // #003E95 Primary Corporate Blue
          baseAlpha: 0.08,
          phase: 0,
          phaseSpeed: 0.008,
        },
        {
          x: width * 0.75,
          y: height * 0.4,
          radius: Math.max(width, height) * 0.45,
          vx: -0.22,
          vy: 0.2,
          color: { r: 0, g: 167, b: 245 }, // #00A7F5 Vibrant Secondary Blue
          baseAlpha: 0.09,
          phase: Math.PI * 0.5,
          phaseSpeed: 0.007,
        },
        {
          x: width * 0.5,
          y: height * 0.75,
          radius: Math.max(width, height) * 0.5,
          vx: 0.18,
          vy: -0.25,
          color: { r: 146, g: 220, b: 255 }, // #92DCFF Electric Cyan
          baseAlpha: 0.1,
          phase: Math.PI,
          phaseSpeed: 0.006,
        },
        {
          x: width * 0.85,
          y: height * 0.85,
          radius: Math.max(width, height) * 0.35,
          vx: -0.15,
          vy: -0.15,
          color: { r: 0, g: 62, b: 149 }, // Deep corporate blue anchor
          baseAlpha: 0.06,
          phase: Math.PI * 1.5,
          phaseSpeed: 0.009,
        },
      ];

      // 2. Initialize Kinetic Lattice Warp Grid
      gridParticles = [];
      const spacing = Math.max(48, Math.min(68, Math.floor(width / 24)));
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const originX = (i - 0.5) * spacing;
          const originY = (j - 0.5) * spacing;
          
          gridParticles.push({
            x: originX,
            y: originY,
            originX,
            originY,
            vx: 0,
            vy: 0,
            size: 1.4,
            baseAlpha: 0.22,
            alpha: 0.22,
            color: "#94A3B8", // Slate 400
          });
        }
      }

      // 3. Initialize Floating Micro-Dust Specks
      dustParticles = [];
      const dustCount = Math.floor((width * height) / 28000);
      for (let k = 0; k < dustCount; k++) {
        dustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -Math.random() * 0.4 - 0.1,
          size: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.4 + 0.1,
          baseAlpha: Math.random() * 0.35 + 0.1,
          color: Math.random() > 0.4 ? "#00A7F5" : "#003E95",
        });
      }
    };

    initScene();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initScene, 120);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Pointer tracking with smooth delta
    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handlePointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isHovered = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    let lastTime = performance.now();

    // Render & Simulation Loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Mouse Lerp & Velocity Calculation
      if (mouse.targetX > -500) {
        if (mouse.x < -500) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
          mouse.prevX = mouse.x;
          mouse.prevY = mouse.y;
        } else {
          mouse.prevX = mouse.x;
          mouse.prevY = mouse.y;
          // Smooth spring-like lerp to mouse
          mouse.x += (mouse.targetX - mouse.x) * 0.14;
          mouse.y += (mouse.targetY - mouse.y) * 0.14;
        }

        const dx = mouse.x - mouse.prevX;
        const dy = mouse.y - mouse.prevY;
        const instantSpeed = Math.sqrt(dx * dx + dy * dy);
        mouse.speed += (instantSpeed - mouse.speed) * 0.2;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
        mouse.speed *= 0.9;
      }

      // Dynamic cursor radius based on velocity
      const dynamicRadius = Math.min(260, mouse.radius + mouse.speed * 4);

      // --- CLEAR CANVAS WITH PRISTINE LIGHT THEMED SURFACE ---
      ctx.fillStyle = "#F8FAFC"; // Ultra-clean Light Slate 50
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 1: AMBIENT FLUID LIQUID GRADIENT BLOBS ---
      ctx.save();
      ambientNodes.forEach((node) => {
        // Move nodes with gentle undulating drift
        node.x += node.vx;
        node.y += node.vy;
        node.phase += node.phaseSpeed;

        if (node.x - node.radius < -100 || node.x + node.radius > width + 100) node.vx *= -1;
        if (node.y - node.radius < -100 || node.y + node.radius > height + 100) node.vy *= -1;

        // Subtle breath pulsation
        const pulse = Math.sin(node.phase) * 0.12;
        const currentRadius = node.radius * (1 + pulse);
        const currentAlpha = Math.max(0.02, node.baseAlpha + pulse * 0.03);

        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          currentRadius
        );

        const { r, g, b } = node.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.45})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive Cursor Ambient Shimmer
      if (mouse.x > -500) {
        const cursorGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          dynamicRadius * 1.5
        );
        const glowIntensity = Math.min(0.22, 0.08 + (mouse.speed / 40) * 0.14);
        cursorGlow.addColorStop(0, `rgba(0, 167, 245, ${glowIntensity})`);
        cursorGlow.addColorStop(0.4, `rgba(146, 220, 255, ${glowIntensity * 0.5})`);
        cursorGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, dynamicRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // --- LAYER 2: ELASTIC KINETIC LATTICE / PARTICLE WARP MESH ---
      ctx.save();
      const springFactor = 0.045;
      const damping = 0.86;

      for (let i = 0; i < gridParticles.length; i++) {
        const p = gridParticles[i];

        // Vector to cursor
        if (mouse.x > -500) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const rSq = dynamicRadius * dynamicRadius;

          if (distSq < rSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / dynamicRadius) * (18 + mouse.speed * 0.75);
            const angle = Math.atan2(dy, dx);

            // Push outward from cursor with velocity momentum
            p.vx += Math.cos(angle) * force * 0.12;
            p.vy += Math.sin(angle) * force * 0.12;

            // Illuminate particles near cursor
            p.alpha = Math.min(0.85, p.baseAlpha + (1 - dist / dynamicRadius) * 0.65);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.08;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.08;
        }

        // Spring force pulling back to origin
        const springX = (p.originX - p.x) * springFactor;
        const springY = (p.originY - p.y) * springFactor;

        p.vx = (p.vx + springX) * damping;
        p.vy = (p.vy + springY) * damping;

        p.x += p.vx;
        p.y += p.vy;

        // Render Dot
        ctx.fillStyle = p.alpha > 0.35 
          ? `rgba(0, 167, 245, ${p.alpha})` 
          : `rgba(148, 163, 184, ${p.alpha})`; // Slate 400 default, Cyan accent when active
        
        ctx.beginPath();
        const drawSize = p.alpha > 0.4 ? p.size * 1.35 : p.size;
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // --- LAYER 3: FLOATING LUMINESCENT MICRO-PARTICLES ---
      ctx.save();
      for (let k = 0; k < dustParticles.length; k++) {
        const d = dustParticles[k];
        d.x += d.vx;
        d.y += d.vy;

        // Wrap around viewport
        if (d.y < -10) {
          d.y = height + 10;
          d.x = Math.random() * width;
        }
        if (d.x < -10) d.x = width + 10;
        if (d.x > width + 10) d.x = -10;

        // Mouse proximity brighten
        if (mouse.x > -500) {
          const ddx = d.x - mouse.x;
          const ddy = d.y - mouse.y;
          const dDistSq = ddx * ddx + ddy * ddy;
          if (dDistSq < 150 * 150) {
            const proximity = 1 - Math.sqrt(dDistSq) / 150;
            d.alpha = Math.min(0.85, d.baseAlpha + proximity * 0.6);
            d.x += ddx * 0.015;
            d.y += ddy * 0.015;
          } else {
            d.alpha += (d.baseAlpha - d.alpha) * 0.05;
          }
        }

        ctx.fillStyle = d.color === "#00A7F5" 
          ? `rgba(0, 167, 245, ${d.alpha})`
          : `rgba(0, 62, 149, ${d.alpha})`;
        
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause loop if tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* HTML5 High-Performance Interactive Kinetic Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />

      {/* Subtle Micro-Noise & Vignette Overlay for Executive Editorial Finish */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Perimeter Soft Vignette to Frame Content */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(241,245,249,0.5)_100%)]" />
    </div>
  );
}
