"use client";

import React, { useEffect, useRef } from "react";
import { useReveal } from "./RevealProvider";

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
  // Idle "breathing" sway — an ambient offset from originX/Y that the spring
  // chases even when the cursor is nowhere near, so the lattice never sits
  // perfectly still.
  swayPhase: number;
  swayPhaseY: number;
  swaySpeed: number;
  swayRadius: number;
}

interface NetworkPulse {
  // An ordered, meandering path of grid-particle indices — each step hops
  // to a random (not nearest) nearby node, so the shape traces an organic
  // wandering line instead of a uniform star/cluster.
  chain: number[];
  color: { r: number; g: number; b: number };
  born: number;
  stepDelay: number;
  nodeDuration: number;
}

function smoothstep(t: number) {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
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
  const { revealed } = useReveal();

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
      radius: 200,
    };

    // Ambient floating colored fluid orbs
    let ambientNodes: AmbientNode[] = [];
    // Interactive elastic grid particles
    let gridParticles: Particle[] = [];
    // Ambient micro dust specks
    let dustParticles: FloatingDust[] = [];
    // Autonomous "network activity" bursts — a handful of nearby lattice
    // nodes self-illuminate and link up on their own, independent of the
    // cursor, so the web keeps feeling alive when the mouse is idle/away.
    let pulses: NetworkPulse[] = [];
    let nextPulseAt = performance.now() + 600;
    const PULSE_STEP_RADIUS = 72;
    const PULSE_COLORS: { r: number; g: number; b: number }[] = [
      { r: 0, g: 62, b: 149 }, // primary
      { r: 0, g: 167, b: 245 }, // secondary
      { r: 146, g: 220, b: 255 }, // tertiary
    ];

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
      const spacing = Math.max(48, Math.min(64, Math.floor(width / 26)));
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
            size: 1.6,
            baseAlpha: 0.3,
            alpha: 0.3,
            color: "#64748B", // Slate 500
            swayPhase: Math.random() * Math.PI * 2,
            swayPhaseY: Math.random() * Math.PI * 2,
            swaySpeed: 0.012 + Math.random() * 0.014,
            swayRadius: 3 + Math.random() * 3,
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

      // Reset pulses — their particle indices point into the array above
      // and would go stale once the grid is rebuilt at the new size.
      pulses = [];
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

    // Traces a short, meandering path across the lattice — at each step it
    // hops to a random (not the nearest) unvisited node within a small
    // radius, so the resulting shape wanders like a neural firing or a
    // vein of lightning instead of a symmetric star/cluster.
    const spawnPulse = (time: number) => {
      if (gridParticles.length === 0) return;
      const startIdx = Math.floor(Math.random() * gridParticles.length);
      const chain: number[] = [startIdx];
      const visited = new Set<number>([startIdx]);
      const chainLength = 3 + Math.floor(Math.random() * 4);
      const stepRadiusSq = PULSE_STEP_RADIUS * PULSE_STEP_RADIUS;
      let currentIdx = startIdx;

      for (let step = 0; step < chainLength; step++) {
        const current = gridParticles[currentIdx];
        const candidates: number[] = [];
        for (let i = 0; i < gridParticles.length; i++) {
          if (visited.has(i)) continue;
          const p = gridParticles[i];
          const dx = p.x - current.x;
          const dy = p.y - current.y;
          if (dx * dx + dy * dy < stepRadiusSq) candidates.push(i);
        }
        if (candidates.length === 0) break;
        const next = candidates[Math.floor(Math.random() * candidates.length)];
        chain.push(next);
        visited.add(next);
        currentIdx = next;
      }

      pulses.push({
        chain,
        color: PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)],
        born: time,
        stepDelay: 90 + Math.random() * 90,
        nodeDuration: 900 + Math.random() * 700,
      });
    };

    let lastTime = performance.now();

    // Render & Simulation Loop
    const render = (time: number) => {
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
          mouse.x += (mouse.targetX - mouse.x) * 0.15;
          mouse.y += (mouse.targetY - mouse.y) * 0.15;
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

      // Dynamic cursor network web radius
      const dynamicRadius = Math.min(270, mouse.radius + mouse.speed * 4);
      const dynamicRadiusSq = dynamicRadius * dynamicRadius;

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
          dynamicRadius * 1.4
        );
        const glowIntensity = Math.min(0.24, 0.09 + (mouse.speed / 40) * 0.14);
        cursorGlow.addColorStop(0, `rgba(0, 167, 245, ${glowIntensity})`);
        cursorGlow.addColorStop(0.4, `rgba(146, 220, 255, ${glowIntensity * 0.5})`);
        cursorGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, dynamicRadius * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // --- LAYER 2: ELASTIC KINETIC LATTICE + NETWORK WEB CONNECTIONS ---
      ctx.save();
      const springFactor = 0.045;
      const damping = 0.86;

      // Active particles list within mouse interaction zone for network web mesh
      const activeParticles: { p: Particle; dist: number; dx: number; dy: number }[] = [];

      for (let i = 0; i < gridParticles.length; i++) {
        const p = gridParticles[i];

        // Vector to cursor
        if (mouse.x > -500) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < dynamicRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / dynamicRadius) * (18 + mouse.speed * 0.75);
            const angle = Math.atan2(dy, dx);

            // Push outward from cursor with velocity momentum
            p.vx += Math.cos(angle) * force * 0.12;
            p.vy += Math.sin(angle) * force * 0.12;

            // Illuminate particles in network web
            p.alpha = Math.min(1.0, p.baseAlpha + (1 - dist / dynamicRadius) * 0.7);
            activeParticles.push({ p, dist, dx, dy });
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.08;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.08;
        }

        // Idle breathing drift: the spring's rest position gently orbits
        // the true origin so the lattice keeps moving even with no cursor.
        p.swayPhase += p.swaySpeed;
        p.swayPhaseY += p.swaySpeed * 1.3;
        const restX = p.originX + Math.cos(p.swayPhase) * p.swayRadius;
        const restY = p.originY + Math.sin(p.swayPhaseY) * p.swayRadius;

        // Spring force pulling back to the (swaying) rest position
        const springX = (restX - p.x) * springFactor;
        const springY = (restY - p.y) * springFactor;

        p.vx = (p.vx + springX) * damping;
        p.vy = (p.vy + springY) * damping;

        p.x += p.vx;
        p.y += p.vy;
      }

      // --- 2A. DRAW NETWORK WEB LINES (Mouse-to-Particle & Particle-to-Particle) ---
      if (mouse.x > -500 && activeParticles.length > 0) {
        // 1. Draw Direct Spider-Web Lines to Mouse Cursor
        for (let i = 0; i < activeParticles.length; i++) {
          const { p, dist } = activeParticles[i];
          const proximity = 1 - dist / dynamicRadius;
          const lineAlpha = Math.pow(proximity, 1.15) * 0.65; // Crisp, luminous web line

          ctx.strokeStyle = `rgba(0, 167, 245, ${lineAlpha})`;
          ctx.lineWidth = Math.max(0.75, proximity * 1.8);

          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        // 2. Draw Inter-Particle Constellation Network Web Mesh
        const maxNeighborDist = 100;
        const maxNeighborDistSq = maxNeighborDist * maxNeighborDist;

        for (let i = 0; i < activeParticles.length; i++) {
          for (let j = i + 1; j < activeParticles.length; j++) {
            const p1 = activeParticles[i].p;
            const p2 = activeParticles[j].p;

            const pdx = p1.x - p2.x;
            const pdy = p1.y - p2.y;
            const pDistSq = pdx * pdx + pdy * pdy;

            if (pDistSq < maxNeighborDistSq) {
              const pDist = Math.sqrt(pDistSq);
              const linkProximity = 1 - pDist / maxNeighborDist;
              const avgDistToMouse = (activeParticles[i].dist + activeParticles[j].dist) / 2;
              const mouseProximity = 1 - avgDistToMouse / dynamicRadius;
              const meshAlpha = Math.min(0.65, linkProximity * mouseProximity * 0.8);

              if (meshAlpha > 0.03) {
                // Gradient connection line between nodes
                ctx.strokeStyle = `rgba(0, 62, 149, ${meshAlpha})`;
                ctx.lineWidth = Math.max(0.6, linkProximity * 1.4);

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }

        // 3. Draw Center Cursor Core Node & Pulse Ring
        ctx.fillStyle = "#00A7F5";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 167, 245, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // --- 2A-2. AUTONOMOUS NETWORK PULSES (self-triggered, cursor-independent) ---
      if (time > nextPulseAt && pulses.length < 6) {
        spawnPulse(time);
        nextPulseAt = time + 500 + Math.random() * 900;
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const totalLifespan = (pulse.chain.length - 1) * pulse.stepDelay + pulse.nodeDuration;
        if (time - pulse.born > totalLifespan) pulses.splice(i, 1);
      }

      for (const pulse of pulses) {
        const elapsed = time - pulse.born;
        const { r, g, b } = pulse.color;

        // Each node's own envelope: a quick organic attack then a slow
        // fade, offset by its position in the chain — a wave that travels
        // node-to-node rather than every node blinking in lockstep.
        const envelopes = pulse.chain.map((_, k) => {
          const local = (elapsed - k * pulse.stepDelay) / pulse.nodeDuration;
          if (local <= 0 || local >= 1) return 0;
          const rise = smoothstep(local / 0.2);
          const fall = 1 - smoothstep((local - 0.2) / 0.8);
          return Math.min(rise, fall);
        });

        for (let k = 0; k < pulse.chain.length; k++) {
          const env = envelopes[k];
          if (env <= 0) continue;
          const node = gridParticles[pulse.chain[k]];
          if (!node) continue;
          // Boost alpha only upward (Math.max) so the cursor-driven web
          // above is never dimmed or overridden by an autonomous pulse.
          node.alpha = Math.max(node.alpha, env);
        }

        for (let k = 0; k < pulse.chain.length - 1; k++) {
          const lineEnv = Math.min(envelopes[k], envelopes[k + 1]);
          if (lineEnv <= 0.02) continue;

          const nodeA = gridParticles[pulse.chain[k]];
          const nodeB = gridParticles[pulse.chain[k + 1]];
          if (!nodeA || !nodeB) continue;

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(lineEnv * 0.85).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.8, lineEnv * 2);
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();
        }
      }

      // --- 2B. RENDER ALL PARTICLES ---
      for (let i = 0; i < gridParticles.length; i++) {
        const p = gridParticles[i];

        if (p.alpha > 0.5) {
          // Highly active node in network web: Vibrant Sky Blue with glowing ring
          ctx.fillStyle = `rgba(0, 167, 245, ${p.alpha})`;
          ctx.beginPath();
          const drawSize = p.size * 1.4;
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
          ctx.fill();

          // Outer subtle cyan glow ring
          ctx.strokeStyle = `rgba(146, 220, 255, ${p.alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize + 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Default particle
          ctx.fillStyle = `rgba(100, 116, 139, ${p.alpha})`; // Slate 500
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
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
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-opacity duration-[1600ms] ease-out ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
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
