"use client";

import React, { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import gsap from "gsap";
import {
  Compass,
  Layers,
  Palette,
  DoorClosed,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Pipette,
  Maximize,
  Box,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { StandBriefFormData } from "@/lib/standBriefSchema";
import { useBriefForm } from "./BriefFormProvider";

const CARPET_PRESETS = [
  { name: "Impact Navy", hex: "#003E95" },
  { name: "Charcoal Slate", hex: "#1E293B" },
  { name: "Pure Platinum", hex: "#F1F5F9" },
  { name: "Electric Cyan", hex: "#00A7F5" },
  { name: "Emerald Luxe", hex: "#059669" },
  { name: "Executive Crimson", hex: "#DC2626" },
];

export default function StepStandDesign() {
  const { nextStep, prevStep } = useBriefForm();
  const { register, setValue, watch } = useFormContext<StandBriefFormData>();

  const trussTraverse = watch("step4.trussTraverse");
  const carpetColorHex = watch("step4.carpetColorHex") || "#003E95";
  const carpetColor = watch("step4.carpetColor") || "Impact Corporate Blue";
  const storeRoom2x2 = watch("step4.storeRoom2x2");

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

  return (
    <div className="space-y-8">
      {/* Step Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Stand Design & Architectural Features</span>
            <span className="text-[11px] font-semibold text-[#00A7F5] bg-[#EBF4FF] px-2.5 py-0.5 rounded-full">
              Structural Rigging
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure overhead truss rigging, floor materials and colorways, and back-of-house storage spaces.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
          * Required fields
        </span>
      </div>

      {/* 1. Above the Stand Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#00A7F5]" />
            Above the Stand (Rigging & Suspended Features)
          </label>
          <span className="text-[10px] text-slate-400">
            Ceiling Attachment & Banners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Truss Traverse with Banner Toggle Card */}
          <div
            onClick={() =>
              setValue("step4.trussTraverse", !trussTraverse, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              trussTraverse
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    trussTraverse
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Maximize className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Truss Traverse with Banner
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Overhead Rigging Structure
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  trussTraverse
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Suspended aluminum box-truss traverse with tension fabric hanging graphic banner for high hall visibility.
            </p>
          </div>

          {/* Other Requirements (Above Stand) Text input */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
                Other Overhead Requirements
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                e.g. 360° circular LED halo, motorized hoist, downlight pin spots
              </p>
            </div>

            <input
              {...register("step4.aboveStandOther")}
              placeholder="Specify custom overhead ceiling elements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003E95] focus:ring-2 focus:ring-[#00A7F5]/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. Flooring Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00A7F5]" />
            Flooring System & Finishes
          </label>
          <span className="text-[10px] text-slate-400">
            Platform & Carpet Finishes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Carpet Color with Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#00A7F5]" />
                Carpet Color Specification
              </span>
              <span className="font-mono text-[11px] font-bold text-[#003E95]">
                {carpetColorHex.toUpperCase()}
              </span>
            </label>

            <div className="relative group">
              {/* Inline color picker trigger swatch */}
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                <label
                  htmlFor="carpet-color-picker"
                  className="w-7 h-7 rounded-xl border border-white shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: carpetColorHex }}
                  title="Click to select carpet color"
                >
                  <Pipette className="w-3.5 h-3.5 text-white drop-shadow" />
                </label>
                <input
                  id="carpet-color-picker"
                  type="color"
                  value={carpetColorHex}
                  onChange={(e) => {
                    setValue("step4.carpetColorHex", e.target.value);
                  }}
                  className="sr-only"
                />
              </div>

              <input
                {...register("step4.carpetColor")}
                placeholder="e.g. Impact Corporate Blue, Deep Charcoal"
                className="w-full px-4 py-3 pl-14 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15"
              />
            </div>

            {/* Carpet Color Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-medium text-slate-400 mr-1">
                Presets:
              </span>
              {CARPET_PRESETS.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => {
                    setValue("step4.carpetColorHex", p.hex);
                    setValue("step4.carpetColor", p.name, { shouldValidate: true });
                  }}
                  className={`w-5 h-5 rounded-full border border-white shadow-xs transition-transform hover:scale-125 ${
                    carpetColorHex === p.hex ? "ring-2 ring-[#003E95] scale-110" : ""
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          {/* Other Flooring Options Text input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00A7F5]" />
                Other Flooring Options
              </span>
              <span className="text-[10px] text-slate-400">Optional Upgrade</span>
            </label>

            <div className="relative group">
              <input
                {...register("step4.flooringOther")}
                placeholder="e.g. 100mm Raised platform with perimeter LED, High-gloss vinyl..."
                className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Raised floor enables discreet under-floor cabling and plumbing distribution.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Store Room Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <DoorClosed className="w-3.5 h-3.5 text-[#00A7F5]" />
            Store Room & Back-of-House Facilities
          </label>
          <span className="text-[10px] text-slate-400">
            Secure Storage & Logistics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 2x2 sqm Store Room Toggle Card */}
          <div
            onClick={() =>
              setValue("step4.storeRoom2x2", !storeRoom2x2, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              storeRoom2x2
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    storeRoom2x2
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    2m × 2m Store Room (4 sqm)
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Standard Lockable Room
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  storeRoom2x2
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Enclosed lockable room with internal lighting, multi-tier industrial shelving, coat hooks & electrical distribution box.
            </p>
          </div>

          {/* Other Store Room Options Text input */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
                Custom Store Room Requirements
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                e.g. 3m x 3m custom pantry, double lockable doors, refrigerator space
              </p>
            </div>

            <input
              {...register("step4.storeRoomOther")}
              placeholder="Specify custom store room dimensions or features..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003E95] focus:ring-2 focus:ring-[#00A7F5]/20 transition-all"
            />
          </div>
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
          <ArrowLeft className="w-4 h-4" /> Back: Display & Meeting
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
            Next: Audio Visual
          </span>

          <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
