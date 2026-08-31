"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import gsap from "gsap";
import {
  ConciergeBell,
  BookOpen,
  Layers,
  Box,
  Sparkles,
  Monitor,
  Users,
  ChevronDown,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Shield,
  Coffee,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  StandBriefFormData,
  DISPLAY_RECEPTION_ITEMS,
  MEETING_AREA_TYPES,
} from "@/lib/standBriefSchema";
import { useBriefForm } from "./BriefFormProvider";

const ITEM_ICONS: Record<string, React.ElementType> = {
  receptionDesk: ConciergeBell,
  brochureHolder: BookOpen,
  displayShelf: Layers,
  displayPodium: Box,
  displayShowcase: Sparkles,
  workstation: Monitor,
};

const SEATING_CAPACITY_OPTIONS = [
  "2-4 Persons",
  "4-6 Persons",
  "8-12 Persons",
  "15+ Executive VIP",
];

export default function StepDisplayMeeting() {
  const { nextStep, prevStep } = useBriefForm();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StandBriefFormData>();

  const meetingAreaType = watch("step3.meetingAreaType") || "Open";
  const seatingCapacity = watch("step3.seatingCapacity") || "4-6 Persons";

  // Meeting Area dropdown state
  const [meetingDropdownOpen, setMeetingDropdownOpen] = useState(false);
  const meetingDropdownRef = useRef<HTMLDivElement | null>(null);

  // Magnetic button refs
  const magneticNextRef = useRef<HTMLButtonElement | null>(null);
  const magneticBackRef = useRef<HTMLButtonElement | null>(null);

  // Close meeting dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        meetingDropdownRef.current &&
        !meetingDropdownRef.current.contains(e.target as Node)
      ) {
        setMeetingDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Magnetic Buttons Effect
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

  const toggleItem = (itemId: typeof DISPLAY_RECEPTION_ITEMS[number]["id"]) => {
    const currentVal = watch(`step3.${itemId}`);
    setValue(`step3.${itemId}`, !currentVal, { shouldValidate: true });
  };

  const updateQuantity = (
    qtyKey: typeof DISPLAY_RECEPTION_ITEMS[number]["qtyKey"],
    delta: number,
    minQty: number,
    maxQty: number
  ) => {
    const currentQty = (watch(`step3.${qtyKey}`) as number) || minQty;
    const nextQty = Math.max(minQty, Math.min(maxQty, currentQty + delta));
    setValue(`step3.${qtyKey}`, nextQty, { shouldValidate: true });
  };

  const currentMeetingTypeObj = MEETING_AREA_TYPES.find(
    (m) => m.id === meetingAreaType
  );

  return (
    <div className="space-y-8">
      {/* Step Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Display Elements & Meeting Spaces</span>
            <span className="text-[11px] font-semibold text-[#00A7F5] bg-[#EBF4FF] px-2.5 py-0.5 rounded-full">
              Spatial Furniture
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select functional furniture modules, display fixtures, and choose meeting zone confidentiality.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
          * Required fields
        </span>
      </div>

      {/* 1. Display & Reception Requirements: Interactive Selectable Toggle Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#00A7F5]" />
            Display & Reception Fixtures
          </label>
          <span className="text-[11px] text-slate-400 font-medium">
            Toggle cards to configure unit quantities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {DISPLAY_RECEPTION_ITEMS.map((item) => {
            const isSelected = !!watch(`step3.${item.id}`);
            const qty = (watch(`step3.${item.qtyKey}`) as number) || item.defaultQty;
            const Icon = ITEM_ICONS[item.id] || Layers;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                    : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white/90 shadow-xs"
                }`}
              >
                {/* Header & Toggle Checkbox trigger */}
                <div
                  onClick={() => toggleItem(item.id)}
                  className="flex items-start justify-between cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#003E95] text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {item.label}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Switch / Check Pill */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#00A7F5] text-white scale-100"
                        : "border border-slate-300 text-transparent scale-90"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <p
                  onClick={() => toggleItem(item.id)}
                  className="text-[11px] text-slate-500 mt-2 cursor-pointer leading-relaxed"
                >
                  {item.desc}
                </p>

                {/* Conditional Quantity Controls (Smooth Animated in when selected) */}
                {isSelected ? (
                  <div className="mt-3.5 pt-3 border-t border-slate-100/90 flex items-center justify-between animate-fadeIn">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Quantity:
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.qtyKey, -1, item.minQty, item.maxQty);
                        }}
                        disabled={qty <= item.minQty}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors disabled:opacity-40"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-7 text-center font-mono font-bold text-xs text-[#003E95]">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.qtyKey, 1, item.minQty, item.maxQty);
                        }}
                        disabled={qty >= item.maxQty}
                        className="w-6 h-6 rounded-lg bg-[#003E95] hover:bg-[#002D6E] text-white flex items-center justify-center transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="mt-3.5 text-[10px] font-semibold text-slate-400 hover:text-[#003E95] flex items-center gap-1 self-start transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add to configuration
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Meeting Area Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#00A7F5]" />
            Meeting Area Architecture <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-slate-400">
            Consultation & Dealmaking Environment
          </span>
        </div>

        {/* Meeting Area Type Custom Animated Dropdown */}
        <div className="relative" ref={meetingDropdownRef}>
          <button
            type="button"
            onClick={() => setMeetingDropdownOpen((prev) => !prev)}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 text-left flex items-center justify-between hover:border-slate-300 shadow-xs focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#003E95]/10 to-[#00A7F5]/10 text-[#003E95] flex items-center justify-center shrink-0">
                {meetingAreaType === "Private" ? (
                  <Shield className="w-4 h-4" />
                ) : meetingAreaType === "Open" ? (
                  <Coffee className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              {currentMeetingTypeObj ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {currentMeetingTypeObj.label}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#EBF4FF] text-[#003E95] border border-[#00A7F5]/20">
                      {currentMeetingTypeObj.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {currentMeetingTypeObj.desc}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Select Meeting Type...</span>
              )}
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                meetingDropdownOpen ? "rotate-180 text-[#003E95]" : ""
              }`}
            />
          </button>

          {/* Dropdown Options Modal */}
          {meetingDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 p-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-300/40 grid grid-cols-1 gap-1.5 animate-fadeIn">
              {MEETING_AREA_TYPES.map((type) => {
                const isSelected = meetingAreaType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setValue("step3.meetingAreaType", type.id, {
                        shouldValidate: true,
                      });
                      setMeetingDropdownOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-[#003E95]/10 to-[#00A7F5]/10 border border-[#00A7F5]/30 text-[#003E95]"
                        : "hover:bg-slate-50 border border-transparent text-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {type.label}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {type.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {type.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#00A7F5] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Conditional Seating Capacity Chips */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-700">
            Expected Seating Capacity
          </label>
          <div className="flex flex-wrap gap-2">
            {SEATING_CAPACITY_OPTIONS.map((cap) => {
              const isSelected = seatingCapacity === cap;
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() =>
                    setValue("step3.seatingCapacity", cap, { shouldValidate: true })
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#003E95] text-white shadow-sm shadow-[#003E95]/25 scale-[1.02]"
                      : "bg-white/70 border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Field if "Other" is selected */}
        {meetingAreaType === "Other" && (
          <div className="p-4 rounded-2xl bg-white/80 border border-[#00A7F5]/30 shadow-xs space-y-1.5 animate-fadeIn">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
              Custom Meeting Space Specifications
            </label>
            <input
              {...register("step3.otherMeetingDetails")}
              placeholder="e.g. Dual acoustic phone booths, coffee bar counter with 6 stools, VIP mezzanine..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003E95] focus:ring-2 focus:ring-[#00A7F5]/20 transition-all"
            />
          </div>
        )}

        {/* Additional Notes for Meeting/Display */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-slate-700">
            Special Display & Hospitality Notes
          </label>
          <input
            {...register("step3.additionalMeetingNotes")}
            placeholder="e.g. Lockable under-counter storage, high-gloss display pedestals, espresso machine power plug..."
            className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Navigation: Magnetic Back and Next Buttons with GSAP Transitions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          ref={magneticBackRef}
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 cursor-pointer transition-all duration-200 will-change-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Back: Stand Brief
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
            Next: Stand Design
          </span>

          <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
