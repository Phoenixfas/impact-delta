"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "@/components/SmoothScroll";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Zap,
  ShieldCheck,
  Activity,
  Compass,
  Users,
  CheckCircle2,
  Globe,
  Calendar,
  ChevronRight,
  MousePointerClick,
  Sliders,
  TrendingUp,
  Award,
} from "lucide-react";

export default function Home() {
  const { scrollTo } = useSmoothScroll();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const bentoRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  // Live cursor telemetry state for the interactive widget
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    x: 0,
    y: 0,
    activeZone: "Hero Ambient",
  });

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();

    const handlePointer = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max((now - lastT) / 1000, 0.016);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const spd = Math.round(Math.sqrt(dx * dx + dy * dy) / dt);

      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      setTelemetry((prev) => ({
        ...prev,
        speed: Math.min(spd, 2500),
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
      }));
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Reveal Stagger
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".hero-badge", { opacity: 0, y: -20, duration: 0.8, delay: 0.1 })
        .from(".hero-title-line", { opacity: 0, y: 40, stagger: 0.15, duration: 1 }, "-=0.5")
        .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
        .from(".hero-cta-group", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
        .from(".hero-card-preview", { opacity: 0, scale: 0.94, y: 30, duration: 1 }, "-=0.7");

      // 2. Bento Cards ScrollTrigger Stagger
      gsap.from(".bento-item", {
        scrollTrigger: {
          trigger: bentoRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 45,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
      });

      // 3. Metrics Section Parallax & Counters
      gsap.from(".metric-card", {
        scrollTrigger: {
          trigger: metricsRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        scale: 0.92,
        y: 35,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.4)",
      });

      // 4. Timeline Stage Reveals
      gsap.from(".timeline-step", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: -30,
        stagger: 0.18,
        duration: 0.9,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">

    </div>
  );
}
