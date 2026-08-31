"use client";

import React, { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import gsap from "gsap";
import {
  Tv,
  Wifi,
  Truck,
  Headphones,
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { StandBriefFormData } from "@/lib/standBriefSchema";
import { useBriefForm } from "./BriefFormProvider";

const LED_PRESETS = [
  '55" Commercial 4K Display',
  '65" Commercial 4K Display',
  '75" Commercial Ultra-HD',
  '85" Keynote Screen',
  "Seamless Fine-Pitch LED Video Wall (P1.9)",
  "Curved Kinetic LED Ribbon",
];

export default function StepAudioVisual() {
  const { nextStep, prevStep } = useBriefForm();
  const { register, setValue, watch } = useFormContext<StandBriefFormData>();

  const ledScreenQty = watch("step5.ledScreenQty") || 1;
  const ledScreenSize = watch("step5.ledScreenSize") || "";
  const wifiInternet = watch("step5.wifiInternet");
  const logisticsForklift = watch("step5.logisticsForklift");
  const eventConferenceSupport = watch("step5.eventConferenceSupport");

  // Magnetic button refs
  const magneticNextRef = useRef<HTMLButtonElement | null>(null);
  const magneticBackRef = useRef<HTMLButtonElement | null>(null);

  // Magnetic Button Physics
  useEffect(() => {
    const attachMagnetic = (btn: HTMLElement | null) => {
      if (!btn) return () => {};
      const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 75) {
          const pullFactor = (1 - dist / 75) * 7;
          xTo((e.clientX - centerX) * 0.15 * pullFactor);
          yTo((e.clientY - centerY) * 0.15 * pullFactor);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        btn.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    const cleanupNext = attachMagnetic(magneticNextRef.current);
    const cleanupBack = attachMagnetic(magneticBackRef.current);

    return () => {
      cleanupNext();
      cleanupBack();
    };
  }, []);

  const updateLedQty = (delta: number) => {
    const nextVal = Math.max(0, Math.min(12, ledScreenQty + delta));
    setValue("step5.ledScreenQty", nextVal, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      {/* Step Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Audio Visual & Venue Services</span>
            <span className="text-[11px] font-semibold text-[#00A7F5] bg-[#EBF4FF] px-2.5 py-0.5 rounded-full">
              AV & Infrastructure
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Specify commercial LED screens, video walls, high-speed venue network, and logistics support.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
          * Required fields
        </span>
      </div>

      {/* 1. LED Screen Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-[#00A7F5]" />
            LED Screen & Display Specifications <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-slate-400">
            Commercial Displays & Fine-Pitch Video Walls
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quantity Stepper Input */}
          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700">
                Quantity of Displays
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Number of screen units required
              </p>
            </div>

            <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => updateLedQty(-1)}
                disabled={ledScreenQty <= 0}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="font-mono font-bold text-lg text-[#003E95]">
                {ledScreenQty} <span className="text-xs font-sans text-slate-400">units</span>
              </span>

              <button
                type="button"
                onClick={() => updateLedQty(1)}
                disabled={ledScreenQty >= 12}
                className="w-8 h-8 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white flex items-center justify-center transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Size Specification Field */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00A7F5]" />
                Display Size & Resolution Specs
              </label>
              <input
                {...register("step5.ledScreenSize")}
                placeholder='e.g. 65" 4K Commercial Display or 4m x 2.5m Seamless LED Wall'
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003E95] focus:ring-2 focus:ring-[#00A7F5]/15 transition-all"
              />
            </div>

            {/* Quick Preset Size Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {LED_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() =>
                    setValue("step5.ledScreenSize", preset, { shouldValidate: true })
                  }
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    ledScreenSize === preset
                      ? "bg-[#003E95] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Venue & Other Services Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#00A7F5]" />
            Venue Utilities & Technical Services
          </label>
          <span className="text-[10px] text-slate-400">
            On-Site Support & Network Drops
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. WiFi / Internet Toggle Card */}
          <div
            onClick={() =>
              setValue("step5.wifiInternet", !wifiInternet, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              wifiInternet
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    wifiInternet
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    WiFi & Dedicated Internet
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Ethernet & 1Gbps Bandwidth
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  wifiInternet
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Dedicated enterprise venue Ethernet cable drops and high-speed secure WiFi router setup for live demos.
            </p>
          </div>

          {/* 2. Logistics / Forklift Toggle Card */}
          <div
            onClick={() =>
              setValue("step5.logisticsForklift", !logisticsForklift, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              logisticsForklift
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    logisticsForklift
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Logistics & Forklift
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Freight & Heavy Offloading
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  logisticsForklift
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              On-site forklift crane handling, machinery uncrating, container marshalling and customs clearance.
            </p>
          </div>

          {/* 3. Event / Conference Support Toggle Card */}
          <div
            onClick={() =>
              setValue("step5.eventConferenceSupport", !eventConferenceSupport, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              eventConferenceSupport
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    eventConferenceSupport
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Event & Conference Support
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Standby Engineers & Cleaning
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  eventConferenceSupport
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Dedicated on-site technical engineer standby, overnight stand cleaning and waste recycling.
            </p>
          </div>
        </div>

        {/* Optional AV notes */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-slate-700">
            Additional Audio Visual Requirements
          </label>
          <input
            {...register("step5.avAdditionalNotes")}
            placeholder="e.g. Wireless presentation microphones, directional audio sound bar, interactive touch screen..."
            className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Navigation: Magnetic Back and Next Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          ref={magneticBackRef}
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 cursor-pointer transition-all duration-200 will-change-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Back: Stand Design
        </button>

        <button
          ref={magneticNextRef}
          type="button"
          onClick={nextStep}
          className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white overflow-hidden shadow-[0_16px_36px_-8px_rgba(0,62,149,0.35)] hover:shadow-[0_20px_44px_-8px_rgba(0,167,245,0.5)] transition-all duration-300 active:scale-95 cursor-pointer will-change-transform"
        >
          {/* Gradient background with smooth hover slide */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />

          <span className="relative z-10 font-bold tracking-tight">
            Next: Additional Requirements
          </span>

          <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
