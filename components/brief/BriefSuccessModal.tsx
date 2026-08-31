"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Download,
  Home,
  RotateCcw,
  Sparkles,
  Calendar,
  Building2,
  Maximize2,
  DollarSign,
  ShieldCheck,
  Printer,
  X,
  Layers,
} from "lucide-react";
import { useBriefForm } from "./BriefFormProvider";
import PrintBriefDocument from "./PrintBriefDocument";

export default function BriefSuccessModal() {
  const { isSubmitted, submissionSuccessData, resetBrief, form } = useBriefForm();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const checkmarkPathRef = useRef<SVGPathElement | null>(null);

  const values = form.getValues();

  useEffect(() => {
    if (!isSubmitted) return;

    // GSAP entrance animation for modal card & SVG checkmark
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6 }
      );

      if (checkmarkPathRef.current) {
        const length = checkmarkPathRef.current.getTotalLength();
        gsap.set(checkmarkPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        tl.to(
          checkmarkPathRef.current,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }
    }, modalRef);

    return () => ctx.revert();
  }, [isSubmitted]);

  if (!isSubmitted || !submissionSuccessData) return null;

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <>
      {/* 1. Interactive On-Screen Celebratory Glass Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-2xl bg-slate-950/70 overflow-y-auto print:hidden"
      >
        {/* Elevated Glass Modal Card */}
        <div
          ref={cardRef}
          className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-slate-950/40 rounded-3xl p-6 sm:p-8 my-auto text-slate-900 will-change-transform"
        >
          {/* Top Dismiss Button */}
          <button
            type="button"
            onClick={resetBrief}
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Checkmark Circle */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#003E95] via-[#00A7F5] to-emerald-500 text-white shadow-xl shadow-[#00A7F5]/30">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  ref={checkmarkPathRef}
                  d="M20 6L9 17L4 12"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Proposal Request Confirmed & Encrypted
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Stand Brief Transmitted
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Your exhibition architectural specifications have been assigned to an executive production director at{" "}
                <span className="font-bold text-slate-800">IMPACT MAKERS EVENTS</span>.
              </p>
            </div>
          </div>

          {/* Reference Summary Badge Container */}
          <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs mb-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Brief Reference Code
                </span>
                <p className="font-mono text-base sm:text-lg font-extrabold text-[#003E95]">
                  {submissionSuccessData.referenceId}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Submission Timestamp
                </span>
                <p className="text-xs font-semibold text-slate-700">
                  {new Date(submissionSuccessData.submittedAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            {/* Quick Specifications Snapshot Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#00A7F5]" /> Client
                </span>
                <p className="text-xs font-bold text-slate-900 line-clamp-1">
                  {values.step1?.companyName || "—"}
                </p>
                <p className="text-[10px] text-slate-500">
                  {values.step1?.contactPerson}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#00A7F5]" /> Event & Location
                </span>
                <p className="text-xs font-bold text-slate-900 line-clamp-1">
                  {values.step1?.eventName || "—"}
                </p>
                <p className="text-[10px] text-slate-500">
                  {values.step1?.standLocation || "—"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-[#00A7F5]" /> Stand Area & Type
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {values.step1?.standSize || "—"}
                </p>
                <p className="text-[10px] text-slate-500">
                  {values.step1?.standType || "—"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#00A7F5]" /> Stand Budget
                </span>
                <p className="text-xs font-bold text-emerald-700">
                  {values.step2?.budgetCurrency} {values.step2?.budgetAmount || "Custom"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#00A7F5]" /> Meeting Zone
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {values.step3?.meetingAreaType || "Open"} Area
                </p>
                <p className="text-[10px] text-slate-500">
                  {values.step3?.seatingCapacity || "4-6 Persons"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00A7F5]" /> Strategic Aims
                </span>
                <p className="text-xs font-bold text-slate-900 line-clamp-1">
                  {values.step2?.primaryGoals?.join(", ") || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200 active:scale-95"
            >
              <Home className="w-4 h-4" /> Return to Homepage
            </Link>

            <div className="w-full sm:w-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrintPDF}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#003E95]" /> Download PDF Copy
              </button>

              <button
                type="button"
                onClick={resetBrief}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#003E95] hover:bg-[#002D6E] shadow-md shadow-[#003E95]/25 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Start New Brief
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pristine Printable Document (Visible only when Printing/Exporting PDF) */}
      <PrintBriefDocument
        data={values}
        referenceId={submissionSuccessData.referenceId}
        submittedAt={submissionSuccessData.submittedAt}
      />
    </>
  );
}
