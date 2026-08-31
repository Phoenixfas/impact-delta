"use client";

import React, { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import gsap from "gsap";
import {
  Users,
  Printer,
  Plane,
  MessageSquare,
  Check,
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { StandBriefFormData } from "@/lib/standBriefSchema";
import { useBriefForm } from "./BriefFormProvider";

export default function StepAdditionalReq() {
  const { prevStep, submitBrief, isSubmitting } = useBriefForm();
  const { register, setValue, watch } = useFormContext<StandBriefFormData>();

  const standPersonnel = watch("step6.standPersonnel");
  const marketingMaterials = watch("step6.marketingMaterials");
  const travelAccommodation = watch("step6.travelAccommodation");
  const additionalComments = watch("step6.additionalComments") || "";

  // Magnetic button refs
  const magneticSubmitRef = useRef<HTMLButtonElement | null>(null);
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

        if (dist < 80) {
          const pullFactor = (1 - dist / 80) * 8;
          xTo((e.clientX - centerX) * 0.16 * pullFactor);
          yTo((e.clientY - centerY) * 0.16 * pullFactor);
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

    const cleanupSubmit = attachMagnetic(magneticSubmitRef.current);
    const cleanupBack = attachMagnetic(magneticBackRef.current);

    return () => {
      cleanupSubmit();
      cleanupBack();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Step Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Additional Requirements & Final Review</span>
            <span className="text-[11px] font-semibold text-[#00A7F5] bg-[#EBF4FF] px-2.5 py-0.5 rounded-full">
              Staffing & Logistics
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select supplementary concierge services and add any final notes before transmitting to production engineering.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
          Final Step (06/06)
        </span>
      </div>

      {/* 1. Other Special Requirements: Interactive Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
            Special Concierge & Event Services
          </label>
          <span className="text-[10px] text-slate-400">
            Optional Event Turnkey Services
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Stand Personnel / Hostesses */}
          <div
            onClick={() =>
              setValue("step6.standPersonnel", !standPersonnel, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              standPersonnel
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    standPersonnel
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Stand Personnel & Hostesses
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Multilingual Staff
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  standPersonnel
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Professional booth hosts, translators, product presentation specialists & VIP beverage servers.
            </p>
          </div>

          {/* Card 2: Marketing Materials / Printing */}
          <div
            onClick={() =>
              setValue("step6.marketingMaterials", !marketingMaterials, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              marketingMaterials
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    marketingMaterials
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Marketing Materials & Print
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Collateral & Gifts
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  marketingMaterials
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Large-format brochures, roll-up banners, branded conference lanyards, USB cards & premium corporate giveaways.
            </p>
          </div>

          {/* Card 3: Visa / Flight & Hotel Accommodation */}
          <div
            onClick={() =>
              setValue("step6.travelAccommodation", !travelAccommodation, {
                shouldValidate: true,
              })
            }
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
              travelAccommodation
                ? "bg-gradient-to-br from-[#003E95]/8 via-[#00A7F5]/8 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/10 ring-2 ring-[#00A7F5]/25"
                : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    travelAccommodation
                      ? "bg-[#003E95] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Visa, Flights & Hotel
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-[#00A7F5]">
                    Delegation Travel
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  travelAccommodation
                    ? "bg-[#00A7F5] text-white scale-100"
                    : "border border-slate-300 text-transparent scale-90"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
              Visa support letters, hotel room block reservations near the exhibition venue, and private airport transfers.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Additional Comments Textarea */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#00A7F5]" />
            Additional Comments & Special Instructions
          </label>
          <span className="text-[10px] text-slate-400">
            Render deadline, height limits, rigging rules
          </span>
        </div>

        <div className="relative group">
          <textarea
            {...register("step6.additionalComments")}
            rows={4}
            placeholder="Include any specific 3D render deadlines, brand guidelines URLs, venue ceiling height limits, power phase requirements, or confidential NDA notes..."
            className="w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 resize-none"
          />
        </div>
      </div>

      {/* Enterprise Security Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          <span className="font-semibold text-slate-800">Direct Engineering Transmission:</span> Your stand brief is encrypted and transmitted directly to our senior exhibition architectural directors in Geneva and New York.
        </p>
      </div>

      {/* Navigation: Magnetic Back and High-Impact Submit Button */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          ref={magneticBackRef}
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 cursor-pointer transition-all duration-200 will-change-transform disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back: Audio Visual
        </button>

        <button
          ref={magneticSubmitRef}
          type="button"
          onClick={submitBrief}
          disabled={isSubmitting}
          className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm font-extrabold text-white overflow-hidden shadow-[0_20px_48px_-10px_rgba(0,62,149,0.5)] hover:shadow-[0_24px_56px_-10px_rgba(0,167,245,0.65)] transition-all duration-300 active:scale-95 cursor-pointer will-change-transform disabled:opacity-60"
        >
          {/* Gradient sweep background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-emerald-600 bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />

          {isSubmitting ? (
            <span className="relative z-10 flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Transmitting Stand Brief...</span>
            </span>
          ) : (
            <span className="relative z-10 flex items-center gap-2.5">
              <span>Submit Stand Brief</span>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
